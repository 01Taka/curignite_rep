import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";
import { Range } from "../../../util/componentsTypes";
import { CategoryActivity, ProblemSetActivityManagementMethod } from "./taskSupplementTypes";

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

