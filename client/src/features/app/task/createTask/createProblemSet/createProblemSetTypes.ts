import { DocumentData, DocumentReference } from "firebase/firestore";
import { ProblemSetCategoryData, ProblemSetData } from "../../../../../types/firebase/db/task/taskStructure";
import { ProblemSetActivityManagementMethod } from "../../../../../types/firebase/db/task/taskSupplementTypes";

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