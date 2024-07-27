import { AuthStorageProps, SpaceStorageProps } from "../../types/app/localStorageTypes";
import { LocalStorageHandler } from "./handleData";

const authStorage = new LocalStorageHandler<AuthStorageProps>('authData', ['username', 'email', 'password']);
const spaceStorage = new LocalStorageHandler<SpaceStorageProps>('spaceData', ["spaceName", "introduction", "publicationTarget", "requiredApproval"]);

export { authStorage, spaceStorage }