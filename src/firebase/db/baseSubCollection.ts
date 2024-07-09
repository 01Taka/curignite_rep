// import { DocumentData, addDoc, collection, doc, getDoc, updateDoc, deleteDoc, query, limit, getDocs, QueryConstraint } from "firebase/firestore";
// import { db } from "../firebase";
// import { DBSnapshot } from "./base"; // ベースクラスをインポート

// abstract class BaseSubCollectionDB {
//     static subcollectionPath: string;
//     static parentDocumentId: string;
//     documentId?: string;

//     abstract toFirestore(): DocumentData;

//     // サブクラスでオーバーライドされる実装メソッド
//     /*
//     static fromSubCollectionFirestore(data: DocumentData, documentId: string, parentDocumentId: string): MySubCollectionDB {
//         const {  } = data;
//         return new MySubCollectionDB(, documentId, parentDocumentId);
//     }

//     static async getFromSubCollectionFirestore(parentDocumentId: string, documentId: string): Promise<MySubCollectionDB | null> {
//         const data = await this.getSubCollectionData(parentDocumentId, documentId);
//         if (data) {
//             return this.fromSubCollectionFirestore(data, documentId, parentDocumentId);
//         }
//         return null;
//     }

//     static async getAllFromSubCollection(parentDocumentId: string, constraints: QueryConstraint[] = []): Promise<MySubCollectionDB[]> {
//         const snapshots = await this.getAllSubCollectionSnapshots(parentDocumentId, constraints);
//         return snapshots.map(snapshot => this.fromSubCollectionFirestore(snapshot.data, snapshot.documentId, parentDocumentId));
//     }
//     */

//     static getPath(): string {
//         return `${(this.constructor as typeof BaseSubCollectionDB).parentDocumentId}/${(this.constructor as typeof BaseSubCollectionDB).subcollectionPath}/${(this.constructor as typeof BaseSubCollectionDB).subcollectionPath}`;
//     }

//     async addToSubCollection(): Promise<void> {
//         try {
//             const data = this.toFirestore();
//             console.log(BaseSubCollectionDB.getPath());
//             const docRef = await addDoc(collection(db, BaseSubCollectionDB.getPath()), data);
            
//             this.documentId = docRef.id;
//         } catch (error) {
//             console.error("Error adding document to subcollection: ", error);
//             throw new Error("Failed to add document to subcollection");
//         }
//     }

//     static async getSubCollectionData(documentId: string): Promise<DocumentData | null> {
//         try {
//             const docRef = doc(db, BaseSubCollectionDB.getPath(), documentId);
//             const docSnap = await getDoc(docRef);

//             if (docSnap.exists()) {
//                 return docSnap.data();
//             } else {
//                 console.log("No such document in subcollection!");
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error getting document from subcollection: ", error);
//             return null;
//         }
//     }

//     static async getAllSubCollectionSnapshots(constraints: QueryConstraint[] = [], limitNumber: number = 100): Promise<DBSnapshot[]> {
//         try {
//             const q = query(collection(db, BaseSubCollectionDB.getPath()), ...constraints, limit(limitNumber));
//             const querySnapshots = await getDocs(q);

//             return querySnapshots.docs.map(snapshot => ({
//                 data: snapshot.data(),
//                 documentId: snapshot.id
//             }));
//         } catch (error) {
//             console.error("Error getting documents from subcollection: ", error);
//             throw new Error("Failed to get documents from subcollection");
//         }
//     }

//     async updateInSubCollection(): Promise<void> {
//         try {
//             if (!this.documentId) throw new Error("ID is required to update document in subcollection.");
//             const docRef = doc(db, BaseSubCollectionDB.getPath(), this.documentId);
//             const data = this.toFirestore();
//             await updateDoc(docRef, data);
//             console.log(`${this.documentId} updated in subcollection`);
//         } catch (error) {
//             console.error("Error updating document in subcollection: ", error);
//             throw new Error("Failed to update document in subcollection");
//         }
//     }

//     static async deleteFromSubCollection(documentId: string): Promise<void> {
//         try {
//             const docRef = doc(db, BaseSubCollectionDB.getPath(), documentId);
//             await deleteDoc(docRef);
//             console.log(`${documentId} deleted from subcollection`);
//         } catch (error) {
//             console.error("Error deleting document from subcollection: ", error);
//             throw new Error("Failed to delete document from subcollection");
//         }
//     }
// }

// export default BaseSubCollectionDB;
