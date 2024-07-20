import { usersDB } from "../../dbs";
import { UserOrganizationInfo } from "./usersTypes";

// Uid(ドキュメントID)がDBに存在するかどうかをチェックする関数
export const checkIfUidExists = async (uid: string): Promise<boolean> => {
  try {
    const user = await usersDB.readAsDocumentSnapshot(uid);
    return user.exists();
  } catch (error) {
    console.error("Error checking UID existence: ", error);
    throw new Error("Failed to check UID existence");
  }
}

// ユーザー名がDBに存在するかどうかをチェックする関数
export const checkIfUserNameExists = async (username: string): Promise<boolean> => {
  try {
    const user = await usersDB.getFirstMatch('username', username);
    return user !== null;
  } catch (error) {
    console.error("Error checking username existence: ", error);
    throw new Error("Failed to check username existence");
  }
}

// Uidをキーとして組織データを要素とする辞書を取得
export const getUserOrganizationInfoWithUidDict = async (uidList: string[]): Promise<{ [uid: string]: UserOrganizationInfo | null }> => {  
  const uniqueUidList: string[] = uidList.filter(uid => uid !== null && uid !== undefined);
  const normUidList: string[] = [...new Set(uniqueUidList)];

  const userDataDict: {[key: string]: UserOrganizationInfo} = {};

  for(let uid of normUidList) {
      const orgInfo = await usersDB.readOrganizationByUid(uid);
      if (orgInfo) {
          userDataDict[uid] = orgInfo;
      }
  }
  return userDataDict;
}
