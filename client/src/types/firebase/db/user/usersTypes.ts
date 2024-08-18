import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";
import { ConvertTimestampToNumber } from "../formatTypes";

export interface UserMetaData {
    spaceIds: string[];
    taskListId: string;
}

// UserDB関連のインターフェース
export interface UserData extends BaseDocumentData {
    username: string;
    iconUrl: string;
    birthDate: Timestamp;
    metaData: UserMetaData;
}
export type SerializableUserData = ConvertTimestampToNumber<UserData>;
