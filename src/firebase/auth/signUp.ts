import { auth } from '../../firebase/firebase';  // Firestoreをインポート
import { applyActionCode, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

import { throwFirebaseError } from '../util/error';

type Languages = "ja" | "en";
const LANGUAGE = 'ja';

const sendEmail = async (userCredential: UserCredential) => {
    try {
        await sendEmailVerification(userCredential.user);
    } catch (error: unknown) {
        const errorMessage = throwFirebaseError(error, LANGUAGE);
        console.error('Failed to send email verification:', errorMessage);
        throw new Error(errorMessage);
    }
};


const createAccountWithEmail = async (email: string, password: string): Promise<UserCredential> => {
    try {
        return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        console.error('Unexpected error occurred during account creation.', error);
        throw error;
    }
};

interface SignUpWithEmailResult {
    isSuccessful: boolean,
    errorMessage: string,
}
export const signUpWithEmail = async (email: string, password: string): Promise<SignUpWithEmailResult> => {
    try {
        const userCredential = await createAccountWithEmail(email, password);
        await sendEmail(userCredential);
        return { isSuccessful: true, errorMessage: '' };
    } catch (error: any) {
        const errorMessage = throwFirebaseError(error, LANGUAGE);
        return { isSuccessful: false, errorMessage }
    }
};

export const resendEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await sendEmail(userCredential);
    } catch (error) {
        const errorMessage = throwFirebaseError(error, LANGUAGE);
        throw new Error(errorMessage);
    }
}

interface VerifyActionCodeResult {
    isValid: boolean,
    errorMessage: string,
}
export const verifyActionCode = async (actionCode: string, lang: string): Promise<VerifyActionCodeResult> => {
    try {
        await applyActionCode(auth, actionCode);
        return { isValid: true, errorMessage: '' };
    } catch (error: any) {
        const language: Languages = lang as Languages;
        const errorMessage = throwFirebaseError(error, language);
        return { isValid: false, errorMessage};
    }
}
