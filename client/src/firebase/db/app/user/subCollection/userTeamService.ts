import { Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { UserTeamData } from "../../../../../types/firebase/db/user/userStructure";
import { JoinRequestStatus } from "../../../../../types/firebase/db/common/joinRequest/joinRequestSupplementTypes";

export class UserTeamService {
    constructor(private firestore: Firestore) {}

    createBaseDB(userId: string): BaseDB<UserTeamData> {
        return new BaseDB(this.firestore, `users/${userId}/teams`);
    }

    async createUserTeam(
        userId: string,
        teamId: string,
        status: JoinRequestStatus,
        isMember: boolean,
        merge: boolean = false,
      ): Promise<void> {
        const data: UserTeamData = {
          ...getInitialBaseDocumentData(userId),
          requestedAt: Timestamp.now(),
          status,
          isMember,
        }
        return this.createBaseDB(userId).createWithId(teamId, data, merge);
      }
    
      async isTeamExist(userId: string, teamId: string): Promise<boolean> {
        const snapshot = await this.createBaseDB(userId).readAsDocumentSnapshot(teamId);
        return snapshot.exists();
      }

      async getAllUserTeams(userId: string): Promise<UserTeamData[]> {
        return await this.createBaseDB(userId).getAll();
      }

      async setJoinStatus(userId: string, teamId: string, joinStatus: JoinRequestStatus): Promise<void> {
        await this.createBaseDB(userId).update(teamId, { status: joinStatus });
      }

      async updateAsMember(userId: string, teamId: string): Promise<void> {
        await this.createBaseDB(userId).update(teamId, { isMember: true, status: "allowed" });
      }
}
