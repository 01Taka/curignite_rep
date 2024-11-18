import { DocumentReference, DocumentSnapshot, QuerySnapshot, addDoc, deleteDoc, doc, getDoc, getDocs, updateDoc, CollectionReference, QueryConstraint, query, where, limit, setDoc, startAfter, orderBy, DocumentData, serverTimestamp, FieldValue } from "firebase/firestore";
import { BaseDocumentRead, BaseDocumentWrite } from "../../../types/firebase/db/baseTypes";
import { FieldValueSupported } from "../../../types/firebase/db/formatTypes";
import { parseDocumentSnapshot, parseQuerySnapshot } from "./utils";

class CRUDHandler<Read extends BaseDocumentRead, Write extends BaseDocumentWrite> {
  private writeCollectionRef: CollectionReference<Write>;
  private readCollectionRef: CollectionReference<Read>;

  constructor(collectionReference: CollectionReference<DocumentData, DocumentData>) {
    this.writeCollectionRef = collectionReference as CollectionReference<Write>;
    this.readCollectionRef = collectionReference as CollectionReference<Read>;
  }

  /**
   * Firestore操作をハンドリングするユーティリティメソッド
   * @param operation 実行するFirestore操作のPromise
   * @param errorMessage エラーメッセージ
   * @returns Firestore操作の結果
   */
  private static async handleFirestoreOperation<T>(
    operation: Promise<T>, 
    action: string, 
    context?: string
  ): Promise<T> {
    try {
      return await operation;
    } catch (error) {
      console.error(`[Firestore Error] ${action} ${context ? `(${context})` : ''}:`, error);
      throw new Error(`[Firestore Error] ${action} failed.`);
    }
  }

  /**
   * 作成前の前処理を行う
   * @param data 作成するデータ
   * @returns 前処理がされたデータ
   */
  private writePreprocessing(
    data: Write,
    options: { setInvalid?: boolean; additionalFields?: Record<string, any> } = {}
  ): Write & { createdAt: FieldValue; isActive: boolean } {
    return {
      ...data,
      createdAt: serverTimestamp(),
      isActive: !options.setInvalid,
      ...options.additionalFields,
    };
  }

  /**
   * ドキュメントを作成するメソッド
   * @param data 作成するドキュメントのデータ
   * @returns 作成されたドキュメントの参照
   */
  async create(data: Write): Promise<DocumentReference<Write>> {
    const result = await CRUDHandler.handleFirestoreOperation(addDoc(this.writeCollectionRef, this.writePreprocessing(data)), "Failed to create document");
    return result as DocumentReference<Write>;
  }

  /**
   * 指定されたIDでドキュメントを作成するメソッド
   * @param documentId 作成するドキュメントのID
   * @param data 作成するドキュメントのデータ
   * @param merge 既存のドキュメントにデータをマージするかどうか
   * @param batchOff バッチ使用時にバッチ操作を行わないようにするかどうか
   */
  async createWithId(documentId: string, data: Write, merge: boolean = false): Promise<void> {
    const docRef = doc(this.writeCollectionRef, documentId);
    return CRUDHandler.handleFirestoreOperation(setDoc(docRef, this.writePreprocessing(data), { merge }), "Failed to create document with ID", documentId);
  }

  /**
   * ドキュメントをDocumentSnapshotとして読み込むメソッド
   * @param documentId 読み込むドキュメントのID
   * @returns 読み込んだドキュメントのDocumentSnapshot
   */
  async readAsDocumentSnapshot(documentId: string): Promise<DocumentSnapshot<Read>> {
    const docRef = doc(this.readCollectionRef, documentId);
    return CRUDHandler.handleFirestoreOperation(getDoc(docRef), "Failed to read document snapshot", documentId);
  }

  /**
   * ドキュメントを読み込むメソッド
   * @param documentId 読み込むドキュメントのID
   * @returns 読み込んだドキュメントのデータ、存在しない場合はnull
   */
  async read(documentId: string): Promise<Read | null> {
    const docSnapshot = await this.readAsDocumentSnapshot(documentId);
    return parseDocumentSnapshot<Read>(docSnapshot);
  }

  /**
   * ドキュメントを更新するメソッド
   * @param documentId 更新するドキュメントのID
   * @param data 更新するドキュメントのデータ（部分的）
   */
  async update(documentId: string, data: FieldValueSupported<Partial<Write>>): Promise<void> {
    const docRef = doc(this.writeCollectionRef, documentId);
    return CRUDHandler.handleFirestoreOperation(updateDoc(docRef, {...data, updatedAt: serverTimestamp()}), "Failed to update document", documentId);
  }

  /**
   * ドキュメントを物理削除するメソッド
   * @param documentId 削除するドキュメントのID
   */
  async hardDelete(documentId: string): Promise<void> {
    const docRef = doc(this.writeCollectionRef, documentId);
    return CRUDHandler.handleFirestoreOperation(deleteDoc(docRef), "Failed to hard delete document", documentId);
  }  

