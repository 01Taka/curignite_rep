import React, { FC, useMemo } from 'react';
import PomodoroTimer from '../../../../components/app/timer/PomodoroTimer';
import TimerView from '../../../../components/app/timer/TimerView';
import { splitTimeForPomodoro } from '../../../../functions/components/learningGoalUtils';
import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';

interface PomodoroSetting {
  workDurationMs: number;
  breakDurationMs: number;
}

const initialPomodoroSetting: PomodoroSetting = {
  workDurationMs: 25 * MINUTES_IN_MILLISECOND,
  breakDurationMs: 5 * MINUTES_IN_MILLISECOND,
};

interface LearningGoalWorkTimerProps {
  isRunning: boolean;
  elapsedTime: number;
  targetDuration: number;
  allowedOverflowTime: number;
  mode: 'pomodoro' | 'countdown';
  pomodoroSetting?: PomodoroSetting;
}

const LearningGoalWorkTimer: FC<LearningGoalWorkTimerProps> = ({
  isRunning,
  elapsedTime,
  targetDuration,
  allowedOverflowTime,
  mode,
  pomodoroSetting = initialPomodoroSetting,
}) => {
  // 最大サイクル数と最後のサイクル時間をメモ化
  const { maxCycle, lastCycleWorkTimeMs } = useMemo(() => {
    const totalTime = allowedOverflowTime + targetDuration;
    const cycles = Math.ceil(totalTime / pomodoroSetting.workDurationMs);
    const lastCycleTime = totalTime % (pomodoroSetting.workDurationMs + pomodoroSetting.breakDurationMs);

    return {
      maxCycle: cycles,
      lastCycleWorkTimeMs: lastCycleTime,
    };
  }, [targetDuration, pomodoroSetting]);

  // ポモドーロタイマーの状態をメモ化
  const pomodoro = useMemo(() => {
    return splitTimeForPomodoro(
      pomodoroSetting.workDurationMs,
      pomodoroSetting.breakDurationMs,
      elapsedTime
    );
  }, [pomodoroSetting, elapsedTime]);

  return (
    <>
      {mode === 'pomodoro' ? (
        <PomodoroTimer
          isRunning={isRunning}
          isWorkTime={pomodoro.isWorkTime}
          currentCycle={pomodoro.currentCycle}
          maxCycle={maxCycle}
          elapsedTime={pomodoro.currentCycleProgress}
          workDurationMs={pomodoro.currentCycle === maxCycle ? lastCycleWorkTimeMs : pomodoroSetting.workDurationMs}
          breakDurationMs={pomodoroSetting.breakDurationMs}
        />
      ) : (
        <TimerView
          totalTime={targetDuration}
          elapsedTime={elapsedTime}
          isRunning={isRunning}
        />
      )}
    </>
  );
};

export default LearningGoalWorkTimer;
