import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { ProblemSetRead, ProblemSetWrite } from "../../../../../../types/firebase/db/task/taskStructure";
import { ProblemSetActivityManagementMethod } from "../../../../../../types/firebase/db/task/taskSupplementTypes";
import FirestoreService from "../../../../handler/firestoreService";
import { FieldValueSupported } from "../../../../../../types/firebase/db/formatTypes";
import { Subject } from "../../../../../../types/firebase/db/common/commonTypes";

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
    subject: Subject,
    description: string,
    activityManagementMethod: ProblemSetActivityManagementMethod
  ): Promise<DocumentReference<ProblemSetWrite, DocumentData>> {
    const data: ProblemSetWrite = {
      createdById: creatorId,
      name: problemSetName,
      subject,
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

  async updateProblemSet(userId: string, problemSetId: string, data: FieldValueSupported<Partial<ProblemSetWrite>>) {
    await this.callFss(userId).update(problemSetId, data);
  }

  async hardDeleteProblemSet(userId: string, problemSetId: string): Promise<void> {
    await this.callFss(userId).hardDelete(problemSetId);
  }
  
  addCollectionCallback(userId: string, callback: (data: ProblemSetRead[]) => void, callbackId?: string) {
    this.callFss(userId).addReadCollectionCallback(callback, callbackId);
  }

  removeCollectionCallback(userId: string, callbackId: string) {
    this.callFss(userId).removeCollectionCallback(callbackId);
  }
}