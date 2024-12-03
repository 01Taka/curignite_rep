import { DocumentData, DocumentReference } from "firebase/firestore";
import { ProblemSetActivityManagementMethod } from "../../../../../../types/firebase/db/task/taskSupplementTypes";
import { ProblemSetCategoryWrite, ProblemSetWrite } from "../../../../../../types/firebase/db/task/taskStructure";

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

export interface CreateProblemSetStateTypes {
  createProblemSet: DocumentReference<ProblemSetWrite, DocumentData>;
  createCategory: DocumentReference<ProblemSetCategoryWrite, DocumentData>;
}

export interface UpdateProblemSetFormState {
  name: string;
  description: string;
}