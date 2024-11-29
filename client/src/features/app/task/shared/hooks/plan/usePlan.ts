import { differenceInCalendarDays } from "date-fns";
import { useMemo, useState } from "react";
import { convertToDate } from "../../../../../../functions/utils/dateTimeUtils";
import { removeDuplicates, groupingByKey } from "../../../../../../functions/utils/objectUtils";
import { useAppSelector } from "../../../../../../redux/hooks";
import { TodayIndividualTask, TodayCategoryTask, TodayTasks } from "../../types/plan/planTypes";

const usePlan = (containExpired: boolean) => {
  const { tasks, problemSetMap, categoryMap } = useAppSelector(state => state.taskSlice);
  const [isContainExpired, setIsContainExpired] = useState(containExpired);

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const studyTimeNeededToday = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!task.dueDateTime || !task.remainingEstimatedDuration) return acc;

      const taskDueDate = convertToDate(task.dueDateTime);
      const daysRemaining = differenceInCalendarDays(taskDueDate, today);
      if (daysRemaining < 0) return acc;

      const durationPerDay = task.remainingEstimatedDuration / Math.max(daysRemaining, 1);
      return acc + durationPerDay;
    }, 0);
  }, [tasks, today]);

  const todayIndividualTasks = useMemo(() => {
    return tasks
      .filter(task => task.isIndividual && task.dueDateTime && task.progress !== 1)
      .map(task => {
        const progress = task.progress || 0;

        if (progress < 0 || progress > 1) {
          console.warn('Invalid progress range: ', progress);
          return null;
        }

        const taskDueDate = task.dueDateTime ? convertToDate(task.dueDateTime) : today;
        const daysRemaining = differenceInCalendarDays(taskDueDate, today);

        if (!isContainExpired && daysRemaining < 0) return null;

        const remainingDays = Math.max(daysRemaining, 1);
        const todayProgress = (1 - progress) / remainingDays;
        const estimatedDuration = todayProgress * task.estimatedDuration;

        return {
          id: task.docId,
          title: task.title,
          todayProgress,
          estimatedDuration,
        };
      })
      .filter((task): task is TodayIndividualTask => task !== null);
  }, [tasks, isContainExpired, today]);

  const todayTaskStatuses = useMemo(() => {
    const categoryStatusMap: Record<string, TodayCategoryTask> = {};

    tasks.forEach(task => {
      const activityField = task.problemSetActivityField;
      if (!activityField || !task.dueDateTime) return;
      const daysRemaining = differenceInCalendarDays(convertToDate(task.dueDateTime), today);

      activityField.activityStatus.forEach(status => {
        const todayQuantity = Math.ceil(status.remainingProblemIds.length / Math.max(daysRemaining, 1));
        const taskProblemIds = isContainExpired || daysRemaining >= 0 
          ? status.remainingProblemIds.slice(0, todayQuantity) 
          : [];

        if (!categoryStatusMap[status.categoryId]) {
          categoryStatusMap[status.categoryId] = {
            problemSetId: problemSetMap[activityField.problemSetId]?.docId,
            problemSetName: problemSetMap[activityField.problemSetId]?.name,
            categoryId: status.categoryId,
            categoryName: status.categoryName,
            todayTaskProblemIds: taskProblemIds,
            estimatedDuration: categoryMap[status.categoryId].timePerProblem * taskProblemIds.length
          };
        } else {
          const newTodayTaskProblemIds = removeDuplicates([
            ...categoryStatusMap[status.categoryId].todayTaskProblemIds, 
            ...taskProblemIds
          ]);
          categoryStatusMap[status.categoryId].todayTaskProblemIds = newTodayTaskProblemIds;
          categoryStatusMap[status.categoryId].estimatedDuration = categoryMap[status.categoryId].timePerProblem * newTodayTaskProblemIds.length;
        }
      });
    });

    return Object.values(categoryStatusMap).filter(status => status.todayTaskProblemIds.length !== 0);
  }, [tasks, isContainExpired, categoryMap, today]);

  const todayTasks: TodayTasks = useMemo(() => {
    const groupedStatuses = groupingByKey(todayTaskStatuses, 'problemSetId');
    const problemSetTasks = Object.entries(groupedStatuses).map(([key, categories]) => ({
      problemSetId: key,
      problemSetName: problemSetMap[key]?.name,
      estimatedDuration: categories.reduce((acc, category) => acc + category.estimatedDuration, 0),
      categories
    }));
    const estimatedDuration =
      problemSetTasks.reduce((acc, task) => acc + task.estimatedDuration, 0) +
      todayIndividualTasks.reduce((acc, task) => acc + task.estimatedDuration, 0);
    return {
      estimatedDuration,
      individualTasks: todayIndividualTasks,
      problemSetTasks
    }
  }, [todayTaskStatuses, todayIndividualTasks, problemSetMap]);

  return { todayTasks, studyTimeNeededToday, categoryMap, problemSetMap, isContainExpired, setIsContainExpired };
};

export default usePlan;