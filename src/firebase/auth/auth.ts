import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthStates } from "../../types/util/stateTypes";
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
        const userData = await usersDB.read(uid);
        if (!userData) {
            return "noUserData";
        } else {
            return "verified";
        }
    } else {
        return "new";
    }
}
