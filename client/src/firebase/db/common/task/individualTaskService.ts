import { Firestore, QueryConstraint, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { IndividualTaskData } from "../../../../types/firebase/db/common/task/taskStructure";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { TaskPriority } from "../../../../types/firebase/db/common/task/taskSupplementTypes";

export class IndividualTaskService {
  constructor(private firestore: Firestore, private path: string) {}

  createBaseDB(docId: string): BaseDB<IndividualTaskData> {
    return new BaseDB(this.firestore, `${this.path}/${docId}/individualTasks`);
  }

  async createTask(
    docId: string,
    createdById: string,
    title: string,
    dueDateTime: Timestamp | null,
    taskNote: string,
    priority: TaskPriority,
    estimatedDuration: number,
    progress: number = 0,
    completed: boolean = false,
  ): Promise<void> {
    try {
      const data: IndividualTaskData = {
        ...getInitialBaseDocumentData(createdById),
        title,
        dueDateTime,
        taskNote,
        priority,
        progress,
        completed,
        estimatedDuration,
      }
      await this.createBaseDB(docId).create(data);
    } catch (error) {
      console.error("Error creating task: ", error);
      throw new Error("Failed to create task");
    }
  }

  async getTask(docId: string, taskId: string): Promise<IndividualTaskData | null> {
    try {
      return await this.createBaseDB(docId).read(taskId);
    } catch (error) {
      console.error("Error retrieving task: ", error);
      return null;
    }
  }

  async getAllTasks(docId: string, ...queryConstraints: QueryConstraint[]): Promise<IndividualTaskData[]> {
    try {
      return await this.createBaseDB(docId).getAll(...queryConstraints);
    } catch (error) {
      console.error("Error getting all tasks: ", error);
      throw new Error("Failed to get all tasks");
    }
  }

  async updateTask(docId: string, taskId: string, data: Partial<IndividualTaskData>): Promise<void> {
    try {
      await this.createBaseDB(docId).update(taskId, data);
    } catch (error) {
      console.error("Error updating task: ", error);
      throw new Error("Failed to update task");
    }
  }

  async softDeleteTask(docId: string, taskId: string): Promise<void> {
    try {
      await this.createBaseDB(docId).softDelete(taskId);
    } catch (error) {
      console.error("Error soft deleting task: ", error);
      throw new Error("Failed to soft delete task");
    }
  }

  async hardDeleteTask(docId: string, taskId: string): Promise<void> {
    try {
      await this.createBaseDB(docId).hardDelete(taskId);
    } catch (error) {
      console.error("Error hard deleting task: ", error);
      throw new Error("Failed to hard delete task");
    }
  }
}