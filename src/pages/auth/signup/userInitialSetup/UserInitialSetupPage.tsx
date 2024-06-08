import React, { useEffect, useState } from 'react';
import UserInitialSetupView from './UserInitialSetupView';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../../firebase/auth/signIn';
import { clearEmailForSignUp, getNameForSignUp } from '../../../../firebase/auth/signUp';
import { getUniqueUsername } from '../../../../firebase/util/generateUniqueUsername';
import { createUser } from './handleUserInitialSetup';

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
    const updateUserName = async () => {
      setIsLoadingName(true);
      const user = await getCurrentUser();
      let name = user?.displayName || getNameForSignUp();
      name = await getUniqueUsername(name);
      setFormData(prev => ({ ...prev, username: name }));
      setIsLoadingName(false);
    };
    updateUserName();
    clearEmailForSignUp();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSetStudentInfo = async () => {
    setSubmitDisabled(true);
    setError("");
    try {
      await createUser(
        formData.username,
        formData.grade,
        formData.classNumber,
        formData.schoolName,
        formData.schoolPassword
      );
      navigate('/home');
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
