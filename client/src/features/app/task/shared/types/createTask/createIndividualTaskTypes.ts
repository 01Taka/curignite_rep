import { Subject } from "../../../../../../types/firebase/db/common/commonTypes";

export interface CreateIndividualTaskFormState {
  title: string;
  subject: Subject;
  dueDateTime: Date | null;
  taskNote: string;
  estimatedDuration: number;
}