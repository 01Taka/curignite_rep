import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";
import { ConvertTimestampToNumber } from "../formatTypes";

// UserDB関連のインターフェース
export interface UserData extends BaseDocumentData {
    username: string;
    iconUrl: string;
    spaceIds: string[];
    birthDate: Timestamp;
}
export type SerializableUserData = ConvertTimestampToNumber<UserData>;
