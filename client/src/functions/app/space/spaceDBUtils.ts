import { NavigateFunction } from "react-router-dom";
import { spacesDB } from "../../../firebase/db/dbs";
import serviceFactory from "../../../firebase/db/factory";
import { SpaceStartFormState } from "../../../types/app/space/spaceTypes";
import { SpaceData } from "../../../types/firebase/db/space/spacesTypes";
import { spaceStorage } from "../../localStorage/storages";
import { spacePaths } from "../../../types/path/mainPaths";
import { replaceParams } from "../../path/pathUtils";
import { PathParam } from "../../../types/path/paths";

/**
 * ストレージから現在のスペースを取得します。
 * ストレージに保存されたスペースIDを使って、対応するスペースデータをデータベースから読み込む非同期関数です。
 *
 * @returns スペースIDがストレージに保存されている場合、そのIDに対応するスペースデータ。IDが存在しない場合は `null`。
 */
export const getSpaceFromStorage = async (): Promise<SpaceData | null> => {
    const id = spaceStorage.getData("currentSpaceId");
    if (id) {
        return await spacesDB.read(id);
    }
    return null;
}

/**
 * スペースを作成します。ユーザーIDとフォーム状態を基に、スペースの詳細を指定して作成します。
 *
 * @param formState - 作成するスペースの詳細。
 * @param uid - スペースを作成するユーザーのID。
 */
export const startNewSpace = async (formState: SpaceStartFormState, uid: string, setIsStartingSpace: React.Dispatch<React.SetStateAction<boolean>>, navigate: NavigateFunction) => {
    setIsStartingSpace(true);
    const spaceService = serviceFactory.createSpaceService();
    const spaceRef = await spaceService.createSpace(
      uid,
      formState.spaceName,
      formState.description,
      formState.publicationTarget,
      formState.requiresApproval
    );
    navigate(replaceParams(spacePaths.home, { [PathParam.SpaceId]: spaceRef.id }));
    setIsStartingSpace(false);
};
