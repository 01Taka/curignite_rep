import { useCallback, useMemo } from 'react';
import useTimer from './useTimer'; // useTimer フックのインポート
import { splitTimeForPomodoro } from '../../../functions/components/learningGoalUtils';
import { MINUTES_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';

export interface PomodoroTimerReturn {
  isRunning: boolean;
  elapsedTime: number;
  isWorkTime: boolean;
  currentCycle: number;
  currentCycleProgress: number;
  currentCycleRemainingTimeMs: number;
  startPomodoro: () => void;
  stopPomodoro: () => void;
  resetPomodoro: () => void;
  getMaxCycle: (requiredTimeMs: number) => {
    maxCycle: number;
    lastCycleWorkTimeMs: number;
  };
}

const usePomodoroTimer = (
  initialElapsedTime: number = 0, // 初期経過時間（ミリ秒単位）
  workDurationMs: number= 25 * MINUTES_IN_MILLISECOND, // 作業時間（ミリ秒単位）
  breakDurationMs: number = 5 * MINUTES_IN_MILLISECOND, // 休憩時間（ミリ秒単位）
): PomodoroTimerReturn => {
  const { isRunning, elapsedTime, startTimer, stopTimer, resetTimer, getElapsedTime } = useTimer({ initialElapsedTime });

  const startPomodoro = useCallback(() => {
    startTimer();
  }, [startTimer]);

  const stopPomodoro = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const resetPomodoro = useCallback(() => {
    stopPomodoro();
    resetTimer();
  }, [stopPomodoro, resetTimer]);

  const getMaxCycle = useCallback((requiredTimeMs: number) => {
    const maxCycle =  Math.ceil(requiredTimeMs / workDurationMs);
    const lastCycleWorkTimeMs = requiredTimeMs % (workDurationMs + breakDurationMs);
    return {
      maxCycle,
      lastCycleWorkTimeMs,
    }
  }, [workDurationMs, breakDurationMs])

  const pomodoroState = useMemo(() => {
    const currentTimeMs = getElapsedTime();
    return splitTimeForPomodoro(workDurationMs, breakDurationMs, currentTimeMs);
  }, [getElapsedTime, workDurationMs, breakDurationMs]);

  const getCurrentCycleRemainingTimeMs = useCallback(() => {
    return pomodoroState.isWorkTime ? workDurationMs - pomodoroState.currentCycleProgress :
    breakDurationMs - pomodoroState.currentCycleProgress;
  }, [pomodoroState])

  return {
    isRunning,
    elapsedTime,
    ...pomodoroState,
    currentCycleRemainingTimeMs: getCurrentCycleRemainingTimeMs(),
    startPomodoro,
    stopPomodoro,
    resetPomodoro,
    getMaxCycle,
  };
};

export default usePomodoroTimer;
