import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { HelpAnswerData } from "../../../../../types/firebase/db/user/userStructure";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { StorageManager } from "../../../../storage/storageManager";

export class HelpAnswerService {
  constructor(private firestore: Firestore, private storageManager: StorageManager) {}

  getPath(userId: string, helpId: string) {
    return `users/${userId}/helps/${helpId}/answers`;
  }

  createBaseDB(userId: string, helpId: string): BaseDB<HelpAnswerData> {
    return new BaseDB(this.firestore, this.getPath(userId, helpId));
  }

  async createHelpAnswer(
    userId: string,
    helpId: string,
    answer: string,
    files: File[],
    answeredBy: string,
    merge: boolean = false,
  ): Promise<Promise<DocumentReference<HelpAnswerData, DocumentData>>> {
    const data: HelpAnswerData = {
      ...getInitialBaseDocumentData(userId),
      answer,
      fileIds: [],
      answeredBy,
    };

    const answerRef =  await this.createBaseDB(userId, helpId).create(data);

    if (files.length > 0) {
      await this.storageManager.uploadFiles(this.getPath(userId, helpId), answerRef.id, 0, files);
    }

    return answerRef;
  }

  async isAnswerExist(userId: string, helpId: string, answerId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(userId, helpId).readAsDocumentSnapshot(answerId);
    return snapshot.exists();
  }

  async getAllHelpAnswers(userId: string, helpId: string): Promise<HelpAnswerData[]> {
    return await this.createBaseDB(userId, helpId).getAll();
  }
}