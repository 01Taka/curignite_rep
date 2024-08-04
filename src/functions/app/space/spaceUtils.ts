import serviceFactory from "../../../firebase/db/factory";
import { spaceDefaultSettingStorage } from "../../localStorage/storages";
import { SpaceDefaultSettingStorageProps } from "../../../types/app/localStorageTypes";
import { SpaceStartFormState } from "../../../types/app/spaceTypes";
import { SpacePublicationTarget } from "../../../types/firebase/db/space/spacesTypes";
import { StringBoolean } from "../../../types/util/componentsTypes";

/**
 * ユーザー名に基づいてデフォルトのスペース名を生成します。
 * ユーザー名が提供されていない場合は、現在のユーザーのユーザー名を取得して使用します。
 *
 * @param username - デフォルトのスペース名を生成するためのユーザー名。省略可能。
 * @returns デフォルトのスペース名。
 */
export const getDefaultSpaceName = async (username: string | null = null): Promise<string> => {
  if (!username) {
    const userService = serviceFactory.createUserService();
    const userData = await userService.getCurrentUserData();
    username = userData ? userData.username : "無名";
  }
  return `${username}のスペース`;
};

/**
 * スペースの初期設定を行います。設定がローカルストレージから取得され、存在しない場合はデフォルト設定が適用されます。
 *
 * @param getDefaultSpaceName - デフォルトのスペース名を取得するための関数。
 * @returns 初期化されたスペース設定の状態。
 */
export const initializeSpaceSetting = async (getDefaultSpaceName: () => Promise<string>): Promise<SpaceStartFormState> => {
  const data = spaceDefaultSettingStorage.getDataAllAtOnce();
  return {
    spaceName: data.spaceName ?? await getDefaultSpaceName(),
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
  