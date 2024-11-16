import { Timestamp } from "firebase/firestore";
import { BaseDocumentWrite } from "../../baseTypes";
import { AutoPlanningSettings, CategoryQuantity, ProblemInfo, TaskStepState } from "./taskStepSupplementTypes";
import { CategoryActivity } from "../taskSupplementTypes";

export interface IndividualTaskStepData extends BaseDocumentWrite {
  stepNumber: number;
  dueDateTime: Timestamp | null;
  title: string;
  estimatedTimeMs: number;
  state: TaskStepState;
}

/**
 * problemSetIdとID連携
 */
export interface ProblemSetStepData extends BaseDocumentWrite {
  stepStack: ProblemInfo[]; // 対象の問題の配列。この配列の順に解く
  autoPlanningSettings: AutoPlanningSettings;
}

/**
 * { ProblemSet |ID連携| ProblemSetStepData / StepPlanData }
 * quantityToTackle - この日に取り組む予定の数
 * tackleProblems - 取り組む予定の問題
 * quantityToTackleの値はtackleProblemsと関係ない
 */
export interface ProblemSetStepPlanData extends BaseDocumentWrite {
  date: Timestamp;
  mixedQuantityToTackle: number;
  quantityToTackle: CategoryQuantity[];
  tackleProblems: CategoryActivity[];
}


// 最終的な目標として、解かなければいけない問題数、おすすめの問題番号、解かなければいけない問題番号を扱えるようにする

