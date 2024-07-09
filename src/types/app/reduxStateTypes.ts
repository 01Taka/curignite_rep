import { UsersDB } from "../../firebase/db/app/user/users";
import { AuthStates } from "./appTypes";

export interface StudentDataState {
    authState: AuthStates;
    uid: string;
    iconUrl: string;
    name: string;
    grade: number;
    classNumber: number;
    joinedAt: number;
    signUpCompleted: boolean;
}

export interface UserDataState {
    userData: UsersDB | null;
}