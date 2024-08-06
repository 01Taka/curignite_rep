import { AuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { checkIfNewUser } from '../util/authUtil';
import { throwFirebaseError } from '../util/error';
import { auth } from '../firebase';

const LANGUAGE = 'ja';

// 外部プロバイダーを使用したユーザーアカウントの作成
export const signInWithProvider = async (provider: AuthProvider): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = checkIfNewUser(result);
      return isNewUser;
    } catch (error) {
      const errorMessage = throwFirebaseError(error, LANGUAGE);
      throw new Error(errorMessage);
    }
}

export const signInWithEmail = async (email: string, password: string) => {
    if (!email) {
        throw new Error("メールを入力してください");
    }

    if (!password) {
        throw new Error("パスワードを入力してください");
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
        throw new Error('メールとパスワードが一致しません');
    }
}

