import { Timestamp } from "firebase/firestore";
import { ConvertTimestampToNumber } from "../../../../functions/db/dbUtils";
import { BaseDocumentData } from "../baseTypes";

// UserDB関連のインターフェース
export interface UserData extends BaseDocumentData {
    username: string;
    iconUrl: string;
    spaceIds: string[];
    birthDate: Timestamp;
}
export type SerializableUserData = ConvertTimestampToNumber<UserData>;

export type UserIdMap = { [key: string]: UserData }