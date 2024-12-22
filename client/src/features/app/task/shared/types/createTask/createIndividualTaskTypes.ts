import { Subject } from "../../../../../../types/firebase/db/common/commonTypes";

export interface CreateIndividualTaskFormState {
  title: string;
  subject: Subject;
  dueDateTime: Date | null;
  informStartDaysBeforeDue: number | null;
  taskNote: string;
  estimatedDuration: number;
}