import { Firestore, DocumentReference, DocumentSnapshot, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, CollectionReference, QueryConstraint, query, where, limit, setDoc, startAfter, orderBy, onSnapshot, Unsubscribe, DocumentData, Transaction, runTransaction } from "firebase/firestore";
import { BaseDocumentData } from "../../types/firebase/db/baseTypes";
import FirestoreCallbacks from "./callbacks";

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
  private collectionRef: CollectionReference<T>;
  private callbacksManager?: FirestoreCallbacks<T>;
  
  constructor(private firestore: Firestore, collectionPath: string) {
    this.collectionRef = collection(this.firestore, collectionPath) as CollectionReference<T>;
    this.callbacksManager = new FirestoreCallbacks<T>(this.collectionRef);
  }

  /**
   * コレクション参照を取得するメソッド
   * @returns Firestoreのコレクション参照
   */
  getCollectionRef(): CollectionReference<T, DocumentData> {
    return this.collectionRef;
  }

  /**
   * コレクションパスを取得するメソッド
   * @returns コレクションパスの文字列
   */
  getCollectionPath(): string {
    return this.collectionRef.path;
  }

  /**
   * Firestore操作をハンドリングするユーティリティメソッド
   * @param operation 実行するFirestore操作のPromise
   * @param errorMessage エラーメッセージ
   * @returns Firestore操作の結果
   */
  private async handleFirestoreOperation<T>(operation: Promise<T>, errorMessage: string): Promise<T> {
    try {
        return await operation;
    } catch (error) {
        console.error(`${errorMessage}: `, error);
        throw new Error(errorMessage);
    }
  }

  /**
   * ドキュメントを作成するメソッド
   * @param data 作成するドキュメントのデータ
   * @returns 作成されたドキュメントの参照
   */
  async create(data: T): Promise<DocumentReference<T>> {
    data.isActive = true;
    return this.handleFirestoreOperation(addDoc(this.collectionRef, data), "Failed to create document");
  }

  /**
   * 指定されたIDでドキュメントを作成するメソッド
   * @param documentId 作成するドキュメントのID
   * @param data 作成するドキュメントのデータ
   * @param merge 既存のドキュメントにデータをマージするかどうか
   */
  async createWithId(documentId: string, data: T, merge: boolean = false): Promise<void> {
    data.isActive = true;
    const docRef = doc(this.collectionRef, documentId);
    return this.handleFirestoreOperation(setDoc(docRef, data, { merge }), "Failed to create document with ID");
  }

  /**
   * ドキュメントをDocumentSnapshotとして読み込むメソッド
   * @param documentId 読み込むドキュメントのID
   * @returns 読み込んだドキュメントのDocumentSnapshot
   */
  async readAsDocumentSnapshot(documentId: string): Promise<DocumentSnapshot<T>> {
    const docRef = doc(this.collectionRef, documentId);
    return this.handleFirestoreOperation(getDoc(docRef), "Failed to read document snapshot");
  }

  /**
   * ドキュメントを読み込むメソッド
   * @param documentId 読み込むドキュメントのID
   * @returns 読み込んだドキュメントのデータ、存在しない場合はnull
   */
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

  /**
   * ドキュメントを更新するメソッド
   * @param documentId 更新するドキュメントのID
   * @param data 更新するドキュメントのデータ（部分的）
   */
  async update(documentId: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.collectionRef, documentId) as DocumentReference<T>;
    return this.handleFirestoreOperation(updateDoc(docRef, data as T), "Failed to update document");
  }

  /**
   * ドキュメントを物理削除するメソッド
   * @param documentId 削除するドキュメントのID
   */
  async hardDelete(documentId: string): Promise<void> {
    const docRef = doc(this.collectionRef, documentId);
    return this.handleFirestoreOperation(deleteDoc(docRef), "Failed to hard delete document");
  }  

  /**
   * ドキュメントを論理削除するメソッド
   * @param documentId 削除するドキュメントのID
   */
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

  /**
   * 条件に合致するすべてのドキュメントをQuerySnapshotとして取得するメソッド
   * @param queryConstraints クエリの制約条件
   * @returns クエリスナップショット
   */
  async getAllAsQuerySnapshot(...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<T>> {
    const q = query(this.collectionRef, where("isActive", "==", true), ...queryConstraints);
    return this.handleFirestoreOperation(getDocs(q), "Failed to get query snapshot");
  }

  /**
   * 条件に合致するすべてのドキュメントを取得するメソッド
   * @param queryConstraints クエリの制約条件
   * @returns 取得したドキュメントの配列
   */
  async getAll(...queryConstraints: QueryConstraint[]): Promise<T[]> {
    const querySnapshot = await this.getAllAsQuerySnapshot(...queryConstraints);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      data.docId = doc.id;
      return data;
    });
  }

    /**
   * 指定されたフィールドと値のペアに基づいてドキュメントを取得します。
   * 値リストが10個を超える場合は、複数のクエリに分割して取得します。
   */
    async getByConditions(field: keyof T, values: any[]): Promise<T[]> {
      const uniqueValues = Array.from(new Set(values));
      const chunkedValues = this.chunkArray(uniqueValues, 10);
  
      const queries = chunkedValues.map(chunk => {
        const q = query(this.collectionRef, where(field as string, "in", chunk));
        return getDocs(q);
      });
  
      const querySnapshots = await Promise.all(queries);
  
      const documents = querySnapshots.flatMap((snapshot: QuerySnapshot) =>
        snapshot.docs.map(doc => doc.data() as T)
      );
  
      return documents;
    }
  
    /**
     * 配列を指定したサイズごとのチャンクに分割するヘルパーメソッド
     */
    private chunkArray<K>(array: K[], size: number): K[][] {
      const chunkedArray: K[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
      }
      return chunkedArray;
    }

  /**
   * 指定されたフィールドと値に一致する最初のドキュメントを取得するメソッド
   * @param field 検索するフィールド名
   * @param value 検索する値
   * @returns 一致するドキュメント、存在しない場合はnull
   */
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

  /**
   * トランザクションを使用してドキュメントを読み書きするメソッド
   * @param transactionFunc 実行するトランザクション関数
   * @returns トランザクションの結果
   */
  async runTransaction<R>(transactionFunc: (transaction: Transaction) => Promise<R>): Promise<R> {
    return this.handleFirestoreOperation(runTransaction(this.firestore, transactionFunc), "Transaction failed");
  }

  // ドキュメントのコールバック関数管理

  private getOrCreateFirestoreCallbacks(): FirestoreCallbacks<T> {
    if (!this.callbacksManager) {
      this.callbacksManager = new FirestoreCallbacks(this.collectionRef);
    }
    return this.callbacksManager;
  }

  addCallback(documentId: string, callback: (data: T) => void): void {
    this.getOrCreateFirestoreCallbacks().addCallback(documentId, callback);
  }

  removeCallback(documentId: string, callback: (data: T) => void): void {
    this.callbacksManager?.removeCallback(documentId, callback);
  }

  setActiveState(documentId: string, isActive: boolean): void {
    this.callbacksManager?.setActiveState(documentId, isActive);
  }

  async executeCallbacks(documentId: string): Promise<void> {
    await this.callbacksManager?.executeCallbacks(documentId);
  }

  addCollectionCallback(callback: (data: T[]) => void): void {
    this.getOrCreateFirestoreCallbacks().addCollectionCallback(callback);
  }

  removeCollectionCallback(callback: (data: T[]) => void): void {
    this.callbacksManager?.removeCollectionCallback(callback);
  }
}

export default BaseDB;