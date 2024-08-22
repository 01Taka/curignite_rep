import React, { useEffect, useState } from 'react';
import UserInitialSetupView, { InitialSetupFormState } from './InitialSetupView';
import { useNavigate } from 'react-router-dom';
import { getUniqueName, handleCreateUser } from './handleUserInitialSetup';
import { rootPaths } from '../../../../types/path/paths';
import { getAuth } from 'firebase/auth';
import { handleFormStateChange } from '../../../../functions/utils';

const InitialSetup: React.FC = () => {
  const navigate = useNavigate();
  const [uid, setUid] = useState<string | null>(null);
  const [isLoadingName, setIsLoadingName] = useState(true);
  const [formState, setFormState] = useState<InitialSetupFormState>({ username: "", birthday: null });
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUid(user.uid);
    } else {
      console.error("No user is logged in");
    }
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoadingName(true);
      const uniqueName = await getUniqueName(null);
      setFormState(prev => ({ ...prev, username: uniqueName }));
      setIsLoadingName(false);
    };

    if (uid) {
      initializeUser();
    }
  }, [uid]);

  const handleSubmit = async () => {
    if (!uid) return;
    if (!formState.birthday) {
      setError("生年月日が入力されていません。");
      return;
    }

    setSubmitDisabled(true);
    setError("");

    try {
      await handleCreateUser(uid, formState);
      navigate(rootPaths.main);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
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
      onFormStateChange={(e) => handleFormStateChange(e, setFormState)}
      onSubmit={handleSubmit}
    />
  );
};

export default InitialSetup;
