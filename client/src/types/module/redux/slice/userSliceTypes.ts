import { ConvertTimestampToNumber, DocumentIdMap } from "../../../firebase/db/formatTypes";
import { UserWithSupplementary } from "../../../firebase/db/user/userStructure";

export interface FetchedUserSliceState {
  users: DocumentIdMap<ConvertTimestampToNumber<UserWithSupplementary>>;
  notExistUsersId: string[];
}

export interface UserWithNotExistUsersId {
  users: UserWithSupplementary[];
  notExistUsersId: string[];
}