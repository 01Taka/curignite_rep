import { useCallback, useMemo } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { ProblemSetStructure, TaskData } from "../../../types/firebase/db/task/taskExpansionTypes";
import { ProblemSetActivityRead, ProblemSetCategoryRead, ProblemSetRead } from "../../../types/firebase/db/task/taskStructure";

const DEFAULT_PROBLEM_SET_DATA = {
  problemSet: null,
  structure: {
    problemSetId: "",
    activityIds: [],
    categoryIds: [],
  },
  activityIds: [],
  categoryIds: [],
  activities: [],
  categories: [],
  tasks: []
};

const useTasks = () => {
  const taskSlice = useAppSelector((state) => state.taskSlice);
  const {
    taskMap,
    individualTaskMap,
    categoryMap,
    activityMap,
    problemSetMap,
    problemSetStructureMap,
  } = taskSlice;

  // Problem Set データを取得する関数
  const getProblemSetData = useCallback(
    (problemSetId: string): {
      problemSet: ProblemSetRead | null,
      structure:  ProblemSetStructure,
      activityIds: string[],
      categoryIds: string[],
      activities: ProblemSetActivityRead[],
      categories: ProblemSetCategoryRead[],
      tasks: TaskData[]
    } => {
      const problemSet = problemSetMap[problemSetId];
      const structure = problemSetStructureMap[problemSetId];
      if (!structure) return DEFAULT_PROBLEM_SET_DATA;

      const activityIds = structure.activityIds || [];
      const activities = activityIds.map((id) => activityMap[id]);
      const tasks = activityIds.map((id) => taskMap[id]);

      const categoryIds = structure.categoryIds || [];
      const categories = categoryIds.map((id) => categoryMap[id]);

      return {
        problemSet,
        structure,
        activityIds,
        categoryIds,
        activities,
        categories,
        tasks
      };
    },
    [problemSetMap, problemSetStructureMap, activityMap, categoryMap]
  );

  // 派生データをメモ化
  const tasks = useMemo(() => Object.values(taskMap), [taskMap]);
  const individualTasks = useMemo(() => Object.values(individualTaskMap), [individualTaskMap]);
  const categories = useMemo(() => Object.values(categoryMap), [categoryMap]);
  const activities = useMemo(() => Object.values(activityMap), [activityMap]);
  const problemSets = useMemo(() => Object.values(problemSetMap), [problemSetMap]);

  return {
    ...taskSlice,
    tasks,
    individualTasks,
    categories,
    activities,
    problemSets,
    getProblemSetData,
  };
};

export default useTasks;
