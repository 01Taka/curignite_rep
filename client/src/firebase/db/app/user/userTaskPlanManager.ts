import { Firestore } from "firebase/firestore";
import { TodayCategoryTask, TodayTasks } from "../../../../features/app/task/plan/shared/planTypes";
import { mathClamp } from "../../../../functions/utils/numberUtils";
import { UserRead, UserWrite } from "../../../../types/firebase/db/user/userStructure";
import { TaskPlan } from "../../../../types/firebase/db/user/userTaskPlanStructure";
import FirestoreService from "../../handler/firestoreService";

export class UserTaskPlanManager {
  private fss: FirestoreService<UserRead, UserWrite>;

  constructor(
    firestore: Firestore
  ) {
    this.fss = new FirestoreService(firestore, 'users');
  }

  get firestoreService() {
    return this.fss;
  }

  static todayTasksToTaskPlan(todayTasks: TodayTasks): TaskPlan {
    const createProgress = (currentProgress: number, todayProgress: number) => ({
      start: currentProgress,
      current: currentProgress,
      goal: mathClamp(currentProgress + todayProgress, 0, 1)
    });
  
    const createCategoryTaskPlan = (category: TodayCategoryTask) => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      targetTaskProblemIds: category.todayTaskProblemIds
    });
  
    const individualTasks = todayTasks.individualTasks.map(task => ({
      id: task.id,
      title: task.title,
      progress: createProgress(task.currentProgress, task.todayProgress)
    }));
  
    const problemSetTasks = todayTasks.problemSetTasks.map(task => ({
      problemSetId: task.problemSetId,
      problemSetName: task.taskName,
      categories: task.categories.map(createCategoryTaskPlan)
    }));
  
    return {
      individualTasks,
      problemSetTasks
    };
  }

  async updateTaskPlanField(userId: string, taskPlan: TaskPlan): Promise<void> {
    await this.fss.update(userId, { taskPlan });
  }

  async createTaskPlan(
    creatorId: string,
    todayTasks: TodayTasks
  ): Promise<void> {
    const data = UserTaskPlanManager.todayTasksToTaskPlan(todayTasks);
    await this.updateTaskPlanField(creatorId, data);
  }
}