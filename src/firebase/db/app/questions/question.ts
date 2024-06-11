import { DocumentData, addDoc, collection, doc, getDoc, updateDoc, deleteDoc, query, limit, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";

export class QuestionDB {
    title: string;
    content: string;
    authorUid: string;
    createdAt: Timestamp;
    id: string;

    constructor (title: string, content: string, authorUid: string, createdAt: Timestamp = Timestamp.now(), id: string = "") {
        this.title = title;
        this.content = content;
        this.authorUid = authorUid;
        this.createdAt = createdAt;
        this.id = id;
    }

    toFirestore(): DocumentData {
        return {
            title: this.title,
            content: this.content,
            authorUid: this.authorUid,
            createdAt: this.createdAt,
        }
    }

    static fromFirestore(data: DocumentData, id: string): QuestionDB {
        const { title, content, authorUid, createdAt } = data;
        return new QuestionDB(title, content, authorUid, createdAt, id);
    }

    async addToFirestore(): Promise<void> {
        try {
            const data = this.toFirestore();
            const docRef = await addDoc(collection(db, "questions"), data);
            this.id = docRef.id;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    static async getFromFirestore(id: string): Promise<QuestionDB | null> {
        try {
            const docRef = doc(db, "questions", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return QuestionDB.fromFirestore(data, id);
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error getting question: ", error);
            return null;
        }
    }

    static async getAll() {
        try {
            const q = query(collection(db, 'questions'), limit(100));
            const querySnapshots = await getDocs(q);

            // ドキュメントのデータを処理し、QuestionDB インスタンスの配列にマッピングする
            const questions: QuestionDB[] = querySnapshots.docs.map(snapshot => {
                const data = snapshot.data();
                return QuestionDB.fromFirestore(data, snapshot.id);
            });

            return questions;
        } catch (error) {
            console.error("Error getting documents: ", error);
            throw error;
        }
    }

    async updateInFirestore(): Promise<void> {
        try {
            if (!this.id) throw new Error("ID is required to update document.");
            const docRef = doc(db, "questions", this.id);
            const data = this.toFirestore();
            await updateDoc(docRef, data);
            console.log(`Question with ID: ${this.id} updated`);
        } catch (error) {
            console.error("Error updating question: ", error);
        }
    }

    static async deleteFromFirestore(id: string): Promise<void> {
        try {
            const docRef = doc(db, "questions", id);
            await deleteDoc(docRef);
            console.log(`Question with ID: ${id} deleted`);
        } catch (error) {
            console.error("Error deleting question: ", error);
        }
    }
}
