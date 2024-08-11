import { TimeTypes } from "../../../types/util/dateTimeTypes";
import serviceFactory from "../../../firebase/db/factory";
import { updateTotalLearningTime } from "../../../redux/actions/space/spaceActions";
import { clearData, saveEndTime, saveLearningTime, saveSpaceId, saveStartTime } from "../../../redux/actions/space/learningSessionActions";
import { learningSessionStorage } from "../../localStorage/storages";
import { AppDispatch } from "../../../types/module/redux/reduxTypes";

/**
 * ユーザーIDとスペースIDからパスワードを生成します。
 */
export const getLearningStoragePassword = (userId: string, spaceId: string): string => `${userId}${spaceId}`;

/**
 * 学習セッションを開始します。
 */
export const startLearningSession = (dispatch: AppDispatch, userId: string, spaceId: string, startTime: TimeTypes = new Date()) => {
    clearData(dispatch);
    const password = getLearningStoragePassword(userId, spaceId);
    saveSpaceId(spaceId, dispatch);
    saveStartTime(startTime, password, dispatch);
}

/**
 * 学習セッションのデータを保存します。
 */
const saveLearningSessionData = async (dispatch: AppDispatch, userId: string) => {
    try {
        const logsService = serviceFactory.createUserDailyLogService();
        const spaceId = getCurrentSessionSpaceId();
    
        if (!spaceId) {
            throw new Error("No spaceId found in storage.");
        }
    
        const learningTime = getLearningTime(userId, spaceId);
        const { startTime, endTime } = getStartAndEndTime(userId, spaceId);
    
        if (learningTime === 0 || !startTime) {
            throw new Error("Invalid learning time or start time.");
        }
        await logsService.addSessionData(userId, spaceId, learningTime, startTime, endTime ?? undefined);
        // reduxの合計勉強時間を更新
        dispatch(updateTotalLearningTime(userId));
    } catch (error) {
        console.error(error);
    }
}

/**
 * 学習セッションを終了します。
 */
export const endLearningSession = async (dispatch: AppDispatch, userId: string, endTime: TimeTypes = new Date()) => {
    const spaceId = getCurrentSessionSpaceId();
    
    if (!spaceId) {
        throw new Error("No spaceId found in storage.");
    }

    const password =  getLearningStoragePassword(userId, spaceId);
    saveEndTime(endTime, password, dispatch)
    await saveLearningSessionData(dispatch, userId);
    clearData(dispatch);
}

/**
 * 学習セッションを移動します。
 * @param userId ユーザーID
 * @param spaceId セッションの対象のスペース
 * @param moveAt 移動時刻
 */
export const moveLearningSession = async (dispatch: AppDispatch, userId: string, spaceId: string, moveAt: TimeTypes = new Date()) => {
    try {
        const currentSessionSpaceId = getCurrentSessionSpaceId();

        if (!currentSessionSpaceId || currentSessionSpaceId !== spaceId) {
            if (currentSessionSpaceId) {
                await endLearningSession(dispatch, userId, moveAt);
            }
            startLearningSession(dispatch, userId, spaceId, moveAt);
        }
    } catch (error) {
        console.error("Error moving learning session:", error);
    }
}

interface StartAndEndTime {
    startTime: number | null;
    endTime: number | null;
}

/**
 * 指定されたユーザーとスペースの開始時刻と終了時刻を取得します。
 */
const getStartAndEndTime = (userId: string, spaceId: string): StartAndEndTime => {
    const password = getLearningStoragePassword(userId, spaceId);
    const startTimeData = learningSessionStorage.getData("startTime", undefined, password);
    const endTimeData = learningSessionStorage.getData("endTime", undefined, password);

    return {
        startTime: startTimeData ? Number(startTimeData) || null : null,
        endTime: endTimeData ? Number(endTimeData) || null : null
    };
}

/**
 * 指定されたユーザーとスペースの現在の学習時間を取得します。
 */
export const getLearningTime = (userId: string, spaceId: string): number => {
    const storedTime = Number(learningSessionStorage.getData("learningTime", undefined, getLearningStoragePassword(userId, spaceId)));
    return isNaN(storedTime) ? 0 : storedTime;
}

/**
 * 指定されたユーザーとスペースの学習時間に加算します。
 */
export const addLearningTime = (dispatch: AppDispatch, userId: string, spaceId: string, addTime: number): number => {
    const newTotalTime = getLearningTime(userId, spaceId) + addTime;
    const password = getLearningStoragePassword(userId, spaceId);
    saveLearningTime(newTotalTime, password, dispatch)
    return newTotalTime;
}

/**
 * ストレージから現在のスペースIDを取得します。
 */
export const getCurrentSessionSpaceId = (): string | null => learningSessionStorage.getData("spaceId");
