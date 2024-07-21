import React, { useEffect, useState } from 'react';
import UserInitialSetupView, { InitialSetupFormState } from './InitialSetupView';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../../firebase/auth/auth';
import { getUniqueUserName } from '../../../../firebase/util/getUniqueName';
import { checkIfUidExists } from '../../../../firebase/db/app/user/userDBUtil';
import { authStorage } from '../../../../functions/localStorage/handleData';
import { processingCreateUser } from './handleUserInitialSetup';
import { handleFormStateChange } from '../../../../functions/utils';
import { rootPaths } from '../../../../types/path/appPaths';

const InitialSetup: React.FC = () => {
  const navigate = useNavigate();

  const [isLoadingName, setIsLoadingName] = useState(true);
  const [formState, setFormState] = useState<InitialSetupFormState>({
    username: "",
    birthday: new Date(),
  });
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 認証状態に応じてリダイレクト
    const handleCheckAuthStatus = async () => {
      const user = await getCurrentUser();
      const uid = user?.uid;
      if (!uid) {
        navigate(rootPaths.top);
      } else if (await checkIfUidExists(uid)) {
        navigate(rootPaths.main);
      }
    }
    // ユーザー名を一意なものに置き換える
    const updateUserName = async () => {
      setIsLoadingName(true);
      const user = await getCurrentUser();
      let name = user?.displayName || authStorage.getData('username') || "";
      name = await getUniqueUserName(name);
      setFormState(prev => ({ ...prev, username: name }));
      setIsLoadingName(false);
    };
    const preprocessing = async () => {
      handleCheckAuthStatus();
      updateUserName();
    }
    preprocessing();
  }, [navigate]);

  const handleCreateUser = async () => {
    setSubmitDisabled(true);
    setError("");
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('ログインをしてください');
      }

      await processingCreateUser(formState.username, formState.birthday);
      
      navigate(rootPaths.main);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setSubmitDisabled(false);
    }
  };

  const handleBirthdayChange = (
    value: Date | null,
  ) => {
    if (value) {
      setFormState(prev => ({ ...prev, birthday: value }));
    }
  };

  return (
    <UserInitialSetupView
      isLoading={isLoadingName}
      formState={formState}
      submitDisabled={submitDisabled}
      error={error}
      onFormStateChange={e => handleFormStateChange(e, setFormState)}
      onBirthdayChange={handleBirthdayChange}
      onSetUserInfo={handleCreateUser}
    />
  );
};

export default InitialSetup;
