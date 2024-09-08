import serviceFactory from "../../../firebase/db/factory";
import { convertTimestampsToNumbers, revertTimestampConversion } from "../../../functions/db/dataFormatUtils";
import { objectArrayToDict, removeDuplicates } from "../../../functions/objectUtils";
import { ConvertTimestampToNumber, DocumentIdMap } from "../../../types/firebase/db/formatTypes";
import { UserWithSupplementary } from "../../../types/firebase/db/user/userStructure";
import { AppDispatch } from "../../../types/module/redux/reduxTypes";
import { FetchedUserSliceState, UserWithNotExistUsersId } from "../../../types/module/redux/slice/userSliceTypes";
import { setNotExitsUsersId, setUsers } from "../../slices/user/fetchedUserSlice";
import store from "../../store";

// ユーザーを取得する関数
const fetchUsers = async (targetIds: string[]): Promise<UserWithNotExistUsersId> => {
  try {
    const userService = serviceFactory.createUserService();
    const result = await userService.getUsersWithNotExistIdsAndSupplementary(targetIds);
    return result;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

// ユーザーを状態に設定する関数
const updateUserState = (dispatch: AppDispatch, state: FetchedUserSliceState, result: UserWithNotExistUsersId) => {
  const newNotExistIds = removeDuplicates([...state.notExistUsersId, ...result.notExistUsersId]);
  dispatch(setNotExitsUsersId(newNotExistIds));

  const fetchedUsersMap = convertTimestampsToNumbers(objectArrayToDict(result.users, "docId")) as DocumentIdMap<ConvertTimestampToNumber<UserWithSupplementary>>;
  const updatedUsers = { ...state.users, ...fetchedUsersMap };

  dispatch(setUsers(updatedUsers));
  return revertTimestampConversion(updatedUsers);
};

// ユーザーを取得して更新する共通関数
export const fetchAndSetUsers = async (
  dispatch: AppDispatch,
  userIdsToFetch: string[],
): Promise<DocumentIdMap<UserWithSupplementary>> => {
  const state = store.getState().fetchedUserSlice;
  
  const targetIds = userIdsToFetch.filter(id => !state.users[id] && !state.notExistUsersId.includes(id));

  if (targetIds.length === 0) return revertTimestampConversion(state.users);

  const result = await fetchUsers(targetIds);
  return updateUserState(dispatch, state, result);
};
