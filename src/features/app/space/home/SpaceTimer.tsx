import React, { FC, useState, useEffect } from 'react';
import { millisToTime } from '../../../../functions/dateTimeUtils';
import { Pomodoro, TimerSize } from '../../../../types/util/componentsTypes';
import CountdownTimer from '../../../../components/app/timer/CountdownTimer';
import Stopwatch from '../../../../components/app/timer/Stopwatch';
import { addTotalTime, getTotalTime } from '../spaceUtils';

interface SpaceTimerProps {
  pomodoro?: Pomodoro;
  size?: TimerSize;
}

const SpaceTimer: FC<SpaceTimerProps> = ({ pomodoro, size = 'xl'}) => {
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const [cycleNumber, setCycleNumber] = useState(1);
  const [isBreak, setIsBreak] = useState(false); // 休憩中かどうかの状態を追加

  useEffect(() => {
    setTotalTime(getTotalTime());
    if (pomodoro) {
        setTime(pomodoro.cycle);
    }
  }, [pomodoro]);

  const handleUpdateTime = (timeDifference: number) => {
    if (pomodoro) {
        timeDifference = isBreak ? 0 : -timeDifference;
    }
    const total = addTotalTime(timeDifference);
    setTotalTime(total);
  };

  const handleReset = () => {
    setCycleNumber(1);
    if (pomodoro) {
      setTime(pomodoro.cycle);
      setIsBreak(false);
    }
  }

  const handleFinish = () => {
    if (pomodoro) {
      if (isBreak) {
        setIsBreak(false);
        setTime(pomodoro.cycle); // 次のポモドーロサイクルを開始
        setCycleNumber(cycleNumber + 1);
        setActive(true);
      } else {
        setIsBreak(true);
        setTime(pomodoro.break); // 休憩を開始
        setActive(true);
      }
    }
  };

  return (
    <div className='w-fit'>
      {pomodoro ? (
        <CountdownTimer
          initialTime={isBreak ? pomodoro.break : pomodoro.cycle}
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
      <div className='w-32 text-lg'>
        <div className='flex flex-col items-center pt-2 space-y-1'>
          <div>
            {cycleNumber}サイクル目
          </div>
          <div>
            合計: {millisToTime(totalTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceTimer;
