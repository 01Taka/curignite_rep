// SignUpPage.tsx
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../firebase/firebase';
import SignUpView from './SignUpView';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed up with Google:', result.user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <SignUpView
      name={name}
      email={email}
      password={password}
      error={error}
      onNameChange={(e) => setName(e.target.value)}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onEmailSignUp={handleEmailSignUp}
      onGoogleSignUp={handleGoogleSignUp}
    />
  );
};

export default SignUpPage;
