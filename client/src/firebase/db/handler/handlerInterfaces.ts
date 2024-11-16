// CRUDHandlerクラスのメソッドインターフェース

import { DocumentReference, DocumentSnapshot, QueryConstraint, QuerySnapshot, Transaction } from "firebase/firestore";
import { BaseDocumentRead, BaseDocumentWrite } from "../../../types/firebase/db/baseTypes";

export interface CRUDHandlerInterface<Read extends BaseDocumentRead, Write extends BaseDocumentWrite> {
  // ドキュメント作成
  create(data: Write): Promise<DocumentReference<Write>>;
  createWithId(documentId: string, data: Write, merge?: boolean): Promise<void>;

  // ドキュメント読み取り
  readAsDocumentSnapshot(documentId: string): Promise<DocumentSnapshot<Read>>;
  read(documentId: string): Promise<Read | null>;

  // ドキュメント更新
  update(documentId: string, data: Partial<Write>): Promise<void>;

  // ドキュメント削除
  hardDelete(documentId: string): Promise<void>;
  softDelete(documentId: string, updateFields?: Partial<Write>): Promise<void>;

  // クエリ関連
  getAllAsQuerySnapshot(...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<Read>>;
  getAll(...queryConstraints: QueryConstraint[]): Promise<Read[]>;
  getFirstMatch(field: keyof Read, value: any): Promise<Read | null>;
  getAllWithPagination(
    startAfterDoc?: DocumentSnapshot<Read>,
    limitCount?: number,
    ...queryConstraints: QueryConstraint[]
  ): Promise<Read[]>;
}

export interface CallbacksHandlerInterface<Read extends BaseDocumentRead> {
  // 個別ドキュメントのコールバック登録
  addCallback(documentId: string, callback: (data: Read) => void): void;
  removeCallback(documentId: string, callback: (data: Read) => void): void;

  // コールバックの実行
  executeCallbacks(documentId: string): Promise<void>;

  // コレクション全体のコールバック登録
  addCollectionCallback(callback: (data: Read[]) => void): void;
  removeCollectionCallback(callback: (data: Read[]) => void): void;
}

export interface BatchHandlerInterface<Write extends BaseDocumentWrite> {
  // バッチ操作のステータス
  readonly isBatchActive: boolean;

  // バッチ操作の開始・キャンセル・コミット
  startBatch(): void;
  cancelBatch(): void;
  commitBatch(): Promise<void>;

  // バッチ操作メソッド
  set(documentId: string, data: Write): void;
  update(documentId: string, data: Partial<Write>): void;
  delete(documentId: string): void;
}

export interface TransactionHandlerInterface<Read extends BaseDocumentRead, Write extends BaseDocumentWrite> {
  // トランザクション操作のステータス
  readonly isTransactionActive: boolean;

  // トランザクションを実行
  runTransaction(transactionCallback: (transaction: Transaction) => Promise<void>): Promise<void>;

  // トランザクション内の操作メソッド
  get(documentId: string): Promise<DocumentSnapshot<Read>>;
  set(documentId: string, data: Write): void;
  update(documentId: string, data: Partial<Write>): void;
  delete(documentId: string): void;
}
