import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { ProblemSetActivityManagementMethod, ProblemSetData } from "../../../../../../types/firebase/db/common/task/taskStructure";
import BaseDB from "../../../../base";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";

export class ProblemSetService {
  constructor(private firestore: Firestore) {}

  createBaseDB(userId: string): BaseDB<ProblemSetData> {
    return new BaseDB(this.firestore, `users/${userId}/problemSets`);
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

    return await this.createBaseDB(creatorId).create(data);
  }

  async getProblemSet(userId: string, problemSetId: string): Promise<ProblemSetData | null> {
    return await this.createBaseDB(userId).read(problemSetId);
  }

  async getAllProblemSets(userId: string): Promise<ProblemSetData[]> {
    return await this.createBaseDB(userId).getAll();
  }
}
