import { DocumentData, DocumentReference, Firestore, QueryConstraint, Timestamp } from "firebase/firestore";
import { IndividualTaskRead, IndividualTaskWrite } from "../../../../../../types/firebase/db/task/taskStructure";
import { AutoFieldToUndefined } from "../../../../../../types/firebase/db/formatTypes";
import FirestoreService from "../../../../handler/firestoreService";

export class IndividualTaskService {
  private fss: FirestoreService<IndividualTaskRead, IndividualTaskWrite>;

  constructor(firestore: Firestore) {
    this.fss = new FirestoreService(firestore, ['users', 'individualTasks']);
  }

  private callFss(userId: string) {
    this.fss.setCollectionPath(userId);
    return this.fss;
  }

  async createTask(
    creatorId: string,
    title: string,
    dueDateTime: Timestamp | null,
    taskNote: string,
    estimatedDuration: number,
    progress: number = 0,
    completed: boolean = false,
  ): Promise<DocumentReference<IndividualTaskWrite, DocumentData>> {
    try {
      const data: IndividualTaskWrite = {
        createdById: creatorId,
        title,
        dueDateTime,
        taskNote,
        progress,
        completed,
        estimatedDuration,
      }
      return await this.callFss(creatorId).create(data);
    } catch (error) {
      console.error("Error creating task: ", error);
      throw new Error("Failed to create task");
    }
  }

  async getTask(userId: string, taskId: string): Promise<IndividualTaskRead | null> {
    try {
      return await this.callFss(userId).read(taskId);
    } catch (error) {
      console.error("Error retrieving task: ", error);
      return null;
    }
  }

  async getAllTasks(userId: string, ...queryConstraints: QueryConstraint[]): Promise<IndividualTaskRead[]> {
    try {
      return await this.callFss(userId).getAll(...queryConstraints);
    } catch (error) {
      console.error("Error getting all tasks: ", error);
      throw new Error("Failed to get all tasks");
    }
  }

  async updateTask(userId: string, taskId: string, data: Partial<AutoFieldToUndefined<IndividualTaskWrite>>): Promise<void> {
    try {
      await this.callFss(userId).update(taskId, data);
    } catch (error) {
      console.error("Error updating task: ", error);
      throw new Error("Failed to update task");
    }
  }

  addCollectionCallback(userId: string, callback: (data: IndividualTaskRead[]) => void, callbackId?: string) {
    this.callFss(userId).addReadCollectionCallback(callback, callbackId);
  }

  removeCollectionCallback(userId: string, callbackId: string) {
    this.callFss(userId).removeCollectionCallback(callbackId);
  }
}