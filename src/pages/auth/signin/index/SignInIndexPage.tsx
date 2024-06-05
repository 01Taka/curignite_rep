import React, { useState } from 'react';
import { googleProvider } from '../../../../firebase/firebase';
import SignInIndexView from './SignInIndexView';
import { useNavigate } from 'react-router-dom';
import { signInWithProvider } from '../../../../firebase/auth/signIn';

const SignInPage: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/create-account');
  }

  const handleGoogleSignIn = async () => {
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

  const handleEmailSignIn = () => {
    navigate('/signin-email');
  }

  return (
    <SignInIndexView
      error={error}
      onGoogleSignIn={handleGoogleSignIn}
      onEmailSignIn={handleEmailSignIn}
    />
  );
};

export default SignInPage;
