import React, { useEffect, useState } from 'react'
import SignInView from './SignInWithEmailView';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../../../firebase/auth/signIn';
import { getEmailData, setEmailData } from '../../../functions/storage/authData';

const SignInWithEmailPage: React.FC = () => {
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setEmailState(getEmailData());
  }, []);

  const handleEmailSignIn = async () => {
    setEmailData(email)
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
    onEmailChange={(e) => setEmailState(e.target.value)}
    onPasswordChange={(e) => setPassword(e.target.value)}
    onEmailSignIn={handleEmailSignIn}
    />
  )
}

export default SignInWithEmailPage;