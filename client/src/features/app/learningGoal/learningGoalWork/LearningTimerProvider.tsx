import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect, useCallback } from 'react';
import useTimer from '../../../hooks/timerHooks/useTimer';
import { useAppSelector } from '../../../../redux/hooks';
import { IndexedLearningGoalService } from '../../../../functions/browserStorage/indexedDB/services/indexedLearningGoalService';

// タイマーコンテキストの型を定義
interface LearningTimerContextType {
  isRunning: boolean;
  elapsedTime: number;
  isOverTargetTime: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setTime: (time: number) => void;
}

// 初期値をnullに設定して、useContextでnullチェックを行えるようにする
const LearningTimerContext = createContext<LearningTimerContextType | null>(null);

interface LearningTimerProviderProps {
  children: ReactNode;
}

export const LearningTimerProvider: React.FC<LearningTimerProviderProps> = ({ children }) => {
  const uid = useAppSelector((state) => state.userSlice.uid);
  const { targetDuration, allowedOverflowTime } = useAppSelector((state) => state.learningGoalSlice);
  const [prevElapsedTime, setPrevElapsedTime] = useState<number>(0);

  const {
    isRunning,
    elapsedTime,
    startTimer: onStartTimer,
    stopTimer,
    resetTimer,
    setTime,
    updateInitialElapsedTime,
  } = useTimer({});

  // 前回の経過時間を取得する関数をメモ化
  const handleCalcElapsedTime = useCallback(async () => {
    if (!uid) return;
    const prevElapsed = await IndexedLearningGoalService.getDurationSpent(uid);
    
    if (prevElapsed === null) {
      resetTimer();
      return;
    }

    setPrevElapsedTime(prevElapsed);
  }, [uid, resetTimer]);

  // 経過時間を保存する関数をメモ化
  const saveElapsedTime = useCallback(async () => {
    if (!uid) return;
    const prevElapsed = await IndexedLearningGoalService.getDurationSpent(uid);
    
    if (prevElapsed === null) {
      resetTimer();
      return;
    }
    
    if (prevElapsed < elapsedTime) {
      await IndexedLearningGoalService.setDurationSpent(uid, elapsedTime);
    }
  }, [uid, elapsedTime, resetTimer]);

  // 初期化時の経過時間を取得
  useEffect(() => {
    handleCalcElapsedTime();
  }, [handleCalcElapsedTime]);

  // 前回の経過時間が存在する場合、タイマーを更新
  useEffect(() => {
    if (prevElapsedTime > 0) {
      updateInitialElapsedTime(prevElapsedTime);
    }
  }, [prevElapsedTime, updateInitialElapsedTime]);

  // 経過時間を保存
  useEffect(() => {
    saveElapsedTime();
  }, [saveElapsedTime]);

  // ターゲット時間を超えているかどうかを計算
  const isOverTargetTime = useMemo(() => {
    return targetDuration + allowedOverflowTime <= elapsedTime;
  }, [targetDuration, allowedOverflowTime, elapsedTime]);

  // ターゲット時間を超えている場合、タイマーを停止
  useEffect(() => {
    if (isOverTargetTime) {
      stopTimer();
    } else {
      onStartTimer();
    }
  }, [isOverTargetTime, stopTimer, onStartTimer]);

  // タイマーを開始する関数をメモ化
  const startTimer = useCallback(() => {
    if (isOverTargetTime) {
      console.warn("allowedOverflowTimeを更新してください。");
      return;
    }
    onStartTimer();
  }, [isOverTargetTime, onStartTimer]);

  // コンテキスト値をメモ化して不要な再レンダリングを防ぐ
  const contextValue = useMemo(
    () => ({
      isRunning,
      elapsedTime,
      isOverTargetTime,
      startTimer,
      stopTimer,
      resetTimer,
      setTime,
    }),
    [isRunning, elapsedTime, isOverTargetTime, startTimer, stopTimer, resetTimer, setTime]
  );

  return (
    <LearningTimerContext.Provider value={contextValue}>
      {children}
    </LearningTimerContext.Provider>
  );
};

export const useLearningTimer = (): LearningTimerContextType => {
  const context = useContext(LearningTimerContext);
  if (!context) {
    throw new Error('useLearningTimer must be used within a LearningTimerProvider');
  }
  return context;
};
