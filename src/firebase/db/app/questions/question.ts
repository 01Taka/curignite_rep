import { DocumentData, QueryConstraint, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";

class QuestionDB extends BaseDB {
    id: string;
    title: string;
    content: string;
    authorUid: string;
    createdAt: Timestamp;

    static dbPath = "questions";

    constructor(title: string, content: string, authorUid: string, createdAt: Timestamp = Timestamp.now(), id: string = "") {
        super();
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorUid = authorUid;
        this.createdAt = createdAt;
    }

    toFirestore(): DocumentData {
        return {
            title: this.title,
            content: this.content,
            authorUid: this.authorUid,
            createdAt: this.createdAt,
        };
    }

    static fromFirestore(data: DocumentData, id: string): QuestionDB {
        const { title, content, authorUid, createdAt } = data;
        return new QuestionDB(title, content, authorUid, createdAt, id);
    }

    static async getFromFirestore(id: string): Promise<QuestionDB | null> {
        const data = await this.getData(id);
        if (data) {
            return this.fromFirestore(data, id);
        }
        return null;
    }

    static async getAll(constraints: QueryConstraint[] = []): Promise<QuestionDB[]> {
        const snapshots = await this.getAllSnapshots(constraints);
        return snapshots.map(snapshot => this.fromFirestore(snapshot.data, snapshot.id));
    }
}

export default QuestionDB;
