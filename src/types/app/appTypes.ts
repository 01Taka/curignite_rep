import { Answer } from "../../firebase/db/app/QandA/answers/answers";
import { Question } from "../../firebase/db/app/QandA/questions/questions";
import { OrganizationExtendsUser } from "../../firebase/db/app/user/users";

export interface QuestionPost {
    studentInfo: OrganizationExtendsUser | null;
    question: Question;
}

export interface AnswerPost {
    studentInfo: OrganizationExtendsUser | null;
    answer: Answer;
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
