export const splitTimeForPomodoro = (
  workDurationMs: number,  // 作業時間（ミリ秒単位）
  breakDurationMs: number, // 休憩時間（ミリ秒単位）
  currentTimeMs: number    // 現在の時間（ミリ秒単位）
) => {
  // ポモドーロサイクルの長さ（作業時間 + 休憩時間）
  const cycleDurationMs = workDurationMs + breakDurationMs;

  // 現在のサイクルにおける経過時間
  const elapsedInCycle = currentTimeMs % cycleDurationMs;

  // 現在のサイクルが作業時間か休憩時間かを判断
  const isWorkTime = elapsedInCycle < workDurationMs;

  // 現在のサイクル番号を計算
  const currentCycle = Math.floor(currentTimeMs / cycleDurationMs) + 1;

  // 現在のサイクル内での進捗（作業時間または休憩時間）
  const currentCycleProgress = isWorkTime
    ? elapsedInCycle
    : elapsedInCycle - workDurationMs;

  return {
    isWorkTime,
    currentCycle,
    currentCycleProgress
  };
};