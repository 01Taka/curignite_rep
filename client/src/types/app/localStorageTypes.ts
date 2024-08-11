import { SpacePublicationTarget } from "../firebase/db/space/spacesTypes";
import { StringBoolean } from "../util/componentsTypes";
import { Stringify } from "../util/utilTypes";
import { LearningSession } from "./space/learningSessionTypes";

export interface AuthStorageProps {
    username: string;
    email: string;
    password: string;
}

export type LearningSessionProps = Stringify<LearningSession>;

export interface SpaceDefaultSettingStorageProps {
    spaceName: string,
    description: string,
    publicationTarget: SpacePublicationTarget,
    requiresApproval: StringBoolean,
}