import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../../baseTypes";
import { TaskPriority } from "./taskSupplementTypes";
import { Range } from "../../../../util/componentsTypes";

export interface BaseTaskData extends BaseDocumentData {
  title: string;
  dueDateTime: Timestamp | null;
  taskNote: string;
  priority: TaskPriority;
}

export interface IndividualTaskData extends BaseTaskData {
  estimatedDuration: number;
  progress: number;
  completed: boolean;
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
  pagesInRange: Range[];
}


// データベース外インターフェース

/**
 * remainingPages = pagesInRange - completedPages
 */
export interface CollectionTaskField {
  collection: TaskCollectionData;
  pagesInRange: Range[];
  completedPages: number[];
  remainingPages: number[];
}

export interface TaskData extends IndividualTaskData {
  collectionTaskField?: CollectionTaskField;
}

export interface CollectionWithCollectionTasks {
  collectionData: TaskCollectionData;
  tasksInCollection: TaskCollectionTaskData[];
}

export interface CollectionWithTasksData {
  collectionData: TaskCollectionData;
  tasksData: TaskData[];
}