import { AuthStorageProps, SpaceDefaultSettingStorageProps, SpaceStorageProps } from "../../types/app/localStorageTypes";
import { LocalStorageHandler } from "./handleData";

const authStorage = new LocalStorageHandler<AuthStorageProps>('authData', ['username', 'email', 'password']);
const spaceStorage = new LocalStorageHandler<SpaceStorageProps>('space', ["currentSpaceId", "totalTime"]);
const spaceDefaultSettingStorage = new LocalStorageHandler<SpaceDefaultSettingStorageProps>('spaceDefaultSetting', ["spaceName", "introduction", "publicationTarget", "requiredApproval"]);

export { authStorage, spaceStorage, spaceDefaultSettingStorage }