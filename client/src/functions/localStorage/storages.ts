import { AuthStorageProps, SpaceDefaultSettingStorageProps, SpaceStorageProps } from "../../types/app/localStorageTypes";
import { LocalStorageHandler } from "./handleData";

const authStorage = new LocalStorageHandler<AuthStorageProps>('authData', ['username', 'email', 'password']);
const spaceStorage = new LocalStorageHandler<SpaceStorageProps>('space', ["currentSpaceId", "totalTime"]);
const spaceDefaultSettingStorage = new LocalStorageHandler<SpaceDefaultSettingStorageProps>('spaceDefaultSetting', ["spaceName", "description", "publicationTarget", "requiresApproval"]);

export { authStorage, spaceStorage, spaceDefaultSettingStorage }