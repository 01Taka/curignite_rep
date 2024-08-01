import { spacesDB } from "../../../firebase/db/dbs";
import { spaceStorage } from "../../../functions/localStorage/storages";
import { SpaceData } from "../../../types/firebase/db/spacesTypes";

// ローカルストレージに保存されたIdのスペースを取得する。
export const getSpaceFromStorage = async (): Promise<SpaceData | null> => {
    const id = spaceStorage.getData("currentSpaceId");
    if (id) {
        return await spacesDB.read(id);
    }
    return null;
}

export const getTotalTime = (): number => {
    const storedTime = Number(spaceStorage.getData("totalTime"));
    return isNaN(storedTime) ? 0 : storedTime;
  };

export const addTotalTime = (addTime: number): number => {
    const newTotalTime = getTotalTime() + addTime;
    spaceStorage.setData("totalTime", newTotalTime.toString());
    return newTotalTime;
};