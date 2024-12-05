import { endOfDay, format } from "date-fns";
import { convertToDate, convertToMilliseconds } from "../../../../../functions/utils/dateTimeUtils";
import { sortObjectArray } from "../../../../../functions/utils/objectUtils";
import { MINUTES_IN_MILLISECOND } from "../../../../../constants/utils/dateTimeConstants";
import { TimeTypes } from "../../../../../types/util/dateTimeTypes";

export const sortByDueDateTime = <T extends Record<string, any>>(items: T[], key: keyof T): T[] => {
  const todayMs = convertToMilliseconds(endOfDay(new Date()));

  const withinTasks = items.filter(task => task[key] && task[key] >= todayMs);
  const overdueTasks = items.filter(task => task[key] && task[key] < todayMs);
  const noDeadlineTasks = items.filter(task => !task[key]);

  // それぞれのタスクをソート
  const sortedWithinTasks = sortObjectArray(withinTasks, key);
  const sortedOverdueTasks = sortObjectArray(overdueTasks, key, false);

  return [...sortedWithinTasks, ...noDeadlineTasks, ...sortedOverdueTasks];
}

export const formatDueDateTime = (dueDateTime: TimeTypes | null) => {
  return dueDateTime 
  ? format(convertToDate(dueDateTime), 'MM/dd') 
  : null;
}