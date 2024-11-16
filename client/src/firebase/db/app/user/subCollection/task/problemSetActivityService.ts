import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import { CategoryActivity } from "../../../../../../types/firebase/db/task/taskSupplementTypes";
import { FunctionManager } from "../../../../util/functionManager";
import FirestoreService from "../../../../handler/firestoreService";
import { ProblemSetActivityRead, ProblemSetActivityWrite } from "../../../../../../types/firebase/db/task/taskStructure";

export class ProblemSetActivityService {
  private fss: FirestoreService<ProblemSetActivityRead, ProblemSetActivityWrite>;

  constructor(firestore: Firestore) {
    this.fss = new FirestoreService(firestore, ['users', 'problemSets', 'activities']);
  }

  private updatePath(userId: string, problemSetId: string) {
    this.fss.setCollectionPath(userId, problemSetId);
  }

  async createActivity(
    creatorId: string,
    problemSetId: string,
    dueDateTime: Timestamp | null, // 課題の期限
    categoryActivities: CategoryActivity[],
    completed = false,
  ): Promise<DocumentReference<ProblemSetActivityWrite, DocumentData> >{
    const data: ProblemSetActivityWrite = {
      createdById: creatorId,
      dueDateTime,
      categoryActivities,
      completed
    }

    this.updatePath(creatorId, problemSetId);
    return await this.fss.create(data);
  }

  async getActivity(userId: string, problemSetId: string, activityId: string) {
    this.updatePath(userId, problemSetId)
    return await this.fss.read(activityId);
  }

  async getAllActivities(userId: string, problemSetId: string) {
    this.updatePath(userId, problemSetId)
    return await this.fss.getAll();
  }

  // addCollectionCallback(
  //   userId: string,
  //   problemSetId: string,
  //   callback: (args: { userId: string, problemSetId: string, data: ProblemSetActivityWrite[] }) => void
  // ) {
  //   const cb = (data: ProblemSetActivityWrite[]) => callback({ userId, problemSetId, data });
  //   this.functionManager.registerConversion(callback, cb);
  //   this.getBaseDB(userId, problemSetId).addCollectionCallback(cb);
  // }

  // removeCollectionCallback(
  //   userId: string,
  //   problemSetId: string,
  //   callback: (args: { userId: string, problemSetId: string, data: ProblemSetActivityWrite[] }) => void
  // ) {
  //   // コールバックの参照を取得
  //   const cb = this.functionManager.getConversion(callback)
  //   if (cb) {
  //     this.getBaseDB(userId, problemSetId).removeCollectionCallback(cb);
  //     this.functionManager.deleteConversion(callback);
  //   }
  // }
}