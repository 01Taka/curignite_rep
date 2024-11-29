import { endOfDay } from "date-fns";
import { convertToMilliseconds } from "../../../../../functions/utils/dateTimeUtils";
import { TaskData } from "../../../../../types/firebase/db/task/taskExpansionTypes";
import { sortObjectArray } from "../../../../../functions/utils/objectUtils";

export const sortTasks = (tasks: TaskData[], key: keyof TaskData): TaskData[] => {
  const todayMs = convertToMilliseconds(endOfDay(new Date()));

  const withinTasks = tasks.filter(task => task.dueDateTime !== null && task.dueDateTime >= todayMs);
  const overdueTasks = tasks.filter(task => task.dueDateTime !== null && task.dueDateTime < todayMs);
  const noDeadlineTasks = tasks.filter(task => task.dueDateTime === null);

  // それぞれのタスクをソート
  const sortedWithinTasks = sortObjectArray(withinTasks, key);
  const sortedOverdueTasks = sortObjectArray(overdueTasks, key, false);

  return [...sortedWithinTasks, ...noDeadlineTasks, ...sortedOverdueTasks];
};
