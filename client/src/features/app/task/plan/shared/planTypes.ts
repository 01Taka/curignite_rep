import { Range } from "../../../../../types/util/componentsTypes";

export interface TodayIndividualTask {
  id: string;
  title: string;
  currentProgress: number;
  todayProgress: number;
  estimatedDuration: number;
}

export interface TodayCategoryTask {
  problemSetId: string;
  problemSetName: string;
  categoryId: string;
  categoryName: string;
  todayTaskProblemIds: number[];
  estimatedDuration: number;
}

export interface TodayCategoryTaskWithRanges {
  taskId: string;
  categoryId: string;
  categoryName: string;
  todayTaskProblemRanges: Range[];
  estimatedDuration: number;
}

export interface TodayProblemSetTask {
  problemSetId: string;
  problemSetName: string;
  estimatedDuration: number;
  categories: TodayCategoryTask[];
}

export interface TodayTasks {
  estimatedDuration: number;
  individualTasks: TodayIndividualTask[];
  problemSetTasks: TodayProblemSetTask[];
}

export interface TodayTasksWithRanges {
  estimatedDuration: number;
  individualTasks: TodayIndividualTask[];
  problemSetTasks: TodayCategoryTaskWithRanges[];
}
