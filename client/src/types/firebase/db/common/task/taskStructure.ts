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
  name: string;
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
export interface TaskData extends IndividualTaskData {
  pagesInRange?: number[];
  completedPages?: number[];
}

export interface CollectionWithTasks {
  collectionData: TaskCollectionData;
  tasksInCollection: TaskCollectionTaskData[];
}