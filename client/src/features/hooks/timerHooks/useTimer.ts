import { useState, useEffect, useRef, useCallback } from 'react';

type CountDirection = 'up' | 'down';

interface UseTimerArgs {
  initialElapsedTime: number;
  countDirection: CountDirection;
  countDownLimit: number;
  intervalMs: number;
}

const useTimer = ({
  initialElapsedTime = 0,
  countDirection = 'up',
  countDownLimit = 0,
  intervalMs = 1000,
}: Partial<UseTimerArgs>) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(initialElapsedTime);
  const [currentInitialElapsedTime, setCurrentInitialElapsedTime] = useState<number>(initialElapsedTime);
  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      const newStartTime = Date.now() - elapsedTime;

      timerRef.current = window.setInterval(() => {
        setElapsedTime(() => {
          const now = Date.now();
          const newElapsedTime =
            countDirection === 'up'
              ? now - newStartTime
              : Math.max(countDownLimit - (now - newStartTime), 0);

          if (countDirection === 'down' && newElapsedTime <= 0) {
            stopTimer();
          }

          return newElapsedTime;
        });
      }, intervalMs);
    }
  }, [isRunning, intervalMs, countDirection, countDownLimit, elapsedTime]);

  const stopTimer = useCallback(() => {
    if (isRunning && timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
    }
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    console.log("reset");
    
    stopTimer();
    setElapsedTime(countDirection === 'up' ? 0 : countDownLimit);
  }, [stopTimer, countDirection, countDownLimit]);

  const updateInitialElapsedTime = useCallback((newInitialElapsedTime: number) => {
    setCurrentInitialElapsedTime(newInitialElapsedTime);
    setElapsedTime(newInitialElapsedTime);
  }, []);

  const setTime = useCallback((newElapsedTime: number) => {
    setElapsedTime(newElapsedTime);
  }, []);

  const getElapsedTime = useCallback(() => {
    return elapsedTime;
  }, [elapsedTime]);

  return {
    isRunning,
    elapsedTime,
    startTimer,
    stopTimer,
    resetTimer,
    setTime,
    getElapsedTime,
    updateInitialElapsedTime,
  };
};

export default useTimer;
