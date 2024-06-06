import { getCurrentUser } from "../../../../firebase/auth/signIn";
import { getSchoolIdWithNameAndPassword } from "../../../../firebase/db/schools/validateSchools";
import { createStudentInfoDB } from "../../../../firebase/db/studentInfo/createStudentInfo";
import { addNewUser } from "../../../../firebase/db/users/addUser";
import { checkIfUsernameTaken } from "../../../../firebase/db/users/getUser";

export const errorHandling = async (
  username: string, grade: string, classNumber: string, schoolName: string, schoolPassword: string
) => {
  if (!username) {
    return new Error('ユーザ名を入力してください');
  }

  if (await checkIfUsernameTaken(username)) {
    return new Error('このユーザ名は既に使用されています');
  }

  if (!grade || !classNumber) {
    return new Error('学年とクラスを入力してください');
  }

  if (isNaN(Number(grade)) || isNaN(Number(classNumber))) {
    return new Error("学年とクラスは数値で入力してください。");
  }

  if (!schoolName) {
    return new Error('学校名を入力してください');
  }

  if (!schoolPassword) {
    return new Error('学校パスワードを入力してください');
  }
};

export const createUser = async (
  username: string, grade: string, classNumber: string, schoolName: string, schoolPassword: string
) => {
  const error = await errorHandling(username, grade, classNumber, schoolName, schoolPassword);
  if (error) {
    throw error;
  }

  const uid = getCurrentUser()?.uid;
  if (!uid) {
    throw new Error('ログインをしてください');
  }

  try {
    const schoolId = await getSchoolIdWithNameAndPassword(schoolName, schoolPassword);
    const studentInfo = await createStudentInfoDB(username, Number(grade), Number(classNumber), schoolId);
    
    await addNewUser(uid, studentInfo);
  } catch (error) {
    throw error;
  }
};
