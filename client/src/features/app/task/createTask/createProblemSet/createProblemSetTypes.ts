import { DocumentData, DocumentReference } from "firebase/firestore";
import { ProblemSetActivityManagementMethod, ProblemSetCategoryData, ProblemSetData } from "../../../../../types/firebase/db/task/taskStructure";

export interface ProblemSetCategoryForm {
  name: string;
  timePerProblem: number;
  totalProblemNumber: number;
}

export interface CreateProblemSetViewFormState {
  name: string;
  description: string;
  activityManagementMethod: ProblemSetActivityManagementMethod;
  categories: ProblemSetCategoryForm[];
}

export type CreateProblemSetStateTypes = {
  createProblemSet: DocumentReference<ProblemSetData, DocumentData>;
  createCategory: DocumentReference<ProblemSetCategoryData, DocumentData>;
};