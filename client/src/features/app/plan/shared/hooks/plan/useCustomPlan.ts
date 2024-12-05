import { useEffect, useMemo, useState, useCallback } from 'react';
import { arrayToRanges, rangesToArray, sumRanges } from '../../../../../../functions/utils/rangeUtils';
import { TaskData } from '../../../../../../types/firebase/db/task/taskExpansionTypes';
import useMultipleRangeSelections from '../../../../../hooks/range/useMultipleRangeSelections';
import { mathClamp } from '../../../../../../functions/utils/mathUtils';
import { Range } from '../../../../../../types/util/componentsTypes';
import { useAppSelector } from '../../../../../../redux/hooks';
import { TodayTasks, TodayIndividualTask, TodayProblemSetTask, TodayCategoryTask } from '../../types/plan/planTypes';
import { recoveryId, getId } from '../../utils/plan/customPlanUtils';

const useCustomPlan = (
  _tasks?: TaskData[],
  recommendTask?: TodayTasks
) => {
  const { taskMap, categoryMap, problemSetMap } = useAppSelector(state => state.taskSlice);
  const tasks = useMemo(() => _tasks ?? Object.values(taskMap), [_tasks, taskMap]);
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
    
  }, [recommendTask]);

  const updateTodayProblemSetTask = useCallback(
    (id: string, ranges: Range[]) => {
      const { categoryId } = recoveryId(id);
      const category = categoryMap[categoryId];
      if (!category) return;

      const problemSetId = category.parentId;
      
      const todayTaskProblemIds = rangesToArray(ranges);
      const newCategory: TodayCategoryTask = {
        problemSetId,
        problemSetName: problemSetMap[problemSetId].name,
        categoryId,
        categoryName: category.name,
        todayTaskProblemIds,
        estimatedDuration: todayTaskProblemIds.length * category.timePerProblem
      };

      const problemSetTask = todayProblemSetTask[problemSetId] || {
        problemSetId,
        problemSetName: problemSetMap[problemSetId],
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
    [categoryMap, problemSetMap, todayProblemSetTask]
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
      Object.keys(categoryMap).forEach(categoryId => {
        const pairId = getId(activityField.problemSetId, categoryId);
        const taskId = getId(task.taskId, categoryId);
        addRangeSelectionWithPairing(pairId, taskId);
      });
    });
  }, [tasks, categoryMap, addRangeSelectionWithPairing]);

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
      id: task.taskId,
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
