import React, { useState } from 'react';
import CreateAccountView, { CreateAccountFormState } from './CreateAccountView';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../../../../firebase/auth/signUp';
import { handleFormStateChange } from '../../../../functions/utils';
import { authStorage } from '../../../../functions/browserStorage/localStorage/storages';
import { authPaths } from '../../../../types/path/authPaths';

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState<CreateAccountFormState>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleEmailSignUp = async () => {
    const username = formState.username;
    const email = formState.email;
    const password = formState.password;

    setSubmitDisabled(true);
    const result = await signUpWithEmail(email, password);
    setSubmitDisabled(false);
 
    if (!result.isSuccessful) {
      setError(result.errorMessage);
    } else {
      authStorage.setDataAllAtOnce({username, email, password});
      navigate(authPaths.accountEndpoint);
    }
  };

  return (
    <CreateAccountView 
      formState={formState}
      error={error}
      submitDisabled={submitDisabled}
      onFormStateChange={e => handleFormStateChange(e, setFormState)}
      onEmailSignUp={handleEmailSignUp}
    />
  );
};

export default CreateAccount;
