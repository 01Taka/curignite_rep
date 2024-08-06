import { FirebaseError } from "firebase/app";
import { getAuthErrorMessage } from "../../functions/error/firebaseErrorMessages";
type Languages = "ja" | "en";

export const throwFirebaseError = (error: any, language: Languages, logging: boolean = true): string => {
    if (error instanceof FirebaseError) {
      const errorMessage = getAuthErrorMessage(error, language);

      if (!errorMessage) {
          console.error('対応するエラーコードがありません。', error.code);
          return 'An unexpected error occurred.';
      }

      if (logging) {
          console.log(errorMessage);
      }

      return errorMessage;
    } else {
      console.error('Unexpected error:', error);
      return error;
    }
}