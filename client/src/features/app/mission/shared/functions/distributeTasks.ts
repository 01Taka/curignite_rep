import { seq } from "../../../../../functions/utils/dataStructureUtils/arrayUtils";
import { groupingByKey, sortObjectArray } from "../../../../../functions/utils/dataStructureUtils/objectUtils";

type Task = {
  taskId: string;
  daysRemainingUntilSubmission: number;
};

type TaskSummary = {
  taskIds: string[];
  daysRemainingUntilSubmission: number;
  taskCount: number;
  availableDays: number;
  tasksPerDay: number;
};

type TaskSegment = TaskSummary[];

function isSortedDescending(dataList: TaskSummary[], key: keyof TaskSummary): boolean {
  if (dataList.length <= 1) return true;
  const values = dataList.map((item) => item[key]);
  return values.every((value, i) => i === 0 || values[i - 1] >= value);
}

function groupTasksByDeadline(tasks: Task[]): {
  taskIds: string[];
  daysRemainingUntilSubmission: number;
}[] {
  const grouped: Record<number, { taskIds: string[]; daysRemainingUntilSubmission: number }> = {};

  tasks.forEach((task) => {
    const { taskId, daysRemainingUntilSubmission } = task;
    if (grouped[daysRemainingUntilSubmission]) {
      grouped[daysRemainingUntilSubmission].taskIds.push(taskId);
    } else {
      grouped[daysRemainingUntilSubmission] = { taskIds: [taskId], daysRemainingUntilSubmission };
    }
  });
  return Object.values(grouped);
}

function calculateTaskSummaries(tasks: Task[]): TaskSummary[] {
  const sortedGroups = sortObjectArray(groupTasksByDeadline(tasks), "daysRemainingUntilSubmission");

  let previousDeadline = 0;
  return sortedGroups.map((group) => {
    const taskCount = group.taskIds.length;
    const availableDays = group.daysRemainingUntilSubmission - previousDeadline;
    previousDeadline = group.daysRemainingUntilSubmission;

    return {
      ...group,
      taskCount,
      availableDays,
      tasksPerDay: taskCount / availableDays,
    };
  });
}

function divideIntoIncreasingSegments(list: TaskSummary[]): TaskSegment[] {
  if (list.length === 0) return [];

  const segments: TaskSegment[] = [[list[0]]];

  for (let i = 1; i < list.length; i++) {
    const current = list[i];
    const previous = list[i - 1];

    if (current.tasksPerDay > previous.tasksPerDay) {
      segments[segments.length - 1].push(current);
    } else {
      segments.push([current]);
    }
  }

  return segments;
}

function mergeTaskSegment(segment: TaskSegment): TaskSummary {
  const allTaskIds: string[] = segment.flatMap((data) => data.taskIds);
  const totalTaskCount = allTaskIds.length;
  const totalAvailableDays = segment.reduce((sum, data) => sum + data.availableDays, 0);
  const averageTasksPerDay = totalTaskCount / totalAvailableDays;

  return {
    taskIds: allTaskIds,
    daysRemainingUntilSubmission: segment[segment.length - 1].daysRemainingUntilSubmission,
    taskCount: totalTaskCount,
    availableDays: totalAvailableDays,
    tasksPerDay: averageTasksPerDay,
  };
}

function distributeTasksAcrossDays(taskSummary: TaskSummary) {
  const { taskIds, daysRemainingUntilSubmission, availableDays } = taskSummary;
  console.log(daysRemainingUntilSubmission - availableDays, daysRemainingUntilSubmission);
  
  const days = seq(daysRemainingUntilSubmission - availableDays, daysRemainingUntilSubmission);
  const dailyDistribution: Record<number, string[]> = Object.fromEntries(days.map(day => ([day, []])));
  const minTasksPerDay = Math.floor(taskIds.length / days.length);
  const remainingTasks = taskIds.length % days.length;

  let start = 0;
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const tasksForDay = minTasksPerDay + (i < remainingTasks ? 1 : 0);
    dailyDistribution[day].push(...taskIds.slice(start, start + tasksForDay));
    start += tasksForDay;
  }

  return Object.entries(dailyDistribution).map(([date, taskIds]) => ({ taskIds, date: Number(date) }));
}

function processTasks<T extends Task>(tasks: T[]) {
  let taskSummaries = calculateTaskSummaries(tasks);

  while (true) {
    const segments = divideIntoIncreasingSegments(taskSummaries);
    const mergedSummaries = segments.map(mergeTaskSegment);

    if (isSortedDescending(mergedSummaries, "tasksPerDay")) {
      taskSummaries = mergedSummaries;
      break;
    }

    taskSummaries = mergedSummaries;
  }

  return taskSummaries;
}

/**
 * Distributes tasks into days based on deadlines and task count.
 * @param tasks List of tasks with deadlines.
 * @returns Record of daily task distributions grouped by date.
 */
function distributeTasksByDate<T extends Task>(tasks: T[]): Record<string, {
  taskIds: string[];
  date: number;
}[]> {
  const taskSummaries = processTasks(tasks);

  const distributedData = taskSummaries.flatMap(summary => {
    return distributeTasksAcrossDays(summary);
  });

  return groupingByKey(distributedData, "date");
}

export { distributeTasksByDate };
