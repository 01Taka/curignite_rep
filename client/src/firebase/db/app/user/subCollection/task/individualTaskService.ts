import { DocumentData, DocumentReference, Firestore, QueryConstraint, Timestamp } from "firebase/firestore";
import BaseDB from "../../../../base";
import { IndividualTaskData } from "../../../../../../types/firebase/db/task/taskStructure";
import { getInitialBaseDocumentData } from "../../../../../../functions/db/dbUtils";

export class IndividualTaskService {
  private baseDB: BaseDB<IndividualTaskData> | undefined;
  
  constructor(private firestore: Firestore) {}

  private getBaseDB(userId: string): BaseDB<IndividualTaskData> {
    if (!this.baseDB || this.baseDB.getCollectionPath() !== this.getPath(userId)) {
      this.baseDB = new BaseDB(this.firestore, this.getPath(userId));
    }
    return this.baseDB;
  }

  private getPath(userId: string) {
    return `users/${userId}/individualTasks`;
  }

  async createTask(
    creatorId: string,
    title: string,
    dueDateTime: Timestamp | null,
    taskNote: string,
    estimatedDuration: number,
    progress: number = 0,
    completed: boolean = false,
  ): Promise<DocumentReference<IndividualTaskData, DocumentData>> {
    try {
      const data: IndividualTaskData = {
        ...getInitialBaseDocumentData(creatorId),
        title,
        dueDateTime,
        taskNote,
        progress,
        completed,
        estimatedDuration,
      }
      return await this.getBaseDB(creatorId).create(data);
    } catch (error) {
      console.error("Error creating task: ", error);
      throw new Error("Failed to create task");
    }
  }

  async getTask(docId: string, taskId: string): Promise<IndividualTaskData | null> {
    try {
      return await this.getBaseDB(docId).read(taskId);
    } catch (error) {
      console.error("Error retrieving task: ", error);
      return null;
    }
  }

  async getAllTasks(userId: string, ...queryConstraints: QueryConstraint[]): Promise<IndividualTaskData[]> {
    try {
      return await this.getBaseDB(userId).getAll(...queryConstraints);
    } catch (error) {
      console.error("Error getting all tasks: ", error);
      throw new Error("Failed to get all tasks");
    }
  }

  async updateTask(docId: string, taskId: string, data: Partial<IndividualTaskData>): Promise<void> {
    try {
      await this.getBaseDB(docId).update(taskId, data);
    } catch (error) {
      console.error("Error updating task: ", error);
      throw new Error("Failed to update task");
    }
  }

  async softDeleteTask(docId: string, taskId: string): Promise<void> {
    try {
      await this.getBaseDB(docId).softDelete(taskId);
    } catch (error) {
      console.error("Error soft deleting task: ", error);
      throw new Error("Failed to soft delete task");
    }
  }

  async hardDeleteTask(docId: string, taskId: string): Promise<void> {
    try {
      await this.getBaseDB(docId).hardDelete(taskId);
    } catch (error) {
      console.error("Error hard deleting task: ", error);
      throw new Error("Failed to hard delete task");
    }
  }
}