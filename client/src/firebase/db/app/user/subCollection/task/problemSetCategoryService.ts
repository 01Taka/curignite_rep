import { DocumentReference, Firestore } from "firebase/firestore";
import { Range } from "../../../../../../types/util/componentsTypes";
import FirestoreService from "../../../../handler/firestoreService";
import { ProblemSetCategoryRead, ProblemSetCategoryWrite } from "../../../../../../types/firebase/db/task/taskStructure";

export class ProblemSetCategoryService {
  private fss: FirestoreService<ProblemSetCategoryRead, ProblemSetCategoryWrite>;

  constructor(firestore: Firestore) {
    this.fss = new FirestoreService(firestore, ['users', 'problemSets', 'categories']);
  }

  private updatePath(userId: string, problemSetId: string) {
    this.fss.setCollectionPath(userId, problemSetId);
  }

  async createCategory(
    creatorId: string,
    problemSetId: string,
    name: string | '',
    isPage: boolean,
    timePerProblem: number,
    totalProblemNumber: number | null,
    completedProblemIdsRange: Range[] = []
  ): Promise<DocumentReference<ProblemSetCategoryWrite>> {
    const data: ProblemSetCategoryWrite = {
      createdById: creatorId,
      name: isPage ? 'page' : name,
      isPage,
      timePerProblem,
      totalProblemNumber,
      completedProblemIdsRange,
    };
    this.updatePath(creatorId, problemSetId);
    return await this.fss.create(data);
  }

  async getCategory(userId: string, problemSetId: string, categoryId: string) {
    this.updatePath(userId, problemSetId);
    return this.fss.read(categoryId);
  }

  async getAllCategory(userId: string, problemSetId: string) {
    this.updatePath(userId, problemSetId);
    return this.fss.getAll();
  }
}

  // addCollectionCallback(
  //   userId: string,
  //   problemSetId: string,
  //   callback: (args: { userId: string, problemSetId: string, data: ProblemSetCategoryData[] }) => void
  // ) {
  //   const cb = (data: ProblemSetCategoryData[]) => callback({ userId, problemSetId, data });
  //   this.functionManager.registerConversion(callback, cb);
  //   this.getBaseDB(userId, problemSetId).addCollectionCallback(cb);
  // }

  // removeCollectionCallback(
  //   userId: string,
  //   problemSetId: string,
  //   callback: (args: { userId: string, problemSetId: string, data: ProblemSetCategoryData[] }) => void
  // ) {
  //   // コールバックの参照を取得
  //   const cb = this.functionManager.getConversion(callback)
  //   if (cb) {
  //     this.getBaseDB(userId, problemSetId).removeCollectionCallback(cb);
  //     this.functionManager.deleteConversion(callback);
  //   }
  // }
