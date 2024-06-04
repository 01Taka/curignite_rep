import { auth } from '../../firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { FirebaseError } from '@firebase/util';

export const completeSignIn = async (url: string) => {
    if (isSignInWithEmailLink(auth, url)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please provide your email for confirmation') || '';
        }
        try {
            await signInWithEmailLink(auth, email, url);
                window.localStorage.removeItem('emailForSignIn');
                alert('Successfully signed in!');
            } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error signing in:', error.code, error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    }
};
