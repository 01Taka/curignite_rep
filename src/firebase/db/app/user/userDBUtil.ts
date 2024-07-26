import { usersDB } from "../../dbs";
import { UserData, UserOrganizationData } from "../../../../types/firebase/db/usersTypes";
import { getCurrentUser } from "../../../auth/auth";

// 現在のユーザーのデータを取得
export const getCurrentUserData = async (): Promise<UserData | null> => {
  try {
    const user = await getCurrentUser();
    if (user) {
      return await usersDB.read(user.uid);
    }
    return null;
  } catch (error) {
    console.error('Failed to get current user data: ', error);
    return null;
  }
}

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
export const getUserOrganizationDataWithUidDict = async (uidList: string[]): Promise<{ [uid: string]: UserOrganizationData | null }> => {  
  const uniqueUidList: string[] = uidList.filter(uid => uid !== null && uid !== undefined);
  const normUidList: string[] = [...new Set(uniqueUidList)];

  const userDataDict: {[key: string]: UserOrganizationData} = {};

  for(let uid of normUidList) {
      const orgData = await usersDB.readOrganizationByUid(uid);
      if (orgData) {
          userDataDict[uid] = orgData;
      }
  }
  return userDataDict;
}

// 自分が作成したスペースIdのリストに新しくIdを追加
export const appendSpaceIdToUserData = async (uid: string, spaceId: string): Promise<void> => {
  try {
    const user = await usersDB.read(uid);
    if (user) {
      const spaceIds = user.spaceIds || [];
      if (!spaceIds.includes(spaceId)) {
        spaceIds.push(spaceId);
        await usersDB.update(uid, { spaceIds });
      }
    } else {
      console.error(`User with UID ${uid} not found`);
    }
  } catch (error) {
    console.error('Failed to append spaceId: ', error);
    throw new Error('Failed to append spaceId');
  }
}
