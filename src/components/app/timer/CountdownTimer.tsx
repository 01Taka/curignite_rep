import React, { FC, useState, useEffect, useRef } from 'react';
import Timer from './Timer';
import { ActiveUseState, TimerSize, TimeUseState } from '../../../types/util/componentsTypes';

interface CountdownTimerProps {
  initialTime: number;
  size?: TimerSize;
  text?: string;
  timeUseState?: TimeUseState;
  activeUseState?: ActiveUseState;
  onUpdateTime?: (timeDifference: number) => void;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  onFinish?: () => void;
}

const CountdownTimer: FC<CountdownTimerProps> = ({
  initialTime,
  size = "md",
  text = "",
  timeUseState,
  activeUseState,
  onUpdateTime,
  onStart,
  onStop,
  onReset,
  onFinish
}) => {
  const [internalTime, setInternalTime] = useState(initialTime);
  const time = timeUseState ? timeUseState.time : internalTime;
  const setTime = timeUseState ? timeUseState.setTime : setInternalTime;

  const [internalActive, setInternalActive] = useState(false);
  const active = activeUseState ? activeUseState.active : internalActive;
  const setActive = activeUseState ? activeUseState.setActive : setInternalActive;

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        const newTime = initialTime - elapsed;
        if (newTime <= 0) {
          setTime(0);
          setActive(false);
          clearInterval(timerRef.current!);
          if (onUpdateTime) onUpdateTime(-time);
          if (onFinish) onFinish();
        } else {
          setTime(newTime);
          if (onUpdateTime) onUpdateTime(newTime - time);
        }
      }
    };

    if (active && time > 0) {
      startTimeRef.current = Date.now() - (initialTime - time);
      timerRef.current = setInterval(updateTimer, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [active, time, initialTime, onUpdateTime, onFinish, setTime, setActive]);

  const handleStart = () => {
    if (onStart) onStart();
    setActive(true);
  };

  const handleStop = () => {
    if (onStop) onStop();
    setActive(false);
  };

  const handleReset = () => {
    if (onReset) onReset();
    setTime(initialTime);
    setActive(false);
    startTimeRef.current = null;
  };

  return (
    <Timer
      time={time}
      size={size}
      text={text}
      active={active}
      onStart={handleStart}
      onStop={handleStop}
      onReset={handleReset}
    />
  );
};

export default CountdownTimer;
