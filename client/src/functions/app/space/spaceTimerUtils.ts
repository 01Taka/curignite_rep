import { spaceStorage } from "../../localStorage/storages";

/**
 * スペースに関連付けられた総時間を取得します。
 * ストレージから指定されたスペースIDの総時間を読み取り、数値として返します。
 * データが存在しない場合は、デフォルトで0を返します。
 *
 * @param spaceId - 総時間を取得する対象のスペースのID。
 * @returns ストレージから取得した総時間。データが存在しない場合は0。
 */
export const getTotalTime = (spaceId: string): number => {
    const storedTime = Number(spaceStorage.getData("totalTime", spaceId));
    return isNaN(storedTime) ? 0 : storedTime;
};

/**
 * スペースに関連付けられた総時間に追加の時間を加算します。
 * まず現在の総時間を取得し、指定された時間を追加した後、新しい総時間をストレージに保存します。
 *
 * @param spaceId - 総時間を更新する対象のスペースのID。
 * @param addTime - 追加する時間（秒）。
 * @returns 更新後の総時間。
 */
export const addTotalTime = (spaceId: string, addTime: number): number => {
    const newTotalTime = getTotalTime(spaceId) + addTime;
    spaceStorage.setData("totalTime", newTotalTime.toString(), spaceId);
    return newTotalTime;
};
