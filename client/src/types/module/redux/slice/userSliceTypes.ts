import { ConvertTimestampToNumber, DocumentIdMap } from "../../../firebase/db/formatTypes";
import { UserData } from "../../../firebase/db/user/userStructure";

export interface FetchedUserSliceState {
  users: DocumentIdMap<ConvertTimestampToNumber<UserData>>;
  notExistUsersId: string[];
}