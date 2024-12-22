import { CategoryActivityStatus } from "../../../types/firebase/db/task/taskExpansionTypes";
import { ProblemSetCategoryRead } from "../../../types/firebase/db/task/taskStructure";
import { generateNumbersWithoutForbidden, findMissingNumbers } from "../../utils/dataStructureUtils/arrayUtils";
import { groupingByKey } from "../../utils/dataStructureUtils/objectUtils";
import { rangesToArray } from "../../utils/rangeUtils";

interface Target {
  id: string;
  notIncludedNumbers: number[];
  minNumber: number;
  maxNumber: number | null;
  estimatedDuration: number;
}

export const generateFilteredNumbers = (targets: Target[], getNumber: number) => {
  const result: { id: string; number: number; estimatedDuration: number; }[] = [];

  for (const target of targets) {
    // 範囲から問題を生成するヘルパー
    const createResult = (numbers: number[]) => {
      return numbers.map(number => ({
        id: target.id,
        number: number,
        estimatedDuration: target.estimatedDuration
      }));
    };

    // 完了問題の範囲を配列化
    const forbiddenNumbers = target.notIncludedNumbers

    if (target.maxNumber === null) {
      // 問題数が無制限の場合
      const numbers = generateNumbersWithoutForbidden(
        getNumber - result.length, forbiddenNumbers, target.minNumber
      );
      result.push(...createResult(numbers));
      break; // 必要な数を取得したらループ終了
    } else {
      // 問題数が限定されている場合
      const missingNumbers = findMissingNumbers(
        forbiddenNumbers, target.minNumber, target.maxNumber
      );
      const remainingNumbers = missingNumbers.slice(
        0, getNumber - result.length
      );
      result.push(...createResult(remainingNumbers));
      if (result.length >= getNumber) break; // 必要な数を取得したらループ終了
    }
  }

  return result;
}

export const getNotFinishedProblemsWithCategories = (categories: ProblemSetCategoryRead[], getNumber: number) => {
  const targets = categories.map(category => ({
    id: category.docId,
    notIncludedNumbers: rangesToArray(category.completedProblemIdsRange),
    minNumber: 1,
    maxNumber: category.totalProblemCount,
    estimatedDuration: category.timePerProblem
  })) as Target[];

  return generateFilteredNumbers(targets, getNumber).map(data => ({
    categoryId: data.id,
    problemId: data.number,
    estimatedDuration: data.estimatedDuration
  }));
}

export const getNotFinishedProblemsWithActivityStatus = (
  activityStatus: CategoryActivityStatus[],
  getNumber: number,
  notIncludedNumbers?: Record<string, number[]>
) => {
  const targets = activityStatus.map(states => ({
    id: states.categoryId,
    notIncludedNumbers: notIncludedNumbers ?
      [...states.remainingProblemIds, ...(notIncludedNumbers[states.categoryId] ?? [])]
      : states.remainingProblemIds,
    minNumber: 1,
    maxNumber: states.categoryTotalProblemCount,
    estimatedDuration: states.timePerProblem 
  }));

  return generateFilteredNumbers(targets, getNumber);
}

export const problemsToNumberRecord = (
  problems: { id: string, number: number }[]
): Record<string, number[]> => {
  const group = groupingByKey(problems, "id");
  const result: Record<string, number[]> = {};
  Object.keys(group).forEach(key => {
    const value = group[key];
    const numbers = value.map(data => data.number);
    result[key] = numbers;
  });
  return result;
}