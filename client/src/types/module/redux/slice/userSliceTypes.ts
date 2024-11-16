import { ConvertTimestampToNumber, DocumentIdMap } from "../../../firebase/db/formatTypes";
import { UserRead } from "../../../firebase/db/user/userStructure";

export interface FetchedUserSliceState {
  users: DocumentIdMap<ConvertTimestampToNumber<UserRead>>;
  notExistUsersId: string[];
}

export interface UserWithNotExistUsersId {
  users: UserRead[];
  notExistUsersId: string[];
}