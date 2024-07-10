import { Firestore, DocumentData, DocumentReference, DocumentSnapshot, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, CollectionReference, QueryConstraint, query, where, limit, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface DbData extends DocumentData {
  documentId: string;
}

class BaseDB<T extends DbData> {
  protected collectionRef: CollectionReference<T>;
  private firestore: Firestore;

  constructor(collectionPath: string) {
    this.firestore = db;
    this.collectionRef = collection(this.firestore, collectionPath) as CollectionReference<T>;
  }

  async create(data: T): Promise<DocumentReference<T>> {
    try {
      const docRef = await addDoc(this.collectionRef, data);
      return docRef;
    } catch (error) {
      console.error("Error creating document: ", error);
      throw new Error("Failed to create document");
    }
  }

  async createWithId(documentId: string, data: T): Promise<DocumentReference<T>> {
    const docRef = doc(this.collectionRef, documentId);
    await setDoc(docRef, data);
    return docRef;
  }  

  async readAsDocumentSnapshot(documentId: string): Promise<DocumentSnapshot<T>> {
    try {
      const docRef = doc(this.collectionRef, documentId);
      const docSnapshot = await getDoc(docRef);
      return docSnapshot;
    } catch (error) {
      console.error("Error reading document snapshot: ", error);
      throw new Error("Failed to read document snapshot");
    }
  }

  async read(documentId: string): Promise<T | null> {
    try {
      const docSnapshot = await this.readAsDocumentSnapshot(documentId);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as T;
        data.documentId = docSnapshot.id;
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error reading document: ", error);
      throw new Error("Failed to read document");
    }
  }

  async update(data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, data.documentId) as DocumentReference<T>;
      await updateDoc(docRef, data as T);
    } catch (error) {
      console.error("Error updating document: ", error);
      throw new Error("Failed to update document");
    }
  }

  async delete(documentId: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw new Error("Failed to delete document");
    }
  }

  async getAllAsQuerySnapshot(...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<T>> {
    try {
      const q = query(this.collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (error) {
      console.error("Error getting query snapshot: ", error);
      throw new Error("Failed to get query snapshot");
    }
  }

  async getAll(...queryConstraints: QueryConstraint[]): Promise<T[]> {
    try {
      const querySnapshot = await this.getAllAsQuerySnapshot(...queryConstraints);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        data.documentId = doc.id;
        return data;
      });
    } catch (error) {
      console.error("Error getting all documents: ", error);
      throw new Error("Failed to get all documents");
    }
  }

  async getFirstMatch(field: keyof T, value: any): Promise<T | null> {
    try {
      const q = query(this.collectionRef, where(field as string, "==", value), limit(1));
      const querySnapshot: QuerySnapshot<T> = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data() as T;
        data.documentId = doc.id;
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting first match: ", error);
      throw new Error("Failed to get first match");
    }
  }

  getSubCollection<K extends DbData>(parentId: string, subCollectionPath: string): CollectionReference<K> {
    return collection(this.firestore, `${this.collectionRef.path}/${parentId}/${subCollectionPath}`) as CollectionReference<K>;
  }

  async createInSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, data: K): Promise<DocumentReference<K>> {
    try {
      const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
      const docRef = await addDoc(subCollectionRef, data);
      return docRef;
    } catch (error) {
      console.error("Error creating document in subcollection: ", error);
      throw new Error("Failed to create document in subcollection");
    }
  }

  async readAsDocumentSnapshotFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, id: string): Promise<DocumentSnapshot<K>> {
    try {
      const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
      const docRef = doc(subCollectionRef, id);
      const docSnapshot = await getDoc(docRef);
      return docSnapshot;
    } catch (error) {
      console.error("Error reading document snapshot from subcollection: ", error);
      throw new Error("Failed to read document snapshot from subcollection");
    }
  }

  async readFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, id: string): Promise<K | null> {
    try {
      const docSnapshot = await this.readAsDocumentSnapshotFromSubCollection<K>(parentId, subCollectionPath, id);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as K;
        data.documentId = docSnapshot.id;
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error reading document from subcollection: ", error);
      throw new Error("Failed to read document from subcollection");
    }
  }

  async updateInSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, data: Partial<K>): Promise<void> {
    try {
      const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
      const docRef = doc(subCollectionRef, data.documentId) as DocumentReference<K>;
      await updateDoc(docRef, data as K);
    } catch (error) {
      console.error("Error updating document in subcollection: ", error);
      throw new Error("Failed to update document in subcollection");
    }
  }

  async deleteFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, id: string): Promise<void> {
    try {
      const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
      const docRef = doc(subCollectionRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document from subcollection: ", error);
      throw new Error("Failed to delete document from subcollection");
    }
  }

  async getAllAsQuerySnapshotFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, ...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<K>> {
    try {
      const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
      const q = query(subCollectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (error) {
      console.error("Error getting query snapshot from subcollection: ", error);
      throw new Error("Failed to get query snapshot from subcollection");
    }
  }

  async getAllFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, ...queryConstraints: QueryConstraint[]): Promise<K[]> {
    try {
      const querySnapshot = await this.getAllAsQuerySnapshotFromSubCollection(parentId, subCollectionPath, ...queryConstraints);
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as K;
        data.documentId = doc.id;
        return data;
      });
    } catch (error) {
      console.error("Error getting all documents from subcollection: ", error);
      throw new Error("Failed to get all documents from subcollection");
    }
  }
}

export default BaseDB;