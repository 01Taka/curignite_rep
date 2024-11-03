import { Firestore } from "firebase/firestore";
import { ProblemSetStepData } from "../../../../../../../types/firebase/db/task/taskStep/taskStepStructure";
import BaseDB from "../../../../../base";
import { AutoFieldToUndefined } from "../../../../../../../types/firebase/db/formatTypes";

export class ProblemSetStepService {
  private baseDB: BaseDB<ProblemSetStepData> | undefined;
  
  constructor(private firestore: Firestore) {}

  private getBaseDB(userId: string): BaseDB<ProblemSetStepData> {
    if (!this.baseDB || this.baseDB.getCollectionPath() !== this.getPath(userId)) {
      this.baseDB = new BaseDB(this.firestore, this.getPath(userId));
    }
    return this.baseDB;
  }

  private getPath(userId: string) {
    return `users/${userId}/problemSetSteps`;
  }

  async createStepWithId(createdById: string, problemSetId: string, data: AutoFieldToUndefined<ProblemSetStepData>) {
    return await this.getBaseDB(createdById).createWithId(problemSetId, data);
  }
}
