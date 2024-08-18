import React, { useEffect, useState } from 'react';
import UserInitialSetupView, { InitialSetupFormState } from './InitialSetupView';
import { useNavigate } from 'react-router-dom';
import { getUniqueName, handleCreateUser } from './handleUserInitialSetup';
import { handleFormStateChange } from '../../../../functions/utils';
import { rootPaths } from '../../../../types/path/paths';
import { getAuth } from 'firebase/auth';

const InitialSetup: React.FC = () => {
  const navigate = useNavigate();

  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUid(user.uid);
    } else {
      console.error("No user is logged in");
    }
  }, []);

  const [isLoadingName, setIsLoadingName] = useState(true);
  const [formState, setFormState] = useState<InitialSetupFormState>({
    username: "",
    birthday: new Date(),
  });
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // ユーザー名を一意なものに置き換える
    const updateUserName = async () => {
      setIsLoadingName(true);
      const uniqueName = await getUniqueName(null);
      setFormState(prev => ({...prev, username: uniqueName}));
      setIsLoadingName(false);
    };

    const preprocessing = async () => {
      // await navigateByAuthState(uid, navigate);
      await updateUserName();
    }

    preprocessing();
  }, [navigate, uid]);

  const createUserProcessing = async () => {
    if (!uid) {
      return;
    }
    
    setSubmitDisabled(true);
    setError("");
    try {
      await handleCreateUser(uid, formState);
      navigate(rootPaths.main);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setSubmitDisabled(false);
    }
  };
  
  return (
    <UserInitialSetupView
      isLoading={isLoadingName}
      formState={formState}
      submitDisabled={submitDisabled}
      error={error}
      onFormStateChange={e => handleFormStateChange(e, setFormState)}
      onSetUserData={createUserProcessing}
    />
  );
};

export default InitialSetup;
