import { QuerySnapshot, DocumentData, DocumentReference } from 'firebase/firestore';
import { getSnapshotFirst } from '../getData';

const getUserSnapshot = async (type: string, value: string): Promise<QuerySnapshot> => {
    return await getSnapshotFirst("users", type, value);
}

// ユーザー名の重複をチェックする関数
export const checkIfUsernameTaken = async (username: string): Promise<boolean> => {
    const querySnapshot = await getUserSnapshot('studentInfo.username', username);
    return !querySnapshot.empty;
}

export const checkIfExistUidInDB = async (uid: string): Promise<boolean> => {
    const snapshot = await getUserSnapshot('uid', uid);
    return !snapshot.empty;
}
