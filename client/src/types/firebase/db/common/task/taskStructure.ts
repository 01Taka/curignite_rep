import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../../baseTypes";
import { TaskPriority } from "./taskSupplementTypes";

export interface BaseTaskData extends BaseDocumentData {
  title: string;
  dueDateTime: Timestamp | null;
  taskNote: string;
  priority: TaskPriority;
  progress: number;
  completed: boolean;
}

export interface IndividualTaskData extends BaseTaskData {
  estimatedDuration: number;
}

export interface TaskCollectionData extends BaseDocumentData {
  collectionName: string;
  totalPages: number;
  timePerPage: number;
  completedPageIndices: number[]; 
  description: string;
}

export interface TaskCollectionTaskData extends BaseTaskData {
  collectionId: string;
  pagesInRange: number[];
  completedPages: number[];
}


// データベース外インターフェース

/**
 * remainingPages = pagesInRange - completedPages
 */
export interface CollectionTaskField {
  collection: TaskCollectionData;
  pagesInRange: number[];
  completedPages: number[];
  remainingPages: number[];
}

export interface TaskData extends IndividualTaskData {
  collectionTaskField?: CollectionTaskField;
}

export interface CollectionWithTasks {
  collectionData: TaskCollectionData;
  tasksInCollection: TaskCollectionTaskData[];
}