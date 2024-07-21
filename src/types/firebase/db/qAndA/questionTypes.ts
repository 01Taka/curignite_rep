import { Timestamp } from "firebase/firestore";
import { DbData } from "../baseTypes";

export interface Question extends DbData{
    title: string;
    content: string;
    authorUid: string;
    createdAt: Timestamp;
}

export const questionInitialState: Question = {
    documentId: "",
    title: "",
    content: "",
    authorUid: "",
    createdAt: Timestamp.fromDate(new Date(0)),
}