import { IndividualTaskPlanExpansion } from "../../../../../../types/firebase/db/user/userTaskPlanStructure";

export interface TaskDataPreview {
  id: string;
  title: string;
  isCompleted: string;
  problemSetField: {
    problemSetId: string;
    problemSetName: string;
    categoryId: string;
    categoryName: string;
  }
}

export interface ProblemSetTaskPreviewById {
  id: string;
  problemId: number;
  problemSetId: string;
  problemSetName: string;
  categoryId: string;
  categoryName: string;
  estimatedDuration: number;
  isCompleted: boolean;
  isIndividual: false;
}

export type IndividualTaskPreview = IndividualTaskPlanExpansion & { id: string, isIndividual: true };

export type TaskPreview = IndividualTaskPreview | ProblemSetTaskPreviewById;