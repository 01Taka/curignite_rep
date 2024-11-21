import { Range } from "../../../util/componentsTypes";

export interface IndividualTaskPlan {
  individualTaskId: string;
  progress: {
    start: number;
    goal: number;
  }
}

export interface ProblemSetTaskPlan {
  problemSetId: string;
  targets: ProblemSetTaskPlanTarget[];
}

export interface ProblemSetTaskPlanTarget {
  categoryId: string;
  targetProblemIdRanges: Range[];
}

export interface TaskPlan {
  individualTasks: IndividualTaskPlan[];
  problemSetTasks: ProblemSetTaskPlan[];
}


// 拡張型
export interface IndividualTaskPlanExpansion {
  individualTaskId: string;
  title: string;
  isCompleted: boolean;
  progress: {
    start: number;
    current: number;
    goal: number;
  }
  totalEstimatedDuration: number;
  estimatedDuration: number;
}

export interface ProblemSetTaskPlanTargetExpansion {
  categoryId: string;
  categoryName: string;
  targetProblemIdRanges: Range[];
  remainingProblemIdRanges: Range[];
  complicatedProblemIdRanges: Range[];
  timePerProblem: number;
  remainingEstimatedDuration: number;
}

export interface ProblemSetTaskPlanExpansion {
  problemSetId: string;
  problemSetName: string;
  targets: ProblemSetTaskPlanTargetExpansion[];
  remainingEstimatedDuration: number;
}

export interface TaskPlanExpansion {
  individualTasks: IndividualTaskPlanExpansion[];
  problemSetTasks: ProblemSetTaskPlanExpansion[];
}

