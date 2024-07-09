import { DocumentData, DocumentReference, QueryConstraint, Timestamp } from "firebase/firestore";
import BaseDB, { DbData } from "../../../base";

export interface Questions extends DbData{
    title: string;
    content: string;
    authorUid: string;
    createdAt: Timestamp;
}

class QuestionsDB extends BaseDB<Questions> {
    constructor() {
        super("questions");
    }

    async createQuestions(title: string, content: string, authorUid: string, createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData>> {
        const data: Questions = { documentId: "", title, content, authorUid, createdAt };
        return this.create(data);
    }
    
    async updateQuestions(documentId: string, title: string, content: string, authorUid: string, createdAt: Timestamp): Promise<void> {
        const data: Questions = { documentId, title, content, authorUid, createdAt};
        return this.update(data);
    }
}

export default QuestionsDB;
