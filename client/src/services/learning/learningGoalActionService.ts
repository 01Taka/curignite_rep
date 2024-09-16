import { MINUTES_IN_MILLISECOND } from "../../constants/utils/dateTimeConstants";
import { useLearningTimer } from "../../features/app/learningGoal/learningGoalWork/LearningTimerProvider";
import serviceFactory from "../../firebase/db/factory";
import { IndexedLearningGoalService } from "../../functions/browserStorage/indexedDB/services/indexedLearningGoalService";
import { convertTimestampsToNumbers } from "../../functions/db/dataFormatUtils";
import { resetLearningGoalSlice, setAllowedOverflowTime, setCurrentGoal } from "../../redux/slices/learning/learningGoalSlice";
import { Subject } from "../../types/firebase/db/common/commonTypes";
import { LearningGoalStatus } from "../../types/firebase/db/user/userSupplementTypes";
import { AppDispatch } from "../../types/module/redux/reduxTypes";
import { endSession, saveSessionsToFirestore, startSession } from "./sessionActionService";

const handleError = (message: string, error: unknown) => {
  console.error(message, error);
};

// 学習ゴールの開始処理
export const startLearningGoal = async (
  userId: string,
  objective: string,
  subject: Subject,
  targetDuration: number,
  dispatch: AppDispatch,
  initialAllowedOverflowTime: number = 10 * MINUTES_IN_MILLISECOND,
  isStartingSession: boolean = true,
) => {
  const learningService = serviceFactory.createUserLearningGoalService();
  const userService = serviceFactory.createUserService();

  try {
    const prevGoalId = (await userService.getUser(userId))?.currentTargetLearningGoalId;

    if (prevGoalId) {
      throw new Error("現在学習中のため新しい学習を始められません。");
    }

    const goalRef = await learningService.createGoal(userId, objective, subject, targetDuration, "inProgress");
    await userService.setCurrentTargetLearningGoalId(userId, goalRef.id);

    IndexedLearningGoalService.createCurrentGoal(userId, goalRef.id);

    const learningGoal = await learningService.getGoal(userId, goalRef.id);
    dispatch(setCurrentGoal(learningGoal ? convertTimestampsToNumbers(learningGoal) : null));
    await updateAllowedOverflowTime(userId, initialAllowedOverflowTime, dispatch);

    if (isStartingSession) await startSession(userId, goalRef.id);
  } catch (error) {
    handleError("Failed to start learning goal:", error);
  }
};

// 学習ゴールの終了処理
export const endLearningGoal = async (
  userId: string,
  dispatch: AppDispatch,
  status: LearningGoalStatus = "achieved",
) => {
  const learningService = serviceFactory.createUserLearningGoalService();
  const userService = serviceFactory.createUserService();

  const learningGoalId = (await userService.getUser(userId))?.currentTargetLearningGoalId;
  if (!learningGoalId) {
    console.warn("現在学習中ではありません。");
    return;
  }

  try {
    // セーブ操作
    await learningService.updateGoalStatus(userId, learningGoalId, status);
    await syncDurationToFirestoreFromIndexedDB(userId);
    await saveSessionsToFirestore(userId, learningGoalId);

    //リセット操作
    await endSession(userId, learningGoalId);
    await userService.setCurrentTargetLearningGoalId(userId, null);
    await IndexedLearningGoalService.clearCurrentGoal(userId);
    dispatch(resetLearningGoalSlice());

  } catch (error) {
    handleError("Failed to end learning goal:", error);
  }
};

// IndexedDBからFirestoreに経過時間を同期
const syncDurationToFirestoreFromIndexedDB = async (userId: string) => {
  try {
    const learningService = serviceFactory.createUserLearningGoalService();
    const currentLearningGoal = await IndexedLearningGoalService.getCurrentGoal(userId);

    if (!currentLearningGoal) {
      handleError("No current learning goal assigned.", null);
      return;
    }

    await learningService.setGoalDurationSpent(userId, currentLearningGoal.learningGoalId, currentLearningGoal.durationSpent);
  } catch (error) {
    handleError("Failed to sync duration to Firestore:", error);
  }
};

// IndexedDBに経過時間を保存
export const setDurationSpentToIndexedDB = async (userId: string, timeMs: number) => {
  try {
    await IndexedLearningGoalService.setDurationSpent(userId, timeMs);
  } catch (error) {
    handleError("Failed to save duration:", error);
  }
};

// 余裕時間を設定
const updateAllowedOverflowTime = async (userId: string, timeMs: number, dispatch: AppDispatch) => {
  try {
    await IndexedLearningGoalService.setAllowedOverflowTime(userId, timeMs);
    dispatch(setAllowedOverflowTime(timeMs));
  } catch (error) {
    handleError("Failed to update allowed overflow time:", error);
  }
};

// 余裕時間を追加
export const addAllowedOverflowLearningTime = async (userId: string, additionalTimeMs: number, dispatch: AppDispatch) => {
  try {
    const previousTime = await IndexedLearningGoalService.getAllowedOverflowTime(userId);
    await updateAllowedOverflowTime(userId, previousTime + additionalTimeMs, dispatch);
  } catch (error) {
    handleError("Failed to add allowed overflow time:", error);
  }
};
