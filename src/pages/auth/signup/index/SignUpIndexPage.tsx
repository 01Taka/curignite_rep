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
    const result =  await signInWithProvider(googleProvider);

    if (result.errorMessage) {
      setError(result.errorMessage);
    } else if (result.isNewUser) {
      navigate('/user-initial-setup');
    } else {
      // 登録済みの場合、アプリのホームページに移動
      navigate('/home');
    }
  };

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
