import serviceFactory from "../../../firebase/db/factory";
import { IndexedLearningGoalService } from "../../../functions/browserStorage/indexedDB/services/indexedLearningGoalService";
import { convertTimestampsToNumbers } from "../../../functions/db/dataFormatUtils";
import { AppDispatch } from "../../../types/module/redux/reduxTypes";
import { setAllowedOverflowTime, setCurrentGoal, setTargetDuration } from "../../slices/learning/learningGoalSlice";

/**
 * 指定されたユーザーの現在の学習目標を更新し、Reduxストアに反映します。
 * @param dispatch - Reduxのdispatch関数
 * @param userId - ユーザーID
 */
export const updateCurrentGoal = async (dispatch: AppDispatch, userId: string): Promise<void> => {
  try {
    const goalService = serviceFactory.createUserLearningGoalService();

    const indexedLearningGoal = await IndexedLearningGoalService.getCurrentGoal(userId);
    if (!indexedLearningGoal) {
      return;
    }

    const learningGoal = await goalService.getGoal(userId, indexedLearningGoal.learningGoalId);
    if (!learningGoal) {
      return;
    }

    setTargetDuration(learningGoal.targetDuration);
    
    const allowedOverflowTime = await IndexedLearningGoalService.getAllowedOverflowTime(userId);
    dispatch(setAllowedOverflowTime(allowedOverflowTime));

    dispatch(setCurrentGoal(convertTimestampsToNumbers(learningGoal)));
  } catch (error) {
    console.error("現在の学習目標の更新に失敗しました:", error);
  }
};
