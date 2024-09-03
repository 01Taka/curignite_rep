import React, { useState } from 'react';
import { googleProvider } from '../../../../firebase/firebase';
import SignInIndexView from './SignInIndexView';
import { useNavigate } from 'react-router-dom';
import { signInWithProvider } from '../../../../firebase/auth/signIn';
import { authStorage } from '../../../../functions/browserStorage/localStorage/storages';
import { authPaths } from '../../../../types/path/authPaths';
import { rootPaths } from '../../../../types/path/paths';

const SignInIndex: React.FC = () => {
  const [email, setEmailState] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const isNewUser = await signInWithProvider(googleProvider);
      if (isNewUser) {
        navigate(authPaths.initialSetup);
      } else {
        navigate(rootPaths.main);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  const handleEmailSignIn = () => {
    authStorage.setData('email', email);
    navigate(authPaths.emailSignIn);
  }

  return (
    <SignInIndexView
      email={email}
      error={error}
      onEmailChange={(e) => setEmailState(e.target.value)}
      onGoogleSignIn={handleGoogleSignIn}
      onEmailSignIn={handleEmailSignIn}
    />
  );
};

export default SignInIndex;
