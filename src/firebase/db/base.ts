import { Firestore, DocumentReference, DocumentSnapshot, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, CollectionReference, QueryConstraint, query, where, limit, setDoc, startAfter } from "firebase/firestore";
import { BaseDocumentData } from "../../types/firebase/db/baseTypes";

class BaseDB<T extends BaseDocumentData> {
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
    data.isActive = true;
    return this.handleFirestoreOperation(addDoc(this.collectionRef, data), "Failed to create document");
  }

  async createWithId(documentId: string, data: T): Promise<DocumentReference<T> | void> {
    data.isActive = true;
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
      if (!data.isActive) return null; // Return null if the document is logically deleted
      data.docId = docSnapshot.id;
      return data;
    } else {
      return null;
    }
  }

  async update(documentId: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.collectionRef, documentId) as DocumentReference<T>;
    return this.handleFirestoreOperation(updateDoc(docRef, data as T), "Failed to update document");
  }

  async hardDelete(documentId: string): Promise<void> {
    const docRef = doc(this.collectionRef, documentId);
    return this.handleFirestoreOperation(deleteDoc(docRef), "Failed to hard delete document");
  }  

  async softDelete(documentId: string): Promise<void> {
    const deleteData = await this.read(documentId);
    if (deleteData) {
      deleteData.isActive = false;
      return this.handleFirestoreOperation(
        this.update(documentId, { isActive: false } as Partial<T>),
        "Failed to soft delete document"
      );
    } else {
      console.warn(`Document with ID ${documentId} does not exist or is already deleted.`);
      return Promise.resolve();
    }
  }

  async getAllAsQuerySnapshot(...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<T>> {
    const q = query(this.collectionRef, where("isActive", "==", true), ...queryConstraints);
    return this.handleFirestoreOperation(getDocs(q), "Failed to get query snapshot");
  }

  async getAll(...queryConstraints: QueryConstraint[]): Promise<T[]> {
    const querySnapshot = await this.getAllAsQuerySnapshot(...queryConstraints);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      data.docId = doc.id;
      return data;
    });
  }

  async getFirstMatch(field: keyof T, value: any): Promise<T | null> {
    const q = query(this.collectionRef, where(field as string, "==", value), where("isActive", "==", true), limit(1));
    const querySnapshot: QuerySnapshot<T> = await this.handleFirestoreOperation(getDocs(q), "Failed to get first match");

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data() as T;
      data.docId = doc.id;
      return data;
    } else {
      return null;
    }
  }

  /**
   * 指定されたドキュメントの後からクエリを開始する関数
   * @param startAfterDoc クエリの開始位置となるドキュメントスナップショット
   * @param limitCount 取得する最大ドキュメント数
   * @param queryConstraints その他のクエリ制約
   * @returns クエリの結果としてのデータ配列
   */
  async getAllWithPagination(startAfterDoc?: DocumentSnapshot<T>, limitCount?: number, ...queryConstraints: QueryConstraint[]): Promise<T[]> {
    let q: QueryConstraint[] = [where("isActive", "==", true)];
    if (startAfterDoc) {
      q.push(startAfter(startAfterDoc));
    }
    if (limitCount !== undefined) {
      q.push(limit(limitCount));
    }
    q = q.concat(queryConstraints);
    const fullQuery = query(this.collectionRef, ...q);
    const querySnapshot = await this.handleFirestoreOperation(getDocs(fullQuery), "Failed to get paginated data");
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      data.docId = doc.id;
      return data;
    });
  }
}

export default BaseDB;