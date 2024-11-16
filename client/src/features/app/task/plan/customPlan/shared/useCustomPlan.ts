import { useEffect, useMemo, useState, useCallback } from 'react';
import { arrayToRanges, rangesToArray, sumRanges } from '../../../../../../functions/utils/rangeUtils';
import { TaskData } from '../../../../../../types/firebase/db/task/taskExpansionTypes';
import useMultipleRangeSelections from '../../../../../hooks/range/useMultipleRangeSelections';
import { getId, recoveryId } from './customPlanUtils';
import { TodayCategoryTask, TodayIndividualTask, TodayProblemSetTask, TodayTasks } from '../../shared/planTypes';
import { mathClamp } from '../../../../../../functions/utils/numberUtils';
import { Range } from '../../../../../../types/util/componentsTypes';
import { ProblemSetCategoryRead } from '../../../../../../types/firebase/db/task/taskStructure';

const useCustomPlan = (tasks: TaskData[], recommendTask: TodayTasks | null) => {
  const [selectedTaskTime, setSelectedTaskTime] = useState<Record<string, number>>({});
  const [todayIndividualTasks, setTodayIndividualTasks] = useState<Record<string, TodayIndividualTask>>({});
  const [todayProblemSetTask, setTodayProblemSetTask] = useState<Record<string, TodayProblemSetTask>>({});

  useEffect(() => {
    setTodayIndividualTasks(
      recommendTask ? Object.fromEntries(recommendTask.individualTasks.map(task => [task.id, task])): {}
    );
    setTodayProblemSetTask(
      recommendTask ? Object.fromEntries(recommendTask.problemSetTasks.map(task => [task.problemSetId, task])): {}
    );
    console.log(recommendTask ? Object.fromEntries(recommendTask.problemSetTasks.map(task => [task.problemSetId, task])): {});
    
  }, [recommendTask])

  const taskNameMap = useMemo(
    () => Object.fromEntries(tasks.map(task => [task.docId, task.title])),
    [tasks]
  );

  const taskProblemSetIdMap = useMemo(
    () => Object.fromEntries(tasks.map(task => [task.docId, task.problemSetActivityField?.problemSet.docId ?? null])),
    [tasks]
  );

  const categoryMap = useMemo(() => {
    return tasks.reduce<Record<string, ProblemSetCategoryRead>>((acc, task) => ({
      ...acc,
      ...(task.problemSetActivityField?.categoryMap ?? {})
    }), {});
  }, [tasks]);

  const updateTodayProblemSetTask = useCallback(
    (id: string, ranges: Range[]) => {
      const { taskId, categoryId } = recoveryId(id);
      const category = categoryMap[categoryId];
      if (!category) return;
      

      const todayTaskProblemIds = rangesToArray(ranges);
      const newCategory: TodayCategoryTask = {
        taskId,
        categoryId,
        categoryName: category.name,
        todayTaskProblemIds,
        estimatedDuration: todayTaskProblemIds.length * category.timePerProblem
      };

      const problemSetId = taskProblemSetIdMap[taskId];



      if (!problemSetId) return;

      const problemSetTask = todayProblemSetTask[problemSetId] || {
        problemSetId,
        taskName: taskNameMap[taskId],
        estimatedDuration: 0,
        categories: []
      };;

      setTodayProblemSetTask(prev => {
        const updatedCategories = [newCategory, ...problemSetTask.categories.filter(cat => cat.categoryId !== categoryId)];
        return {
          ...prev,
          [problemSetId]: {
            ...problemSetTask,
            categories: updatedCategories,
            estimatedDuration: updatedCategories.reduce((sum, cat) => sum + cat.estimatedDuration, 0)
          }
        };
      });
    },
    [categoryMap, taskNameMap, taskProblemSetIdMap, todayProblemSetTask]
  );

  const {
    totalState,
    addRangeSelectionWithPairing,
    setRangesWithPair,
    getNumberColor,
    onSelectNumber,
    getState,
    onCancelSelection,
    onDeleteOperatingRange
  } = useMultipleRangeSelections({ onChangeRanges: updateTodayProblemSetTask });

  useEffect(() => {
    const updatedTaskTime = totalState.reduce((acc, state) => {
      const { categoryId } = recoveryId(state.id);
      const problemNumber = sumRanges(state.selectedRanges);
      acc[state.id] = problemNumber * (categoryMap[categoryId]?.timePerProblem || 0);
      return acc;
    }, {} as Record<string, number>);
    setSelectedTaskTime(updatedTaskTime);
  }, [totalState, categoryMap]);

  const initializeSelections = useCallback(() => {
    tasks.forEach(task => {
      const activityField = task.problemSetActivityField;
      if (!activityField) return;
      Object.keys(activityField.categoryMap).forEach(categoryId => {
        const pairId = getId(activityField.problemSet.docId, categoryId);
        const taskId = getId(task.docId, categoryId);
        addRangeSelectionWithPairing(pairId, taskId);
      });
    });
  }, [tasks, addRangeSelectionWithPairing]);

  useEffect(() => {
    initializeSelections();
  }, [initializeSelections]);

  useEffect(() => {
    if (recommendTask) {
      recommendTask.problemSetTasks.forEach(task => {
        task.categories.forEach(category => {
          const pairId = getId(task.problemSetId, category.categoryId);
          setRangesWithPair(pairId, arrayToRanges(category.todayTaskProblemIds));
        });
      });
    }
  }, [recommendTask, setRangesWithPair]);

  const addIndividualTask = useCallback((task: TaskData, progress: number = 1) => {
    const todayProgress = mathClamp(progress - task.progress, 0, 1);
    const data: TodayIndividualTask = {
      id: task.docId,
      title: task.title,
      currentProgress: task.progress,
      todayProgress,
      estimatedDuration: task.estimatedDuration * todayProgress
    };
    setTodayIndividualTasks(prev => ({ ...prev, [data.id]: data }));
  }, []);

  const removeIndividualTask = useCallback((taskId: string) => {
    setTodayIndividualTasks(prev => {
      const updatedTasks = { ...prev };
      delete updatedTasks[taskId];
      return updatedTasks;
    });
  }, []);

  const todayPlanTasks = useMemo(() => {
    const individualTasks = Object.values(todayIndividualTasks);
    const problemSetTasks = Object.values(todayProblemSetTask);
    const estimatedDuration = 
      individualTasks.reduce((sum, task) => sum + task.estimatedDuration, 0)
      + problemSetTasks.reduce((sum, task) => sum + task.estimatedDuration, 0);

    return {
      estimatedDuration,
      individualTasks,
      problemSetTasks
    };
  }, [todayIndividualTasks, todayProblemSetTask]);

  return {
    todayPlanTasks,
    todayIndividualTasks,
    todayProblemSetTask,
    selectedTaskTime,
    addIndividualTask,
    removeIndividualTask,
    getNumberColor,
    onSelectNumber,
    getState,
    onCancelSelection,
    onDeleteOperatingRange,
  };
};

export default useCustomPlan;
