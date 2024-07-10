import React, { useEffect, useState } from 'react';
import UserInitialSetupView from './UserInitialSetupView';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../../firebase/auth/auth';
import { createUser } from './handleUserInitialSetup';
import { checkIfExistUidInDB } from '../../../../firebase/db/auth/users/getUser';
import { getUserNameData } from '../../../../functions/localStorage/authData';
import { getUniqueUserName } from '../../../../firebase/util/getUniqueName';

const UserInitialSetupPage: React.FC = () => {
  const [isLoadingName, setIsLoadingName] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    grade: "",
    classNumber: "",
    schoolName: "",
    schoolPassword: "",
  });
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleCheckAuthStatus = async () => {
      const user = await getCurrentUser();
      const uid = user?.uid;
      if (!uid) {
        throw new Error('アカウントを作成してください');
      }
      else if (await checkIfExistUidInDB(uid)) {
        navigate('/main');
      }
    }
    const updateUserName = async () => {
      setIsLoadingName(true);
      const user = await getCurrentUser();
      let name = user?.displayName || getUserNameData();
      name = await getUniqueUserName(name);
      setFormData(prev => ({ ...prev, username: name }));
      setIsLoadingName(false);
    };
    const preprocessing = async () => {
      handleCheckAuthStatus();
      updateUserName();
    }
    preprocessing();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSetStudentInfo = async () => {
    setSubmitDisabled(true);
    setError("");
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('ログインをしてください');
      }

      await createUser(
        formData.username,
        formData.grade,
        formData.classNumber,
        formData.schoolName,
        formData.schoolPassword
      );
      
      navigate('/main');
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
      username={formData.username}
      grade={formData.grade}
      classNumber={formData.classNumber}
      schoolName={formData.schoolName}
      schoolPassword={formData.schoolPassword}
      submitDisabled={submitDisabled}
      error={error}
      onUserNameChange={handleChange}
      onClassNumberChange={handleChange}
      onGradeChange={handleChange}
      onSchoolNameChange={handleChange}
      onSchoolPasswordChange={handleChange}
      onSetUserInfo={handleSetStudentInfo}
    />
  );
};

export default UserInitialSetupPage;
