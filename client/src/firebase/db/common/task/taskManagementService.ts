import { Firestore, QueryConstraint } from "firebase/firestore";
import { CollectionWithTasks, TaskCollectionTaskData, TaskData } from "../../../../types/firebase/db/common/task/taskStructure";
import { TaskCollectionService } from "./taskCollectionService";
import { IndividualTaskService } from "./individualTaskService";
import { TaskCollectionTaskService } from "./taskCollectionTaskService";

export class TaskManagementService {
  private individualTaskService: IndividualTaskService;
  private taskCollectionService: TaskCollectionService;
  private taskCollectionTaskService: TaskCollectionTaskService;

  constructor(firestore: Firestore, basePath: string) {
    this.individualTaskService = new IndividualTaskService(firestore, basePath);
    this.taskCollectionService = new TaskCollectionService(firestore, basePath);
    this.taskCollectionTaskService = new TaskCollectionTaskService(firestore, basePath);
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

  async getAllTasksFromCollections(
    docId: string,
    collectionQueryConstraints: QueryConstraint[] = [],
    taskQueryConstraints: QueryConstraint[] = []
  ): Promise<TaskCollectionTaskData[]> {
    try {
      const collections = await this.taskCollectionService.getAllCollections(docId, ...collectionQueryConstraints);
      const allTasksInCollections = await Promise.all(
        collections.map(collection => this.taskCollectionTaskService.getAllTasks(docId, collection.docId, ...taskQueryConstraints))
      );
      return allTasksInCollections.flat();
    } catch (error) {
      console.error("Error getting all tasks from collections:", error);
      throw new Error("Failed to get all tasks from collections");
    }
  }

  async getCollectionsWithTasks(
    docId: string,
    collectionQueryConstraints: QueryConstraint[] = [],
    taskQueryConstraints: QueryConstraint[] = []
  ): Promise<CollectionWithTasks[]> {
    try {
      const collections = await this.taskCollectionService.getAllCollections(docId, ...collectionQueryConstraints);
      const collectionTaskMapping = await Promise.all(
        collections.map(async collection => ({
          collectionData: collection,
          tasksInCollection: await this.taskCollectionTaskService.getAllTasks(docId, collection.docId, ...taskQueryConstraints)
        }))
      );
      return collectionTaskMapping;
    } catch (error) {
      console.error("Error getting collections with tasks:", error);
      throw new Error("Failed to get collections with tasks");
    }
  }

  async getAllTasks(docId: string, queryConstraints: QueryConstraint[] = [], collectionQueryConstraints: QueryConstraint[] = []): Promise<TaskData[]> {
    try {
      const individualTasks = await this.individualTaskService.getAllTasks(docId, ...queryConstraints);
      const collectionTaskMappings = await this.getCollectionsWithTasks(docId, collectionQueryConstraints, queryConstraints);

      const collectionTasksWithDuration = collectionTaskMappings.flatMap(({ collectionData, tasksInCollection }) => {
        const estimatedDuration = collectionData.timePerPage * tasksInCollection.length;
        return tasksInCollection.map(task => ({
          ...task,
          estimatedDuration,
        } as TaskData));
      });

      return [...individualTasks, ...collectionTasksWithDuration];
    } catch (error) {
      console.error("Error getting all tasks:", error);
      throw new Error("Failed to get all tasks");
    }
  }
}
