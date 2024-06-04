export {}
// import { updateData } from "../updateData";
// import { StudentInfoDB } from "./studentInfo";

// const setStudentInfo = async (type: string, value: string, studentInfoDB: StudentInfoDB) => {
//     try {
//         const studentInfo = studentInfoDB.toFirestore();
//         await updateData('users', type, value, studentInfo);
//     } catch (error) {
//         throw error;
//     }
// }

// export const setStudentInfoByEmail = async (email: string, displayName: string, grade: number, classNumber: number): Promise<String | null> => {
//     const studentInfo = new StudentInfoDB(displayName, grade, classNumber);
//     try {
//         await setStudentInfo('email', email, studentInfo);
//         return null;
//     } catch (error) {
//         if (error instanceof Error && error.message === '404') {
//             return `認証に使用したEmailが無効です。もう一度認証をしてください。Email: ${email}`;
//         }
//         return 'メールアドレスによる学生情報の設定中にエラーが発生しました';
//     }
// }

