import React, { useState } from 'react';
import CreateAccountView from './CreateAccountView';
import { useNavigate } from 'react-router-dom';
import { setEmailForSignUp, setNameForSignUp, signUpWithEmail } from '../../../../firebase/auth/signUp';

const CreateAccountPage: React.FC = () => {
  const [name, setName] = useState('');
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
      setEmailForSignUp(email);
      setNameForSignUp(name);
      navigate('/create-account-endpoint')
    }
  };

  return (
    <CreateAccountView 
      name={name}
      email={email}
      password={password}
      error={error}
      submitDisabled={submitDisabled}
      onNameChange={(e) => setName(e.target.value)}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onEmailSignUp={handleEmailSignUp}
    />
  );
};

export default CreateAccountPage;
