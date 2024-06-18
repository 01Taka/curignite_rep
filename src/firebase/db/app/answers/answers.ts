import { DocumentData, QueryConstraint, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";

class AnswerDB extends BaseDB {
    id: string;
    questionId: string;
    content: string;
    authorUid: string;
    createdAt: Timestamp;

    static dbPath = "answers";

    constructor(questionId: string, content: string, authorUid: string, createdAt: Timestamp = Timestamp.now(), id: string = "") {
        super();
        this.questionId = questionId;
        this.id = id;
        this.content = content;
        this.authorUid = authorUid;
        this.createdAt = createdAt;
    }

    toFirestore(): DocumentData {
        return {
            questionId: this.questionId,
            content: this.content,
            authorUid: this.authorUid,
            createdAt: this.createdAt,
        };
    }

    static fromFirestore(data: DocumentData, id: string): AnswerDB {
        const { questionId, content, authorUid, createdAt } = data;
        return new AnswerDB(questionId, content, authorUid, createdAt, id);
    }

    static async getFromFirestore(id: string): Promise<AnswerDB | null> {
        const data = await this.getData(id);
        if (data) {
            return this.fromFirestore(data, id);
        }
        return null;
    }

    static async getAll(constraints: QueryConstraint[] = []): Promise<AnswerDB[]> {
        const snapshots = await this.getAllSnapshots(constraints);
        return snapshots.map(snapshot => this.fromFirestore(snapshot.data, snapshot.id));
    }
}

export default AnswerDB;
