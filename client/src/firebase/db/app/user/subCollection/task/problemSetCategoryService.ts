import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../../../base";
import { ProblemSetCategoryData } from "../../../../../../types/firebase/db/task/taskStructure";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";
import { Range } from "../../../../../../types/util/componentsTypes";

export class ProblemSetCategoryService {
  private baseDB: BaseDB<ProblemSetCategoryData> | undefined;
  
  constructor(private firestore: Firestore) {}

  private getBaseDB(userId: string, problemSetId: string): BaseDB<ProblemSetCategoryData> {
    if (!this.baseDB || this.baseDB.getCollectionPath() !== this.getPath(userId, problemSetId)) {
      this.baseDB = new BaseDB(this.firestore, this.getPath(userId, problemSetId));
    }
    return this.baseDB;
  }

  getPath(userId: string, problemSetId: string) {
    return `users/${userId}/problemSets/${problemSetId}/categories`;
  }

  async createCategory(
    creatorId: string,
    problemSetId: string,
    name: string | '', // カテゴリの名前
    isPage: boolean,
    timePerProblem: number,
    totalProblemNumber: number | null, // カテゴリ内の問題の総数
    completedProblemIdsRange: Range[] = [] // 完了した問題番号
  ): Promise<DocumentReference<ProblemSetCategoryData, DocumentData> >{
    const data: ProblemSetCategoryData = {
      ...getInitialBaseDocumentData(creatorId),
      name: isPage ? 'page' : name,
      isPage,
      timePerProblem,
      totalProblemNumber,
      completedProblemIdsRange
    }

    return await this.getBaseDB(creatorId, problemSetId).create(data);
  }

  async getCategory(userId: string, problemSetId: string, categoryId: string) {
    return await this.getBaseDB(userId, problemSetId).read(categoryId);
  }

  async getAllCategory(userId: string, problemSetId: string) {
    return await this.getBaseDB(userId, problemSetId).getAll();
  }
}