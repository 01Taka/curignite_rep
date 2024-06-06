// SignUpPage.tsx
import React, { useState } from 'react';
import { googleProvider } from '../../../../firebase/firebase';
import SignUpIndexView from './SignUpIndexView';
import { useNavigate } from 'react-router-dom';
import { signInWithProvider } from '../../../../firebase/auth/signIn';

const SignUpPage: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/create-account');
  }

  const handleGoogleSignUp = async () => {
    try {
      const isNewUser = await signInWithProvider(googleProvider);
      if (isNewUser) {
        navigate('/user-initial-setup');
      } else {
        navigate('/home');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  const handleSignIn = () => {
    navigate('/signin');
  }

  return (
    <SignUpIndexView
      error={error}
      onCreateAccount={handleCreateAccount}
      onGoogleSignUp={handleGoogleSignUp}
      onSignIn={handleSignIn}
    />
  );
};

export default SignUpPage;
