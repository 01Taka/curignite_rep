import { Firestore, DocumentReference, DocumentSnapshot, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, CollectionReference, QueryConstraint, query, where, limit, setDoc, startAfter, orderBy, onSnapshot, Unsubscribe } from "firebase/firestore";
import { BaseDocumentData } from "../../types/firebase/db/baseTypes";

export interface Callback<T extends BaseDocumentData> {
  unsubscribe?: Unsubscribe;
  active: boolean;
  func: Array<(data: T) => void>;
}

export interface CollectionCallback<T extends BaseDocumentData> {
  unsubscribe?: Unsubscribe;
  active: boolean;
  func: Array<(data: T[]) => void>;
}

class BaseDB<T extends BaseDocumentData> {
  protected collectionRef: CollectionReference<T>;
  private callbacks: { [documentId: string]: Callback<T> } = {};
  private collectionCallbacks: CollectionCallback<T> = { active: false, func: [] };
  
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
      if (docSnapshot.metadata.fromCache) {
        console.log('このデータはローカルキャッシュからのものです。');
      } else {
        console.log('このデータはサーバーからのものです。');
      }
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

    q.push(orderBy("createdAt", "desc"));

    if (startAfterDoc) {
      q.push(startAfter(startAfterDoc));
    }

    if (limitCount !== undefined) {
      q.push(limit(limitCount));
    }

    q = q.concat(queryConstraints);

    try {
      const fullQuery = query(this.collectionRef, ...q);

      const querySnapshot = await this.handleFirestoreOperation(getDocs(fullQuery), "Failed to get paginated data");

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        data.docId = doc.id;
        return data;
      });
    } catch (error) {
      console.error("Error creating query or fetching documents:", error);
      throw error;
    }
  }

  // ドキュメントのコールバック関数管理

  /**
   * コールバック関数を追加します。
   * @param documentId - ドキュメントのID
   * @param callback - コールバック関数
   */
  addCallback(documentId: string, callback: (data: T) => void): void {
    if (!this.callbacks[documentId]) {
      this.callbacks[documentId] = { active: true, func: [] };
      this.registerSnapshotListener(documentId);
    }
    if (!this.callbacks[documentId].func.includes(callback)) {
      this.callbacks[documentId].func.push(callback);
    }
  }

  /**
   * 指定したコールバック関数を削除します。
   * @param documentId - ドキュメントのID
   * @param callback - 削除するコールバック関数
   */
  removeCallback(documentId: string, callback: (data: T) => void): void {
    const callbackEntry = this.callbacks[documentId];
    if (callbackEntry) {
      callbackEntry.func = callbackEntry.func.filter(cb => cb !== callback);
      if (callbackEntry.func.length === 0) {
        this.removeSnapshotListener(documentId);
        delete this.callbacks[documentId];
      }
    }
  }  

  /**
   * ドキュメントIDに関連付けられたコールバックのアクティブ状態を設定します。
   * @param documentId - ドキュメントのID
   * @param isActive - コールバックを有効にするかどうか
   */
  setActiveState(documentId: string, isActive: boolean): void {
    if (this.callbacks[documentId]) {
      this.callbacks[documentId].active = isActive;
    }
  }

  /**
   * スナップショットからデータを取得し、コールバックを実行します。
   * @param documentId - ドキュメントのID
   * @param snapshot - ドキュメントのスナップショット
   */
  private handleSnapshot(documentId: string, snapshot: DocumentSnapshot<T>): void {
    if (snapshot.exists()) {
      const data = snapshot.data() as T;
      if (this.callbacks[documentId]?.active) {
        this.callbacks[documentId].func.forEach(func => {
          try {
            func(data);
          } catch (error) {
            console.error(`Callback function error for document ${documentId}:`, error);
          }
        });
      }
    } else {
      console.warn(`Document ${documentId} does not exist.`);
    }
  }

  /**
   * 指定したドキュメントIDに対して登録されているコールバック関数を実行します。
   * @param documentId - ドキュメントのID
   * @returns {Promise<void>} - 非同期処理の完了を示すPromise
   */
  async executeCallbacks(documentId: string): Promise<void> {
    try {
      const snapshot = await this.readAsDocumentSnapshot(documentId);
      this.handleSnapshot(documentId, snapshot);
    } catch (error) {
      console.error(`Error fetching document ${documentId}:`, error);
    }
  }

  /**
   * ドキュメントIDに対してスナップショットリスナーを登録します。
   * @param documentId - ドキュメントのID
   */
  registerSnapshotListener(documentId: string): void {
    this.removeSnapshotListener(documentId);
    const docRef = doc(this.firestore, documentId);
    const unsubscribe = onSnapshot(docRef, snapshot => {
      this.handleSnapshot(documentId, snapshot as DocumentSnapshot<T>);
    }, error => {
      console.error(`Error listening to document ${documentId}:`, error);
    });
    
    this.callbacks[documentId].unsubscribe = unsubscribe;
  }
  
  /**
   * ドキュメントIDに対して登録されているスナップショットリスナーを削除します。
   * @param documentId - ドキュメントのID
   */
  removeSnapshotListener(documentId: string): void {
    if (!!this.callbacks[documentId]?.unsubscribe) {
      this.callbacks[documentId].unsubscribe!();
      this.callbacks[documentId].unsubscribe = undefined;
    }
  }
  
  // コレクションのコールバック関数管理

  /**
   * コレクション用ののコールバック関数を追加します。
   * @param callback - コールバック関数
   */
  addCollectionCallback(callback: (data: T[]) => void): void {
    if (!this.collectionCallbacks.active) {
      this.collectionCallbacks.active = true;
      this.registerCollectionSnapshotListener();
    }
    if (!this.collectionCallbacks.func.includes(callback)) {
      this.collectionCallbacks.func.push(callback);
    }
  }
  
  /**
   * 指定したコレクション用のコールバック関数を削除します。
   * @param callback - 削除するコールバック関数
   */
    removeCollectionCallback(callback: (data: T[]) => void): void {
      this.collectionCallbacks.func = this.collectionCallbacks.func.filter(cb => cb !== callback);
      if (this.collectionCallbacks.func.length === 0) {
        this.removeCollectionSnapshotListener();
        this.collectionCallbacks.active = false;
      }
    }
  
  /**
   * スナップショットからデータを取得し、コールバックを実行します。
   * @param documentId - ドキュメントのID
   * @param snapshot - ドキュメントのスナップショット
   */
  private handleCollectionSnapshot(snapshot: QuerySnapshot<T>): void {
    const data = snapshot.docs.map(doc => {
      const docData = doc.data();
      docData.docId = doc.id;
      return docData;
    });

    if (this.collectionCallbacks.active) {
      this.collectionCallbacks.func.forEach(func => {
        try {
          func(data);
        } catch (error) {
          console.error('Collection callback function error:', error);
        }
      });
    }
  }
  
  /**
   * コレクションのスナップショットリスナーを登録します。
   */
  registerCollectionSnapshotListener(): void {
    this.removeCollectionSnapshotListener();
    const unsubscribe = onSnapshot(this.collectionRef, snapshot => {
      this.handleCollectionSnapshot(snapshot);
    }, error => {
      console.error('Error listening to collection:', error);
    });

    this.collectionCallbacks.unsubscribe = unsubscribe;
  }
  
  /**
   * コレクションのスナップショットリスナーを削除します。
   */
  removeCollectionSnapshotListener(): void {
    if (this.collectionCallbacks.unsubscribe) {
      this.collectionCallbacks.unsubscribe();
      this.collectionCallbacks.unsubscribe = undefined;
    }
  }
}

export default BaseDB;