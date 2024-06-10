import React, { useState } from 'react';
import CreateAccountView from './CreateAccountView';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../../../../firebase/auth/signUp';
import { setAuthData } from '../../../../functions/localStorage/authData';

const CreateAccountPage: React.FC = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const navigate = useNavigate();

  const handleEmailSignUp = async () => {
    setSubmitDisabled(true);
    const result = await signUpWithEmail(email, password);
    setSubmitDisabled(false);
 
    if (!result.isSuccessful) {
      setError(result.errorMessage);
    } else {
      setAuthData(username, email, password);
      navigate('/create-account-endpoint')
    }
  };

  return (
    <CreateAccountView 
      username={username}
      email={email}
      password={password}
      error={error}
      submitDisabled={submitDisabled}
      onUserNameChange={(e) => setUserName(e.target.value)}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onEmailSignUp={handleEmailSignUp}
    />
  );
};

export default CreateAccountPage;