  /**
   * ドキュメントを論理削除するメソッド
   * @param documentId 削除するドキュメントのID
   */
  async softDelete(documentId: string, updateFields?: Partial<Write>): Promise<void> {
    return this.update(
      documentId,
      { ...updateFields, isActive: false, deletedAt: serverTimestamp() } as FieldValueSupported<Partial<Write>>
    )
  }

  /**
   * 条件に合致するすべてのドキュメントをQuerySnapshotとして取得するメソッド
   * @param queryConstraints クエリの制約条件
   * @returns クエリスナップショット
   */
  async getAllAsQuerySnapshot(...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<Read>> {
    const q = query(this.readCollectionRef, where("isActive", "==", true), ...queryConstraints);
    return CRUDHandler.handleFirestoreOperation(getDocs(q), "Failed to get query snapshot");
  }

  /**
   * 条件に合致するすべてのドキュメントを取得するメソッド
   * @param queryConstraints クエリの制約条件
   * @returns 取得したドキュメントの配列
   */
  async getAll(...queryConstraints: QueryConstraint[]): Promise<Read[]> {
    const querySnapshot = await this.getAllAsQuerySnapshot(...queryConstraints);
    return parseQuerySnapshot<Read>(querySnapshot);
  }

  /**
   * 指定されたフィールドと値に一致する最初のドキュメントを取得するメソッド
   * @param field 検索するフィールド名
   * @param value 検索する値
   * @returns 一致するドキュメント、存在しない場合はnull
   */
  async getFirstMatch(field: keyof Read, value: any): Promise<Read | null> {
    const q = query(this.readCollectionRef, where(field as string, "==", value), where("isActive", "==", true), limit(1));
    const querySnapshot: QuerySnapshot<Read> = await CRUDHandler.handleFirestoreOperation(getDocs(q), "Failed to get first match");

    return parseDocumentSnapshot<Read>(querySnapshot.docs[0]);
  }
  
  /**
   * クエリ制約を動的に構築するためのヘルパー関数
   * @param startAfterDoc クエリの開始位置となるドキュメントスナップショット
   * @param limitCount 取得する最大ドキュメント数
   * @param additionalConstraints その他のクエリ制約
   * @returns 構築されたクエリ制約配列
   */
  private static buildQueryConstraints<T>(
    startAfterDoc?: DocumentSnapshot<T>,
    limitCount?: number,
    additionalConstraints: QueryConstraint[] = []
  ): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];

    // デフォルトのクエリ制約
    constraints.push(where("isActive", "==", true));
    constraints.push(orderBy("createdAt", "desc"));

    // ページング用のクエリ制約
    if (startAfterDoc) {
      constraints.push(startAfter(startAfterDoc));
    }

    if (limitCount !== undefined) {
      constraints.push(limit(limitCount));
    }

    // その他のクエリ制約を追加
    return constraints.concat(additionalConstraints);
  }

  /**
   * 指定されたドキュメントの後からクエリを開始する関数
   * @param startAfterDoc クエリの開始位置となるドキュメントスナップショット
   * @param limitCount 取得する最大ドキュメント数
   * @param queryConstraints その他のクエリ制約
   * @returns クエリの結果としてのデータ配列
   */
  async getAllWithPagination(
    startAfterDoc?: DocumentSnapshot<Read>,
    limitCount?: number,
    ...queryConstraints: QueryConstraint[]
  ): Promise<Read[]> {
    try {
      // クエリ制約を構築
      const constraints = CRUDHandler.buildQueryConstraints(startAfterDoc, limitCount, queryConstraints);

      // クエリを実行
      const fullQuery = query(this.readCollectionRef, ...constraints);
      const querySnapshot = await CRUDHandler.handleFirestoreOperation(getDocs(fullQuery), "Failed to get paginated data");

      return parseQuerySnapshot(querySnapshot);
    } catch (error) {
      console.error("Error creating query or fetching documents:", error);
      throw error;
    }
  }


  // /**
  //  * 指定されたフィールドと値のペアに基づいてドキュメントを取得します。
  //  * 値リストが10個を超える場合は、複数のクエリに分割して取得します。
  //  */
  // private async getByConditions(field: keyof Write, values: any[]): Promise<Write[]> {
  //   const uniqueValues = Array.from(new Set(values));
  //   const chunkedValues = this.chunkArray(uniqueValues, 10);

  //   const queries = chunkedValues.map(chunk => {
  //     const q = query(this.writeCollectionRef, where(field as string, "in", chunk));
  //     return getDocs(q);
  //   });

  //   const querySnapshots = await Promise.all(queries);

  //   const documents = querySnapshots.flatMap((snapshot: QuerySnapshot) =>
  //     snapshot.docs.map(doc => doc.data() as Write)
  //   );

  //   return documents;
  // }

  // /**
  //  * 配列を指定したサイズごとのチャンクに分割するヘルパーメソッド
  //  */
  // private chunkArray<K>(array: K[], size: number): K[][] {
  //   const chunkedArray: K[][] = [];
  //   for (let i = 0; i < array.length; i += size) {
  //     chunkedArray.push(array.slice(i, i + size));
  //   }
  //   return chunkedArray;
  // }
}

export default CRUDHandler;