import { TodayTasks } from "../../../../features/app/task/plan/shared/planTypes";
import { arrayToRanges } from "../../../../functions/utils/rangeUtils";
import { UserData } from "../../../../types/firebase/db/user/userStructure";
import { UserTaskPlanData } from "../../../../types/firebase/db/user/userSupplementTypes";
import BaseDB from "../../base";
import { UserService } from "./userService";

export class UserTaskPlanManager {
  private baseDB: BaseDB<UserData>;

  constructor(userService: UserService) {
    this.baseDB = userService.getBaseDB();
  }

  async updateTaskPlanField(userId: string, taskPlan: UserTaskPlanData): Promise<void> {
    await this.baseDB.update(userId, { taskPlan });
  } 

  async createTaskPlan(
    creatorId: string,
    todayTasks: TodayTasks
  ): Promise<void> {
    const problemSetTasks = todayTasks.problemSetTasks.map(
      task => task.categories.map(category => {
        const { todayTaskProblemIds, ...rest } = category;
        return {
          ...rest,
          todayTaskProblemRanges: arrayToRanges(todayTaskProblemIds)
        };
      })).flat();
      
    const data: UserTaskPlanData = {
      estimatedDuration: todayTasks.estimatedDuration,
      individualTasks: todayTasks.individualTasks,
      problemSetTasks
    }

    await this.updateTaskPlanField(creatorId, data);
  }
}