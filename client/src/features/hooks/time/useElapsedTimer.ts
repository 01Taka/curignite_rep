import { useCallback, useEffect, useRef, useState } from "react";

interface UseElapsedTimerOptions {
  intervalMs: number;
  initialValue: number;
}

interface UseElapsedTimerReturn {
  start: () => void;
  stop: () => void;
  reset: (value?: number) => void;
  resetAndStart: (value?: number) => void;
  isRunning: boolean;
  count: number;
  timeMs: number;
}

const DEFAULT_OPTIONS: UseElapsedTimerOptions = {
  intervalMs: 1000,
  initialValue: 0,
};

function useElapsedTimer(options: Partial<UseElapsedTimerOptions> = {}): UseElapsedTimerReturn {
  const { intervalMs, initialValue } = { ...DEFAULT_OPTIONS, ...options };

  const [count, setCount] = useState(initialValue);
  const [isRunning, setIsRunning] = useState(false); // Track whether the timer is running
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null); // Start time for tracking elapsed time
  const pausedTimeRef = useRef<number | null>(null); // Time when paused

  const start = useCallback(() => {
    if (timerIdRef.current !== null) return; // Prevent duplicate timers

    // If paused, adjust the start time to exclude the paused duration
    if (pausedTimeRef.current !== null && startTimeRef.current !== null) {
      startTimeRef.current += Date.now() - pausedTimeRef.current;
      pausedTimeRef.current = null;
    }

    // If starting for the first time or after reset, set the start time
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now() - count * intervalMs; // Account for the current count
    }

    timerIdRef.current = setInterval(() => {
      if (startTimeRef.current !== null) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / intervalMs);
        setCount(elapsed);
      }
    }, intervalMs);

    setIsRunning(true); // Set isRunning to true
  }, [intervalMs, count]);

  const stop = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    pausedTimeRef.current = Date.now(); // Record paused time
    setIsRunning(false); // Set isRunning to false
  }, []);

  const reset = useCallback((value: number = 0) => {
    setCount(value);
    startTimeRef.current = null; // Reset start time
    pausedTimeRef.current = null; // Reset paused time
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null; // Clear any running timer
    }
    setIsRunning(false); // Reset isRunning to false
  }, []);

  const resetAndStart = useCallback((value: number = 0) => {
    setCount(value); // Directly reset the count
    startTimeRef.current = Date.now() - value * intervalMs; // Adjust start time based on the reset value
    pausedTimeRef.current = null; // Reset paused time
    setIsRunning(true); // Set isRunning to true
    start(); // Start the timer immediately after resetting
  }, [start, intervalMs]);

  useEffect(() => {
    return () => stop(); // Cleanup on unmount
  }, [stop]);

  const timeMs = count * intervalMs;

  return { start, stop, reset, resetAndStart, isRunning, count, timeMs };
}

export default useElapsedTimer;

