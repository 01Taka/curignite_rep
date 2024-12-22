import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { CategoryActivity } from "../../../../../../types/firebase/db/task/taskSupplementTypes";
import FirestoreService from "../../../../handler/firestoreService";
import { ProblemSetActivityRead, ProblemSetActivityWrite } from "../../../../../../types/firebase/db/task/taskStructure";
import { toTimestamp } from "../../../../../../functions/utils/dateTimeUtils";
import { TimeTypes } from "../../../../../../types/util/dateTimeTypes";
import { removeDuplicates } from "../../../../../../functions/utils/dataStructureUtils/structureUtils";

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
    dueDateTime: TimeTypes | null, // 課題の期限
    informStartDaysBeforeDue: number | null,
    categoryActivities: CategoryActivity[],
    completed = false,
  ): Promise<DocumentReference<ProblemSetActivityWrite, DocumentData> >{
    const data: ProblemSetActivityWrite = {
      createdById: creatorId,
      dueDateTime: dueDateTime ? toTimestamp(dueDateTime) : null,
      informStartDaysBeforeDue,
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

  async hardDeleteActivity(userId: string, problemSetId: string, activityId: string): Promise<void> {
    await this.callFss(userId, problemSetId).hardDelete(activityId);
  }

  addCollectionCallback(userId: string, problemSetId: string, callback: (data: ProblemSetActivityRead[]) => void, callbackId?: string) {
    return this.callFss(userId, problemSetId).addReadCollectionCallback(callback, callbackId);
  }

  removeCollectionCallback(userId: string, problemSetId: string, callbackId: string) {
    this.callFss(userId, problemSetId).removeCollectionCallback(callbackId);
  }

  addCollectionCallbackToAll(userId: string, problemSetIds: string[], callback: (data: ProblemSetActivityRead[]) => void, callbackId?: string) {
    const uniqueIds = removeDuplicates(problemSetIds);
    const callbackIds = uniqueIds.map(problemSetId => {
      const generatedId = this.addCollectionCallback(userId, problemSetId, callback, callbackId);
      return {
        problemSetId,
        callbackId: generatedId
      }
    })
    return callbackIds;
  }

  removeCollectionCallbackToAll(userId: string, problemSetIds: string[], callbackId: string) {
    const uniqueIds = removeDuplicates(problemSetIds);
    uniqueIds.forEach(problemSetId => {
      this.removeCollectionCallback(userId, problemSetId, callbackId);
    })
  }
}