import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { UserData, UserOrganizationData, UserTeamData } from "../../../../types/firebase/db/usersTypes";
import { TeamRoles } from "../../../../types/firebase/db/teamsTypes";


export class UsersDB extends BaseDB<UserData> {
  organizationPath: string = "organization";
  teamPath: string = "team";

  constructor(firestore: Firestore) {
    super(firestore, 'users');
  }

  async createUser(uid: string, username: string, spaceIds: string[], birthDate: Timestamp, createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData> | void> {
    try {
      const data: UserData = { documentId: uid, username, spaceIds, birthDate, createdAt }; // UIDをdocumentIdとして設定
      return this.createWithId(uid, data); // createWithIdを使用
    } catch (error) {
      console.error("Error creating user: ", error);
      throw new Error("Failed to create user");
    }
  }

  // Organizationデータに関するCRUD操作
  async createUserOrganizationData(uid: string, organizationId: string, organizationName: string, grade: number, classNumber: number, joinedAt: Timestamp): Promise<DocumentReference<UserOrganizationData>> {
    try {
      const data: UserOrganizationData = { documentId: "", uid, organizationId, organizationName, grade, classNumber, joinedAt };
      return this.createInSubCollection<UserOrganizationData>(uid, this.organizationPath, data);
    } catch (error) {
      console.error("Error creating organization data: ", error);
      throw new Error("Failed to create organization data");
    }
  }

  async readUserOrganizationData(uid: string, id: string): Promise<UserOrganizationData | null> {
    try {
      return this.readFromSubCollection<UserOrganizationData>(uid, this.organizationPath, id);
    } catch (error) {
      console.error("Error reading organization data: ", error);
      throw new Error("Failed to read organization data");
    }
  }

  async updateUserOrganizationData(uid: string, documentId: string, data: Partial<UserOrganizationData>): Promise<void> {
    try {
      return await this.updateInSubCollection<UserOrganizationData>(uid, this.organizationPath, documentId, data);
    } catch (error) {
      console.error("Error updating organization data: ", error);
      throw new Error("Failed to update organization data");
    }
  }

  async deleteUserOrganizationData(uid: string, id: string): Promise<void> {
    try {
      return this.deleteFromSubCollection<UserOrganizationData>(uid, this.organizationPath, id);
    } catch (error) {
      console.error("Error deleting organization data: ", error);
      throw new Error("Failed to delete organization data");
    }
  }

  async readOrganizationByUid(uid: string): Promise<UserOrganizationData | null> {
    const user = await this.getFirstMatch("uid", uid);
    if (user) {
      const organizations = await this.readUserOrganizationData(user.documentId, this.organizationPath);
      return organizations;
    }
    return null;
  }

  
  // teamデータに関するCRUD操作
  async createUserTeamData(uid: string, teamId: string, teamName: string, teamIconPath: string, role: TeamRoles, myTeam: boolean): Promise<DocumentReference<UserTeamData>> {
    try {
      const data: UserTeamData = { documentId: "", teamId, teamName, teamIconPath, role, myTeam };
      return await this.createInSubCollection<UserTeamData>(uid, this.teamPath, data);
    } catch (error) {
      console.error("Error creating team data: ", error);
      throw new Error("Failed to create team data");
    }
  }

  async readUserTeamData(uid: string, id: string): Promise<UserTeamData | null> {
    try {
      return await this.readFromSubCollection<UserTeamData>(uid, this.teamPath, id);
    } catch (error) {
      console.error("Error reading team data: ", error);
      throw new Error("Failed to read team data");
    }
  }

  async updateUserTeamData(uid: string, documentId: string, data: Partial<UserTeamData>): Promise<void> {
    try {
      return await this.updateInSubCollection<UserTeamData>(uid, this.teamPath, documentId, data);
    } catch (error) {
      console.error("Error updating team data: ", error);
      throw new Error("Failed to update team data");
    }
  }

  async deleteUserTeamData(uid: string, id: string): Promise<void> {
    try {
      return await this.deleteFromSubCollection<UserTeamData>(uid, this.teamPath, id);
    } catch (error) {
      console.error("Error deleting team data: ", error);
      throw new Error("Failed to delete team data");
    }
  }

  async getAllUserTeamsData(uid: string): Promise<UserTeamData[]> {
    try {
      return await this.getAllFromSubCollection(uid, this.teamPath);
    } catch (error) {
      console.error("Error getting all team data: ", error);
      throw new Error("Failed to getting all team data");
    }
  }

  async getUserTeamDataByTeamId(uid: string, teamId: string): Promise<UserTeamData | null> {
    try {
      return await this.getFirstMatchFromSubCollection(uid, this.teamPath, "teamId", teamId);
    } catch (error) {
      console.error("Error getting team data by teamId: ", error);
      throw new Error("Failed to get team data by teamId");
    }
  }
}
