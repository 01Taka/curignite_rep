import { auth } from '../../firebase/firebase';  // Firestoreをインポート
import { applyActionCode, createUserWithEmailAndPassword, sendEmailVerification, UserCredential } from 'firebase/auth';

import { throwFirebaseError } from '../util/error';
import { Languages } from '../../types/app/languages';
import { Language } from '@mui/icons-material';

const LANGUAGE = 'ja';

const sendEmail = async (userCredential: UserCredential) => {
    try {
        await sendEmailVerification(userCredential.user);
    } catch (error) {
        console.error('Failed to send email verification:', error);
        throw error;
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


export const setNameForSignUp = (name: string) => {
    localStorage.setItem('nameForSignUp', name);
}

export const getNameForSignUp = (): string => {
    const name = localStorage.getItem('nameForSignUp');
    return name ? name : '';
}

export const clearNameForSignUp = () => {
    localStorage.removeItem('nameForSignUp');
}

export const setEmailForAuth = (email: string) => {
    localStorage.setItem('emailForAuth', email);
}

export const getEmailForAuth = (): string => {
    const email = localStorage.getItem('emailForAuth');
    return email ? email : '';
}

export const clearEmailForAuth = () => {
    localStorage.removeItem('emailForAuth');
}
