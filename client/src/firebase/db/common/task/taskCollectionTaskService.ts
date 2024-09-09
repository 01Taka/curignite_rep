import { Firestore, QueryConstraint, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { TaskCollectionTaskData } from "../../../../types/firebase/db/common/task/taskStructure";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { TaskCollectionService } from "./taskCollectionService";
import { TaskPriority } from "../../../../types/firebase/db/common/task/taskSupplementTypes";
import { Range } from "../../../../types/util/componentsTypes";
import { mergeRanges } from "../../../../functions/objectUtils";

export class TaskCollectionTaskService {
  constructor(private firestore: Firestore, private path: string, private taskCollectionService: TaskCollectionService) {}

  createBaseDB(taskCollectionId: string, docId: string): BaseDB<TaskCollectionTaskData> {
    return new BaseDB(this.firestore, `${this.path}/${docId}/taskCollections/${taskCollectionId}/tasks`);
  }

  async createTask(
    docId: string,
    taskCollectionId: string,
    title: string,
    dueDateTime: Timestamp | null,
    taskNote: string,
    priority: TaskPriority,
    pagesInRange: Range[],
  ): Promise<void> {
    try {
      const data: TaskCollectionTaskData = {
        ...getInitialBaseDocumentData(docId),
        collectionId: taskCollectionId,
        title,
        dueDateTime,
        taskNote,
        priority,
        pagesInRange: mergeRanges(pagesInRange),
      }
      await this.createBaseDB(taskCollectionId, docId).create(data);
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