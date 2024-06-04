import { applyActionCode } from "firebase/auth"
import { auth } from "../firebase"

export const checkActionCode = async (actionCode: string | null, email: string): Promise<string> => {
    if (actionCode) {
        await applyActionCode(auth, actionCode).then(res => {
            sessionStorage.setItem('validEmail', email);
            return "";
        }).catch((error => {
            console.error(error);
            return "無効なURLです。";
        }))
    }
    return "無効なURLです。";
}

