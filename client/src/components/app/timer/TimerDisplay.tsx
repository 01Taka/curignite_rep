import React from 'react';
import { TimerSize } from '../../../types/util/componentsTypes';
import CountdownTimer from './CountdownTimer';
import Stopwatch from './Stopwatch';
import { TimerMode } from '../../../types/components/TimerTypes';

interface TimerDisplayProps {
  timerMode: TimerMode;
  size: TimerSize;
  isBreak: boolean;
  active: boolean;
  initialTime: number;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateTime: (timeDifference: number) => void;
  handleReset: () => void;
  handleFinish: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timerMode,
  size,
  isBreak,
  active,
  initialTime,
  time,
  setTime,
  setActive,
  handleUpdateTime,
  handleReset,
  handleFinish,
}) => {
  return (
    <>
      {timerMode !== "stopwatch" ? (
        <CountdownTimer
          initialTime={initialTime}
          size={size}
          text={(!isBreak && active) ? "学習中" : "休憩中"}
          timeUseState={{ time, setTime }}
          activeUseState={{ active, setActive }}
          onUpdateTime={handleUpdateTime}
          onReset={handleReset}
          onFinish={handleFinish}
        />
      ) : (
        <Stopwatch
          size={size}
          text={active ? "学習中" : "休憩中"}
          timeUseState={{ time, setTime }}
          activeUseState={{ active, setActive }}
          onUpdateTime={handleUpdateTime}
        />
      )}
    </>
  );
};

export default TimerDisplay;
