import { DocumentData, DocumentReference } from "firebase/firestore";
import TaskListTaskCollectionsDB from "./taskListTaskCollection";
import { arrayToDict } from "../../../../../functions/objectUtils";
import { DocumentIdMap } from "../../../../../types/firebase/db/formatTypes";
import { TaskListTaskCollectionData } from "../../../../../types/firebase/db/todo/TodoTypes";

export class TaskListTaskCollectionService {
  constructor(private getTaskListTaskCollectionsDBInstance: (taskListId: string) => TaskListTaskCollectionsDB) {}

  async createTaskCollection(
    taskListId: string,
    createdById: string,
    name: string,
    totalPages: number, 
    timePerPage: number,
    description: string,
  ): Promise<DocumentReference<DocumentData, DocumentData>> {
    try {
      const taskCollectionsDB = this.getTaskListTaskCollectionsDBInstance(taskListId);
      return await taskCollectionsDB.createTaskListTaskCollection(createdById, name, totalPages, timePerPage, [], description);
    } catch (error) {
      throw new Error("");
    }
  }

  async getAllCollections(taskListId: string) {
    const taskCollectionsDB = this.getTaskListTaskCollectionsDBInstance(taskListId);
    const collections = await taskCollectionsDB.getAllListTaskCollections();
    return collections;
  }

  async getTaskCollectionMap(taskListId: string): Promise<DocumentIdMap<TaskListTaskCollectionData>> {
    const collections = await this.getAllCollections(taskListId);
    return arrayToDict(collections, "docId");
  }
}