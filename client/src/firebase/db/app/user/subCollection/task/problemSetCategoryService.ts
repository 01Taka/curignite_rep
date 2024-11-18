import { DocumentReference, Firestore } from "firebase/firestore";
import { Range } from "../../../../../../types/util/componentsTypes";
import FirestoreService from "../../../../handler/firestoreService";
import { ProblemSetCategoryRead, ProblemSetCategoryWrite } from "../../../../../../types/firebase/db/task/taskStructure";

export class ProblemSetCategoryService {
  private fss: FirestoreService<ProblemSetCategoryRead, ProblemSetCategoryWrite>;

  constructor(firestore: Firestore) {
    this.fss = new FirestoreService(firestore, ['users', 'problemSets', 'categories']);
  }

  private callFss(userId: string, problemSetId: string) {
    this.fss.setCollectionPath(userId, problemSetId);
    return this.fss;
  }

  async createCategory(
    creatorId: string,
    problemSetId: string,
    name: string | '',
    isPage: boolean,
    timePerProblem: number,
    totalProblemNumber: number | null,
    completedProblemIdsRange: Range[] = []
  ): Promise<DocumentReference<ProblemSetCategoryWrite>> {
    const data: ProblemSetCategoryWrite = {
      createdById: creatorId,
      name: isPage ? 'page' : name,
      isPage,
      timePerProblem,
      totalProblemNumber,
      completedProblemIdsRange,
    };
    return await this.callFss(creatorId, problemSetId).create(data);
  }

  async getCategory(userId: string, problemSetId: string, categoryId: string) {
    return this.callFss(userId, problemSetId).read(categoryId);
  }

  async getAllCategory(userId: string, problemSetId: string) {
    return this.callFss(userId, problemSetId).getAll();
  }
  
  addCollectionCallback(userId: string, problemSetId: string, callback: (data: ProblemSetCategoryRead[]) => void) {
    this.callFss(userId, problemSetId).addReadCollectionCallback(callback);
  }

  removeCollectionCallback(userId: string, problemSetId: string, callback: (data: ProblemSetCategoryRead[]) => void) {
    this.callFss(userId, problemSetId).removeReadCollectionCallback(callback);
  }
}
