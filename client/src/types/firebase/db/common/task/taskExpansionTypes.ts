import { IndividualTaskData, MainQuestionActivity, MainQuestionData, ProblemSetData } from "./taskStructure";

export interface Task_Data extends IndividualTaskData {
  problemSetActivityField?: ProblemSetActivityField; // 問題集の活動フィールド
}

export interface ProblemSetActivityField {
  totalProblemCount: number; // 総問題数
  totalEstimatedDurationMs: number; // 合計の推定所要時間
  activityStatuses: MainQuestionActivityStatus[];
}

export interface MainQuestionActivityStatus extends MainQuestionActivity {
  completedTaskIds: string[];
  remainingTaskIds: string[];
  completionRate: `${number}/${number}`; // 完了率
}

export interface ProblemSetWithQuestions {
  problemSet: ProblemSetData;
  mainQuestions: MainQuestionData[];
  mainQuestionNumber: number;
  totalProblemNumber: number;
}

export interface ProblemSetWithTaskData {
  problemSet: ProblemSetData;
  tasks: Task_Data[]
}

