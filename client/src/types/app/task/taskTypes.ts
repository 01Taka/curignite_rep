import { TaskData } from "../../firebase/db/common/task/taskStructure";

export type GradientCircleSize = 'sm' | 'md' | 'lg';

export interface TaskContainerComponentProps {
  task: TaskData;
  size: GradientCircleSize;
}

