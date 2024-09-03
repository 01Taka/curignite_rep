import { Firestore } from "firebase/firestore";
import { UserHelpData } from "../../../../../types/firebase/db/user/userStructure";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { Subject } from "../../../../../types/firebase/db/common/commonTypes";

export class UserHelpService {
  constructor(private firestore: Firestore) {}

  createBaseDB(userId: string): BaseDB<UserHelpData> {
    return new BaseDB(this.firestore, `users/${userId}/helps`);
  }

  async createUserHelp(
    userId: string,
    helpId: string,
    subject: Subject,
    question: string,
    fileUrls: string[] = [],
    merge: boolean = false,
  ): Promise<void> {
    const data: UserHelpData = {
      ...getInitialBaseDocumentData(userId),
      subject,
      question,
      fileUrls,
    };
    return this.createBaseDB(userId).createWithId(helpId, data, merge);
  }

  async isHelpExist(userId: string, helpId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(userId).readAsDocumentSnapshot(helpId);
    return snapshot.exists();
  }

  async getAllUserHelps(userId: string): Promise<UserHelpData[]> {
    return await this.createBaseDB(userId).getAll();
  }
}