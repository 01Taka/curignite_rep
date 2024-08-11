import React, { FC, useState, useEffect, useCallback } from 'react';
import { Pomodoro, TimerSize } from '../../../../../types/util/componentsTypes';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import { spaceTimerModes, SpaceTimerMode } from '../../../../../types/app/space/spaceTypes';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { SECONDS_IN_MILLISECOND } from '../../../../../types/util/dateTimeTypes';
import { addLearningTime } from '../../../../../functions/app/space/learningSessionUtils';

interface SpaceTimerProps {
  spaceId: string;
  pomodoro?: Pomodoro;
  size?: TimerSize;
}

const DEFAULT_POMODORO: Pomodoro = { cycle: 25 * 60 * 1000, break: 5 * 60 * 1000 };
const DEFAULT_TIMER_INITIAL_TIME = 60 * 60 * 1000;

const SpaceTimer: FC<SpaceTimerProps> = ({ spaceId }) => {
  const dispatch = useAppDispatch();
  const { uid } = useAppSelector(state => state.userSlice);
  const [prevSecond, setPrevSecond] = useState(0);
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);
  const [cycleNumber, setCycleNumber] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [timerMode, setTimerMode] = useState<SpaceTimerMode>("stopwatch");
  const [pomodoro, setPomodoro] = useState<Pomodoro>(DEFAULT_POMODORO);
  const [timerInitialTime, setTimerInitialTime] = useState(DEFAULT_TIMER_INITIAL_TIME);

  const handleSetTime = (time: number) => {
    setPrevSecond(time)
    setTime(time);
  }
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
    if (uid && spaceId) {
      setTime(getInitialTime());
    }
  }, [spaceId, uid, getInitialTime, dispatch]);

  const handleUpdateTotalTime = useCallback((_: number) => {
    if (!isBreak && uid) {
      const diff = Math.abs(time - (prevSecond * SECONDS_IN_MILLISECOND));

      if (diff >= 1000) {
        const second = Math.floor(time / SECONDS_IN_MILLISECOND)
        setPrevSecond(second);
        addLearningTime(dispatch, uid, spaceId, 1000);
      }
    }
  }, [spaceId, uid, isBreak, prevSecond, time, dispatch]);

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
        active={!!spaceId && active}
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
        timerModes={spaceTimerModes}
        active={active}
        onTimerModeChange={(e) => setTimerMode(e.target.value as SpaceTimerMode)}
      />
    </div>
  );
};

export default SpaceTimer;
