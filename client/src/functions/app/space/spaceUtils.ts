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
export const getDefaultSpaceName = (username?: string): string => {
  return `${username ?? "無名"}のスペース`;
};


export const getInitialSpaceStartFormState = (username?: string): SpaceStartFormState => {
  const data = spaceDefaultSettingStorage.getDataAllAtOnce();
  const spaceName = data.spaceName ?? `${username ?? "無名"}のスペース`;

  return {
    spaceName: spaceName,
    description: data.description ?? "",
    publicationTarget: data.publicationTarget ?? SpacePublicationTarget.Team,
    requiresApproval: data.requiresApproval ? data.requiresApproval === "true" : true,
  };
}

/**
 * スペース作成のフォーム状態をローカルストレージに保存します。
 *
 * @param formState - 保存するフォーム状態。
 */
export const setDefaultSpaceFormState = (formState: SpaceStartFormState) => {
  const data: SpaceDefaultSettingStorageProps = {
    spaceName: formState.spaceName,
    description: formState.description,
    publicationTarget: formState.publicationTarget,
    requiresApproval: String(formState.requiresApproval) as StringBoolean,
  };
  spaceDefaultSettingStorage.setDataAllAtOnce(data);
};
  