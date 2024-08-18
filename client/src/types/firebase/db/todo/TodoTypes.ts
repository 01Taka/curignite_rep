import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";

export enum TaskParentType {
  User = "user",
  Team = "team",
}

export interface TaskListData extends BaseDocumentData {
  parentId: string;
  parentType: TaskParentType;
}

export type TaskPriority = "high" | "medium" | "low";

export interface BaseTaskData extends BaseDocumentData {
  title: string;
  dueDateTime: Timestamp | null;
  taskNote: string;
  priority: TaskPriority;
  progress: number;
  completed: boolean;
}

export interface TaskListIndividualTaskData extends BaseTaskData {
  estimatedDuration: number; // Duration in milliseconds
}

export interface TaskListTaskCollectionData extends BaseDocumentData {
  name: string;
  totalPages: number; // Total number of pages in the collection
  timePerPage: number; // Time per page in milliseconds
  completedPageIndices: number[]; // Ensure uniqueness
  description: string;
}

export interface TaskCollectionBatchTaskData extends BaseTaskData {
  collectionId: string;
  pagesInRange: number[];
  completedPages: number[]; // Ensure uniqueness
}

/*
/taskList/{taskListId}/individualTasks/{singleTaskId}
/taskList/{taskListId}/taskCollections/{collectionId}
/taskList/{taskListId}/taskCollections/{collectionId}/batchTasks/{batchTaskId}
*/
