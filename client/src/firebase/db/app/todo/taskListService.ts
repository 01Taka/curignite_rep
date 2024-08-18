import { DocumentData, DocumentReference } from "firebase/firestore";
import { TaskCollectionBatchTaskData, TaskListIndividualTaskData, TaskParentType } from "../../../../types/firebase/db/todo/TodoTypes";
import TaskListsDB from "./taskLists";
import { TaskListIndividualTaskService } from "./subCollection/taskListIndividualTaskService";
import { TaskCollectionBatchTaskService } from "./subCollection/subCollection/taskCollectionBatchTaskService";
import { sortArray } from "../../../../functions/objectUtils";
import { UsersDB } from "../user/users";

export class TaskListService {
  constructor(
    private taskListsDB: TaskListsDB,
    private usersDB: UsersDB,
    private taskListIndividualTaskService: TaskListIndividualTaskService,
    private taskCollectionBatchTaskService: TaskCollectionBatchTaskService
  ) {}

  async createTaskListForUser(userId: string): Promise<DocumentReference<DocumentData, DocumentData>> {
    try {
      return this.taskListsDB.createTaskList(userId, userId, TaskParentType.User);
    } catch (error) {
      console.error(`Failed to create task list for user ${userId}:`, error);
      throw new Error(`Failed to create task list for user ${userId}. Please try again later.`);
    }
  }

  async getAllTasks(taskListId: string, sortingByDueDateTime: boolean = true): Promise<(TaskListIndividualTaskData | TaskCollectionBatchTaskData)[]> {
    try {
      const individualTasks = await this.taskListIndividualTaskService.getAllIndividualTasks(taskListId);
      const batchTasks = await this.taskCollectionBatchTaskService.getAllBatchTasks(taskListId);
      const mergedTasks = [...individualTasks, ...batchTasks];
      return sortingByDueDateTime ? sortArray(mergedTasks, "dueDateTime") : mergedTasks;
    } catch (error) {
      console.error(`Failed to retrieve tasks for task list ${taskListId}:`, error);
      throw new Error(`Failed to retrieve tasks for task list ${taskListId}. Please try again later.`);
    }
  }

  async getAllTasksByUserId(userId: string, sortingByDueDateTime: boolean = true): Promise<(TaskListIndividualTaskData | TaskCollectionBatchTaskData)[]> {
    try {
      const user = await this.usersDB.getUser(userId);
      if (!user) {
        throw new Error("user not found.");
      }
      const taskListId = user.metaData.taskListId;
      return await this.getAllTasks(taskListId, sortingByDueDateTime);
    } catch (error) {
      console.error(`Failed to retrieve tasks for task list by userId ${userId}:`, error);
      throw new Error(`Failed to retrieve tasks for task list by userId ${userId}. Please try again later.`);
    }
  }
}
