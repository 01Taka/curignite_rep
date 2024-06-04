import { AuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from 'firebase/auth';
import { checkIfNewUser } from '../util/authUtil';
import { throwFirebaseError } from '../util/error';
import { auth } from '../firebase';

const LANGUAGE = 'ja';

interface SignUpResult {
    uid: string;
    errorMessage: string;
    isNewUser: boolean;
}

// 外部プロバイダーを使用したユーザーアカウントの作成
export const signInWithProvider = async (provider: AuthProvider): Promise<SignUpResult> => {
    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const isNewUser = checkIfNewUser(result);
      return { uid, errorMessage: '', isNewUser };
    } catch (error) {
      const errorMessage = throwFirebaseError(error, LANGUAGE);
      return { uid: '', errorMessage, isNewUser: false };
    }
};

interface VerifyEmailResult {
    isValid: boolean,
    errorMessage: string,
}

export const verifyEmail = async (email: string, password: string): Promise<VerifyEmailResult> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        const user: User = userCredential.user;
    
        // ユーザー情報をリロードして最新の状態を取得
        await user.reload();

        const isValid = user.emailVerified;
        return { isValid , errorMessage: '' };
    } catch (error) {
        const errorMessage =  throwFirebaseError(error, LANGUAGE);
        return { isValid: false, errorMessage };
    }
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
}