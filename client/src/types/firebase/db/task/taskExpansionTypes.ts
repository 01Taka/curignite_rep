import { IndividualTaskRead, ProblemSetCategoryRead, ProblemSetRead } from "./taskStructure";
import { CategoryActivity, ProblemSetActivityManagementMethod } from "./taskSupplementTypes";

export interface TaskData extends IndividualTaskRead {
  isIndividual: boolean;
  remainingEstimatedDuration: number;
  problemSetActivityField?: ProblemSetActivityField; // 問題集の活動フィールド
}

export interface ExpansionProblemSetData extends ProblemSetRead {
  averageEstimatedDuration: number;
  totalProblemNumber: number;
  completedProblemNumber: number;
}

export interface ProblemSetActivityField {
  problemSet: ProblemSetRead;
  categoryMap: Record<string, ProblemSetCategoryRead>;
  totalProblemCount: number; // 総問題数
  totalRemainingProblemNumber: number;
  activityManagementMethod: ProblemSetActivityManagementMethod;
  activityStatus: CategoryActivityStatus[];
  completionRate: `${number}/${number}`;
}

export interface CategoryActivityStatus extends CategoryActivity  {
  categoryName: string;
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
  categories: ProblemSetCategoryRead[];
}

