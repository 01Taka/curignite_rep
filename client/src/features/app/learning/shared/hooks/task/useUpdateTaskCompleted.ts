import { useCallback, useEffect, useMemo, useState } from "react";
import serviceFactory from "../../../../../../firebase/db/factory";
import useEffectOnCondition from "../../../../../hooks/common/useEffectOnCondition";
import useAsyncHandler from "../../../../../hooks/form/useAsyncHandler";
import { IndividualTaskPreview, ProblemSetTaskPreviewById, TaskPreview } from "../../types/task/taskPreviewTypes";
import { useAppSelector } from "../../../../../../redux/hooks";

interface CompletedChangedCategoryTask {
  toCompletedIds: number[];
  toIncompleteIds: number[];
}

const LOCAL_STORAGE_CATEGORY_KEY = 'completedChangedProblemSetTaskMap';
const LOCAL_STORAGE_INDIVIDUAL_KEY = 'progressChangedIndividualTaskMap';

const useUpdateTaskCompleted = (
  userId: string | null, onSuccessUpdate: () => void, onFailedMessage?: string
) => {
  const [completedChangedProblemSetTaskMap, setCompletedChangedCategoryTaskMap] = useState<Record<string, CompletedChangedCategoryTask>>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_CATEGORY_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const [progressChangedIndividualTaskMap, setProgressChangedIndividualTaskMap] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_INDIVIDUAL_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const { asyncStatus, errorMessage, callAsyncFunction, logError, reset } = useAsyncHandler();
  const { problemSetStructureMap } = useAppSelector(state => state.taskSlice);

  const problemSetIdMapByCategoryId = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(problemSetStructureMap).forEach((structure) => {
      structure.categoryIds.forEach(categoryId => {
        map[categoryId] = structure.problemSetId;
      });
    });
    return map;
  }, [problemSetStructureMap]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CATEGORY_KEY, JSON.stringify(completedChangedProblemSetTaskMap));
  }, [completedChangedProblemSetTaskMap]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_INDIVIDUAL_KEY, JSON.stringify(progressChangedIndividualTaskMap));
  }, [progressChangedIndividualTaskMap]);

  const addProblemSetTaskCompletedChanged = useCallback((task: ProblemSetTaskPreviewById, isCompleted: boolean) => {
    setCompletedChangedCategoryTaskMap(prev => {
      const spritId = task.id.split("_");
      if (spritId.length !== 2) return prev;
      const categoryId = spritId[0];
      const problemId = Number(spritId[1]);

      if (prev[categoryId]) {
        const toCompletedIds = prev[categoryId].toCompletedIds.filter(id => id !== problemId);
        const toIncompleteIds = prev[categoryId].toIncompleteIds.filter(id => id !== problemId);
        return {
          ...prev,
          [categoryId]: {
            toCompletedIds: isCompleted ? [...toCompletedIds, problemId] : toCompletedIds,
            toIncompleteIds: isCompleted ? toIncompleteIds : [...toIncompleteIds, problemId]
          }
        };
      } else {
        return {
          ...prev,
          [categoryId]: {
            toCompletedIds: isCompleted ? [problemId] : [],
            toIncompleteIds: isCompleted ? [] : [problemId]
          }
        };
      }
    });
  }, []);

  const addIndividualTaskProgressChanged = useCallback((task: IndividualTaskPreview, progress: number) => {
    setProgressChangedIndividualTaskMap(prev => ({
      ...prev,
      [task.id]: progress
    }));
  }, []);

  const getAdjustCompletedStateTask = useCallback((previewTasks: TaskPreview[]): TaskPreview[] => {
    return previewTasks.map(task => {
      if (task.isIndividual) {
        if (progressChangedIndividualTaskMap[task.id]) {
          const newTask = {...task};
          newTask.progress.current = progressChangedIndividualTaskMap[task.id];
          return newTask;
        }
        return task;
      } else {
        const changedData = completedChangedProblemSetTaskMap[task.categoryId];
        if (changedData) {
          if (changedData.toCompletedIds.includes(task.problemId)) {
            return { ...task, isCompleted: true };
          } else if (changedData.toIncompleteIds.includes(task.problemId)) {
            return { ...task, isCompleted: false };
          }
        }
        return task;
      }
    });
  }, [progressChangedIndividualTaskMap, completedChangedProblemSetTaskMap]);

  useEffectOnCondition(asyncStatus === "success", { onSuccess: [onSuccessUpdate, reset] });

  const confirmIndividualTaskProgress = useCallback((userId: string) => {
    if (Object.keys(progressChangedIndividualTaskMap).length === 0) return;

    const tasks = Object.entries(progressChangedIndividualTaskMap).map(([taskId, progress]) => ({ taskId, progress }));
    const individualTaskService = serviceFactory.createIndividualTaskService();
    callAsyncFunction(
      individualTaskService.setTasksProgress.bind(individualTaskService),
      [userId, tasks],
      onFailedMessage
    );
  }, [progressChangedIndividualTaskMap, onFailedMessage, callAsyncFunction]);

  const confirmProblemTaskCompletedState = useCallback((userId: string) => {
    if (Object.keys(setCompletedChangedCategoryTaskMap).length) return;

    const categoryService = serviceFactory.createProblemSetCategoryService();
    Object.entries(completedChangedProblemSetTaskMap).forEach(([categoryId, { toCompletedIds, toIncompleteIds }]) => {
      const problemSetId = problemSetIdMapByCategoryId[categoryId];
      if (problemSetId) {
        callAsyncFunction(
          categoryService.setCompletedId.bind(categoryService),
          [userId, problemSetId, categoryId, { toCompletedIds, toIncompleteIds }],
          onFailedMessage
        );
      }
    });
  }, [completedChangedProblemSetTaskMap, problemSetIdMapByCategoryId, onFailedMessage, callAsyncFunction]);

  const confirmTaskState = useCallback(() => {
    if (!userId) {
      logError("User is not authenticated.", "ユーザーが認証されていません。ログインしてください。");
      return;
    }

    confirmIndividualTaskProgress(userId);
    confirmProblemTaskCompletedState(userId);

    localStorage.removeItem(LOCAL_STORAGE_CATEGORY_KEY);
    setCompletedChangedCategoryTaskMap({});
  }, [userId, logError, confirmIndividualTaskProgress, confirmProblemTaskCompletedState]);

  return {
    asyncStatus,
    errorMessage,
    addProblemSetTaskCompletedChanged,
    addIndividualTaskProgressChanged,
    getAdjustCompletedStateTask,
    confirmTaskState
  };
}

export default useUpdateTaskCompleted;