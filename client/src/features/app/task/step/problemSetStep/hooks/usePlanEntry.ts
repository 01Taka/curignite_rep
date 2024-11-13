import { useCallback, useMemo, useState } from "react";
import { CategoryActivityStatus, ProblemSetActivityField, TaskData } from "../../../../../../types/firebase/db/task/taskExpansionTypes";
import { ProblemSetCategoryData } from "../../../../../../types/firebase/db/task/taskStructure";
import { distributeTargetByRatio, groupingByKey, removeDuplicates, removeNullAndUndefined, splitArray } from "../../../../../../functions/utils/objectUtils";
import { arrayToRanges, rangesToArray } from "../../../../../../functions/utils/rangeUtils";
import { convertToDate } from "../../../../../../functions/utils/dateTimeUtils";
import { Range } from "../../../../../../types/util/componentsTypes";
import { DAYS_IN_MILLISECOND } from "../../../../../../constants/utils/dateTimeConstants";
import { EntryProblems, PlanEntry, ProblemGroup } from "../problemSetStepTypes";
import { dateArrayToRange } from "../../../../../../functions/utils/dateRangeUtils";

export const usePlanEntry = (taskData: TaskData) => {
  const [entries, setEntries] = useState<PlanEntry[]>([]);
  const [currentProblems, setCurrentProblems] = useState<Record<string, number[]>>({});
  const [currentDates, setCurrentDates] = useState<Date[]>([]);
  const [distributionRatio, setDistributionRatio] = useState<number[]>([]);
  const [useAutoSettingRatio, setUseAutoSettingRatio] = useState<boolean>(false);

  // 状態リセット関数
  const resetCurrentState = () => {
    setCurrentProblems({});
    setCurrentDates([]);
  };

  const categoryMap = useMemo(() => (
    taskData?.problemSetActivityField?.categoryMap ?? {}
  ), [taskData]);

  const problemsWithKey = useMemo(() => {
    return Object.entries(currentProblems).flatMap(([key, problems]) =>
      problems.map(problemId => ({ key, problemId }))
    );
  }, [currentProblems]);

  const autoSplitProblems = useMemo(() => {
    if (currentDates.length === 0) return [];

    return distributeTargetByRatio((currentDates[0].getDay() + 6) % 7, currentDates.length, distributionRatio, problemsWithKey);
  }, [problemsWithKey, currentDates, distributionRatio]);

  // `problemsWithDate` の更新
  const problemsWithDate = useMemo(() => {
    if (currentDates.length === 0) return [];

    const splitProblems = useAutoSettingRatio ? autoSplitProblems : splitArray(problemsWithKey, currentDates.length);

    return currentDates.map((date, index) => ({
      date,
      problems: splitProblems[index] || [],
    }));
  }, [problemsWithKey, currentDates, useAutoSettingRatio, distributionRatio, autoSplitProblems]);

  // エントリの現在状態管理
  const handleEntryCurrent = useCallback(() => {
    const dateRanges = dateArrayToRange(currentDates);
    const problems = removeNullAndUndefined(Object.keys(currentProblems).map(key => {
      const problemIds = currentProblems[key];
      if (!problemIds || problemIds.length === 0) return null;
      const problemRanges = arrayToRanges(problemIds);
      return { categoryId: key, problemRanges } as EntryProblems;
    }));

    if (problems.length === 0) {
      resetCurrentState();
      return;
    }

    setEntries(prev => [...prev, { dateRanges, problems }]);
    resetCurrentState();
  }, [currentProblems, currentDates]);

  const handleSelectProblems = useCallback((id: string, numbers: number[]) => {
    setCurrentProblems(prev => ({
      ...prev,
      [id]: numbers
    }));
  }, []);

  const handleSelectDates = useCallback((ranges: Range[]) => {
    const dateNumber = rangesToArray(ranges);
    const dates = dateNumber.map(num => convertToDate((num + 1) * DAYS_IN_MILLISECOND));
    setCurrentDates(dates);
  }, []);

  const getGroupedProblems = (activityField: ProblemSetActivityField): ProblemGroup[] => {
    const getProblemNumbersFromStatus = (status: CategoryActivityStatus[]) => {
      return removeDuplicates(
        status.flatMap((data) => rangesToArray(data.problemIdsRange))
      );
    }
  
    if (activityField.activityManagementMethod === 'page') {
      return [{
        id: activityField.activityStatus[0].categoryId,
        categoryName: 'ページ',
        problemNumbers: getProblemNumbersFromStatus(activityField.activityStatus)
      }]
    }
  
    const statusGroupedByCategory = Object.values(groupingByKey(activityField.activityStatus, 'categoryId'));
  
    return removeNullAndUndefined(
      statusGroupedByCategory.map((status) => {
        if (status.length === 0) return null;
  
        const problemNumbers = getProblemNumbersFromStatus(status);
        return {
          id: status[0].categoryId,
          categoryName: status[0].categoryName,
          problemNumbers,
        };
      })
    );
  };

  return {
    categoryMap,
    currentProblems,
    currentDates,
    problemsWithDate,
    distributionRatio,
    useAutoSettingRatio,
    entries,
    handleSelectProblems,
    handleSelectDates,
    setDistributionRatio,
    setUseAutoSettingRatio,
    getGroupedProblems,
    handleEntryCurrent
  }
};