import { auth } from '../firebase';
import { signOut } from "firebase/auth";
import { FirebaseError } from '@firebase/util';

export const signOutUser = async () => {
    try {
        await signOut(auth);
        alert('Sign-out successful.');
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.error('Error signing out:', error.code, error.message);
        } else {
            console.error('Unknown error:', error);
        }
    }
};
