import React, { useState } from 'react'
import CreateAccountView from './CreateAccountView'
import { auth } from '../../../../firebase/firebase';
import { sendSignInLink } from '../../../../firebase/auth/sendSignInLink';

const CreateAccountPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleEmailSignUp = async () => {
    try {
      setError(''); // Clear any previous errors
      await sendSignInLink(email);
    } catch (e) {
      setError('Failed to send sign-in link. Please try again.');
    }
  };

  return (
    <CreateAccountView 
      name={name}
      email={email}
      password={password}
      error={error}
      onNameChange={(e) => setName(e.target.value)}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onEmailSignUp={handleEmailSignUp}
    />
  )
}

export default CreateAccountPage