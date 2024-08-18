import { Timestamp } from "firebase/firestore";
import TaskCollectionBatchTasksDB from "./taskCollectionBatchTasks";
import { TaskCollectionBatchTaskData, TaskPriority } from "../../../../../../types/firebase/db/todo/TodoTypes";
import TaskListTaskCollectionsDB from "../taskListTaskCollection";
import { DocumentIdMap } from "../../../../../../types/firebase/db/formatTypes";

export class TaskCollectionBatchTaskService {
  constructor(
    private getTaskCollectionBatchTasksDBInstance: (taskListId: string, taskCollectionId: string) => TaskCollectionBatchTasksDB,
    private getTaskListTaskCollectionsDBInstance: (taskListId: string) => TaskListTaskCollectionsDB,
  ) {}

  async createBatchTask(
    taskListId: string,
    collectionId: string,
    createdById: string,
    title: string,
    dueDateTime: Timestamp | null,
    taskNote: string,
    priority: TaskPriority,
    pagesInRange: number[],
  ) {
    const batchTasksDB = this.getTaskCollectionBatchTasksDBInstance(taskListId, collectionId);
    const collectionsDB = this.getTaskListTaskCollectionsDBInstance(taskListId);
    const collection = await collectionsDB.getTaskListTaskCollection(collectionId);

    if (!collection) throw new Error(`Not found Collection. id: ${collectionId}`);

    const setPagesInRange = Array.from(new Set(pagesInRange));
    const existingCompPages = collection.completedPageIndices || [];
    const completedPages = setPagesInRange.filter(page => existingCompPages.includes(page));
    const progress = setPagesInRange.length > 0 ? completedPages.length / setPagesInRange.length : 0;

    await batchTasksDB.createTaskCollectionBatchTask(
      createdById,
      title,
      dueDateTime,
      taskNote,
      priority,
      setPagesInRange,
      completedPages,
      progress,
      progress === 1
    );
  }

  async getAllBatchTasks(
    taskListId: string,
  ): Promise<TaskCollectionBatchTaskData[]> {
    const collectionsDB = this.getTaskListTaskCollectionsDBInstance(taskListId);
    const collections = await collectionsDB.getAllListTaskCollections();
  
    const tasksPromises = collections.map(async (collection) => {
      const batchTasksDB = this.getTaskCollectionBatchTasksDBInstance(taskListId, collection.docId);
      return batchTasksDB ? await batchTasksDB.getAllTaskCollectionBatchTask() : [];
    });
  
    const tasksArrays = await Promise.all(tasksPromises);
    return tasksArrays.flat();
  }  

  async getBatchTaskMapByCollectionId(
    taskListId: string
  ): Promise<DocumentIdMap<TaskCollectionBatchTaskData[]>> {
    const collectionsDB = this.getTaskListTaskCollectionsDBInstance(taskListId);
    const collections = await collectionsDB.getAllListTaskCollections();
  
    const tasksPromises = collections.map(async (collection) => {
      const batchTasksDB = this.getTaskCollectionBatchTasksDBInstance(taskListId, collection.docId);
      return batchTasksDB ? [collection.docId, await batchTasksDB.getAllTaskCollectionBatchTask()] : [];
    });
  
    const tasksArray = await Promise.all(tasksPromises);
  
    const taskMap: DocumentIdMap<TaskCollectionBatchTaskData[]> = tasksArray.reduce((acc, [docId, tasks]) => {
      if (docId && tasks) {
        acc[docId as string] = tasks as TaskCollectionBatchTaskData[];
      }
      return acc;
    }, {} as DocumentIdMap<TaskCollectionBatchTaskData[]>);
  
    return taskMap;
  }  
}
