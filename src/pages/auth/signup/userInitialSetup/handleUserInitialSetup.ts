import { Timestamp } from "firebase/firestore";
import { getCurrentUser } from "../../../../firebase/auth/auth";
import { usersDB } from "../../../../firebase/db/dbs";
import { checkIfUserNameExists } from "../../../../firebase/db/app/user/userDBUtil";

export const errorHandling = async (
  username: string, birthday: Date,
) => {
  if (!username) {
    return new Error('ユーザ名を入力してください');
  }

  if (await checkIfUserNameExists(username)) {
    return new Error('このユーザ名は既に使用されています');
  }

  if (!birthday) {
    return new Error('生年月日を入力してください');
  }
};

export const processingCreateUser = async (
  username: string, birthday: Date,
) => {
  const error = await errorHandling(username, birthday);
  if (error) {
    throw error;
  }

  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) {
    throw new Error('ログインをしてください');
  }

  try {
    const user = await getCurrentUser();
    const uid = user?.uid;
    if (!uid) {
      throw new Error('ログインをしてください');
    }

    await usersDB.createUser(uid, username, [], Timestamp.fromDate(birthday));
  } catch (error) {
    throw error;
  }
};
