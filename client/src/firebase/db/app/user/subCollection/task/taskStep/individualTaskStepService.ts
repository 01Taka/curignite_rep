import { Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../../../../base";
import { IndividualTaskStepData } from "../../../../../../../types/firebase/db/task/taskStep/taskStepStructure";
import { TaskStepState } from "../../../../../../../types/firebase/db/task/taskStep/taskStepSupplementTypes";
import { autoFields } from "../../../../../../../constants/firebase/firestoreConstants";
import { AutoFieldToUndefined } from "../../../../../../../types/firebase/db/formatTypes";

export class IndividualTaskStepService {
  private baseDB: BaseDB<IndividualTaskStepData> | undefined;
  
  constructor(private firestore: Firestore) {}

  private getBaseDB(userId: string, taskId: string): BaseDB<IndividualTaskStepData> {
    if (!this.baseDB || this.baseDB.getCollectionPath() !== this.getPath(userId, taskId)) {
      this.baseDB = new BaseDB(this.firestore, this.getPath(userId, taskId));
    }
    return this.baseDB;
  }

  private getPath(userId: string, taskId: string) {
    return `users/${userId}/individualTasks/${taskId}/steps`;
  }

  async createStep(
    createdById: string,
    taskId: string,
    title: string,
    dueDateTime: Timestamp | null,
    estimatedTimeMs: number,
    state: TaskStepState = 'inProgress',
    stepNumber: number,
  ) {
    try {
      const data: AutoFieldToUndefined<IndividualTaskStepData> = {
        ...autoFields,
        createdById,
        title,
        stepNumber,
        dueDateTime,
        estimatedTimeMs,
        state
      }
      this.getBaseDB(createdById, taskId).create(data);
    } catch (error) {
      
    }
  }
}
