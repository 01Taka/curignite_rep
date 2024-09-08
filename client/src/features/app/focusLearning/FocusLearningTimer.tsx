import React, { FC, useState, useEffect, useCallback } from 'react';
import { Pomodoro, TimerSize } from '../../../types/util/componentsTypes';
import { TimerMode } from '../../../types/components/TimerTypes';
import { SECONDS_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
import TimerControls from '../../../components/app/timer/TimerControls';
import TimerDisplay from '../../../components/app/timer/TimerDisplay';

interface SpaceTimerProps {
  pomodoro?: Pomodoro;
  size?: TimerSize;
}

const DEFAULT_POMODORO: Pomodoro = { cycle: 25 * 60 * 1000, break: 5 * 60 * 1000 };
const DEFAULT_TIMER_INITIAL_TIME = 60 * 60 * 1000;

const FocusLearningTimer: FC<SpaceTimerProps> = () => {
  const [prevSecond, setPrevSecond] = useState(0);
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);
  const [cycleNumber, setCycleNumber] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("stopwatch");
  const [pomodoro, setPomodoro] = useState<Pomodoro>(DEFAULT_POMODORO);
  const [timerInitialTime, setTimerInitialTime] = useState(DEFAULT_TIMER_INITIAL_TIME);

  const handleSetTime = (time: number) => {
    setPrevSecond(time)
    setTime(time);
  }
  useEffect(() => {
    setPomodoro(DEFAULT_POMODORO);
    setTimerInitialTime(DEFAULT_TIMER_INITIAL_TIME);
  }, []);

  const getInitialTime = useCallback((): number => {
    switch (timerMode) {
      case "pomodoro":
        return pomodoro.cycle;
      case "timer":
        return timerInitialTime;
      default:
        return 0;
    }
  }, [timerMode, pomodoro.cycle, timerInitialTime]);

  useEffect(() => {
    setTime(getInitialTime());
  }, [getInitialTime]);

  const handleUpdateTotalTime = useCallback((_: number) => {
    if (!isBreak) {
      const diff = Math.abs(time - (prevSecond * SECONDS_IN_MILLISECOND));

      if (diff >= 1000) {
        const second = Math.floor(time / SECONDS_IN_MILLISECOND)
        setPrevSecond(second);
        // addLearningTime(dispatch, uid, spaceId, 1000); UNDONE
      }
    }
  }, [isBreak, prevSecond, time]);

  const handleReset = useCallback(() => {
    setCycleNumber(1);
    handleSetTime(getInitialTime());
    setIsBreak(false);
  }, [getInitialTime]);

  const handleFinish = useCallback(() => {
    if (timerMode === "pomodoro") {
      if (isBreak) {
        setIsBreak(false);
        handleSetTime(pomodoro.cycle);
        setCycleNumber(prev => prev + 1);
      } else {
        setIsBreak(true);
        handleSetTime(pomodoro.break);
      }
      setActive(true);
    }
  }, [timerMode, isBreak, pomodoro.cycle, pomodoro.break]);

  return (
    <div className="relative flex flex-col items-center w-full">
      <TimerDisplay
        timerMode={timerMode}
        size="xl"
        isBreak={isBreak}
        active={active}
        initialTime={isBreak ? pomodoro.break : getInitialTime()}
        time={time}
        setTime={setTime}
        setActive={setActive}
        handleUpdateTime={handleUpdateTotalTime}
        handleReset={handleReset}
        handleFinish={handleFinish}
      />
      <TimerControls
        cycleNumber={cycleNumber}
        timerMode={timerMode}
        active={active}
        onTimerModeChange={(e) => setTimerMode(e.target.value as TimerMode)}
      />
    </div>
  );
};

export default FocusLearningTimer;
