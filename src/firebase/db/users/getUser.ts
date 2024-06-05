import { QuerySnapshot, DocumentData, DocumentReference } from 'firebase/firestore';
import { UserDB } from './user';
import { getDataFirst, getRefFirst, getSnapshotFirst } from '../getData';

const getUserSnapshot = async (type: string, value: string): Promise<QuerySnapshot> => {
    return await getSnapshotFirst("users", type, value);
}

export const getUserRef = async (type: string, value: string): Promise<DocumentReference | null> => {
    return await getRefFirst('users', type, value);
}

// ユーザー名の重複をチェックする関数
export const isUsernameTaken = async (username: string): Promise<boolean> => {
    const querySnapshot = await getUserSnapshot('studentInfo.username', username);
    return !querySnapshot.empty;
}
