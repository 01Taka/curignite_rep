import { useCallback, useMemo, useState } from "react";
import { CategoryActivityStatus, ProblemSetActivityField, TaskData } from "../../../../../../types/firebase/db/task/taskExpansionTypes";
import { groupingByKey, removeNullAndUndefined } from "../../../../../../functions/utils/dataStructureUtils/objectUtils";
import { arrayToRanges, rangesToArray } from "../../../../../../functions/utils/rangeUtils";
import { convertToDate } from "../../../../../../functions/utils/dateTimeUtils";
import { Range } from "../../../../../../types/util/componentsTypes";
import { DAYS_IN_MILLISECOND } from "../../../../../../constants/utils/dateTimeConstants";
import { EntryProblems, PlanEntry, ProblemGroup } from "../problemSetStepTypes";
import { dateArrayToRange } from "../../../../../../functions/utils/dateRangeUtils";
import { splitArray } from "../../../../../../functions/utils/dataStructureUtils/arrayUtils";
import { removeDuplicates } from "../../../../../../functions/utils/dataStructureUtils/structureUtils";


export const distributeByRatios = (start: number, distr: number, ratios: number[], element: number): number[] => {
  // 結果リストを初期化
  const result: number[] = Array(distr).fill(0);

  // `ratios`を繰り返して、`distr`の長さの比率リストを作成
  const def_ratios: number[] = Array.from({ length: distr }, (_, i) => ratios[(start + i) % ratios.length]);

  // 合計比率を計算
  const total_ratio = def_ratios.reduce((sum, ratio) => sum + ratio, 0);

  // 各要素に基本的な割り当てを計算
  for (let i = 0; i < distr; i++) {
    result[i] = Math.floor((element * def_ratios[i]) / total_ratio);
  }

  // 余りの計算
  const remaining = element - result.reduce((sum, value) => sum + value, 0);

  // 余りを def_ratios の比率に基づいて分配
  const indices = Array.from({ length: distr }, (_, i) => i)
    .sort((a, b) => def_ratios[b] - def_ratios[a]);

  // 残りの余りを比率の大きい順に1ずつ追加
  for (let i = 0; i < remaining; i++) {
    result[indices[i % distr]] += 1;
  }

  return result;
}


/**
 * 配列を指定された比率で分割する関数
 * @param start - 配列の分割開始位置
 * @param distr - 配分を行う対象の分割数
 * @param ratios - 各部分の比率を表す数値の配列（合計が1になる必要はない）
 * @param element - 分割する対象の配列
 * @returns 分割された部分配列の配列
 */
export const distributeTargetByRatio = <T>(start: number, distr: number, ratios: number[], element: T[]): T[][] => {
  const distribute = distributeByRatios(start, distr, ratios, element.length);
  
  if (element.length === 0) return []; // エラーチェック
  
  const result: T[][] = [];
  let count = 0;

  distribute.forEach((countForSegment) => {
      result.push(element.slice(count, count + countForSegment));
      count += countForSegment;
  });

  return result;
};


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