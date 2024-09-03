import { Firestore } from "firebase/firestore";
import { HelpAnswerData } from "../../../../../types/firebase/db/user/userStructure";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";

export class HelpAnswerService {
  constructor(private firestore: Firestore) {}

  createBaseDB(userId: string, helpId: string): BaseDB<HelpAnswerData> {
    return new BaseDB(this.firestore, `users/${userId}/helps/${helpId}/answers`);
  }

  async createHelpAnswer(
    userId: string,
    helpId: string,
    answerId: string,
    answer: string,
    fileUrls: string[] = [],
    answeredBy: string,
    merge: boolean = false,
  ): Promise<void> {
    const data: HelpAnswerData = {
      ...getInitialBaseDocumentData(userId),
      answer,
      fileUrls,
      answeredBy,
    };
    return this.createBaseDB(userId, helpId).createWithId(answerId, data, merge);
  }

  async isAnswerExist(userId: string, helpId: string, answerId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(userId, helpId).readAsDocumentSnapshot(answerId);
    return snapshot.exists();
  }

  async getAllHelpAnswers(userId: string, helpId: string): Promise<HelpAnswerData[]> {
    return await this.createBaseDB(userId, helpId).getAll();
  }
}