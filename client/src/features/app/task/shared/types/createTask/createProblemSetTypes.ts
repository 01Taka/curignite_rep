import { DocumentData, DocumentReference } from "firebase/firestore";
import { ProblemSetActivityManagementMethod } from "../../../../../../types/firebase/db/task/taskSupplementTypes";
import { ProblemSetCategoryWrite, ProblemSetWrite } from "../../../../../../types/firebase/db/task/taskStructure";
import { Subject } from "../../../../../../types/firebase/db/common/commonTypes";

export interface ProblemSetCategoryForm {
  name: string;
  timePerProblem: number;
  totalProblemCount: number;
}

export interface CreateProblemSetFormState {
  name: string;
  subject: Subject;
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