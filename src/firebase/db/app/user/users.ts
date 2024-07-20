import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { User, UserOrganizationInfo, UserTeamInfo } from "./usersTypes";
import { TeamRolesKey } from "../team/teamsTypes";


export class UsersDB extends BaseDB<User> {
  organizationPath: string = "organization";
  teamPath: string = "team";

  constructor(firestore: Firestore) {
    super(firestore, 'users');
  }

  async createUser(uid: string, username: string, birthDate: Timestamp, createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData> | void> {
    try {
      const data: User = { documentId: uid, username, birthDate, createdAt }; // UIDをdocumentIdとして設定
      return this.createWithId(uid, data); // createWithIdを使用
    } catch (error) {
      console.error("Error creating user: ", error);
      throw new Error("Failed to create user");
    }
  }

  // Organizationデータに関するCRUD操作
  async createUserOrganizationInfo(parentId: string, uid: string, organizationId: string, organizationName: string, grade: number, classNumber: number, joinedAt: Timestamp): Promise<DocumentReference<UserOrganizationInfo>> {
    try {
      const data: UserOrganizationInfo = { documentId: "", uid, organizationId, organizationName, grade, classNumber, joinedAt };
      return this.createInSubCollection<UserOrganizationInfo>(parentId, this.organizationPath, data);
    } catch (error) {
      console.error("Error creating organization data: ", error);
      throw new Error("Failed to create organization data");
    }
  }

  async readUserOrganizationInfo(parentId: string, id: string): Promise<UserOrganizationInfo | null> {
    try {
      return this.readFromSubCollection<UserOrganizationInfo>(parentId, this.organizationPath, id);
    } catch (error) {
      console.error("Error reading organization data: ", error);
      throw new Error("Failed to read organization data");
    }
  }

  async updateUserOrganizationInfo(parentId: string, documentId: string, data: Partial<UserOrganizationInfo>): Promise<void> {
    try {
      return await this.updateInSubCollection<UserOrganizationInfo>(parentId, this.organizationPath, documentId, data);
    } catch (error) {
      console.error("Error updating organization data: ", error);
      throw new Error("Failed to update organization data");
    }
  }

  async deleteUserOrganizationInfo(parentId: string, id: string): Promise<void> {
    try {
      return this.deleteFromSubCollection<UserOrganizationInfo>(parentId, this.organizationPath, id);
    } catch (error) {
      console.error("Error deleting organization data: ", error);
      throw new Error("Failed to delete organization data");
    }
  }

  async readOrganizationByUid(uid: string): Promise<UserOrganizationInfo | null> {
    const user = await this.getFirstMatch("uid", uid);
    if (user) {
      const organizations = await this.readUserOrganizationInfo(user.documentId, this.organizationPath);
      return organizations;
    }
    return null;
  }

  
  // teamデータに関するCRUD操作
  async createUserTeamInfo(parentId: string, teamId: string, teamName: string, teamIconPath: string, roles: TeamRolesKey, myTeam: boolean): Promise<DocumentReference<UserTeamInfo>> {
    try {
      const data: UserTeamInfo = { documentId: "", teamId, teamName, teamIconPath, roles, myTeam };
      return await this.createInSubCollection<UserTeamInfo>(parentId, this.teamPath, data);
    } catch (error) {
      console.error("Error creating team data: ", error);
      throw new Error("Failed to create team data");
    }
  }

  async readUserTeamInfo(parentId: string, id: string): Promise<UserTeamInfo | null> {
    try {
      return await this.readFromSubCollection<UserTeamInfo>(parentId, this.teamPath, id);
    } catch (error) {
      console.error("Error reading team data: ", error);
      throw new Error("Failed to read team data");
    }
  }

  async updateUserTeamInfo(parentId: string, documentId: string, data: Partial<UserTeamInfo>): Promise<void> {
    try {
      return await this.updateInSubCollection<UserTeamInfo>(parentId, this.teamPath, documentId, data);
    } catch (error) {
      console.error("Error updating team data: ", error);
      throw new Error("Failed to update team data");
    }
  }

  async deleteUserTeamInfo(parentId: string, id: string): Promise<void> {
    try {
      return await this.deleteFromSubCollection<UserTeamInfo>(parentId, this.teamPath, id);
    } catch (error) {
      console.error("Error deleting team data: ", error);
      throw new Error("Failed to delete team data");
    }
  }

  async getAllUserTeamsInfo(parentId: string): Promise<UserTeamInfo[]> {
    try {
      return await this.getAllFromSubCollection(parentId, this.teamPath);
    } catch (error) {
      console.error("Error getting all team data: ", error);
      throw new Error("Failed to getting all team data");
    }
  }

  async getUserTeamInfoByTeamId(parentId: string, teamId: string): Promise<UserTeamInfo | null> {
    try {
      return await this.getFirstMatchFromSubCollection(parentId, this.teamPath, "teamId", teamId);
    } catch (error) {
      console.error("Error getting team data by teamId: ", error);
      throw new Error("Failed to get team data by teamId");
    }
  }
}
