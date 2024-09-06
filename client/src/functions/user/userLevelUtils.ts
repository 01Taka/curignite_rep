import { MINUTES_IN_MILLISECOND } from "../../constants/utils/dateTimeConstants";
import { LevelInfo } from "../../types/user/userLevelTypes";

const MAX_XP = 5 * 60; // 収束するXPの最大値 五時間の学習で1レベル分
const GROWTH_RATE = 0.2; // 必要なXPの増加率

const getRequiredXP = (level: number): number => {
  return Math.floor(MAX_XP / (1 + Math.exp(-GROWTH_RATE * (level - 10))));
}



const getLevelAndRemainingXP = (totalExp: number): LevelInfo => {
  let level = 1;

  while (totalExp >= getRequiredXP(level)) {
      totalExp -= getRequiredXP(level);
      level += 1;
  }

  const xpToNextLevel = getRequiredXP(level) - totalExp;
  const progress = totalExp / getRequiredXP(level);

  return {
      level: level,
      remainingXP: totalExp,
      xpToNextLevel: xpToNextLevel,
      progress: progress,
  };
}

export const getLevelAndRemainingXPFromLearningTime = (learningTimeMills: number) => {
  return getLevelAndRemainingXP(learningTimeMills * MINUTES_IN_MILLISECOND);
}