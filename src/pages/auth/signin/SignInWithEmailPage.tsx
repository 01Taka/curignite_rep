import React, { useEffect, useState } from 'react'
import SignInView from './SignInWithEmailView';
import { useNavigate } from 'react-router-dom';
import { getEmailForAuth, setEmailForAuth } from '../../../firebase/auth/signUp';
import { signInWithEmail } from '../../../firebase/auth/signIn';

const SignInWithEmailPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(getEmailForAuth());
  }, []);

  const handleEmailSignIn = async () => {
    setEmailForAuth(email);
    setSubmitDisabled(true);
    setError('');
    try {
      await signInWithEmail(email, password);
      navigate('/home');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    setSubmitDisabled(false);
  }
  
  return (
    <SignInView 
    email={email}
    password={password}
    error={error}
    submitDisabled={submitDisabled}
    onEmailChange={(e) => setEmail(e.target.value)}
    onPasswordChange={(e) => setPassword(e.target.value)}
    onEmailSignIn={handleEmailSignIn}
    />
  )
}

export default SignInWithEmailPage;