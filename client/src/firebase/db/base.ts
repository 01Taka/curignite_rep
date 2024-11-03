import { Firestore, DocumentReference, DocumentSnapshot, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, CollectionReference, QueryConstraint, query, where, limit, setDoc, startAfter, orderBy, Unsubscribe, DocumentData, Transaction, runTransaction, Timestamp, serverTimestamp, writeBatch, WriteBatch } from "firebase/firestore";
import { BaseDocumentData } from "../../types/firebase/db/baseTypes";
import FirestoreCallbacks from "./callbacks";
import { AutoFieldToUndefined, FieldValueSupported } from "../../types/firebase/db/formatTypes";

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
  private batch: WriteBatch | null;
  
  constructor(private firestore: Firestore, collectionPath: string) {
    this.collectionRef = collection(this.firestore, collectionPath) as CollectionReference<T>;
    this.callbacksManager = new FirestoreCallbacks<T>(this.collectionRef);
    this.batch = null;
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
  private async handleFirestoreOperation<T>(operation: Promise<T>, errorMessage: string, context: string = ''): Promise<T> {
    try {
        return await operation;
    } catch (error) {
      console.error(`${errorMessage} ${context}:`, error);
      throw new Error(`${errorMessage} ${context}`);
    }
  }

  /**
   * 作成前の前処理を行う
   * @param data 作成するデータ
   * @returns 前処理がされたデータ
   */
  private createPreprocessing<T extends BaseDocumentData>(data: AutoFieldToUndefined<T>, options: { setActive?: boolean, keepCreatedAt?: boolean } = {}): Omit<T, 'docId'> {
    return {
        ...data,
        createdAt: options.keepCreatedAt ? undefined : serverTimestamp(),
        isActive: options.setActive ?? true
    };
  }

  startBatch() {
    if (this.batch) {
        throw new Error("Batch already in progress. Commit or cancel the current batch first.");
    }
    this.batch = writeBatch(this.firestore);
  }

  cancelBatch() {
      this.batch = null;
  }

  async commitBatch() {
    if (this.batch) await this.batch.commit();
    this.batch = null;
  }

  /**
   * ドキュメントを作成するメソッド
   * @param data 作成するドキュメントのデータ
   * @returns 作成されたドキュメントの参照
   */
  async create(data: AutoFieldToUndefined<T> | T): Promise<DocumentReference<T>> {
    const result = await this.handleFirestoreOperation(addDoc(this.collectionRef, this.createPreprocessing(data)), "Failed to create document");
    return result as DocumentReference<T>;
  }

  /**
   * 指定されたIDでドキュメントを作成するメソッド
   * @param documentId 作成するドキュメントのID
   * @param data 作成するドキュメントのデータ
   * @param merge 既存のドキュメントにデータをマージするかどうか
   * @param batchOff バッチ使用時にバッチ操作を行わないようにするかどうか
   */
  async createWithId(documentId: string, data: AutoFieldToUndefined<T>, merge: boolean = false, batchOff: boolean = false): Promise<void> {
    const docRef = doc(this.collectionRef, documentId);
    if (this.batch && !batchOff) {
      this.batch.set(docRef, this.createPreprocessing(data));
      return;
    }
    let keepCreatedAt: boolean = false;
    if (merge) {
      const snapshot = await this.readAsDocumentSnapshot(documentId);
      if (snapshot.exists() && snapshot.data().createdAt) {
        keepCreatedAt = true;
      }
    }
    return this.handleFirestoreOperation(setDoc(docRef, this.createPreprocessing(data, { keepCreatedAt }), { merge }), "Failed to create document with ID", documentId);
  }

  /**
   * ドキュメントをDocumentSnapshotとして読み込むメソッド
   * @param documentId 読み込むドキュメントのID
   * @returns 読み込んだドキュメントのDocumentSnapshot
   */
  async readAsDocumentSnapshot(documentId: string): Promise<DocumentSnapshot<T>> {
    const docRef = doc(this.collectionRef, documentId);
    return this.handleFirestoreOperation(getDoc(docRef), "Failed to read document snapshot", documentId);
  }

  /**
   * ドキュメントを読み込むメソッド
   * @param documentId 読み込むドキュメントのID
   * @returns 読み込んだドキュメントのデータ、存在しない場合はnull
   */
  async read(documentId: string): Promise<T | null> {
    console.log("Called read"); // 開発用

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

  /**
   * ドキュメントを更新するメソッド
   * @param documentId 更新するドキュメントのID
   * @param data 更新するドキュメントのデータ（部分的）
   */
  async update(documentId: string, data: FieldValueSupported<Partial<AutoFieldToUndefined<T>>>, batchOff = false): Promise<void> {
    console.log("Called update"); // 開発用
    const docRef = doc(this.collectionRef, documentId);
    
    if (this.batch && !batchOff) {
      this.batch.update(docRef, data as T);
      return;
    }

    data.createdAt = undefined;
    return this.handleFirestoreOperation(updateDoc(docRef, {...data, updatedAt: serverTimestamp()} as T), "Failed to update document", documentId);
  }

  /**
   * ドキュメントを物理削除するメソッド
   * @param documentId 削除するドキュメントのID
   */
  async hardDelete(documentId: string, batchOff = false): Promise<void> {
    console.log("Called hard delete"); // 開発用
    const docRef = doc(this.collectionRef, documentId);
    if (this.batch && !batchOff) {
      this.batch.delete(docRef);
      return;
    }
    return this.handleFirestoreOperation(deleteDoc(docRef), "Failed to hard delete document", documentId);
  }  

  /**
   * ドキュメントを論理削除するメソッド
   * @param documentId 削除するドキュメントのID
   */
  async softDelete(documentId: string, updateFields?: Partial<AutoFieldToUndefined<T>>, batchOff = false): Promise<void> {
    console.log("soft deleted: ", documentId);
    return this.update(
      documentId,
      { ...updateFields, isActive: false, deletedAt: serverTimestamp() } as FieldValueSupported<Partial<T>>,
      batchOff
    )
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
    console.log("Called get All"); // 開発用

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
    private async getByConditions(field: keyof T, values: any[]): Promise<T[]> {
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
    console.log("Called get first match"); // 開発用

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