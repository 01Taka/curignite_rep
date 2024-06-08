// errorMessages.ts
import { FirebaseError } from 'firebase/app';
import { Languages } from '../../types/app/languages';

const errorMessages: Record<string, Record<string, string>> = {
  en: {
    'auth/email-already-in-use': 'The email address is already in use by another account.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'The password is too weak.',
    'auth/user-disabled': 'The user account has been disabled by an administrator.',
    'auth/user-not-found': 'There is no user record corresponding to this email.',
    'auth/wrong-password': 'The password is invalid.',
    'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
    'auth/invalid-credential': 'The provided credential is invalid. Please try again with valid credentials.',
    'auth/invalid-action-code': 'Access was via an invalid email.',
    'auth/missing-password': 'Passwords do not match.',
    default: 'An unknown error occurred.',
  },
  ja: {
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています。',
    'auth/invalid-email': 'メールアドレスが無効です。',
    'auth/operation-not-allowed': 'メール/パスワードアカウントは有効になっていません。',
    'auth/weak-password': 'パスワードが弱すぎます。',
    'auth/user-disabled': 'ユーザーアカウントが管理者によって無効にされています。',
    'auth/user-not-found': 'このメールに対応するユーザーが見つかりません。',
    'auth/wrong-password': 'パスワードが無効です。',
    'auth/too-many-requests': 'ログイン試行が多すぎます。後でもう一度お試しください。',
    'auth/invalid-credential': '提供された情報が無効です。',
    'auth/invalid-action-code': '無効なメールからアクセスされました。',
    'auth/missing-password': 'パスワードが一致しません',
    default: '不明なエラーが発生しました。',
  }
  // 他の言語も追加可能
};

export const getAuthErrorMessage = (errorCode: FirebaseError, language: Languages = 'ja'): string => {
  const messages = errorMessages[language];
  return messages && messages[errorCode.code];
};
