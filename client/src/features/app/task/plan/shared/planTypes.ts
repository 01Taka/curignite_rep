export interface TodayIndividualTask {
  id: string;
  title: string;
  todayProgress: number;
  estimatedDuration: number;
}

export interface TodayCategoryTask {
  taskId: string;
  categoryId: string;
  categoryName: string;
  todayTaskProblemIds: number[];
  estimatedDuration: number;
}

export interface TodayProblemSetTask {
  problemSetId: string;
  taskName: string;
  estimatedDuration: number;
  categories: TodayCategoryTask[];
}

export interface TodayTasks {
  estimatedDuration: number;
  individualTasks: TodayIndividualTask[];
  problemSetTasks: TodayProblemSetTask[];
}
