import { doc, Firestore, Timestamp, Transaction } from "firebase/firestore";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData, isDocumentExist } from "../../../../../functions/db/dbUtils";
import { BaseMemberRole } from "../../../../../types/firebase/db/baseTypes";
import { SpaceData, SpaceMemberData } from "../../../../../types/firebase/db/space/spaceStructure";

export class SpaceMemberService {
  constructor(private firestore: Firestore) {}

  private createBaseDB(spaceId: string): BaseDB<SpaceMemberData> {
    return new BaseDB(this.firestore, `spaces/${spaceId}/members`);
  }

  async createMember(
    spaceId: string,
    userId: string,
    role: BaseMemberRole,
    isAway: boolean = false,
    joinedAt: Timestamp = Timestamp.now(),
  ): Promise<void> {
    try {
      const data: SpaceMemberData = {
        ...getInitialBaseDocumentData(userId),
        role,
        isAway,
        joinedAt,
      };
      await this.createBaseDB(spaceId).createWithId(userId, data);
    } catch (error) {
      console.error("Error creating space member: ", error);
      throw new Error("Failed to create space member");
    }
  }

  async getAllMembers(spaceId: string): Promise<SpaceMemberData[]> {
    return this.createBaseDB(spaceId).getAll();
  }

  private async isUserAlreadyMember(spaceId: string, userId: string): Promise<boolean> {
    const members = await this.createBaseDB(spaceId).getAll();
    return isDocumentExist(userId, members);
  }

  async addMember(spaceId: string, userId: string, role: BaseMemberRole = BaseMemberRole.Member): Promise<void> {
    const isMember = await this.isUserAlreadyMember(spaceId, userId);
    if (isMember) return;

    const exists = await this.isUserExist(spaceId, userId);
    if (exists) {
      await this.updateMemberStatusAndRole(spaceId, userId, role);
    } else {
      await this.createMember(spaceId, userId, role);
    }
  }

  private async updateMemberStatusAndRole(spaceId: string, userId: string, role: BaseMemberRole): Promise<void> {
    await this.createBaseDB(spaceId).update(userId, { joinStatus: "allowed", role });
  }

  async isUserExist(spaceId: string, userId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(spaceId).readAsDocumentSnapshot(userId);
    return snapshot.exists();
  }

  async leaveSpace(spaceId: string, userId: string): Promise<void> {
    await this.createBaseDB(spaceId).softDelete(userId);
  }

  async setAwayState(spaceId: string, userId: string, state: boolean): Promise<void> {
    await this.createBaseDB(spaceId).update(userId, { isAway: state });
  }

  async setRole(spaceId: string, userId: string, role: BaseMemberRole): Promise<void> {
    await this.createBaseDB(spaceId).update(userId, { role });
  }

  async transferPrivileges(spaceId: string, assignorUserId: string, transfereeUserId: string): Promise<void> {
    const baseDB = this.createBaseDB(spaceId);
    await baseDB.runTransaction(async (transaction: Transaction) => {
      const assignorUserRef = doc(baseDB.getCollectionRef(), assignorUserId);
      const transfereeUserRef = doc(baseDB.getCollectionRef(), transfereeUserId);

      const assignorSnapshot = await transaction.get(assignorUserRef);
      if (!assignorSnapshot.exists || assignorSnapshot.data()?.role !== "admin") {
        throw new Error(`User with ID ${assignorUserId} does not have admin privileges.`);
      }

      transaction.update(assignorUserRef, { role: "member" });
      transaction.update(transfereeUserRef, { role: "admin" });
    });
  }

  async filterNonMemberSpaces(userId: string, spaces: SpaceData[]): Promise<SpaceData[]> {
    const results = await Promise.all(spaces.map(async space => {
      const isMember = await this.isUserExist(space.docId, userId);
      return isMember ? space : null;
    }));
    
    return results.filter((space): space is SpaceData => space !== null);
  }
}
