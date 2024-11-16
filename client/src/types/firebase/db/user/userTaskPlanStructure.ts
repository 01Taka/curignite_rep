
export interface IndividualTaskPlan {
  id: string;
  title: string;
  progress: {
    start: number;
    current: number;
    goal: number;
  }
}

export interface CategoryTaskPlan {
  categoryId: string;
  categoryName: string;
  targetTaskProblemIds: number[];
}

export interface ProblemSetTaskPlan {
  problemSetId: string;
  problemSetName: string;
  categories: CategoryTaskPlan[];
}

export interface TaskPlan {
  individualTasks: IndividualTaskPlan[];
  problemSetTasks: ProblemSetTaskPlan[];
}