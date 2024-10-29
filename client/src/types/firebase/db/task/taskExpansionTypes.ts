import { CategoryActivity, ProblemSetCategoryData, IndividualTaskData, ProblemSetData } from "./taskStructure";

export interface TaskData extends IndividualTaskData {
  remainingEstimatedDuration: number;
  problemSetActivityField?: ProblemSetActivityField; // 問題集の活動フィールド
}

export interface ExpansionProblemSetData extends ProblemSetData {
  averageEstimatedDuration: number;
  totalProblemNumber: number;
  completedProblemNumber: number;
}

export interface ProblemSetActivityField {
  totalProblemCount: number; // 総問題数
  activityStatus: CategoryActivityStatus[];
  completionRate: `${number}/${number}`;
}

export interface CategoryActivityStatus extends CategoryActivity  {
  category: ProblemSetCategoryData;
  completedProblemIds: number[];
  remainingProblemIds: number[];
}

// export interface ProblemSetWithQuestions {
//   problemSet: ProblemSetData;
//   mainQuestions: MainQuestionData[];
//   mainQuestionNumber: number;
//   totalProblemNumber: number;
// }

export interface FullProblemSetData {
  problemSet: ExpansionProblemSetData;
  activities: TaskData[];
  categories: ProblemSetCategoryData[];
}

