import { Timestamp } from "firebase/firestore";
import { TaskListIndividualTaskData, TaskPriority } from "../../../../../types/firebase/db/todo/TodoTypes";
import TaskListIndividualTasksDB from "./taskListIndividualTasks";

export class TaskListIndividualTaskService {
  constructor(private getTaskListIndividualTasksDBInstance: (taskListId: string) => TaskListIndividualTasksDB) {}

  async createIndividualTasks(
    taskListId: string,
    createdById: string,
    title: string,
    dueDateTime: Timestamp | null,
    taskNote: string,
    priority: TaskPriority,
    estimatedDuration: number,
    progress: number = 0,
    completed: boolean = false,
  ) {
    try {
      const individualTasksDB = this.getTaskListIndividualTasksDBInstance(taskListId);
      individualTasksDB.createTaskListIndividualTask(
        createdById,
        title,
        dueDateTime,
        taskNote,
        priority,
        estimatedDuration,
        progress,
        completed
      );
    } catch (error) {
      
    }
  }

  async getAllIndividualTasks(taskListId: string): Promise<TaskListIndividualTaskData[]> {
    return this.getTaskListIndividualTasksDBInstance(taskListId).getAllTaskListIndividualTask();
  }
}