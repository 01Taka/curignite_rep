import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB, { DbData } from "../../../base";

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

class QuestionsDB extends BaseDB<Question> {
    constructor(firestore: Firestore) {
        super(firestore, "questions");
    }

    async createQuestions(title: string, content: string, authorUid: string, createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData>> {
        const data: Question = { documentId: "", title, content, authorUid, createdAt };
        return this.create(data);
    }
    
    async updateQuestions(documentId: string, title: string, content: string, authorUid: string, createdAt: Timestamp): Promise<void> {
        const data: Question = { documentId, title, content, authorUid, createdAt};
        return this.update(documentId, data);
    }
}

export default QuestionsDB;
