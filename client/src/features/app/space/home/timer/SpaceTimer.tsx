import React, { FC, useState, useEffect, useCallback } from 'react';
import { Pomodoro, TimerSize } from '../../../../../types/util/componentsTypes';
import { addTotalTime, getTotalTime } from '../../../../../functions/app/space/spaceTimerUtils';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import { spaceTimerModes, SpaceTimerMode } from '../../../../../types/app/space/spaceTypes';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { MINUTES_IN_MILLISECOND } from '../../../../../types/util/dateTimeTypes';
import { setTodayTotalLearningMinutes } from '../../../../../redux/slices/space/spaceSlice';
import { spaceStorage } from '../../../../../functions/localStorage/storages';

interface SpaceTimerProps {
  spaceId: string;
  pomodoro?: Pomodoro;
  size?: TimerSize;
}

const DEFAULT_POMODORO: Pomodoro = { cycle: 25 * 60 * 1000, break: 5 * 60 * 1000 };
const DEFAULT_TIMER_INITIAL_TIME = 60 * 60 * 1000;

const SpaceTimer: FC<SpaceTimerProps> = ({ spaceId }) => {
  const dispatch = useAppDispatch();
  const { todayTotalLearningMinutes } = useAppSelector(state => state.spaceSlice);
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [cycleNumber, setCycleNumber] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [timerMode, setTimerMode] = useState<SpaceTimerMode>("stopwatch");
  const [pomodoro, setPomodoro] = useState<Pomodoro>(DEFAULT_POMODORO);
  const [timerInitialTime, setTimerInitialTime] = useState(DEFAULT_TIMER_INITIAL_TIME);

  useEffect(() => {
    // ローカルストレージからデータを取得する処理は、後で追加する
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
    setTotalTime(getTotalTime(spaceId));
    setTime(getInitialTime());

    const minutes = Math.floor(Number(spaceStorage.getData("totalTime", spaceId)) / MINUTES_IN_MILLISECOND);
    dispatch(setTodayTotalLearningMinutes(minutes));
  }, [spaceId, pomodoro, timerMode, timerInitialTime, getInitialTime, dispatch]);

  const handleUpdateTotalTime = useCallback((timeDifference: number) => {
    if (!isBreak) {
      const total = addTotalTime(spaceId, Math.abs(timeDifference));
      setTotalTime(total);

      // reduxの今日の合計学習分数を更新
      const minutes = Math.floor(total / MINUTES_IN_MILLISECOND);
      if (todayTotalLearningMinutes !== minutes) {
        dispatch(setTodayTotalLearningMinutes(minutes));
      }
    }
  }, [spaceId, isBreak, todayTotalLearningMinutes, dispatch]);

  const handleReset = useCallback(() => {
    setCycleNumber(1);
    setTime(getInitialTime());
    setIsBreak(false);
  }, [getInitialTime]);

  const handleFinish = useCallback(() => {
    if (timerMode === "pomodoro") {
      if (isBreak) {
        setIsBreak(false);
        setTime(pomodoro.cycle);
        setCycleNumber(prev => prev + 1);
      } else {
        setIsBreak(true);
        setTime(pomodoro.break);
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
        totalTime={totalTime}
        timerMode={timerMode}
        timerModes={spaceTimerModes}
        active={active}
        onTimerModeChange={(e) => setTimerMode(e.target.value as SpaceTimerMode)}
      />
    </div>
  );
};

export default SpaceTimer;