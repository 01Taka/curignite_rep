import { CollectionReference, doc, DocumentData, DocumentSnapshot, Firestore, runTransaction, Transaction } from "firebase/firestore";
import { BaseDocumentRead, BaseDocumentWrite } from "../../../types/firebase/db/baseTypes";
import { FieldValueSupported } from "../../../types/firebase/db/formatTypes";

class TransactionHandler<Read extends BaseDocumentRead, Write extends BaseDocumentWrite> {
  private transaction: Transaction | null;
  private readCollectionRef: CollectionReference<Read>;
  private writeCollectionRef: CollectionReference<Write>;

  constructor(private firestore: Firestore, collectionReference: CollectionReference<DocumentData, DocumentData>) {
    this.transaction = null;
    this.readCollectionRef = collectionReference as CollectionReference<Read>;
    this.writeCollectionRef = collectionReference as CollectionReference<Write>;
  }

  get isTransactionActive(): boolean {
    return this.transaction !== null;
  }

  private ensureTransactionActive() {
    if (!this.transaction) {
      throw new Error("No active transaction. Please start a transaction before performing operations.");
    }
  }

  /**
   * トランザクションを開始して処理を実行
   * @param transactionCallback トランザクション内で実行する処理
   */
  async runTransaction(transactionCallback: (transaction: Transaction) => Promise<void>) {
    if (this.isTransactionActive) {
      throw new Error("Transaction already in progress. Finish or abort the current transaction first.");
    }
    await runTransaction(this.firestore, async (transaction) => {
      this.transaction = transaction;
      try {
        await transactionCallback(transaction);
      } finally {
        this.transaction = null;
      }
    });
  }

  async get(documentId: string): Promise<DocumentSnapshot<Read, DocumentData>> {
    this.ensureTransactionActive();
    const docRef = doc(this.readCollectionRef, documentId);
    return await this.transaction!.get(docRef);
  }

  /**
   * ドキュメントを作成する
   * @param documentId 作成するドキュメントのID
   * @param data 作成するデータ
   */
  set(documentId: string, data: Write) {
    this.ensureTransactionActive();
    const docRef = doc(this.writeCollectionRef, documentId);
    this.transaction!.set(docRef, data);
  }

  /**
   * ドキュメントを更新する
   * @param documentId 更新するドキュメントのID
   * @param data 更新するデータ（部分的）
   */
  update(documentId: string, data: FieldValueSupported<Partial<Write>>) {
    this.ensureTransactionActive();
    const docRef = doc(this.writeCollectionRef, documentId);
    this.transaction!.update(docRef, data as Write);
  }

  /**
   * ドキュメントを削除する
   * @param documentId 削除するドキュメントのID
   */
  delete(documentId: string) {
    this.ensureTransactionActive();
    const docRef = doc(this.writeCollectionRef, documentId);
    this.transaction!.delete(docRef);
  }
}

export default TransactionHandler;