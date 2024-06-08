import { NavigateFunction } from "react-router-dom";
import { verifyActionCode } from "../../../firebase/auth/signUp";

export const actionNavigation = (action: string, navigate: NavigateFunction) => {
    switch (action) {
        case 'resetPassword':
          navigate('/reset-password');
          break;
        case 'recoverEmail':
          // Display email recovery handler and UI.
          break;
        case 'verifyEmail':
          navigate('/user-initial-setup');
          break;
        default:
          console.error('Unknown action:', action);
      }
};
  

export const checkActionCode = async (actionCode: string | null, lang: string): Promise<boolean> => {
    if (!actionCode) {
        console.error('Failed to retrieve action code.');
        return false;
    }

    const result = await verifyActionCode(actionCode, lang);
    if (result.errorMessage) {
        console.error(result.errorMessage);
    }
    return result.isValid;
};