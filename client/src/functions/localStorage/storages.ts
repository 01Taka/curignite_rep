import { AuthStorageProps, LearningSessionProps, SpaceDefaultSettingStorageProps } from "../../types/app/localStorageTypes";
import { LocalStorageHandler } from "./localStorageHandler";

const authStorage = new LocalStorageHandler<AuthStorageProps>('authData', ['username', 'email', 'password']);
const learningSessionStorage = new LocalStorageHandler<LearningSessionProps>('space', ["spaceId", "learningTime", "startTime", "endTime"]);
const spaceDefaultSettingStorage = new LocalStorageHandler<SpaceDefaultSettingStorageProps>('spaceDefaultSetting', ["spaceName", "description", "publicationTarget", "requiresApproval"]);

export { authStorage, learningSessionStorage, spaceDefaultSettingStorage };