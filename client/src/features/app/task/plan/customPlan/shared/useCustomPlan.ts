// hooks/useCustomPlan.ts
import { useEffect, useMemo, useState } from 'react';
import { sumRanges } from '../../../../../../functions/utils/rangeUtils';
import { TaskData } from '../../../../../../types/firebase/db/task/taskExpansionTypes';
import { ProblemSetCategoryData } from '../../../../../../types/firebase/db/task/taskStructure';
import useMultipleRangeSelections from '../../../../../hooks/range/useMultipleRangeSelections';
import { getId, recoveryId } from './customPlanUtils';

const useCustomPlan = (tasks: TaskData[]) => {
  const [selectedTaskTime, setSelectedTaskTime] = useState<Record<string, number>>({});
  const { totalState, addRangeSelections, getNumberColor, onSelectNumber, getState, onCancelSelection, onDeleteOperatingRange } = useMultipleRangeSelections();

  const categoryMap: Record<string, ProblemSetCategoryData> = useMemo(() => {
    return tasks.reduce((acc, task) => {
      return Object.assign(acc, task.problemSetActivityField?.categoryMap ?? {});
    }, {});
  }, [tasks]);

  useEffect(() => {
    totalState.forEach((state) => {
      const { categoryId } = recoveryId(state.id);
      const problemNumber = sumRanges(state.selectedRanges);
      const time = problemNumber * categoryMap[categoryId].timePerProblem;

      setSelectedTaskTime((prev) => ({
        ...prev,
        [state.id]: time,
      }));
    });
  }, [totalState, categoryMap]);

  const ids = useMemo(() => {
    const ids = tasks.map((task) => task.problemSetActivityField ? Object.keys(task.problemSetActivityField.categoryMap).map(categoryId => getId(task.docId, categoryId)) : null);
    return ids.filter(id => id !== null).flat() as string[];
  }, [tasks]);

  useEffect(() => {
    if (ids.length > 0) addRangeSelections(ids);
  }, [ids, tasks, addRangeSelections]);



  const totalTime = useMemo(() => Object.values(selectedTaskTime).reduce((sum, time) => sum + time, 0), [selectedTaskTime]);


  const setTaskTime = (id: string, estimatedDuration: number) => setSelectedTaskTime((prev) => ({ ...prev, [id]: estimatedDuration }));
  const removeTask = (id: string) => setSelectedTaskTime((prev) => {
    const { [id]: _, ...rest } = prev;
    return rest;
  });

  return {
    totalTime,
    selectedTaskTime,
    setTaskTime,
    removeTask,
    getNumberColor,
    onSelectNumber,
    getState,
    onCancelSelection,
    onDeleteOperatingRange
  };
};

export default useCustomPlan;
