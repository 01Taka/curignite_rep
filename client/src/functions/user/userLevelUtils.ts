import { GROWTH_RATE, MAX_XP } from "../../constants/components/userConstants";
import { MINUTES_IN_MILLISECOND } from "../../constants/utils/dateTimeConstants";
import { LevelInfo } from "../../types/user/userLevelTypes";
import { TimeTypes } from "../../types/util/dateTimeTypes";
import { convertToMilliseconds } from "../dateTimeUtils";

// レベルに必要なXPを計算する関数
const getRequiredXP = (level: number): number => {
  if (level <= 0) throw new Error("Level must be a positive integer");

  const requiredXP = Math.floor(MAX_XP / (1 + Math.exp(-GROWTH_RATE * (level - 10))));
  
  if (requiredXP <= 0) throw new Error("Invalid XP calculation");

  return requiredXP;
};

// レベルと残りのXPを取得する関数
const getLevelAndRemainingXP = (totalExp: number): LevelInfo => {
  if (totalExp < 0) throw new Error("totalExp cannot be negative");

  let level = 1;
  let iterationCount = 0;
  const MAX_ITERATIONS = 1000; // 無限ループ防止のための最大回数

  while (totalExp >= getRequiredXP(level)) {
    if (iterationCount > MAX_ITERATIONS) {
      throw new Error("Too many iterations, possible infinite loop");
    }

    totalExp -= getRequiredXP(level);
    level += 1;
    iterationCount++;
  }

  const xpToNextLevel = getRequiredXP(level) - totalExp;
  const progress = getRequiredXP(level) > 0 ? totalExp / getRequiredXP(level) : 0;

  return {
    level: level,
    remainingXP: totalExp,
    xpToNextLevel: xpToNextLevel,
    progress: progress,
  };
};

// 学習時間（ミリ秒）からレベルと残りXPを取得する関数
export const getLevelAndRemainingXPFromLearningTime = (learningTime: TimeTypes) => {
  const learningTimeMills = convertToMilliseconds(learningTime);
  if (isNaN(learningTimeMills)) throw new Error("値がNaNです");
  
  const totalExp = learningTimeMills * MINUTES_IN_MILLISECOND;
  return getLevelAndRemainingXP(totalExp);
};