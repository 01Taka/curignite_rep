import { Firestore, QueryConstraint } from "firebase/firestore";
import BaseDB from "../../base";
import { TaskCollectionTaskData } from "../../../../types/firebase/db/common/task/taskStructure";

export class TaskCollectionTaskService {
  constructor(private firestore: Firestore, private path: string) {}

  createBaseDB(taskCollectionId: string, docId: string): BaseDB<TaskCollectionTaskData> {
    return new BaseDB(this.firestore, `${this.path}/${docId}/taskCollections/${taskCollectionId}/tasks`);
  }

  async createTask(
    docId: string,
    taskCollectionId: string,
    taskId: string,
    data: TaskCollectionTaskData,
  ): Promise<void> {
    try {
      await this.createBaseDB(taskCollectionId, docId).createWithId(taskId, data);
    } catch (error) {
      console.error("Error creating task: ", error);
      throw new Error("Failed to create task");
    }
  }

  async getTask(docId: string, taskCollectionId: string, taskId: string): Promise<TaskCollectionTaskData | null> {
    try {
      return await this.createBaseDB(taskCollectionId, docId).read(taskId);
    } catch (error) {
      console.error("Error retrieving task: ", error);
      return null;
    }
  }

  async getAllTasks(docId: string, taskCollectionId: string, ...queryConstraints: QueryConstraint[]): Promise<TaskCollectionTaskData[]> {
    try {
      return await this.createBaseDB(taskCollectionId, docId).getAll(...queryConstraints);
    } catch (error) {
      console.error("Error getting all tasks: ", error);
      throw new Error("Failed to get all tasks");
    }
  }

  async updateTask(docId: string, taskCollectionId: string, taskId: string, data: Partial<TaskCollectionTaskData>): Promise<void> {
    try {
      await this.createBaseDB(taskCollectionId, docId).update(taskId, data);
    } catch (error) {
      console.error("Error updating task: ", error);
      throw new Error("Failed to update task");
    }
  }

  async softDeleteTask(docId: string, taskCollectionId: string, taskId: string): Promise<void> {
    try {
      await this.createBaseDB(taskCollectionId, docId).softDelete(taskId);
    } catch (error) {
      console.error("Error soft deleting task: ", error);
      throw new Error("Failed to soft delete task");
    }
  }

  async hardDeleteTask(docId: string, taskCollectionId: string, taskId: string): Promise<void> {
    try {
      await this.createBaseDB(taskCollectionId, docId).hardDelete(taskId);
    } catch (error) {
      console.error("Error hard deleting task: ", error);
      throw new Error("Failed to hard delete task");
    }
  }
}