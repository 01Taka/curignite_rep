// AuthIndex.tsx
import React, { useState } from 'react';
import { googleProvider } from '../../../firebase/firebase';
import AuthIndexView from './AuthIndexView';
import { useNavigate } from 'react-router-dom';
import { signInWithProvider } from '../../../firebase/auth/signIn';
import { authPaths } from '../../../types/path/authPaths';
import { rootPaths } from '../../../types/path/paths';

const AuthIndex: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate(authPaths.createAccount);
  }

  const handleGoogleSignUp = async () => {
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

  const handleSignIn = () => {
    navigate(authPaths.signIn);
  }

  return (
    <AuthIndexView
      error={error}
      onCreateAccount={handleCreateAccount}
      onGoogleSignUp={handleGoogleSignUp}
      onSignIn={handleSignIn}
    />
  );
};

export default AuthIndex;
