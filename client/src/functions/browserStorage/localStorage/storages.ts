import { LocalStorageHandler } from "./localStorageHandler";
import { AuthStorageProps } from "../../../types/app/localStorageTypes";

const authStorage = new LocalStorageHandler<AuthStorageProps>('authData', ['username', 'email', 'password']);
// const learningSessionStorage = new LocalStorageHandler<LearningSessionProps>('space', ["spaceId", "learningTime", "startTime", "endTime"]);
// const spaceDefaultSettingStorage = new LocalStorageHandler<SpaceDefaultSettingStorageProps>('spaceDefaultSetting', ["spaceName", "description", "publicationTarget", "requiresApproval"]);

export { authStorage };
