import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import { ProblemSetActivityData } from "../../../../../../types/firebase/db/task/taskStructure";
import BaseDB from "../../../../base";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";
import { CategoryActivity } from "../../../../../../types/firebase/db/task/taskSupplementTypes";

export class ProblemSetActivityService {
  private baseDB: BaseDB<ProblemSetActivityData> | undefined;
  
  constructor(private firestore: Firestore) {}

  private getBaseDB(userId: string, problemSetId: string): BaseDB<ProblemSetActivityData> {
    if (!this.baseDB || this.baseDB.getCollectionPath() !== this.getPath(userId, problemSetId)) {
      this.baseDB = new BaseDB(this.firestore, this.getPath(userId, problemSetId));
    }
    return this.baseDB;
  }

  getPath(userId: string, problemSetId: string) {
    return `users/${userId}/problemSets/${problemSetId}/activities`;
  }

  async createActivity(
    creatorId: string,
    problemSetId: string,
    dueDateTime: Timestamp | null, // 課題の期限
    categoryActivities: CategoryActivity[],
    completed = false,
  ): Promise<DocumentReference<ProblemSetActivityData, DocumentData> >{
    const data: ProblemSetActivityData = {
      ...getInitialBaseDocumentData(creatorId),
      dueDateTime,
      categoryActivities,
      completed
    }

    return await this.getBaseDB(creatorId, problemSetId).create(data);
  }

  async getActivity(userId: string, problemSetId: string, activityId: string) {
    return await this.getBaseDB(userId, problemSetId).read(activityId);
  }

  async getAllActivities(userId: string, problemSetId: string) {
    return await this.getBaseDB(userId, problemSetId).getAll();
  }
}