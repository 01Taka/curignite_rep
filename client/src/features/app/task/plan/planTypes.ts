export interface TodayIndividualTask {
  id: string;
  title: string;
  todayProgress: number;
  estimatedDuration: number;
}

export interface TodayTaskStatus {
  taskId: string;
  categoryId: string;
  categoryName: string;
  todayTaskProblemIds: number[];
  estimatedDuration: number;
}

export interface TodayTasks {
  estimatedDuration: number;
  individualTasks: TodayIndividualTask[];
  problemSetTasks: {
      taskId: string;
      taskName: string;
      estimatedDuration: number;
      categories: TodayTaskStatus[];
  }[];
}