import { TaskData } from "../../../../../../types/firebase/db/task/taskExpansionTypes";
import { ProblemSetRead } from "../../../../../../types/firebase/db/task/taskStructure";

export type PlanType = "individual" | "problemSetTask" | "problemSet";

interface WorkOnPlanBase {
  planType: PlanType;
  task: null | TaskData;
  minValue: number;
  currentValue: number;
  estimatedDuration: number;
}

export interface WorkOnProblemSetTask extends WorkOnPlanBase {
  planType: "problemSetTask";
  maxValue: number;
  remainingValue: number;
  task: TaskData;
  problemSet: ProblemSetRead;
  workOnItems: {
    categoryId: string;
    problemId: number;
  }[];
}

export interface WorkOnProblemSet extends WorkOnPlanBase {
  planType: "problemSet";
  maxValue: number | null;
  remainingValue: number | null;
  task: null;
  problemSet: ProblemSetRead;
  workOnItems: {
    categoryId: string;
    problemId: number;
  }[];
}


export interface WorkOnIndividualTask extends WorkOnPlanBase {
  planType: "individual";
  maxValue: number;
  remainingValue: number;
  task: TaskData;
}

export type WorkOnPlan = WorkOnIndividualTask | WorkOnProblemSetTask | WorkOnProblemSet;
