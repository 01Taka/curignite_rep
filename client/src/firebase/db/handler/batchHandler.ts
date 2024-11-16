import { CollectionReference, doc, DocumentData, FieldValue, Firestore, serverTimestamp, writeBatch, WriteBatch } from "firebase/firestore";
import { BaseDocumentWrite } from "../../../types/firebase/db/baseTypes";
import { FieldValueSupported } from "../../../types/firebase/db/formatTypes";

class BatchHandler<Write extends BaseDocumentWrite> {
  private batch: WriteBatch | null;
  private writeCollectionRef: CollectionReference<Write>;

  constructor(private firestore: Firestore, collectionReference: CollectionReference<DocumentData, DocumentData>) {
    this.batch = null;
    this.writeCollectionRef = collectionReference as CollectionReference<Write>;
  }

  get isBatchActive(): boolean {
    return this.batch !== null;
  }

  /**
   * 作成前の前処理を行う
   * @param data 作成するデータ
   * @returns 前処理がされたデータ
   */
  private writePreprocessing(
    data: Write, 
    options: { setInvalid?: boolean } = {}
  ): Write & { createdAt: FieldValue; isActive: boolean } {
    return {
      ...data,
      createdAt: serverTimestamp(),
      isActive: !options.setInvalid,
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

  async commitBatch(): Promise<void> {
    if (this.batch) await this.batch.commit();
    this.batch = null;
  }

  private ensureBatchActive() {
    if (!this.batch) {
      throw new Error("No active batch operation. Please call startBatch() before performing batch operations.");
    }
  }

  /**
   * 指定されたIDでドキュメントを作成するメソッド
   * @param documentId 作成するドキュメントのID
   * @param data 作成するドキュメントのデータ
   */
  set(documentId: string, data: Write) {
    this.ensureBatchActive();
    const docRef = doc(this.writeCollectionRef, documentId);
    this.batch!.set(docRef, this.writePreprocessing(data));
  }

  /**
   * ドキュメントを更新するメソッド
   * @param documentId 更新するドキュメントのID
   * @param data 更新するドキュメントのデータ（部分的）
   */
  update(documentId: string, data: FieldValueSupported<Partial<Write>>) {
    this.ensureBatchActive();
    const docRef = doc(this.writeCollectionRef, documentId);
    this.batch!.update(docRef, data as Write);
  }

  /**
   * ドキュメントを物理削除するメソッド
   * @param documentId 削除するドキュメントのID
   */
  delete(documentId: string) {
    this.ensureBatchActive();
    const docRef = doc(this.writeCollectionRef, documentId);
    this.batch!.delete(docRef);
  }
}

export default BatchHandler;