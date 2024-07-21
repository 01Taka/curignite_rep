import { Timestamp } from "firebase/firestore";
import { DbData } from "../baseTypes";

export interface Answer extends DbData {
    questionId: string;
    content: string;
    authorUid: string;
    createdAt: Timestamp;
}
