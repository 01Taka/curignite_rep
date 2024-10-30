import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { ProblemSetActivityManagementMethod, ProblemSetData } from "../../../../../../types/firebase/db/task/taskStructure";
import BaseDB from "../../../../base";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";

export class ProblemSetService {
  private baseDB: BaseDB<ProblemSetData> | undefined;
  
  constructor(private firestore: Firestore) {}
  
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
}
