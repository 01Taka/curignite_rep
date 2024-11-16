import { DocumentData, DocumentReference, Firestore, QueryConstraint, Timestamp } from "firebase/firestore";
import { IndividualTaskRead, IndividualTaskWrite } from "../../../../../../types/firebase/db/task/taskStructure";
import { AutoFieldToUndefined } from "../../../../../../types/firebase/db/formatTypes";
import FirestoreService from "../../../../handler/firestoreService";

export class IndividualTaskService {
  private fss: FirestoreService<IndividualTaskRead, IndividualTaskWrite>;

  constructor(firestore: Firestore) {
    this.fss = new FirestoreService(firestore, ['users', 'individualTasks']);
  }

  private updatePath(userId: string) {
    this.fss.setCollectionPath(userId);
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
      return await this.fss.create(data);
    } catch (error) {
      console.error("Error creating task: ", error);
      throw new Error("Failed to create task");
    }
  }

  async getTask(docId: string, taskId: string): Promise<IndividualTaskRead | null> {
    try {
      this.updatePath(docId);
      return await this.fss.read(taskId);
    } catch (error) {
      console.error("Error retrieving task: ", error);
      return null;
    }
  }

  async getAllTasks(userId: string, ...queryConstraints: QueryConstraint[]): Promise<IndividualTaskRead[]> {
    try {
      this.updatePath(userId);
      return await this.fss.getAll(...queryConstraints);
    } catch (error) {
      console.error("Error getting all tasks: ", error);
      throw new Error("Failed to get all tasks");
    }
  }

  async updateTask(docId: string, taskId: string, data: Partial<AutoFieldToUndefined<IndividualTaskWrite>>): Promise<void> {
    try {
      this.updatePath(docId);
      await this.fss.update(taskId, data);
    } catch (error) {
      console.error("Error updating task: ", error);
      throw new Error("Failed to update task");
    }
  }
}