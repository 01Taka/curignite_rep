import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";
import { Range } from "../../../util/componentsTypes";

export interface IndividualTaskData extends BaseDocumentData {
  title: string; // タスクのタイトル
  estimatedDuration: number; // 推定所要時間
  dueDateTime: Timestamp | null; // 期限
  progress: number; // 進捗率（0〜1）
  taskNote: string; // タスクのノート
  completed: boolean; // 完了状態
}

export type ProblemSetActivityManagementMethod = 'page' | 'mainQuestion';

export interface ProblemSetData extends BaseDocumentData {
  name: string; // 問題集の名前
  description: string; // 問題集の説明
  activityManagementMethod: ProblemSetActivityManagementMethod;
}

export interface ProblemSetCategoryData extends BaseDocumentData {
  name: string | 'page'; // カテゴリの名前
  timePerProblem: number;
  totalProblemNumber: number | null; // カテゴリ内の問題の総数
  completedProblemIdsRange: Range[]; // 完了した問題番号
}

export interface ProblemSetActivityData extends BaseDocumentData {
  dueDateTime: Timestamp | null; // 課題の期限
  completed: boolean; // 課題の完了状態
  categoryActivities: CategoryActivity[]; // カテゴリの活動
}

export interface CategoryActivity {
  categoryId: string; // カテゴリのID
  problemIdsRange: Range[]; // カテゴリ内の問題番号
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