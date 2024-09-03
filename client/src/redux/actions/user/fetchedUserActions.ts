import serviceFactory from "../../../firebase/db/factory";
import { convertTimestampsToNumbers, revertTimestampConversion } from "../../../functions/db/dataFormatUtils";
import { arrayToDict, removeDuplicates } from "../../../functions/objectUtils";
import { ConvertTimestampToNumber, DocumentIdMap } from "../../../types/firebase/db/formatTypes";
import { UserData } from "../../../types/firebase/db/user/userStructure";
import { AppDispatch } from "../../../types/module/redux/reduxTypes";
import { setUsers } from "../../slices/user/fetchedUserSlice";
import store from "../../store";

// ユーザーを取得して更新する共通関数
const fetchAndSetUsers = async (
  dispatch: AppDispatch,
  userIdsToFetch: string[],
  prevUsers: DocumentIdMap<ConvertTimestampToNumber<UserData>>,
  updateExistingUsers = true
): Promise<DocumentIdMap<ConvertTimestampToNumber<UserData>>> => {
  const userService = serviceFactory.createUserService();

  try {
    const fetchedUsers = await userService.getUsers(userIdsToFetch);
    const fetchedUsersMap = convertTimestampsToNumbers(arrayToDict(fetchedUsers, "docId")) as DocumentIdMap<ConvertTimestampToNumber<UserData>>;

    const updatedUsers = updateExistingUsers
      ? { ...prevUsers, ...fetchedUsersMap }
      : fetchedUsersMap;

    dispatch(setUsers(updatedUsers));
    return updatedUsers;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

// 新規ユーザーをフェッチして追加
export const fetchAndAddNewUsers = async (dispatch: AppDispatch, usersId: string[]) => {
  const prevUsers = store.getState().fetchedUserSlice.users;
  const newUsersId = usersId.filter(userId => !prevUsers[userId]);

  if (newUsersId.length === 0) return; // 全ユーザーが既に取得済み

  await fetchAndSetUsers(dispatch, newUsersId, prevUsers);
};

// 特定のユーザーをフェッチして追加
export const fetchAndAddNewUser = async (dispatch: AppDispatch, userId: string) => {
  await fetchAndAddNewUsers(dispatch, [userId]);
};

// 必要に応じてユーザーをフェッチ、もしくは既存データを取得
export const getOrFetchUsers = async (dispatch: AppDispatch, userIds: string[]): Promise<DocumentIdMap<UserData>> => {
  const prevUsers = store.getState().fetchedUserSlice.users;
  const uniqueUserIds = removeDuplicates(userIds);
  const existingUsers = uniqueUserIds.reduce((acc, userId) => {
    if (prevUsers[userId]) acc[userId] = prevUsers[userId];
    return acc;
  }, {} as DocumentIdMap<ConvertTimestampToNumber<UserData>>);

  const usersToFetch = uniqueUserIds.filter(userId => !existingUsers[userId]);

  if (usersToFetch.length === 0) {
    return revertTimestampConversion(existingUsers);
  }

  const fetchedUsers = await fetchAndSetUsers(dispatch, usersToFetch, prevUsers, false);
  return revertTimestampConversion({ ...existingUsers, ...fetchedUsers });
};

export const getOrFetchUser = async (
  dispatch: AppDispatch,
  userId: string
): Promise<UserData | null> => {
  const prevUsers = store.getState().fetchedUserSlice.users;

  // 既に取得済みのユーザーをチェック
  if (prevUsers[userId]) {
    return revertTimestampConversion(prevUsers[userId]); // 既存のユーザーデータを返す
  }

  try {
    // ユーザーが存在しない場合にフェッチ
    const fetchedUserMap = await fetchAndSetUsers(dispatch, [userId], prevUsers, false);
    return revertTimestampConversion(fetchedUserMap[userId]) || null;
  } catch (error) {
    console.error(`Failed to fetch or get user with ID ${userId}:`, error);
    return null; // 必要に応じてエラーハンドリングの対応を拡張
  }
};