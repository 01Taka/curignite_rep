import { auth } from '../firebase';
import { fetchSignInMethodsForEmail, EmailAuthProvider } from "firebase/auth";
import { FirebaseError } from '@firebase/util';

export const checkSignInMethod = async (email: string): Promise<string> => {
    try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.includes(EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)) {
            return 'User can sign in with email/password.';
        }
        if (signInMethods.includes(EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD)) {
            return 'User can sign in with email/link.';
        }
        return 'No sign-in methods available for this email.';
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.error('Error fetching sign-in methods:', error.code, error.message);
        } else {
            console.error('Unknown error:', error);
        }
        return 'Error fetching sign-in methods.';
    }
};
