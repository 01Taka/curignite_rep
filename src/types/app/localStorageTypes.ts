import { PublicationTarget } from "../firebase/db/spacesTypes";
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
    introduction: string,
    publicationTarget: PublicationTarget,
    requiredApproval: StringBoolean,
}