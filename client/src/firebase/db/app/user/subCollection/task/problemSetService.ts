import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { ProblemSetRead, ProblemSetWrite } from "../../../../../../types/firebase/db/task/taskStructure";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";
import { ProblemSetActivityManagementMethod } from "../../../../../../types/firebase/db/task/taskSupplementTypes";
import FirestoreService from "../../../../handler/firestoreService";

export class ProblemSetService {
  private fss: FirestoreService<ProblemSetRead, ProblemSetWrite>;

  constructor(firestore: Firestore) {
    this.fss = new FirestoreService(firestore, ['users', 'problemSets']);
  }

  private updatePath(userId: string) {
    this.fss.setCollectionPath(userId);
  }
  async createProblemSet(
    creatorId: string,
    problemSetName: string,
    description: string,
    activityManagementMethod: ProblemSetActivityManagementMethod
  ): Promise<DocumentReference<ProblemSetWrite, DocumentData>> {
    const data: ProblemSetWrite = {
      ...getInitialBaseDocumentData(creatorId),
      name: problemSetName,
      description,
      activityManagementMethod
    }

    this.updatePath(creatorId);
    return await this.fss.crudHandler.create(data);
  }

  async getProblemSet(userId: string, problemSetId: string): Promise<ProblemSetRead | null> {
    this.updatePath(userId);
    return await this.fss.crudHandler.read(problemSetId);
  }

  async getAllProblemSets(userId: string): Promise<ProblemSetRead[]> {
    this.updatePath(userId);
    return await this.fss.crudHandler.getAll();
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
