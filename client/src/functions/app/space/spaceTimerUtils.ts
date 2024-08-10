import { startOfDay } from "date-fns";
import { spaceStorage } from "../../localStorage/storages";


const getPassword = (userId: string) => {
    return String(startOfDay(new Date())) + userId;
}
/**
 * 学習の総時間を取得します。
 * ストレージから指定されたスペースIDの総時間を読み取り、数値として返します。
 * データが存在しない場合は、デフォルトで0を返します。
 *
 * @param userId - パスワードに使用するUID
 * @returns ストレージから取得した総時間。データが存在しない場合は0。
 */
export const getTotalTime = (userId: string): number => {
    const storedTime = Number(spaceStorage.getData("totalTime", undefined, getPassword(userId)));
    return isNaN(storedTime) ? 0 : storedTime;
};

/**
 * 学習の総時間に追加の時間を加算します。
 * まず現在の総時間を取得し、指定された時間を追加した後、新しい総時間をストレージに保存します。
 *
 * @param userId - パスワードに使用するUID
 * @param addTime - 追加する時間（秒）。
 * @returns 更新後の総時間。
 */
export const addTotalTime = (userId: string, addTime: number): number => {
    const newTotalTime = getTotalTime(userId) + addTime;
    spaceStorage.setData("totalTime", newTotalTime.toString(), undefined, getPassword(userId));
    return newTotalTime;
};
