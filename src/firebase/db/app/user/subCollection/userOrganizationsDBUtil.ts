import { UserOrganizationData } from "../../../../../types/firebase/db/user/usersTypes";
import { db } from "../../../../firebase";
import UserOrganizationsDB from "./userOrganizations";

const getUserOrganizationsDBInstance = (uid: string): UserOrganizationsDB => {
    return new UserOrganizationsDB(db, uid);
}

export const readUserOrganizationByUid = async (uid: string): Promise<UserOrganizationData | null> => {
    return await getUserOrganizationsDBInstance(uid).getFirstMatch('uid', uid);
}