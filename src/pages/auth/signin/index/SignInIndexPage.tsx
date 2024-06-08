import React, { useState } from 'react';
import { googleProvider } from '../../../../firebase/firebase';
import SignInIndexView from './SignInIndexView';
import { useNavigate } from 'react-router-dom';
import { signInWithProvider } from '../../../../firebase/auth/signIn';
import { setEmailForAuth } from '../../../../firebase/auth/signUp';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
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

  const handleEmailSignIn = () => {
    setEmailForAuth(email);
    navigate('/signin-email');
  }

  return (
    <SignInIndexView
      email={email}
      error={error}
      onEmailChange={(e) => setEmail(e.target.value)}
      onGoogleSignIn={handleGoogleSignIn}
      onEmailSignIn={handleEmailSignIn}
    />
  );
};

export default SignInPage;
