import { Range } from "../../../util/componentsTypes";
import { IndividualTaskRead, ProblemSetCategoryRead, ProblemSetRead } from "./taskStructure";
import { ProblemSetActivityManagementMethod } from "./taskSupplementTypes";

interface BaseTaskData extends Omit<IndividualTaskRead, "docId"> {
  taskId: string;
  isIndividual: boolean;
  remainingEstimatedDuration: number;
  formatEstDuration: string;
  daysUntilInformBegins: number;
  daysRemainingUntilSubmission: number | null;
}

interface IndividualTask extends BaseTaskData {
  isIndividual: true;
  problemSetActivityField?: never; // 個別タスクにはこのフィールドは存在しない
}

export interface ProblemSetTask extends BaseTaskData {
  isIndividual: false;
  problemSetActivityField: ProblemSetActivityField; // 必須
}

/**
 * taskId - Individual: docId, ProblemSetActivity: activity docId
 */
export type TaskData = IndividualTask | ProblemSetTask;

export interface ExpansionProblemSetData extends ProblemSetRead {
  averageEstimatedDuration: number;
  totalProblemCount: number;
  completedProblemNumber: number;
}

export interface ProblemSetActivityField {
  problemSetId: string;
  problemSetName: string;
  totalProblemCount: number; // 総問題数
  totalCompletedProblemCount: number;
  totalRemainingProblemCount: number;
  activityManagementMethod: ProblemSetActivityManagementMethod;
  activityStatus: CategoryActivityStatus[];
  completionRate: `${number}/${number}`;
}

export interface CategoryActivityStatus {
  categoryId: string; // カテゴリのID
  categoryName: string;
  categoryTotalProblemCount: number | null;
  timePerProblem: number;
  problemIdsRange: Range[]; // カテゴリ内の問題番号
  completedProblemIds: number[];
  remainingProblemIds: number[];
}

// export interface ProblemSetWithQuestions {
//   problemSet: ProblemSetData;
//   mainQuestions: MainQuestionData[];
//   mainQuestionNumber: number;
//   totalProblemCount: number;
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