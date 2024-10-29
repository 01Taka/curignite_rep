import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../../../base";
import { ProblemSetCategoryData } from "../../../../../../types/firebase/db/task/taskStructure";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";
import { Range } from "../../../../../../types/util/componentsTypes";

export class ProblemSetCategoryService {
  constructor(private firestore: Firestore) {}

  getPath(userId: string, problemSetId: string) {
    return `users/${userId}/problemSets/${problemSetId}/categories`;
  }

  createBaseDB(userId: string, problemSetId: string): BaseDB<ProblemSetCategoryData> {
    return new BaseDB(this.firestore, this.getPath(userId, problemSetId));
  }

  async createCategory(
    creatorId: string,
    problemSetId: string,
    name: string | 'page', // カテゴリの名前
    timePerProblem: number,
    totalProblemNumber: number | null, // カテゴリ内の問題の総数
    completedProblemIdsRange: Range[] = [] // 完了した問題番号
  ): Promise<DocumentReference<ProblemSetCategoryData, DocumentData> >{
    const data: ProblemSetCategoryData = {
      ...getInitialBaseDocumentData(creatorId),
      name,
      timePerProblem,
      totalProblemNumber,
      completedProblemIdsRange
    }

    return await this.createBaseDB(creatorId, problemSetId).create(data);
  }

  async getCategory(userId: string, problemSetId: string, categoryId: string) {
    return await this.createBaseDB(userId, problemSetId).read(categoryId);
  }

  async getAllCategory(userId: string, problemSetId: string) {
    return await this.createBaseDB(userId, problemSetId).getAll();
  }
}