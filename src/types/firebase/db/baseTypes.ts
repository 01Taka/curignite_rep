import { DocumentData } from "firebase/firestore";

export interface DbData extends DocumentData {
    documentId: string;
}