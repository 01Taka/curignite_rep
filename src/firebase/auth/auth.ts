import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthStates } from "../../types/app/appTypes";
import { validateSchoolId } from "../db/auth/schools/validateSchools";
import { usersDB } from "../db/dbs";

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
        const organizationExtendsUser = await usersDB.readOrganizationByUid(uid);
        if (!organizationExtendsUser) {
            return "signingUp";
        } else {
            if (organizationExtendsUser.schoolId) {
                try {
                    await validateSchoolId(organizationExtendsUser.schoolId);
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
