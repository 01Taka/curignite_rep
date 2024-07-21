import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../../base";
import { Question } from "../../../../../types/firebase/db/qAndA/questionTypes";

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
