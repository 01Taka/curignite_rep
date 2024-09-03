import { TaskPriority } from "../../firebase/db/common/task/taskSupplementTypes";
import { Range, SelectItem } from "../../util/componentsTypes";

interface BaseTaskFormState {
  title: string;
  dueDateTime: Date | null;
  taskNote: string;
  priority: TaskPriority;
}

export const taskPrioritySelectItem: SelectItem<TaskPriority>[] = [
  {
    label: "高い",
    value: "high",
  },
  {
    label: "普通",
    value: "medium",
  },
  {
    label: "低い",
    value: "low",
  }
];


export interface CreateIndividualTaskViewFormState extends BaseTaskFormState {
  estimatedDuration: number;
}

export interface CreateTaskCollectionViewFormState {
  name: string;
  totalPages: number;
  timePerPage: number;
  description: string;
}

export interface CreateCollectionTaskViewFormState extends BaseTaskFormState {
  pagesInRange: Range[];
}
