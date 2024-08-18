import { BaseTaskData } from "../../firebase/db/todo/TodoTypes";

export type GradientCircleSize = 'sm' | 'md' | 'lg';

export interface TaskContainerComponentProps {
  task: BaseTaskData;
  estimatedDuration?: number;
  remainingPages?: number;
  size: GradientCircleSize;
}

