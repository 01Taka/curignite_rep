export {}

// import { FirebaseError } from 'firebase/app';
// import { auth } from '../../firebase/firebase';  // Firestoreをインポート
// import { AuthProvider, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, UserCredential } from 'firebase/auth';
// import { checkIfNewUser } from '../util/authUtil';
// import { addNewUser } from '../db/users/addUser';

// interface CreateAccountResult {
//     error: string | null;
//     registeredUser: boolean;
// }

// // エラーメッセージのオブジェクト
// const errorMessages: Record<string, string> = {
//     'default': 'アカウント作成中にエラーが発生しました。もう一度お試しください。',
//     'auth/email-already-in-use': 'このメールアドレスは既に使用されています。',
//     'auth/invalid-email': '無効なメールアドレスです。',
//     'auth/weak-password': 'パスワードが弱すぎます。もう一度お試しください。',
// };

// // 共通のエラーハンドリング関数
// const handleFirebaseError = (error: FirebaseError): string => {
//     return errorMessages[error.code] || errorMessages['default'];
// }

// // Firestoreにユーザーデータを追加
// const addUserToDatabase = async (uid: string, email: string, displayName: string) => {
//     // ユーザー初期設定用の一時的な名前を保存
//     localStorage.setItem('emailForSignIn', email);
    
//     await addNewUser(uid, email, displayName);
// }

// // Emailでのユーザーの作成時に行う処理
// const handleUserCreation = async (userCredential: UserCredential, username: string): Promise<string | null> => {
//     const user = userCredential.user;
//     if (user.email === null) {
//         return 'emailが取得できませんでした。';
//     }
//     await sendEmailVerification(user);
//     // データベースへの追加を待たずに次の処理に移る
//     addUserToDatabase(user.uid, user.email, username);
//     console.log('アカウントが正常に作成されました。確認メールが送信されました。');
//     return null;
// };

// // ユーザーアカウントの作成
// export const createAccountWithEmail = async (email: string, password: string, username: string): Promise<CreateAccountResult> => {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const error = await handleUserCreation(userCredential, username);
//         return { error: error, registeredUser: false };
//     } catch (error) {
//         if (error instanceof FirebaseError) {
//             return { error: handleFirebaseError(error), registeredUser: false };
//         }
//         return { error: '予期しないエラーが発生しました。', registeredUser: false };
//     }
// };

// // 外部プロバイダーを使用したユーザーアカウントの作成
// export const createAccountWithProvider = async (provider: AuthProvider): Promise<CreateAccountResult> => {
//     try {
//         const result = await signInWithPopup(auth, provider);
//         const user = result.user;
//         if (user.email === null || user.displayName === null) {
//             return { error: errorMessages.default, registeredUser: false };
//         } else {
//             const isNew = checkIfNewUser(result);
//             if (isNew) {
//                 await addUserToDatabase(user.uid, user.email, user.displayName); // 新規ユーザーの場合のみデータベースに追加
//             }
//             return { error: null, registeredUser: !isNew };
//         }
//     } catch (error) {
//         if (error instanceof FirebaseError) {
//             return { error: handleFirebaseError(error), registeredUser: false };
//         }
//         return { error: '予期しないエラーが発生しました。', registeredUser: false };
//     }
// };
