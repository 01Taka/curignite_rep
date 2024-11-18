import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import { CategoryActivity } from "../../../../../../types/firebase/db/task/taskSupplementTypes";
import FirestoreService from "../../../../handler/firestoreService";
import { ProblemSetActivityRead, ProblemSetActivityWrite } from "../../../../../../types/firebase/db/task/taskStructure";

export class ProblemSetActivityService {
  private fss: FirestoreService<ProblemSetActivityRead, ProblemSetActivityWrite>;

  constructor(firestore: Firestore) {
    this.fss = new FirestoreService(firestore, ['users', 'problemSets', 'activities']);
  }

  private callFss(userId: string, problemSetId: string) {
    this.fss.setCollectionPath(userId, problemSetId);
    return this.fss;
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

    return await this.callFss(creatorId, problemSetId).create(data);
  }

  async getActivity(userId: string, problemSetId: string, activityId: string) {
    return await this.callFss(userId, problemSetId).read(activityId);
  }

  async getAllActivities(userId: string, problemSetId: string) {
    return await this.callFss(userId, problemSetId).getAll();
  }

  addCollectionCallback(userId: string, problemSetId: string, callback: (data: ProblemSetActivityRead[]) => void) {
    this.callFss(userId, problemSetId).addReadCollectionCallback(callback);
  }

  removeCollectionCallback(userId: string, problemSetId: string, callback: (data: ProblemSetActivityRead[]) => void) {
    this.callFss(userId, problemSetId).removeReadCollectionCallback(callback);
  }
}