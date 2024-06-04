import React, { useState } from 'react'
import SignInView from './SignInView';
import { signInWithProvider } from '../../../firebase/auth/signInAccount';
import { googleProvider } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSignIn = async () => {
    const { error, registeredUser } = await signInWithProvider(googleProvider);
    if (error !== null) {
      setError(error);
    } else if (registeredUser) {
      navigate('/home');
    } else {
      // 未登録の場合、初期設定ページに移動
      navigate('/user-initial-setup');
    }
  }
  
  return (
    <SignInView 
    email={email}
    password={password}
    error={error}
    onEmailChange={(e) => setEmail(e.target.value)}
    onPasswordChange={(e) => setPassword(e.target.value)}
    onEmailSignIn={handleEmailSignIn}
    />
  )
}

export default SignInPage;