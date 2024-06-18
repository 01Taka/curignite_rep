import { DocumentData, addDoc, collection, doc, getDoc, updateDoc, deleteDoc, query, limit, getDocs, QueryConstraint } from "firebase/firestore";
import { db } from "../firebase";

interface DBSnapshot {
    id: string;
    data: DocumentData;
}

abstract class BaseDB {
    static dbPath: string;
    abstract id: string;

    abstract toFirestore(): DocumentData;

    // サブクラスでオーバーライドされる実装メソッド
    /*
    static fromFirestore(data: DocumentData, id: string): MyDB {
        const {  } = data;
        return new MyDB(, id);
    }

    static async getFromFirestore(id: string): Promise<MyDB | null> {
        const data = await this.getData(id);
        if (data) {
            return this.fromFirestore(data, id);
        }
        return null;
    }

    static async getAll(constraints: QueryConstraint[] = []): Promise<MyDB[]> {
        const snapshots = await this.getAllSnapshots(constraints);
        return snapshots.map(snapshot => this.fromFirestore(snapshot.data, snapshot.id));
    }
    */
   
    async addToFirestore(): Promise<void> {
        try {
            const data = this.toFirestore();
            const docRef = await addDoc(collection(db, (this.constructor as typeof BaseDB).dbPath), data);
            this.id = docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);
            throw new Error("Failed to add document");
        }
    }

    static async getData(id: string): Promise<DocumentData | null> {
        try {
            const docRef = doc(db, this.dbPath, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error getting document: ", error);
            return null;
        }
    }

    static async getAllSnapshots(constraints: QueryConstraint[] = [], limitNumber: number = 100): Promise<DBSnapshot[]> {
        try {
            const q = query(collection(db, this.dbPath), ...constraints, limit(limitNumber));
            const querySnapshots = await getDocs(q);

            return querySnapshots.docs.map(snapshot => ({
                data: snapshot.data(),
                id: snapshot.id
            }));
        } catch (error) {
            console.error("Error getting documents: ", error);
            throw new Error("Failed to get documents");
        }
    }

    async updateInFirestore(): Promise<void> {
        try {
            if (!this.id) throw new Error("ID is required to update document.");
            const docRef = doc(db, (this.constructor as typeof BaseDB).dbPath, this.id);
            const data = this.toFirestore();
            await updateDoc(docRef, data);
            console.log(`${this.id} updated`);
        } catch (error) {
            console.error("Error updating document: ", error);
            throw new Error("Failed to update document");
        }
    }

    static async deleteFromFirestore(id: string): Promise<void> {
        try {
            const docRef = doc(db, this.dbPath, id);
            await deleteDoc(docRef);
            console.log(`${id} deleted`);
        } catch (error) {
            console.error("Error deleting document: ", error);
            throw new Error("Failed to delete document");
        }
    }
}

export default BaseDB;
