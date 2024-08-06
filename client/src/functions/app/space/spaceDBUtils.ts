import { spacesDB } from "../../../firebase/db/dbs";
import serviceFactory from "../../../firebase/db/factory";
import { SpaceStartFormState } from "../../../types/app/spaceTypes";
import { SpaceData } from "../../../types/firebase/db/space/spacesTypes";
import { spaceStorage } from "../../localStorage/storages";

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
export const handleCreateSpace = async (formState: SpaceStartFormState, uid: string) => {
    const spaceService = serviceFactory.createSpaceService(uid);
    await spaceService.createSpace(
      uid,
      formState.spaceName,
      formState.description,
      formState.publicationTarget,
      formState.requiredApproval
    );
};
  
/**
 * ユーザーのスペースデータを更新します。ユーザーが属しているチームのスペースを取得し、状態を更新します。
 *
 * @param userId - スペースデータを取得するユーザーのID。
 * @returns ユーザーのスペースデータの配列。
 */
export const updateSpaces = async (userId: string): Promise<SpaceData[]> => {
    const spaceService = serviceFactory.createSpaceService(userId);
    const spaceIds = await spaceService.getSameTeamMembersSpaceIds();
    return await spaceService.getSpaceDataByUserSpaceIds(spaceIds);
};