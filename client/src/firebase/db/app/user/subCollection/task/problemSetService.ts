import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { ProblemSetRead, ProblemSetWrite } from "../../../../../../types/firebase/db/task/taskStructure";
import { ProblemSetActivityManagementMethod } from "../../../../../../types/firebase/db/task/taskSupplementTypes";
import FirestoreService from "../../../../handler/firestoreService";

export class ProblemSetService {
  private fss: FirestoreService<ProblemSetRead, ProblemSetWrite>;

  constructor(firestore: Firestore) {
    this.fss = new FirestoreService(firestore, ['users', 'problemSets']);
  }

  private callFss(userId: string) {
    this.fss.setCollectionPath(userId);
    return this.fss;
  }
  
  async createProblemSet(
    creatorId: string,
    problemSetName: string,
    description: string,
    activityManagementMethod: ProblemSetActivityManagementMethod
  ): Promise<DocumentReference<ProblemSetWrite, DocumentData>> {
    const data: ProblemSetWrite = {
      createdById: creatorId,
      name: problemSetName,
      description,
      activityManagementMethod
    }

    return await this.callFss(creatorId).create(data);
  }

  async getProblemSet(userId: string, problemSetId: string): Promise<ProblemSetRead | null> {
    return await this.callFss(userId).read(problemSetId);
  }

  async getAllProblemSets(userId: string): Promise<ProblemSetRead[]> {
    return await this.callFss(userId).getAll();
  }

  // async createProblemSetStep(
  //   createdById: string,
  //   problemSetId: string,
  //   stepStack: ProblemInfo[],
  //   recurringTacklePlan: RecurringTacklePlan[],
  //   tackleExcludedDates: TimeTypes[] = []
  // ): Promise<void> {
  //   const autoPlanningSettings: AutoPlanningSettings = {
  //     recurringTacklePlan: removeDuplicatesByKey(recurringTacklePlan, 'dayOfWeek'),
  //     // 今日より前の取り組まない予定を削除
  //     excludedDates: tackleExcludedDates.filter(date => !isBeforeDateTime(date, new Date(), false, true)).map(date => toTimestamp(date))
  //   }
  //   const data: AutoFieldToUndefined<ProblemSetStepData> = {
  //     ...autoFields,
  //     createdById,
  //     autoPlanningSettings,
  //     stepStack
  //   }
  //   await this.stepService.createStepWithId(createdById, problemSetId, data);
  // }

  // addCollectionCallback(userId: string, callback: (data: ProblemSetData[]) => void) {
  //   this.getBaseDB(userId).addCollectionCallback(callback);
  // }

  // removeCollectionCallback(userId: string, callback: (data: ProblemSetData[]) => void) {
  //   this.getBaseDB(userId).removeCollectionCallback(callback);
  // }
}
