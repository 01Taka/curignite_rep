// checkUidExistence.ts
import { adminAuth } from './firebaseAdmin';

export const checkUidExistence = async (uid: string): Promise<boolean> => {
  try {
    // UIDに対応するユーザー情報を取得します
    await adminAuth.getUser(uid);
    console.log(`User with UID ${uid} exists.`);
    return true; // UIDが存在する場合はtrueを返します
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log(`User with UID ${uid} does not exist.`);
      return false; // UIDが存在しない場合はfalseを返します
    } else {
      console.error('Error checking UID existence:', error);
      throw error; // その他のエラーの場合はエラーをスローします
    }
  }
};
