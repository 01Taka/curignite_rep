import { TodayCategoryTask, TodayTasks } from "../../../../features/app/plan/shared/types/plan/planTypes";
import { mathClamp } from "../../../../functions/utils/mathUtils";
import { arrayToRanges, subtractRanges, sumRanges } from "../../../../functions/utils/rangeUtils";
import { IndividualTaskRead, ProblemSetCategoryRead, ProblemSetRead } from "../../../../types/firebase/db/task/taskStructure";
import { UserRead, UserWrite } from "../../../../types/firebase/db/user/userStructure";
import { IndividualTaskPlan, IndividualTaskPlanExpansion, ProblemSetTaskPlan, ProblemSetTaskPlanExpansion, ProblemSetTaskPlanTarget, ProblemSetTaskPlanTargetExpansion, TaskPlan, TaskPlanExpansion } from "../../../../types/firebase/db/user/userTaskPlanStructure";
import FirestoreService from "../../handler/firestoreService";
import { UserService } from "./userService";

export class UserTaskPlanManager {
  private fss: FirestoreService<UserRead, UserWrite>;

  constructor(
    userService: UserService
  ) {
    this.fss = userService.fss;
  }

  static todayTasksToTaskPlan(todayTasks: TodayTasks): TaskPlan {
    const createProgress = (currentProgress: number, todayProgress: number) => ({
      start: currentProgress,
      goal: mathClamp(currentProgress + todayProgress, 0, 1)
    });
  
    const createTargets = (category: TodayCategoryTask) => ({
      categoryId: category.categoryId,
      targetProblemIdRanges: arrayToRanges(category.todayTaskProblemIds)
    });
  
    const individualTasks: IndividualTaskPlan[] = todayTasks.individualTasks.map(task => ({
      individualTaskId: task.id,
      progress: createProgress(task.currentProgress, task.todayProgress)
    }));
  
    const problemSetTasks: ProblemSetTaskPlan[] = todayTasks.problemSetTasks.map(task => ({
      problemSetId: task.problemSetId,
      targets: task.categories.map(createTargets)
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
  
  static expandTaskPlan(
    taskPlan: TaskPlan,
    individualTaskMap: Record<string, IndividualTaskRead>,
    problemSetMap: Record<string, ProblemSetRead>,
    categoryMap: Record<string, ProblemSetCategoryRead>
  ): TaskPlanExpansion {
    // 個別タスクの拡張を行う関数
    const expandIndividualTasks = (): IndividualTaskPlanExpansion[] =>
      taskPlan.individualTasks.map(task => {
        const taskData = individualTaskMap[task.individualTaskId];
        const progressRemaining = mathClamp(task.progress.goal - taskData.progress, 0, 1);
  
        return {
          individualTaskId: task.individualTaskId,
          title: taskData.title,
          isCompleted: taskData.completed,
          progress: {
            start: Math.min(task.progress.start, taskData.progress),
            current: taskData.progress,
            goal: task.progress.goal,
          },
          totalEstimatedDuration: taskData.estimatedDuration,
          estimatedDuration: taskData.estimatedDuration * progressRemaining,
        };
      });
  
    // 問題セットタスクのターゲット処理関数
    const processTarget = (
      target: ProblemSetTaskPlanTarget,
      category: ProblemSetCategoryRead
    ): ProblemSetTaskPlanTargetExpansion => {
      const remainingRanges = subtractRanges(target.targetProblemIdRanges, category.completedProblemIdsRange);
      const remainingEstimatedDuration = sumRanges(remainingRanges) * category.timePerProblem;
  
      return {
        categoryId: target.categoryId,
        categoryName: category.name,
        targetProblemIdRanges: target.targetProblemIdRanges,
        remainingProblemIdRanges: remainingRanges,
        complicatedProblemIdRanges: category.completedProblemIdsRange,
        timePerProblem: category.timePerProblem,
        remainingEstimatedDuration,
      };
    };
  
    // 問題セットタスクの拡張を行う関数
    const expandProblemSetTasks = (): ProblemSetTaskPlanExpansion[] =>
      taskPlan.problemSetTasks.map(task => {
        const problemSet = problemSetMap[task.problemSetId];
        if (!problemSet) {
          return null;
        }

        const targets = task.targets.map(target => {
          const category = categoryMap[target.categoryId];
          if (!category) {
            return null;
          }
          return processTarget(target, category);
        });

        const validTargets = targets.filter(target => !!target) as ProblemSetTaskPlanTargetExpansion[];
  
        const remainingEstimatedDuration = validTargets.reduce(
          (sum, target) => sum + target.remainingEstimatedDuration,
          0
        );
  
        return {
          problemSetId: task.problemSetId,
          problemSetName: problemSet.name,
          targets: validTargets,
          remainingEstimatedDuration,
        };
      }).filter(data => !!data) as ProblemSetTaskPlanExpansion[];
  
    return {
      individualTasks: expandIndividualTasks(),
      problemSetTasks: expandProblemSetTasks(),
    };
  }
  
}