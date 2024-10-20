import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../../baseTypes";

export interface IndividualTaskData extends BaseDocumentData {
  title: string; // タスクのタイトル
  estimatedDuration: number; // 推定所要時間
  dueDateTime: Timestamp | null; // 期限
  progress: number; // 進捗率（0〜1）
  taskNote: string; // タスクのノート
  completed: boolean; // 完了状態
}

export interface ProblemSetData extends BaseDocumentData {
  name: string; // 問題集の名前
  description: string; // 問題集の説明
}

export interface MainQuestionData extends BaseDocumentData {
  name: string; // 大問の名前
  totalProblemNumber: number; // 大問内のの問題の総数
  completedProblemIds: number[]; // 完了した問題番号
}

export interface ProblemSetActivityData extends BaseDocumentData {
  dueDateTime: Timestamp | null; // 課題の期限
  completed: boolean; // 課題の完了状態
  mainQuestionActivities: MainQuestionActivity[]; // 大問の活動
}

export interface MainQuestionActivity {
  mainQuestionId: string; // 大問のID
  problemIds: number[]; // 大問内の問題番号
}















// export interface TaskCollectionData extends BaseDocumentData {
//   collectionName: string;
//   totalPages: number;
//   timePerPage: number;
//   completedPageIndices: number[]; 
//   description: string;
// }

// export interface TaskCollectionTaskData extends BaseTaskData {
//   collectionId: string;
//   pagesInRange: Range[];
// }


// // データベース外インターフェース

// /**
//  * remainingPages = pagesInRange - completedPages
//  */
// export interface CollectionTaskField {
//   collection: TaskCollectionData;
//   pagesInRange: Range[];
//   completedPages: number[];
//   remainingPages: number[];
//   completionRate: string;
// }



// export interface TaskCategoryProgress extends TaskCategory {

// }



// export interface CollectionWithCollectionTasks {
//   collectionData: TaskCollectionData;
//   tasksInCollection: TaskCollectionTaskData[];
// }

// export interface CollectionWithTasksData {
//   collectionData: TaskCollectionData;
//   tasksData: TaskData[];
// }