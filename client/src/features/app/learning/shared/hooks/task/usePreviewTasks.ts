import { useMemo } from "react";
import { UserTaskPlanManager } from "../../../../../../firebase/db/app/user/userTaskPlanManager";
import { rangesToArray, isNumberInRange } from "../../../../../../functions/utils/rangeUtils";
import { useAppSelector } from "../../../../../../redux/hooks";
import { IndividualTaskPreview, ProblemSetTaskPreviewById } from "../../types/task/taskPreviewTypes";

export const usePreviewTasks = ({ taskOrder }: { taskOrder: string[] }) => {
  const { individualTaskMap, problemSetMap, categoryMap } = useAppSelector(state => state.taskSlice);
  const user = useAppSelector(state => state.userSlice.userData);

  const expandTasks = useMemo(() => {
    if (user && user.taskPlan) {
      return UserTaskPlanManager.expandTaskPlan(user.taskPlan, individualTaskMap, problemSetMap, categoryMap);
    }
    return { individualTasks: [], problemSetTasks: [] };
  }, [user, individualTaskMap, problemSetMap, categoryMap]);

  const taskPreviews = useMemo(() => {
    const individualTaskPreviews = expandTasks.individualTasks.map(task => ({
      ...task,
      id: task.individualTaskId,
      isIndividual: true
    })) as IndividualTaskPreview[];
    const problemSetTaskPreviews = expandTasks.problemSetTasks.map(task => {
      return task.targets.map(target => {
        const problemSetId = task.problemSetId;
        const categoryId = target.categoryId;
        const data = {
          id: categoryId,
          categoryId,
          problemSetId,
          problemSetName: task.problemSetName,
          categoryName: target.categoryName,
          estimatedDuration: target.timePerProblem,
          isIndividual: false
        }
        const problemIds = rangesToArray(target.remainingProblemIdRanges);
        return problemIds.map(id => {
          return {
            ...data,
            id: `${data.id}_${id}`,
            problemId: id,
            isCompleted: isNumberInRange(target.complicatedProblemIdRanges, id)
          } as ProblemSetTaskPreviewById
        })
      })
    }).flat(2);
    return [...individualTaskPreviews, ...problemSetTaskPreviews];
  }, [expandTasks]);

  return { expandTasks, taskPreviews };
}