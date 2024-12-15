import { Timestamp } from "firebase/firestore";
import { Range } from "../../../util/componentsTypes";
import { CategoryActivity, ProblemSetActivityManagementMethod } from "./taskSupplementTypes";
import { DocumentRead, DocumentWrite } from "../baseTypes";
import { Subject } from "../common/commonTypes";

interface IndividualTaskDocument {
  title: string; // タスクのタイトル
  subject: Subject;
  estimatedDuration: number; // 推定所要時間
  dueDateTime: number | null; // 期限
  progress: number; // 進捗率（0〜1）
  taskNote: string; // タスクのノート
  completed: boolean; // 完了状態
}

interface ProblemSetDocument {
  name: string; // 問題集の名前
  subject: Subject;
  description: string; // 問題集の説明
  activityManagementMethod: ProblemSetActivityManagementMethod;
}

interface ProblemSetCategoryDocument {
  name: string | 'page'; // カテゴリの名前
  isPage: boolean;
  timePerProblem: number;
  totalProblemNumber: number | null; // カテゴリ内の問題の総数
  completedProblemIdsRange: Range[]; // 完了した問題番号
}

interface ProblemSetActivityDocument {
  dueDateTime: number | null; // 課題の期限
  completed: boolean; // 課題の完了状態
  categoryActivities: CategoryActivity[]; // カテゴリの活動
}

export type IndividualTaskWrite = DocumentWrite<IndividualTaskDocument | { dueDateTime: Timestamp | null }>; 
export type ProblemSetWrite = DocumentWrite<ProblemSetDocument>; 
export type ProblemSetCategoryWrite = DocumentWrite<ProblemSetCategoryDocument>; 
export type ProblemSetActivityWrite = DocumentWrite<ProblemSetActivityDocument | { dueDateTime: Timestamp | null }>; 

export type IndividualTaskRead = DocumentRead<IndividualTaskDocument>; 
export type ProblemSetRead = DocumentRead<ProblemSetDocument>; 
export type ProblemSetCategoryRead = DocumentRead<ProblemSetCategoryDocument>; 
export type ProblemSetActivityRead = DocumentRead<ProblemSetActivityDocument>; 
