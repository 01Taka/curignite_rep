import { Firestore, CollectionReference, DocumentData, DocumentSnapshot, Transaction, QueryConstraint, QuerySnapshot, DocumentReference } from "firebase/firestore";
import { BaseDocumentRead, BaseDocumentWrite } from "../../../types/firebase/db/baseTypes";
import CRUDHandler from "./crudHandler";
import CallbacksHandler from "./callbacksHandler";
import BatchHandler from "./batchHandler";
import TransactionHandler from "./transactionHandler";
import CollectionService from "./collectionService";
import { FieldValueSupported } from "../../../types/firebase/db/formatTypes";

class FirestoreService<
  Read extends BaseDocumentRead,
  Write extends BaseDocumentWrite
> {
  private static instances: Map<string, FirestoreService<any, any>> = new Map();

  private _crudHandler?: CRUDHandler<Read, Write>;
  private _callbacksHandler?: CallbacksHandler<Read>;
  private _batchHandler?: BatchHandler<Write>;
  private _transactionHandler?: TransactionHandler<Read, Write>;

  private _collectionService: CollectionService;

  constructor(firestore: Firestore, collectionPaths: string | string[]) {
    this._collectionService = new CollectionService(firestore, collectionPaths);
  }

  public get collectionRef(): CollectionReference<DocumentData> {
    return this._collectionService.collectionRef;
  }

  public get collectionPath(): string {
    return this._collectionService.collectionPath;
  }

  public setCollectionPath(...paths: string[]) {
    // pathが変わると、リファレンスも変わる
    // ハンドラ内で新しいリファレンスを使うためにハンドラをクリア
    this._collectionService.setCollectionPath(paths, this.clearHandlers);
  }
  
  /**
   * すべてのハンドラーインスタンスを削除
   */
  private clearHandlers(): void {
    this._crudHandler = undefined;
    this._callbacksHandler = undefined;
    this._batchHandler = undefined;
    this._transactionHandler = undefined;
  }

  static getInstance<Read extends BaseDocumentRead, Write extends BaseDocumentWrite>(
    firestore: Firestore,
    path: string
  ): FirestoreService<Read, Write> {
    const key = `${firestore.app.name}:${path}`;

    if (!FirestoreService.instances.has(key)) {
      FirestoreService.instances.set(key, new FirestoreService<Read, Write>(firestore, path));
    }

    return FirestoreService.instances.get(key) as FirestoreService<Read, Write>;
  }

  private get crudHandler(): CRUDHandler<Read, Write> {
    if (!this._crudHandler) {
      this._crudHandler = new CRUDHandler<Read, Write>(this.collectionRef);
    }
    return this._crudHandler;
  }

  private get callbacksHandler(): CallbacksHandler<Read> {
    if (!this._callbacksHandler) {
      this._callbacksHandler = new CallbacksHandler<Read>(this.collectionRef);
    }
    return this._callbacksHandler;
  }

  private get batchHandler(): BatchHandler<Write> {
    if (!this._batchHandler) {
      this._batchHandler = new BatchHandler<Write>(this.collectionRef.firestore, this.collectionRef);
    }
    return this._batchHandler;
  }

  private get transactionHandler(): TransactionHandler<Read, Write> {
    if (!this._transactionHandler) {
      this._transactionHandler = new TransactionHandler<Read, Write>(this.collectionRef.firestore, this.collectionRef);
    }
    return this._transactionHandler;
  }

  
  // CRUDHandler methods
  async create(data: Write): Promise<DocumentReference<Write>> {
    return await this.crudHandler.create(data);
  }

  async createWithId(documentId: string, data: Write, merge: boolean = false): Promise<void> {
    return await this.crudHandler.createWithId(documentId, data, merge);
  }

  async readAsDocumentSnapshot(documentId: string): Promise<DocumentSnapshot<Read>> {
    return await this.crudHandler.readAsDocumentSnapshot(documentId);
  }

  async read(documentId: string): Promise<Read | null> {
    return await this.crudHandler.read(documentId);
  }

  async update(documentId: string, data: FieldValueSupported<Partial<Write>>): Promise<void> {
    return await this.crudHandler.update(documentId, data);
  }

  async hardDelete(documentId: string): Promise<void> {
    return await this.crudHandler.hardDelete(documentId);
  }

  async softDelete(documentId: string, updateFields?: Partial<Write>): Promise<void> {
    return await this.crudHandler.softDelete(documentId, updateFields);
  }

  async getAllAsQuerySnapshot(...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<Read>> {
    return await this.crudHandler.getAllAsQuerySnapshot(...queryConstraints);
  }

  async getAll(...queryConstraints: QueryConstraint[]): Promise<Read[]> {
    return await this.crudHandler.getAll(...queryConstraints);
  }

  async getFirstMatch(field: keyof Read, value: any): Promise<Read | null> {
    return await this.crudHandler.getFirstMatch(field, value);
  }

  async getAllWithPagination(
    startAfterDoc?: DocumentSnapshot<Read>,
    limitCount?: number,
    ...queryConstraints: QueryConstraint[]
  ): Promise<Read[]> {
    return await this.crudHandler.getAllWithPagination(startAfterDoc, limitCount, ...queryConstraints);
  }

  // CallbacksHandler methods
  addCallback(documentId: string, callback: (data: Read) => void): void {
    this.callbacksHandler.addCallback(documentId, callback);
  }

  removeCallback(documentId: string, callback: (data: Read) => void): void {
    this.callbacksHandler.removeCallback(documentId, callback);
  }

  async executeCallbacks(documentId: string): Promise<void> {
    await this.callbacksHandler.executeCallbacks(documentId);
  }

  addCollectionCallback(callback: (data: Read[]) => void): void {
    this.callbacksHandler.addCollectionCallback(callback);
  }

  removeCollectionCallback(callback: (data: Read[]) => void): void {
    this.callbacksHandler.removeCollectionCallback(callback);
  }

  // BatchHandler methods
  startBatch(): void {
    this.batchHandler.startBatch();
  }

  cancelBatch(): void {
    this.batchHandler.cancelBatch();
  }

  async commitBatch(): Promise<void> {
    await this.batchHandler.commitBatch();
  }

  setInBatch(documentId: string, data: Write): void {
    this.batchHandler.set(documentId, data);
  }

  updateInBatch(documentId: string, data: FieldValueSupported<Partial<Write>>): void {
    this.batchHandler.update(documentId, data);
  }

  deleteInBatch(documentId: string): void {
    this.batchHandler.delete(documentId);
  }

  // TransactionHandler methods
  async runTransaction(transactionCallback: (transaction: Transaction) => Promise<void>): Promise<void> {
    await this.transactionHandler.runTransaction(transactionCallback);
  }

  async getInTransaction(documentId: string): Promise<DocumentSnapshot<Read>> {
    return await this.transactionHandler.get(documentId);
  }

  setInTransaction(documentId: string, data: Write): void {
    this.transactionHandler.set(documentId, data);
  }

  updateInTransaction(documentId: string, data: FieldValueSupported<Partial<Write>>): void {
    this.transactionHandler.update(documentId, data);
  }

  deleteInTransaction(documentId: string): void {
    this.transactionHandler.delete(documentId);
  }
}

export default FirestoreService;
