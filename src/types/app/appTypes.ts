import AnswerDB from "../../firebase/db/app/answers/answers";
import QuestionDB from "../../firebase/db/app/questions/question";
import { StudentInfoDB } from "../../firebase/db/auth/studentInfo/studentInfo";

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

export interface StudentInfoWithUid {
    uid: string;
    studentInfo: StudentInfoDB | null;
}

export interface QuestionPost {
    studentInfo: StudentInfoDB | null;
    question: QuestionDB;
}

export interface AnswerPost {
    studentInfo: StudentInfoDB | null;
    answer: AnswerDB;
}

export type AnonymousStatus =
    | "public"
    | "communityOnly"
    | "private"


export const defaultIconUrl = "https://firebasestorage.googleapis.com/v0/b/curignite-33bbc.appspot.com/o/userIcons%2Fdefault.png?alt=media&token=54c2c2e3-6335-4d41-9c32-cff2a730702c"


export type AuthStates =
    | "verified"
    | "noAffiliation"
    | "signingUp"
    | "new"
