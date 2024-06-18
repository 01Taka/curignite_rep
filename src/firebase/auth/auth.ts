import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { getStudentInfo } from "../db/auth/users/getUser";
import { AuthStates } from "../../types/app/appTypes";
import { validateSchoolId } from "../db/auth/schools/validateSchools";

export const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe(); // リスナーを解除して、一度だけ実行
        resolve(user);
      }, reject);
    });
};


export const  getUserAuthState = async (): Promise<AuthStates> => {
    const user = await getCurrentUser();
    if (user) {
        const uid = user.uid;
        const studentInfo = await getStudentInfo(uid);
        if (!studentInfo) {
            return "signingUp";
        } else {
            if (studentInfo.schoolId) {
                try {
                    await validateSchoolId(studentInfo.schoolId);
                    return "verified";
                } catch (error) {
                    console.error(error);
                }
            }
            return "noAffiliation";
        }
    } else {
        return "new";
    }
}
