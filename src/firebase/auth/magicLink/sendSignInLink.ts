// src/firebase/sendSignInLink.ts
import { auth } from '../../firebase';
import { sendSignInLinkToEmail } from "firebase/auth";
import { FirebaseError } from '@firebase/util';

const actionCodeSettings = {
    url: 'http://localhost:3000/create-account',
    handleCodeInApp: true,
    iOS: {
        bundleId: 'com.example.ios'
    },
    android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
    },
};

export const sendSignInLink = async (email: string) => {
    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        alert('Sign-in link sent!');
    } catch (error) {
        console.log(error);
        
        if (error instanceof FirebaseError) {
            console.error('Error sending email:', error.code, error.message);
        } else {
            console.error('Unknown error:', error);
        }
    }
};
