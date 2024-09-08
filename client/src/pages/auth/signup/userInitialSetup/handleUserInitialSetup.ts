import { Timestamp } from "firebase/firestore";
import serviceFactory from "../../../../firebase/db/factory";
import { InitialSetupFormState } from "./InitialSetupView";
import { authStorage } from "../../../../functions/browserStorage/localStorage/storages";
import { getUniqueUserName } from "../../../../firebase/util/getUniqueName";
import { ConvertTimestampToNumber } from "../../../../types/firebase/db/formatTypes";
import { UserData } from "../../../../types/firebase/db/user/userStructure";

export const getUniqueName = async (
  userData?: ConvertTimestampToNumber<UserData> | null
) => {
  const name = userData?.displayName || authStorage.getData('username') || "";
  const uniqueName = await getUniqueUserName(name);
  return uniqueName;
}

export const handleCreateUser = async (uid: string, formState: InitialSetupFormState) => {
  const { username, birthday, iconFile } = formState;

  // ユーザー名と誕生日のチェック
  if (!username || !birthday || !iconFile) {
    console.error('ユーザー名または誕生日またはアイコンが正しく設定されていません。');
    throw new Error('ユーザー名または誕生日またはアイコンが正しく設定されていません。');
  }

  const userService = serviceFactory.createUserService();
  
  try {
    // ユーザーの作成処理
    await userService.createUser(uid, username, iconFile, Timestamp.fromDate(birthday));
  } catch (error) {
    console.error('ユーザー作成中にエラーが発生しました:', error);
    throw new Error('ユーザーの作成に失敗しました。');
  }
};