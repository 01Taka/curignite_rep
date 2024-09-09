import { Firestore, QueryConstraint } from "firebase/firestore";
import { CollectionWithCollectionTasks, CollectionWithTasksData, TaskCollectionData, TaskCollectionTaskData, TaskData } from "../../../../types/firebase/db/common/task/taskStructure";
import { TaskCollectionService } from "./taskCollectionService";
import { IndividualTaskService } from "./individualTaskService";
import { TaskCollectionTaskService } from "./taskCollectionTaskService";
import { rangesToArray, removeDuplicates } from "../../../../functions/objectUtils";

export class TaskManagementService {
  private individualTaskService: IndividualTaskService;
  private taskCollectionService: TaskCollectionService;
  private taskCollectionTaskService: TaskCollectionTaskService;

  constructor(firestore: Firestore, basePath: string) {
    this.individualTaskService = new IndividualTaskService(firestore, basePath);
    this.taskCollectionService = new TaskCollectionService(firestore, basePath);
    this.taskCollectionTaskService = new TaskCollectionTaskService(firestore, basePath, this.taskCollectionService);
  }

  getIndividualTaskService() {
    return this.individualTaskService;
  }

  getTaskCollectionService() {
    return this.taskCollectionService;
  }

  getTaskCollectionTaskService() {
    return this.taskCollectionTaskService;
  }

  async getCollectionsWithTasksData(
    docId: string,
    collectionQueryConstraints: QueryConstraint[] = [],
    taskQueryConstraints: QueryConstraint[] = []
  ): Promise<CollectionWithTasksData[]> {
    try {
      const collectionTasks = await this.getCollectionsWithCollectionTasks(docId, collectionQueryConstraints, taskQueryConstraints);
      return collectionTasks.map(data => ({
        collectionData: data.collectionData,
        tasksData: this.processCollectionTasks([data])
      }));
    } catch (error) {
      this.logErrorAndThrow("getting collections with tasks", error);
    }
  }

  async getCollectionsWithCollectionTasks(
    docId: string,
    collectionQueryConstraints: QueryConstraint[] = [],
    taskQueryConstraints: QueryConstraint[] = []
  ): Promise<CollectionWithCollectionTasks[]> {
    try {
      const collections = await this.taskCollectionService.getAllCollections(docId, ...collectionQueryConstraints);
      return await Promise.all(
        collections.map(async (collectionData) => {
          const tasksInCollection = await this.taskCollectionTaskService.getAllTasks(docId, collectionData.docId, ...taskQueryConstraints);
          return { collectionData, tasksInCollection } as CollectionWithCollectionTasks;
        })
      );
    } catch (error) {
      this.logErrorAndThrow("getting collections with tasks", error);
    }
  }

  async getAllTasks(docId: string, queryConstraints: QueryConstraint[] = [], collectionQueryConstraints: QueryConstraint[] = []): Promise<TaskData[]> {
    try {
      const [individualTasks, collectionTaskMappings] = await Promise.all([
        this.individualTaskService.getAllTasks(docId, ...queryConstraints),
        this.getCollectionsWithCollectionTasks(docId, collectionQueryConstraints, queryConstraints)
      ]);
      const collectionTasks = this.processCollectionTasks(collectionTaskMappings);
      return [...individualTasks, ...collectionTasks];
    } catch (error) {
      this.logErrorAndThrow(`getting all tasks for document ID: ${docId}`, error);
    }
  }

  private processCollectionTasks(collectionTaskMappings: CollectionWithCollectionTasks[]): TaskData[] {
    return collectionTaskMappings.flatMap(({ collectionData, tasksInCollection }) =>
      tasksInCollection.map(task => this.buildTaskWithCollectionData(task, collectionData))
    );
  }

  private buildTaskWithCollectionData(task: TaskCollectionTaskData, collectionData: TaskCollectionData): TaskData {
    const targetPages = this.getTargetPages(task.pagesInRange);
    const completedPages = this.getCompletedPages(targetPages, collectionData.completedPageIndices);
    const remainingPages = this.getRemainingPages(targetPages, collectionData.completedPageIndices);
    const progress = this.calculateProgress(targetPages.length, completedPages.length);
    const estimatedDuration = collectionData.timePerPage * remainingPages.length;

    return {
      ...task,
      estimatedDuration,
      progress,
      completed: progress === 1,
      collectionTaskField: {
        collection: collectionData,
        pagesInRange: task.pagesInRange,
        completedPages,
        remainingPages,
      },
    };
  }

  private getTargetPages(pagesInRange: { min: number; max: number }[]): number[] {
    return removeDuplicates(rangesToArray(pagesInRange));
  }

  private getRemainingPages(targetPages: number[], completedPageIndices: number[]): number[] {
    return targetPages.filter(page => !completedPageIndices.includes(page));
  }

  private getCompletedPages(targetPages: number[], completedPageIndices: number[]): number[] {
    return completedPageIndices.filter(pageIndex => targetPages.includes(pageIndex));
  }

  private calculateProgress(totalPages: number, completedPages: number): number {
    return totalPages === 0 ? 0 : completedPages / totalPages;
  }

  private logErrorAndThrow(action: string, error: unknown): never {
    console.error(`Error ${action}:`, error);
    throw new Error(`Failed to ${action}`);
  }
}
