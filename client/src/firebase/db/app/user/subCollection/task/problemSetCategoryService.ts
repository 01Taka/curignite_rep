import { DocumentReference, Firestore } from "firebase/firestore";
import { Range } from "../../../../../../types/util/componentsTypes";
import FirestoreService from "../../../../handler/firestoreService";
import { ProblemSetCategoryRead, ProblemSetCategoryWrite } from "../../../../../../types/firebase/db/task/taskStructure";
import { FieldValueSupported } from "../../../../../../types/firebase/db/formatTypes";
import { addRanges, arrayToRanges, subtractRanges } from "../../../../../../functions/utils/rangeUtils";
import { removeDuplicates } from "../../../../../../functions/utils/dataStructureUtils/structureUtils";

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

  async getAllCategories(userId: string, problemSetId: string) {
    return this.callFss(userId, problemSetId).getAll();
  }

  async setCompletedIdsByCategory(
    userId: string,
    problemSetId: string,
    data: {
      categoryId: string,
      toCompletedIds?: number[]
      toIncompleteIds?: number[]
    }[]
  ) {
    const setCompletedPromise = data.map(async( {categoryId, toCompletedIds, toIncompleteIds }) => {
      await this.setCompletedId(userId, problemSetId, categoryId, { toCompletedIds, toIncompleteIds });
    });
    await Promise.all(setCompletedPromise);
  }

  async setCompletedId(
    userId: string,
    problemSetId: string,
    categoryId: string,
    {
      toCompletedIds,
      toIncompleteIds
    }: {
      toCompletedIds?: number[]
      toIncompleteIds?: number[]
    }
  ) {
    const category = await this.getCategory(userId, problemSetId, categoryId);
    if (category) {      
      const baseRanges = category.completedProblemIdsRange;
      const addedRanges = toCompletedIds ? addRanges(baseRanges, toCompletedIds) : baseRanges;
      const newRanges = toIncompleteIds ? subtractRanges(addedRanges, arrayToRanges(toIncompleteIds)) : addedRanges;
      await this.updateCategory(userId, problemSetId, categoryId, { completedProblemIdsRange: newRanges });
    }
  }

  async updateCategory(userId: string, problemSetId: string, categoryId: string, data: FieldValueSupported<Partial<ProblemSetCategoryWrite>>) {
    return this.callFss(userId, problemSetId).update(categoryId, data);
  }
  
  addCollectionCallback(userId: string, problemSetId: string, callback: (data: ProblemSetCategoryRead[]) => void, callbackId?: string) {
    return this.callFss(userId, problemSetId).addReadCollectionCallback(callback, callbackId);
  }

  removeCollectionCallback(userId: string, problemSetId: string, callbackId: string) {
    this.callFss(userId, problemSetId).removeCollectionCallback(callbackId);
  }

  addCollectionCallbackToAll(userId: string, problemSetIds: string[], callback: (data: ProblemSetCategoryRead[]) => void, callbackId?: string) {
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
