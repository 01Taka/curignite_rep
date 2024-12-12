import { useState, useCallback, useMemo, useEffect } from "react";
import { LearningState } from "../../../../../../types/firebase/db/learning/learningSupplementTypes";
import useElapsedTimer from "../../../../../hooks/time/useElapsedTimer";

const useLearningTimeManager = ({ learningState, setLearningState }: { learningState: LearningState, setLearningState: (state: LearningState) => void }) => {
  const [recordedTime, setRecordedTime] = useState(0);
  const [recordingState, setRecordingState] = useState<LearningState | null>(null);
  const [timeLog, setTimeLog] = useState<Record<LearningState, number>>({ focus: 0, study: 0, break: 0, away: 0 });  
  const { isRunning, timeMs, start, stop, resetAndStart } = useElapsedTimer({ intervalMs: 500 });

  const saveCurrentLogToLocalStorage = useCallback((timeLog: Record<LearningState, number>) => {
    if (timeLog.focus + timeLog.study + timeLog.break + timeLog.away !== 0) {
      localStorage.setItem("learning_time_log", JSON.stringify(timeLog));
    }
  }, []);

  useEffect(() => {
    setTimeLog(prev => {
      const newLog = ({
        ...prev,
        [learningState]: prev[learningState] + timeMs - recordedTime,
      })
      saveCurrentLogToLocalStorage(newLog);
      return newLog;
    });
    setRecordedTime(timeMs);
    if (learningState !== recordingState) {
      setRecordingState(learningState);
      setRecordedTime(0);
    }
  }, [timeMs, learningState, recordedTime, recordingState, saveCurrentLogToLocalStorage]);

  useEffect(() => {
    const timeLogData = localStorage.getItem("learning_time_log");
    if (timeLogData) {
      const timeLog = JSON.parse(timeLogData);
      console.log(timeLog);
      
      setTimeLog(timeLog)
    }
  }, []);

  const handleSetCurrentState = useCallback(
    (state: LearningState) => {
      if (state === learningState) return;
      resetAndStart();
      setRecordedTime(0);
      setLearningState(state);
    },
    [learningState, resetAndStart, setLearningState]
  );

  const totalLearningTime = useMemo(() => {
    return timeLog.focus + timeLog.study + (["focus", "study"].includes(learningState) ? timeMs : 0);
  }, [timeLog, timeMs, learningState])
  
  const switchRunning = useCallback(() => {
    isRunning ? stop() : start();
  }, [isRunning, stop, start]);

  return { isRunning, timeMs, totalLearningTime, timeLog, start, stop, switchRunning, handleSetCurrentState }
}

export default useLearningTimeManager;