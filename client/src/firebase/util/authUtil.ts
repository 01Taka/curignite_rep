import { UserCredential } from "firebase/auth";

// ユーザーが新規か既存かを判断する関数
export const checkIfNewUser = (userCredential: UserCredential): boolean => {
    const user = userCredential.user;
    const creationTime = user.metadata.creationTime;
    return creationTime === user.metadata.lastSignInTime;
};