import { TaskData } from "../../../../../../types/firebase/db/task/taskExpansionTypes";
import { ProblemSetRead } from "../../../../../../types/firebase/db/task/taskStructure";

export type PlanMode = "common" | "priority" | "emergency";

export interface BasePlan {
  mode: PlanMode;
  dueDateTime?: Date; // 任意プロパティとして扱う
  estimatedDurationMs: number;
  isIndividual: boolean;
  progress: number;
}

export interface ProblemSetPlanProblemIds {
  categoryId: string;
  problemIds: number[];
  completedIds: number[];
}

export interface ProblemSetPlan extends BasePlan {
  isIndividual: false;
  goalNumber: number;
  completedNumber: number;
  targets: ProblemSetPlanProblemIds[];
  maxProblemNumber: number;
}

export interface IndividualPlan extends BasePlan {
  isIndividual: true;
  goalProgress: number;
  completedProgress: number;
}

export type Plan = ProblemSetPlan | IndividualPlan;


interface IndividualPlanTarget {
  isIndividual: true;
  target: TaskData;
}

interface ProblemSetPlanTarget {
  isIndividual: false;
  target: ProblemSetRead;
}

export type PlanTarget = IndividualPlanTarget | ProblemSetPlanTarget;
