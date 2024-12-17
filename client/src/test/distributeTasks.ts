import { seq } from "../functions/utils/dataStructureUtils/arrayUtils";
import { groupingByKey, sortObjectArray } from "../functions/utils/dataStructureUtils/objectUtils";

type Task = {
  id: string;
  deadline: number;
};

type FormatData = {
  tasks: string[];
  deadline: number;
  task_num: number;
  days_available: number;
  task_per_day: number;
};

type Segment = FormatData[];

function isDescending(dictList: FormatData[], key: keyof FormatData): boolean {
  if (dictList.length <= 1) return true;
  const values = dictList.map((item) => item[key]);
  return values.every((value, i) => i === 0 || values[i - 1] >= value);
}

function groupingByDeadline(tasks: Task[]): {
  tasks: string[];
  deadline: number;
}[] {
  const results: Record<number, { tasks: string[]; deadline: number }> = {};

  tasks.forEach((task) => {
    const { deadline, id } = task;
    if (results[deadline]) {
      results[deadline].tasks.push(id);
    } else {
      results[deadline] = { tasks: [id], deadline };
    }
  });
  return Object.values(results);
}

function getFormatData(tasks: Task[]): FormatData[] {
  const sortedResults = sortObjectArray(groupingByDeadline(tasks), "deadline");

  let prevDeadline = 0;
  return sortedResults.map((value) => {
    const taskNum = value.tasks.length;
    const daysAvailable = value.deadline - prevDeadline;
    prevDeadline = value.deadline;

    return {
      ...value,
      task_num: taskNum,
      days_available: daysAvailable,
      task_per_day: taskNum / daysAvailable,
    };
  });
}

function splitIncreasingSegments(list: FormatData[]): Segment[] {
  if (list.length === 0) return [];

  const segments: Segment[] = [[list[0]]];

  for (let i = 1; i < list.length; i++) {
    const current = list[i];
    const previous = list[i - 1];

    if (current.task_per_day > previous.task_per_day) {
      segments[segments.length - 1].push(current);
    } else {
      segments.push([current]);
    }
  }

  return segments;
}

function mergeSegment(segment: Segment): FormatData {
  const totalTasks: string[] = segment.flatMap((data) => data.tasks);
  const totalTaskNum = totalTasks.length;
  const totalDaysAvailable = segment.reduce((sum, data) => sum + data.days_available, 0);
  const taskPerDayAvg = totalTaskNum / totalDaysAvailable;

  return {
    tasks: totalTasks,
    deadline: segment[segment.length - 1].deadline,
    task_num: totalTaskNum,
    days_available: totalDaysAvailable,
    task_per_day: taskPerDayAvg,
  };
}

function distributeDays(formatData: FormatData) {
  const { tasks, deadline, days_available } = formatData;
  const days = seq(deadline - days_available, deadline);
  const taskDistribution: Record<number, string[]> = Object.fromEntries(days.map(day => ([day, []])));
  const minSize = Math.floor(tasks.length / days.length);
  const remainder = tasks.length % days.length;

  let start = 0;
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const groupSize = minSize + (i < remainder ? 1 : 0);
    taskDistribution[day].push(...tasks.slice(start, start + groupSize));
  }

  const result = Object.entries(taskDistribution).map(([date, taskIds]) => ({ taskIds, date: Number(date) }));

  return result;
}



function toFormatData<T extends Task>(tasks: T[]) {
  let formatData = getFormatData(tasks);

  while (true) {
    const segments = splitIncreasingSegments(formatData);
    const mergedData = segments.map(mergeSegment);

    if (isDescending(mergedData, "task_per_day")) {
      formatData = mergedData;
      break;
    }

    formatData = mergedData;
  }

  return formatData;
}

/**
 * 
 * @param tasks 
 * @returns { [taskId]: deadline } のRecord
 */
function distributeTasks<T extends Task>(tasks: T[]): Record<string, {
  taskIds: string[];
  date: number;
}[]> {
  const formatData = toFormatData(tasks);

  const distributedData = formatData.flatMap(data => {
    return distributeDays(data);
  });

  return groupingByKey(distributedData, "date");
}

export { distributeTasks };
