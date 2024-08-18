import { Timestamp } from "firebase/firestore";
import serviceFactory from "../../../../firebase/db/factory";
import { InitialSetupFormState } from "./InitialSetupView";
import { authStorage } from "../../../../functions/localStorage/storages";
import { UserData } from "../../../../types/firebase/db/user/usersTypes";
import { getUniqueUserName } from "../../../../firebase/util/getUniqueName";
import { ConvertTimestampToNumber } from "../../../../types/firebase/db/formatTypes";

export const getUniqueName = async (
  userData?: ConvertTimestampToNumber<UserData> | null
) => {
  const name = userData?.displayName || authStorage.getData('username') || "";
  const uniqueName = await getUniqueUserName(name);
  return uniqueName;
}

export const handleCreateUser = async (uid: string, formState: InitialSetupFormState) => {
  const { username, birthday } = formState;

  console.log(username, birthday);
  

  // ユーザー名と誕生日のチェック
  if (!username || !birthday) {
    console.error('ユーザー名または誕生日が正しく設定されていません。');
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