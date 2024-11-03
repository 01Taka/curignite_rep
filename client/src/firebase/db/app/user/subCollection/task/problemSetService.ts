import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { ProblemSetData } from "../../../../../../types/firebase/db/task/taskStructure";
import BaseDB from "../../../../base";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";
import { ProblemSetActivityManagementMethod } from "../../../../../../types/firebase/db/task/taskSupplementTypes";
import { ProblemSetStepService } from "./taskStep/problemSetStepService";
import { AutoPlanningSettings, ProblemInfo, RecurringTacklePlan } from "../../../../../../types/firebase/db/task/taskStep/taskStepSupplementTypes";
import { ProblemSetStepData } from "../../../../../../types/firebase/db/task/taskStep/taskStepStructure";
import { AutoFieldToUndefined } from "../../../../../../types/firebase/db/formatTypes";
import { autoFields } from "../../../../../../constants/firebase/firestoreConstants";
import { removeDuplicatesByKey } from "../../../../../../functions/utils/objectUtils";
import { TimeTypes } from "../../../../../../types/util/dateTimeTypes";
import { isBeforeDateTime, toTimestamp } from "../../../../../../functions/utils/dateTimeUtils";

export class ProblemSetService {
  private baseDB: BaseDB<ProblemSetData> | undefined;
  private stepService: ProblemSetStepService;
  
  constructor(private firestore: Firestore) {
    this.stepService = new ProblemSetStepService(firestore);
  }
  
  private getBaseDB(userId: string): BaseDB<ProblemSetData> {
    if (!this.baseDB || this.baseDB.getCollectionPath() !== this.getPath(userId)) {
      this.baseDB = new BaseDB(this.firestore, this.getPath(userId));
    }
    return this.baseDB;
  }

  private getPath(userId: string) {
    return `users/${userId}/problemSets`
  }

  async createProblemSet(
    creatorId: string,
    problemSetName: string,
    description: string,
    activityManagementMethod: ProblemSetActivityManagementMethod
  ): Promise<DocumentReference<ProblemSetData, DocumentData>> {
    const data: ProblemSetData = {
      ...getInitialBaseDocumentData(creatorId),
      name: problemSetName,
      description,
      activityManagementMethod
    }

    return await this.getBaseDB(creatorId).create(data);
  }

  async getProblemSet(userId: string, problemSetId: string): Promise<ProblemSetData | null> {
    return await this.getBaseDB(userId).read(problemSetId);
  }

  async getAllProblemSets(userId: string): Promise<ProblemSetData[]> {
    return await this.getBaseDB(userId).getAll();
  }

  async createProblemSetStep(
    createdById: string,
    problemSetId: string,
    stepStack: ProblemInfo[],
    recurringTacklePlan: RecurringTacklePlan[],
    tackleExcludedDates: TimeTypes[] = []
  ): Promise<void> {
    const autoPlanningSettings: AutoPlanningSettings = {
      recurringTacklePlan: removeDuplicatesByKey(recurringTacklePlan, 'dayOfWeek'),
      // 今日より前の取り組まない予定を削除
      excludedDates: tackleExcludedDates.filter(date => !isBeforeDateTime(date, new Date(), false, true)).map(date => toTimestamp(date))
    }
    const data: AutoFieldToUndefined<ProblemSetStepData> = {
      ...autoFields,
      createdById,
      autoPlanningSettings,
      stepStack
    }
    await this.stepService.createStepWithId(createdById, problemSetId, data);
  }
}
