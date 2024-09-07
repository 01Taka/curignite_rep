import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { UserHelpData } from "../../../../../types/firebase/db/user/userStructure";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { Subject } from "../../../../../types/firebase/db/common/commonTypes";
import { storageManager, StorageManager } from "../../../../storage/storageManager";

export class UserHelpService {
  constructor(private firestore: Firestore, private storageManager: StorageManager) {}

  getPath(userId: string): string {
    return `users/${userId}/helps`;
  }

  createBaseDB(userId: string): BaseDB<UserHelpData> {
    return new BaseDB(this.firestore, this.getPath(userId));
  }

  async createUserHelp(
    userId: string,
    subject: Subject,
    question: string,
    files: File[],
  ): Promise<DocumentReference<UserHelpData, DocumentData>> {
    const baseDB = this.createBaseDB(userId)
    const helpRef: UserHelpData = {
      ...getInitialBaseDocumentData(userId),
      subject,
      question,
      fileUrls: [],
      solved: false,
      bestAnswerId: null,
    };

    if (files.length > 0) {
      const urls = await this.storageManager.uploadFiles(this.getPath(userId), helpRef.docId, 0, files);
      baseDB.update(helpRef.docId, { fileUrls: urls });
    }

    return await baseDB.create(helpRef);
  }

  async isHelpExist(userId: string, helpId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(userId).readAsDocumentSnapshot(helpId);
    return snapshot.exists();
  }

  async getAllUserHelps(userId: string): Promise<UserHelpData[]> {
    return await this.createBaseDB(userId).getAll();
  }
}