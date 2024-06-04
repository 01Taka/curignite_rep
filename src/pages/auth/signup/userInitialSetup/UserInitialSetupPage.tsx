import React, { useEffect, useState } from 'react';
import UserInitialSetupView from './UserInitialSetupView';
import { isUsernameTaken } from '../../../../firebase/db/users/getUser';
import { validateSchool } from '../../../../firebase/db/schools/validateSchools';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../../firebase/auth/signIn';
import { clearEmailForSignUp, getNameForSignUp } from '../../../../firebase/auth/signUp';
import { getUniqueUsername } from '../../../../firebase/util/generateUniqueUsername';
import { createStudentInfoDB } from '../../../../firebase/db/studentInfo/createStudentInfo';
import { addNewUser } from '../../../../firebase/db/users/addUser';

const UserInitialSetupPage: React.FC = () => {
  const [isLoadingName, setIsLoadingName] = useState(true);
  const [userName, setUserName] = useState("");
  const [grade, setGrade] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolPassword, setSchoolPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateUserName = async () => {
      setIsLoadingName(true);
      const user = getCurrentUser();
      let name = user?.displayName || getNameForSignUp();
      name = await getUniqueUsername(name);
      setUserName(name);
      setIsLoadingName(false);
    };
    updateUserName();
    clearEmailForSignUp();
  }, []);

  const setErrorMessage = (message: string) => {
    setError(message);
    setSubmitDisabled(false);
  };

  const handleSchoolValidate = async (): Promise<boolean> => {
    if (!schoolName || !schoolPassword) {
      setErrorMessage(schoolName ? "パスワードを入力してください。" : "学校名を入力してください。");
      return false;
    }

    try {
      const id = await validateSchool(schoolName, schoolPassword);
      if (id) {
        setSchoolId(id);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "学校の検証に失敗しました。");
      return false;
    }
  };

  const handleValidate = async (): Promise<boolean> => {
    if (!userName || !grade || !classNumber) {
      setErrorMessage(!userName ? "ユーザー名を入力してください。" : "学年とクラスを入力してください。");
      return false;
    }

    if (await isUsernameTaken(userName)) {
      setErrorMessage("このユーザー名は既に使用されています。");
      return false;
    }

    if (isNaN(Number(grade)) || isNaN(Number(classNumber))) {
      setErrorMessage("学年とクラスは数値で入力してください。");
      return false;
    }

    return await handleSchoolValidate();
  };

  const handleCreateStudentInfo = async () => {
    try {
      const studentInfo = await createStudentInfoDB(userName, Number(grade), Number(classNumber), schoolId);
      if (studentInfo) {
        return studentInfo;
      }
      setErrorMessage("学生情報の作成に失敗しました。");
      return null;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "学生情報の作成に失敗しました。");
      return null;
    }
  };

  const handleCreateUser = async () => {
    const studentInfo = await handleCreateStudentInfo();
    if (!studentInfo) return;

    const uid = getCurrentUser()?.uid;
    if (!uid) {
      setErrorMessage("ログインができていません。");
      return;
    }

    try {
      await addNewUser(uid, studentInfo);
      navigate('/home');  // 成功したらホームページに移動
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "ユーザーの作成に失敗しました。");
    }
  };

  const handleSetStudentInfo = async () => {
    setSubmitDisabled(true);
    setError("");

    const isValid = await handleValidate();
    if (isValid) {
      await handleCreateUser();
    }

    setSubmitDisabled(false);
  };

  return (
    <UserInitialSetupView
      isLoading={isLoadingName}
      username={userName}
      grade={grade}
      classNumber={classNumber}
      schoolName={schoolName}
      schoolPassword={schoolPassword}
      submitDisabled={submitDisabled}
      error={error}
      onUserNameChange={(e) => setUserName(e.target.value)}
      onClassNumberChange={(e) => setClassNumber(e.target.value)}
      onGradeChange={(e) => setGrade(e.target.value)}
      onSchoolNameChange={(e) => setSchoolName(e.target.value)}
      onSchoolPasswordChange={(e) => setSchoolPassword(e.target.value)}
      onSetUserInfo={handleSetStudentInfo}
    />
  );
};

export default UserInitialSetupPage;
