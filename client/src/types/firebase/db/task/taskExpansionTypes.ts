import { Range } from "../../../util/componentsTypes";
import { IndividualTaskRead, ProblemSetCategoryRead, ProblemSetRead } from "./taskStructure";
import { ProblemSetActivityManagementMethod } from "./taskSupplementTypes";

/**
 * taskId - Individual: docId, ProblemSetActivity: activity docId
 */
export interface TaskData extends Omit<IndividualTaskRead, "docId"> {
  taskId: string;
  isIndividual: boolean;
  remainingEstimatedDuration: number;
  formatEstDuration: string;
  problemSetActivityField?: ProblemSetActivityField; // 問題集の活動フィールド
}

export interface ExpansionProblemSetData extends ProblemSetRead {
  averageEstimatedDuration: number;
  totalProblemNumber: number;
  completedProblemNumber: number;
}

export interface ProblemSetActivityField {
  problemSetId: string;
  problemSetName: string;
  totalProblemCount: number; // 総問題数
  totalRemainingProblemNumber: number;
  activityManagementMethod: ProblemSetActivityManagementMethod;
  activityStatus: CategoryActivityStatus[];
  completionRate: `${number}/${number}`;
}

export interface CategoryActivityStatus {
  categoryId: string; // カテゴリのID
  categoryName: string;
  problemIdsRange: Range[]; // カテゴリ内の問題番号
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

export interface ProblemSetStructure {
  problemSetId: string;
  categoryIds: string[];
  activityIds: string[];
}