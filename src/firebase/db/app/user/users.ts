import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import BaseDB, { DbData } from "../../base";

export interface User extends DbData {
  uid: string;
  username: string;
  birthDate: Timestamp;
  createdAt: Timestamp;
}

export interface OrganizationExtendsUser extends DbData {
  uid: string;
  organizationId: string;
  organizationName: string;
  grade: number;
  classNumber: number;
  joinedAt: Timestamp;
}

export const userInitialUserState: User = {
  documentId: "",
  uid: '',
  username: '',
  birthDate: Timestamp.fromDate(new Date(0)),
  createdAt: Timestamp.fromDate(new Date(0)),
};

export const initialOrganizationExtendsUserState: OrganizationExtendsUser = {
  documentId: "",
  uid: "",
  organizationId: '',
  organizationName: '',
  grade: 0,
  classNumber: 0,
  joinedAt: Timestamp.fromDate(new Date(0)),
};

export class UsersDB extends BaseDB<User> {
  organizationPath: string = "organization";

  constructor() {
    super('users');
  }

  async createUser(uid: string, username: string, birthDate: Timestamp, createdAt: Timestamp): Promise<DocumentReference<DocumentData>> {
    try {
      const data: User = { documentId: uid, uid, username, birthDate, createdAt }; // UIDをdocumentIdとして設定
      return this.createWithId(uid, data); // createWithIdを使用
    } catch (error) {
      console.error("Error creating user: ", error);
      throw new Error("Failed to create user");
    }
  }

  async updateUser(documentId: string, uid: string, username: string, birthDate: Timestamp, createdAt: Timestamp): Promise<void> {
    try {
      const data: User = { documentId, uid, username, birthDate, createdAt };
      return this.update(data);
    } catch (error) {
      console.error("Error updating user: ", error);
      throw new Error("Failed to update user");
    }
  }

  // Organizationデータに関するCRUD操作
  async createOrganizationData(parentId: string, uid: string, organizationId: string, organizationName: string, grade: number, classNumber: number, joinedAt: Timestamp): Promise<DocumentReference<OrganizationExtendsUser>> {
    try {
      const data: OrganizationExtendsUser = { documentId: "", uid, organizationId, organizationName, grade, classNumber, joinedAt };
      return this.createInSubCollection<OrganizationExtendsUser>(parentId, this.organizationPath, data);
    } catch (error) {
      console.error("Error creating organization data: ", error);
      throw new Error("Failed to create organization data");
    }
  }

  async readOrganizationData(parentId: string, id: string): Promise<OrganizationExtendsUser | null> {
    try {
      return this.readFromSubCollection<OrganizationExtendsUser>(parentId, this.organizationPath, id);
    } catch (error) {
      console.error("Error reading organization data: ", error);
      throw new Error("Failed to read organization data");
    }
  }

  async updateOrganizationData(parentId: string, documentId: string, uid: string, organizationId: string, organizationName: string, grade: number, classNumber: number, joinedAt: Timestamp): Promise<void> {
    try {
      const data: OrganizationExtendsUser = { documentId, uid, organizationId, organizationName, grade, classNumber, joinedAt };
      return this.updateInSubCollection<OrganizationExtendsUser>(parentId, this.organizationPath, data);
    } catch (error) {
      console.error("Error updating organization data: ", error);
      throw new Error("Failed to update organization data");
    }
  }

  async deleteOrganizationData(parentId: string, id: string): Promise<void> {
    try {
      return this.deleteFromSubCollection<OrganizationExtendsUser>(parentId, this.organizationPath, id);
    } catch (error) {
      console.error("Error deleting organization data: ", error);
      throw new Error("Failed to delete organization data");
    }
  }

  async readOrganizationByUid(uid: string): Promise<OrganizationExtendsUser | null> {
    const user = await this.getFirstMatch("uid", uid);
    if (user) {
      const organizations = await this.readOrganizationData(user.documentId, this.organizationPath);
      return organizations;
    }
    return null;
  }
}