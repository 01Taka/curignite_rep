import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import { CategoryActivity, ProblemSetActivityData } from "../../../../../../types/firebase/db/task/taskStructure";
import BaseDB from "../../../../base";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";

export class ProblemSetActivityService {
  constructor(private firestore: Firestore) {}

  getPath(userId: string, problemSetId: string) {
    return `users/${userId}/problemSets/${problemSetId}/activities`;
  }

  createBaseDB(userId: string, problemSetId: string): BaseDB<ProblemSetActivityData> {
    return new BaseDB(this.firestore, this.getPath(userId, problemSetId));
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

    return await this.createBaseDB(creatorId, problemSetId).create(data);
  }

  async getActivity(userId: string, problemSetId: string, activityId: string) {
    return await this.createBaseDB(userId, problemSetId).read(activityId);
  }

  async getAllActivities(userId: string, problemSetId: string) {
    return await this.createBaseDB(userId, problemSetId).getAll();
  }
}