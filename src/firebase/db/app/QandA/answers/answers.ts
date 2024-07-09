import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import BaseDB, { DbData } from "../../../base";

export interface Answers extends DbData {
    questionId: string;
    content: string;
    authorUid: string;
    createdAt: Timestamp;
}

class AnswersDB extends BaseDB<Answers> {
    constructor() {
        super("answers");
    }

    async createAnswers(questionId: string, content: string, authorUid: string, createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData>> {
        const data: Answers = { documentId: "", questionId, content, authorUid, createdAt };
        return this.create(data);
    }
    
    async updateAnswers(documentId: string, questionId: string, content: string, authorUid: string, createdAt: Timestamp): Promise<void> {
        const data: Answers = { documentId, questionId, content, authorUid, createdAt};
        return this.update(data);
    }
}

export default AnswersDB;
