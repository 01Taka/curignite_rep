// import { DocumentData, QuerySnapshot } from 'firebase/firestore';
// import { getDataFirst, getSnapshotFirst } from '../../getData';
// import { StudentInfoDB } from '../studentInfo/studentInfo';

// const getUserSnapshot = async (type: string, value: string): Promise<QuerySnapshot> => {
//     return await getSnapshotFirst("users", type, value);
// }

// // ユーザー名の重複をチェックする関数
// export const checkIfUserNameTaken = async (username: string): Promise<boolean> => {
//     const querySnapshot = await getUserSnapshot('studentInfo.username', username);
//     return !querySnapshot.empty;
// }

// export const getUserData = async (uid: string): Promise<DocumentData | null> => {
//     const userData = await getDataFirst('users', 'uid', uid);
//     return userData;
// }

// export const getStudentInfo = async (uid: string): Promise<StudentInfoDB | null> => {
//     const userData = await getUserData(uid);

//     if (userData) {
//         return userData.studentInfo;
//     }
//     return null;
// }

// export const getStudentInfoWithUidDict = async (uidList: string[]): Promise<{ [uid: string]: StudentInfoDB | null }> => {  
//     const uniqueUidList: string[] = uidList.filter(uid => uid !== null && uid !== undefined);
//     const normUidList: string[] = [...new Set(uniqueUidList)];

//     const userDataDict: {[key: string]: StudentInfoDB} = {};

//     for(let uid of normUidList) {
//         const studentInfo = await getStudentInfo(uid);
//         if (studentInfo) {
//             userDataDict[uid] = studentInfo;
//         }
//     }

//     return userDataDict;
// }

// export const checkIfExistUidInDB = async (uid: string): Promise<boolean> => {
//     const snapshot = await getUserSnapshot('uid', uid);
//     return !snapshot.empty;
// }
