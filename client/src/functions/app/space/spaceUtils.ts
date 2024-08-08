import { spaceDefaultSettingStorage } from "../../localStorage/storages";
import { SpaceDefaultSettingStorageProps } from "../../../types/app/localStorageTypes";
import { StringBoolean } from "../../../types/util/componentsTypes";
import { SpaceStartFormState } from "../../../types/app/space/spaceTypes";
import { SpacePublicationTarget } from "../../../types/firebase/db/space/spacesTypes";

/**
 * ユーザー名に基づいてデフォルトのスペース名を生成します。
 *
 * @param username - デフォルトのスペース名を生成するためのユーザー名。\
 * @returns デフォルトのスペース名。
 */
export const getDefaultSpaceName = (username?: string | null): string => {
  
  return `${username ?? "無名"}のスペース`;
};

/**
 * スペースの初期設定を行います。設定がローカルストレージから取得され、存在しない場合はデフォルト設定が適用されます。
 *
 * @param getDefaultSpaceName - デフォルトのスペース名を取得するための関数。
 * @returns 初期化されたスペース設定の状態。
 */
export const initializeSpaceSetting = async (username?: string | null): Promise<SpaceStartFormState> => {
  const data = spaceDefaultSettingStorage.getDataAllAtOnce();
  return {
    spaceName: data.spaceName ?? getDefaultSpaceName(username),
    description: data.description ?? "",
    publicationTarget: data.publicationTarget ?? SpacePublicationTarget.Team,
    requiredApproval: data.requiredApproval ? data.requiredApproval === "true" : true,
  };
};
  
/**
 * スペース作成のフォーム状態をローカルストレージに保存します。
 *
 * @param formState - 保存するフォーム状態。
 */
export const handleSetDefaultFormState = (formState: SpaceStartFormState) => {
  const data: SpaceDefaultSettingStorageProps = {
    spaceName: formState.spaceName,
    description: formState.description,
    publicationTarget: formState.publicationTarget,
    requiredApproval: String(formState.requiredApproval) as StringBoolean,
  };
  spaceDefaultSettingStorage.setDataAllAtOnce(data);
};
  