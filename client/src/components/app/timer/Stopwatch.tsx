import React, { FC, useState, useEffect, useRef } from 'react';
import Timer from './Timer';
import { ActiveUseState, TimerSize, TimeUseState } from '../../../types/util/componentsTypes';

interface StopwatchProps {
  size?: TimerSize;
  text?: string;
  timeUseState?: TimeUseState;
  activeUseState?: ActiveUseState;
  onUpdateTime?: (timeDifference: number) => void;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
}

const Stopwatch: FC<StopwatchProps> = ({
  size = "md",
  text = "",
  timeUseState,
  activeUseState,
  onUpdateTime,
  onStart,
  onStop,
  onReset
}) => {
  const [internalTime, setInternalTime] = useState(0);
  const time = timeUseState !== undefined ? timeUseState.time : internalTime;
  const setTime = timeUseState !== undefined ? timeUseState.setTime : setInternalTime;

  const [internalActive, setInternalActive] = useState(false);
  const active = activeUseState ? activeUseState.active : internalActive;
  const setActive = activeUseState ? activeUseState.setActive : setInternalActive;

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (active) {
      // タイマーがアクティブになったときの処理
      startTimeRef.current = Date.now() - (time as number);
      timerRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const newTime = Date.now() - startTimeRef.current;
          if (onUpdateTime) onUpdateTime(newTime - time);
          setTime(newTime);
        }
      }, 100); // 100msごとに更新
    } else if (timerRef.current) {
      // タイマーが停止されたときの処理
      clearInterval(timerRef.current);
    }

    // クリーンアップ関数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [active, time, setTime, onUpdateTime, setActive]);

  const handleStart = () => {
    onStart?.();
    setActive(true);
  };

  const handleStop = () => {
    onStop?.();
    setActive(false);
  };

  const handleReset = () => {
    onReset?.();
    setTime(0);
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
}

export default Stopwatch;
