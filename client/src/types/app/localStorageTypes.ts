import { SpacePublicationTarget } from "../firebase/db/space/spacesTypes";
import { StringBoolean } from "../util/componentsTypes";

export interface AuthStorageProps {
    username: string;
    email: string;
    password: string;
}

export interface SpaceStorageProps {
    currentSpaceId: string;
    totalTime: string;
}

export interface SpaceDefaultSettingStorageProps {
    spaceName: string,
    description: string,
    publicationTarget: SpacePublicationTarget,
    requiresApproval: StringBoolean,
}