import { Timestamp } from "firebase/firestore";
import { usersDB } from "../../../../firebase/db/dbs";
import serviceFactory from "../../../../firebase/db/factory";
import { AuthStates } from "../../../../types/util/stateTypes";
import { NavigateFunction } from "react-router-dom";
import { rootPaths } from "../../../../types/path/appPaths";
import { InitialSetupFormState } from "./InitialSetupView";
import { authStorage } from "../../../../functions/localStorage/storages";
import { UserData } from "../../../../types/firebase/db/user/usersTypes";
import { getUniqueUserName } from "../../../../firebase/util/getUniqueName";
import { ConvertTimestampToNumber } from "../../../../functions/db/dbUtils";

export const navigateByAuthState = async (uid: string | null, navigate: NavigateFunction) => {
  const userService = serviceFactory.createUserService();
  const state = await userService.getUserAuthState(uid);
  switch (state) {
    case "new":
      navigate(rootPaths.top);
      break;
    case "noUserData":
      navigate(rootPaths.auth);
      break;
    case "verified":
      navigate(rootPaths.main);
      break;
    default:
      console.error("一致する認証状態がありません。");
      break;
  }
}

export const getUniqueName = async (
  userData?: ConvertTimestampToNumber<UserData> | null
) => {
  const name = userData?.displayName || authStorage.getData('username') || "";
  const uniqueName = await getUniqueUserName(name);
  return uniqueName;
}

export const handleCreateUser = async (uid: string, formState: InitialSetupFormState) => {
  const { username, birthday } = formState;

  // ユーザー名と誕生日のチェック
  if (!username || !birthday) {
    throw new Error('ユーザー名または誕生日が正しく設定されていません。');
  }

  const usersDB = serviceFactory.createUserService();
  
  try {
    // ユーザーの作成処理
    await usersDB.createUser(uid, username, "", Timestamp.fromDate(birthday));
  } catch (error) {
    console.error('ユーザー作成中にエラーが発生しました:', error);
    throw new Error('ユーザーの作成に失敗しました。');
  }
};