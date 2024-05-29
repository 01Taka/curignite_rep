// SignUpPage.tsx
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../../firebase/firebase';
import SignUpIndexView from './SignUpIndexView';

const SignUpPage: React.FC = () => {
  const [error, setError] = useState('');


  const handleCreateAccount = () => {

  }

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed up with Google:', result.user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <SignUpIndexView
      error={error}
      onCreateAccount={handleCreateAccount}
      onGoogleSignUp={handleGoogleSignUp}
    />
  );
};

export default SignUpPage;
