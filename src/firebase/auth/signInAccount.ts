// signInWithEmail.ts

import { FirebaseError } from 'firebase/app';
import { auth } from '../../firebase/firebase';
import { AuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { checkIfNewUser } from '../util/authUtil';

interface SignInResult {
    error: string | null;
    registeredUser: boolean;
}

const errorMessages: Record<string, string> = {
    'default': 'サインイン中にエラーが発生しました。もう一度お試しください。',
    'auth/user-not-found': '入力されたメールアドレスに対応するユーザーが見つかりません。',
    'auth/wrong-password': 'パスワードが間違っています。',
    'auth/invalid-email': '無効なメールアドレスです。',
}

export const signInWithEmail = async (email: string, password: string): Promise<SignInResult> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { error: null, registeredUser: false };
    } catch (error) {
        if (error instanceof FirebaseError) {
            const errorCode = error.code;
            return { error: errorMessages[errorCode] || errorMessages['default'], registeredUser: false };
        }
        return { error: '予期しないエラーが発生しました。', registeredUser: false };
    }
};


export const signInWithProvider = async (provider: AuthProvider): Promise<SignInResult> => {
    try {
        const result = await signInWithPopup(auth, provider);
        return { error: null, registeredUser: !checkIfNewUser(result) };
    } catch (error) {
        if (error instanceof FirebaseError) {
            const errorCode = error.code;
            return { error: errorMessages[errorCode] || errorMessages['default'], registeredUser: false };
        }
        return { error: '予期しないエラーが発生しました。', registeredUser: false };
    }
};