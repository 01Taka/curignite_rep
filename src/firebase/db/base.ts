import { Firestore, DocumentData, DocumentReference, DocumentSnapshot, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, CollectionReference, QueryConstraint, query, where, limit, setDoc } from "firebase/firestore";

export interface DbData extends DocumentData {
  documentId: string;
}

class BaseDB<T extends DbData> {
  protected collectionRef: CollectionReference<T>;
  
  constructor(protected firestore: Firestore, collectionPath: string) {
    this.collectionRef = collection(this.firestore, collectionPath) as CollectionReference<T>;
  }

  async handleFirestoreOperation<T>(operation: Promise<T>, errorMessage: string): Promise<T> {
    try {
        return await operation;
    } catch (error) {
        console.error(`${errorMessage}: `, error);
        throw new Error(errorMessage);
    }
  }

  async create(data: T): Promise<DocumentReference<T>> {
    return this.handleFirestoreOperation(addDoc(this.collectionRef, data), "Failed to create document");
  }

  async createWithId(documentId: string, data: T): Promise<DocumentReference<T> | void> {
    const docRef = doc(this.collectionRef, documentId);
    return this.handleFirestoreOperation(setDoc(docRef, data), "Failed to create document with ID");
  }
  
  async readAsDocumentSnapshot(documentId: string): Promise<DocumentSnapshot<T>> {
    const docRef = doc(this.collectionRef, documentId);
    return this.handleFirestoreOperation(getDoc(docRef), "Failed to read document snapshot");
  }

  async read(documentId: string): Promise<T | null> {
    const docSnapshot = await this.readAsDocumentSnapshot(documentId);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as T;
      data.documentId = docSnapshot.id;
      return data;
    } else {
      return null;
    }
  }

  async update(documentId: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.collectionRef, documentId) as DocumentReference<T>;
    return this.handleFirestoreOperation(updateDoc(docRef, data as T), "Failed to update document");
  }

  async delete(documentId: string): Promise<void> {
    const docRef = doc(this.collectionRef, documentId);
    return this.handleFirestoreOperation(deleteDoc(docRef), "Failed to delete document");
  }

  async getAllAsQuerySnapshot(...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<T>> {
    const q = query(this.collectionRef, ...queryConstraints);
    return this.handleFirestoreOperation(getDocs(q), "Failed to get query snapshot");
  }

  async getAll(...queryConstraints: QueryConstraint[]): Promise<T[]> {
    const querySnapshot = await this.getAllAsQuerySnapshot(...queryConstraints);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      data.documentId = doc.id;
      return data;
    });
  }

  async getFirstMatch(field: keyof T, value: any): Promise<T | null> {
    const q = query(this.collectionRef, where(field as string, "==", value), limit(1));
    const querySnapshot: QuerySnapshot<T> = await this.handleFirestoreOperation(getDocs(q), "Failed to get first match");

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data() as T;
      data.documentId = doc.id;
      return data;
    } else {
      return null;
    }
  }

  getSubCollection<K extends DbData>(parentId: string, subCollectionPath: string): CollectionReference<K> {
    return collection(this.firestore, `${this.collectionRef.path}/${parentId}/${subCollectionPath}`) as CollectionReference<K>;
  }

  async createInSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, data: K): Promise<DocumentReference<K>> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    return this.handleFirestoreOperation(addDoc(subCollectionRef, data), "Failed to create document in subcollection");
  }

  async readAsDocumentSnapshotFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, id: string): Promise<DocumentSnapshot<K>> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const docRef = doc(subCollectionRef, id);
    return this.handleFirestoreOperation(getDoc(docRef), "Failed to read document snapshot from subcollection");
  }

  async readFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, id: string): Promise<K | null> {
    const docSnapshot = await this.readAsDocumentSnapshotFromSubCollection<K>(parentId, subCollectionPath, id);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as K;
      data.documentId = docSnapshot.id;
      return data;
    } else {
      return null;
    }
  }

  async updateInSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, documentId: string, data: Partial<K>): Promise<void> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const docRef = doc(subCollectionRef, documentId) as DocumentReference<K>;
    return this.handleFirestoreOperation(updateDoc(docRef, data as K), "Failed to update document in subcollection");
  }

  async deleteFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, id: string): Promise<void> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const docRef = doc(subCollectionRef, id);
    return this.handleFirestoreOperation(deleteDoc(docRef), "Failed to delete document from subcollection");
  }

  async getAllAsQuerySnapshotFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, ...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<K>> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const q = query(subCollectionRef, ...queryConstraints);
    return this.handleFirestoreOperation(getDocs(q), "Failed to get query snapshot from subcollection");
  }

  async getAllFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, ...queryConstraints: QueryConstraint[]): Promise<K[]> {
    const querySnapshot = await this.getAllAsQuerySnapshotFromSubCollection(parentId, subCollectionPath, ...queryConstraints);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as K;
      data.documentId = doc.id;
      return data;
    });
  }

  async getFirstMatchFromSubCollection<K extends DbData>(parentId: string, subCollectionPath: string, field: keyof K, value: any): Promise<K | null> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const q = query(subCollectionRef, where(field as string, "==", value), limit(1));
    const querySnapshot: QuerySnapshot<K> = await this.handleFirestoreOperation(getDocs(q), "Failed to get first match");

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data() as K;
      data.documentId = doc.id;
      return data;
    } else {
      return null;
    }
  }
}

export default BaseDB;