import { DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../../base";
import { UserOrganizationData } from "../../../../../types/firebase/db/user/userOrganizationType";

class UserOrganizationsDB extends BaseDB<UserOrganizationData> {
  constructor(firestore: Firestore, userId: string) {
    super(firestore, `users/${userId}/organizations`);
  }

  async createUserOrganization(data: UserOrganizationData): Promise<DocumentReference<UserOrganizationData>> {
    return this.create(data);
  }
}

export default UserOrganizationsDB;