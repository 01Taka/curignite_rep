import { useCallback, useState } from "react"
import { ProblemSetCategoryRead, ProblemSetRead } from "../../../../../../types/firebase/db/task/taskStructure";
import { ProblemSetActivityField, TaskData } from "../../../../../../types/firebase/db/task/taskExpansionTypes";
import { WorkOnProblemSetTask, WorkOnIndividualTask, WorkOnPlan, WorkOnProblemSet } from "../../types/plan/workOnPlanTypes";
import { PlanTarget } from "../../types/plan/planTargetTypes";
import { sumRanges } from "../../../../../../functions/utils/rangeUtils";
import { getNotFinishedProblemsWithCategories } from "../../../../../../functions/app/task/TaskUtils";


const useWorkOnPlan = () => {
  const [workOnProblemSetMap, setWorkOnProblemSetMap] = useState<Record<string, WorkOnProblemSet>>({});
  const [workOnProblemSetTask, setWorkOnProblemSetTask] = useState<Record<string, WorkOnProblemSetTask>>({});
  const [workOnIndividualTask, setWorkOnIndividualTask] = useState<Record<string, WorkOnIndividualTask>>({});

  const getWorkOnItems = useCallback((activityField: ProblemSetActivityField, workOnNumber: number) => {
    const workOnItems: {
      categoryId: string;
      problemId: number;
    }[] = [];
    let estimatedDuration = 0;

    for(let status of activityField.activityStatus) {
      const remainingProblems = status.remainingProblemIds.map(id => ({ categoryId: status.categoryId, problemId: id }));
      const addProblems = remainingProblems.slice(0, workOnNumber - workOnItems.length);
      estimatedDuration += addProblems.length * status.timePerProblem;
      workOnItems.push(...addProblems);
      if (workOnItems.length >= workOnNumber) break;
    }

    return { workOnItems, estimatedDuration };
  }, []);

  const addWorkOnProblemSetTask = useCallback((
    problemSet: ProblemSetRead,
    task: TaskData,
    workOnNumber: number
  ) => {
    if (!task.problemSetActivityField) return;
    const { workOnItems, estimatedDuration } = getWorkOnItems(task.problemSetActivityField, workOnNumber);
    setWorkOnProblemSetTask(prev => ({
      ...prev,
      [task.taskId]: {
        planType: "problemSetTask",
        minValue: task.problemSetActivityField.totalCompletedProblemCount,
        maxValue: task.problemSetActivityField.totalProblemCount,
        remainingValue: task.problemSetActivityField.totalRemainingProblemCount,
        currentValue: workOnItems.length,
        problemSet,
        task,
        workOnItems,
        estimatedDuration
      }
    }))
  }, [getWorkOnItems]);

  const addWorkOnProblemSet = useCallback((
    problemSet: ProblemSetRead,
    categories: ProblemSetCategoryRead[],
    workOnNumber: number
  ) => {
    const minValue = categories.reduce((sum, category) => (sum + sumRanges(category.completedProblemIdsRange)), 0);
    const maxValue = categories.find(category => category.totalProblemCount === null) ?
    null : categories.reduce((sum, category) => (sum + (category.totalProblemCount ?? 0)), 0);

    const workOnItems = getNotFinishedProblemsWithCategories(categories, workOnNumber);
    
    setWorkOnProblemSetMap(prev => ({
      ...prev,
      [problemSet.docId]: {
        planType: "problemSet",
        minValue,
        maxValue,
        remainingValue: maxValue ? (maxValue - minValue) : null,
        currentValue: workOnItems.length,
        problemSet,
        workOnItems,
        estimatedDuration: workOnItems.reduce((sum, item) => (sum + item.estimatedDuration), 0),
        task: null
      }
    }));
  }, []);

  const getProblemSetTask = useCallback((problemSetId: string) => {
    return Object.values(workOnProblemSetTask).filter(Task => Task.problemSet.docId === problemSetId);
  }, [workOnProblemSetTask]);

  const addIndividualTask = useCallback((task: TaskData, progress: number | null) => {
    if (!task.isIndividual) return;
    const currentProgress = progress ? progress / 1 : task.progress;

    const formatProgress = (progress: number) => Math.floor(progress * 100);
    
    setWorkOnIndividualTask(prev => {
      return {
        ...prev,
        [task.taskId]: {
          planType: "individual",
          task,
          minValue: formatProgress(task.progress),
          maxValue: 100,
          remainingValue: formatProgress(1 - task.progress),
          currentValue: formatProgress(currentProgress),
          estimatedDuration: (currentProgress - task.progress) * task.estimatedDuration
        }
      }
    })
  }, []);

  const getWorkOnTasks = useCallback((TaskTarget: PlanTarget): WorkOnPlan[] => {
    if (TaskTarget.isIndividual) {
      const plan = workOnIndividualTask[TaskTarget.target.taskId];
      return plan ? [plan] : [];
    } else {
      return getProblemSetTask(TaskTarget.target.docId);
    }
  }, [workOnIndividualTask, getProblemSetTask]);

  return { workOnProblemSetMap, addWorkOnProblemSetTask, addWorkOnProblemSet, addIndividualTask, getWorkOnTasks }
}

export default useWorkOnPlan