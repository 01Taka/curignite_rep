import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  measureMode?: "elapsed" | "manual";
}

interface UseTimerReturn {
  start: () => void;
  stop: () => void;
  set: (value: number) => void;
  count: number;
}

function useTimeCounter(
  interval: number,
  initialValue: number = 0,
  options: UseTimerOptions = { measureMode: "elapsed" }
): UseTimerReturn {
  const { measureMode = "manual" } = options;
  const [count, setCount] = useState(initialValue);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null); // Start time for "elapsed" mode

  const start = useCallback(() => {
    if (timerIdRef.current !== null) return; // 既にタイマーが動作している場合は何もしない

    if (measureMode === "elapsed") {
      startTimeRef.current = Date.now();
      timerIdRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setCount(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, interval);
    } else if (measureMode === "manual") {
      timerIdRef.current = setInterval(() => {
        setCount((prev) => prev + 1);
      }, interval);
    }
  }, [interval, measureMode]);

  const stop = useCallback(() => {
    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const set = useCallback((value: number) => {
    setCount(value);
    if (measureMode === "elapsed" && value === 0) {
      startTimeRef.current = null; // リセット時に開始時間もクリア
    }
  }, [measureMode]);

  // コンポーネントがアンマウントされたらタイマーをクリア
  useEffect(() => {
    return () => {
      if (timerIdRef.current !== null) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  return { start, stop, set, count };
}

export default useTimeCounter;
