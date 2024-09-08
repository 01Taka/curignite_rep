import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { HelpAndAnswersWithFileUrls, HelpAnswerData, UserHelpData } from "../../../../../types/firebase/db/user/userStructure";
import BaseDB from "../../../base";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { Subject } from "../../../../../types/firebase/db/common/commonTypes";
import { StorageManager } from "../../../../storage/storageManager";
import { HelpAnswerService } from "./helpAnswerService";

export class UserHelpService {
  constructor(private firestore: Firestore, private storageManager: StorageManager, private answerService: HelpAnswerService) {}

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
    const data: UserHelpData = {
      ...getInitialBaseDocumentData(userId),
      subject,
      question,
      fileIds: [],
      solved: false,
      bestAnswerId: null,
    };

    const helpRef =  await baseDB.create(data);

    if (files.length > 0) {
      const urls = await this.storageManager.uploadFiles(this.getPath(userId), helpRef.id, 0, files);
      baseDB.update(helpRef.id, { fileIds: urls });
    }

    return helpRef;
  }

  async isHelpExist(userId: string, helpId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(userId).readAsDocumentSnapshot(helpId);
    return snapshot.exists();
  }

  async getAllHelps(userId: string): Promise<UserHelpData[]> {
    return await this.createBaseDB(userId).getAll();
  }

  async getAllHelpAndAnswersWithFileUrls(userId: string): Promise<HelpAndAnswersWithFileUrls[]> {
    try {
      const helps = await this.getAllHelps(userId);
      const helpWithAnswersPromises = helps.map(help => this.getHelpWithAnswers(userId, help));
  
      return await Promise.all(helpWithAnswersPromises);
    } catch (error) {
      console.error('Failed to fetch help with answers:', error);
      throw new Error('Failed to fetch help with answers');
    }
  }
  
  private async getHelpWithAnswers(userId: string, help: UserHelpData): Promise<HelpAndAnswersWithFileUrls> {
    try {
      const helpFileUrls = await this.storageManager.getFileUrls(help.fileIds);
      const answers = await this.answerService.getAllHelpAnswers(userId, help.docId);
      const answersFileUrls = await this.getAnswersFileUrls(answers);
  
      return { help, helpFileUrls, answers, answersFileUrls } as HelpAndAnswersWithFileUrls;
    } catch (error) {
      console.error(`Failed to fetch data for help docId ${help.docId}:`, error);
      throw new Error(`Failed to fetch data for help docId ${help.docId}`);
    }
  }
  
  private async getAnswersFileUrls(answers: HelpAnswerData[]): Promise<Record<string, string[]>> {
    const answerFileUrlPromises = answers.map(async (answer) => {
      const fileUrls = await this.storageManager.getFileUrls(answer.fileIds);
      return { [answer.docId]: fileUrls };
    });
  
    const answerFileUrlsArray = await Promise.all(answerFileUrlPromises);
    return Object.assign({}, ...answerFileUrlsArray);
  }
  
}