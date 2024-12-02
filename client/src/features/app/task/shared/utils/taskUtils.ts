import { endOfDay, format } from "date-fns";
import { convertToDate, convertToMilliseconds } from "../../../../../functions/utils/dateTimeUtils";
import { TaskData } from "../../../../../types/firebase/db/task/taskExpansionTypes";
import { sortObjectArray } from "../../../../../functions/utils/objectUtils";
import { MINUTES_IN_MILLISECOND } from "../../../../../constants/utils/dateTimeConstants";
import { TimeTypes } from "../../../../../types/util/dateTimeTypes";

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

export const millToMin = (mill: number) => Math.ceil(mill / MINUTES_IN_MILLISECOND);

export const formatDueDateTime = (dueDateTime: TimeTypes | null) => {
  return dueDateTime 
  ? format(convertToDate(dueDateTime), 'MM/dd') 
  : null;
}