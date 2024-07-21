import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../../base";
import { Answer } from "../../../../../types/firebase/db/qAndA/answerTypes";

class AnswersDB extends BaseDB<Answer> {
    constructor(firestore: Firestore) {
        super(firestore, "answers");
    }

    async createAnswers(questionId: string, content: string, authorUid: string, createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData>> {
        const data: Answer = { documentId: "", questionId, content, authorUid, createdAt };
        return this.create(data);
    }
    
    async updateAnswers(documentId: string, questionId: string, content: string, authorUid: string, createdAt: Timestamp): Promise<void> {
        const data: Answer = { documentId, questionId, content, authorUid, createdAt};
        return this.update(documentId, data);
    }
}

export default AnswersDB;
