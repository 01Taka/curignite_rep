import { 
  DocumentSnapshot, 
  QuerySnapshot, 
  doc, 
  onSnapshot, 
  CollectionReference, 
  Unsubscribe 
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { BaseDocumentRead } from "../../../types/firebase/db/baseTypes";

// 個別ドキュメント用のコールバック
export interface Callback<Read extends BaseDocumentRead> {
  unsubscribe?: Unsubscribe;
  func: Map<string, (snapshot: DocumentSnapshot<Read>) => void>;
}

// コレクション全体用のコールバック
export interface CollectionCallback<Read extends BaseDocumentRead> {
  unsubscribe?: Unsubscribe;
  func: Map<string, (snapshot: QuerySnapshot<Read>) => void>;
}

class CallbacksHandler<Read extends BaseDocumentRead> {
  private readCollectionRef: CollectionReference<Read>;
  private callbacks: Map<string, Callback<Read>> = new Map();
  private collectionCallbacks: CollectionCallback<Read> = { func: new Map() };

  constructor(collectionReference: CollectionReference) {
    this.readCollectionRef = collectionReference as CollectionReference<Read>;
  }

  /**
   * 個別ドキュメントのコールバックを追加
   * @param documentId - ドキュメントID
   * @param callback - コールバック関数
   * @param callbackId - コールバックID
   * @param overwrite - 上書きオプション
   * @returns callbackId
   */
  addCallback(documentId: string, callback: (snapshot: DocumentSnapshot<Read>) => void, callbackId?: string, overwrite = false): string {
    const cbId = callbackId ?? nanoid();
    const callbackEntry = this.callbacks.get(documentId) ?? this.createDocumentCallbackEntry(documentId);

    if (overwrite) {
      // 上書きの場合は既存のコールバックを削除
      callbackEntry.func.set(cbId, callback);
    } else {
      // 既に同じIDのコールバックがある場合は追加しない
      if (!callbackEntry.func.has(cbId)) {
        callbackEntry.func.set(cbId, callback);
      }
    }

    return cbId;
  }

  /**
   * 個別ドキュメントのコールバックを削除
   * @param documentId - ドキュメントID
   * @param callbackId - コールバックID
   */
  removeCallback(documentId: string, callbackId: string): void {
    const callbackEntry = this.callbacks.get(documentId);
    if (callbackEntry) {
      callbackEntry.func.delete(callbackId);
      if (callbackEntry.func.size === 0) {
        this.unregisterDocumentListener(documentId);
        this.callbacks.delete(documentId);
      }
    }
  }

  /**
   * コレクション全体のコールバックを追加
   * @param callback - コールバック関数
   * @param callbackId - コールバックID
   * @param overwrite - 上書きオプション
   * @returns callbackId
   */
  addCollectionCallback(callback: (snapshot: QuerySnapshot<Read>) => void, callbackId?: string, overwrite = false): string {
    const cbId = callbackId ?? nanoid();

    if (overwrite) {
      // 上書きの場合は既存のコールバックを削除
      this.collectionCallbacks.func.set(cbId, callback);
    } else {
      // 既に同じIDのコールバックがある場合は追加しない
      if (!this.collectionCallbacks.func.has(cbId)) {
        this.collectionCallbacks.func.set(cbId, callback);
      }
    }

    if (!this.collectionCallbacks.unsubscribe) {
      this.registerCollectionListener();
    }

    return cbId;
  }

  /**
   * コレクション全体のコールバックを削除
   * @param callbackId - コールバックID
   */
  removeCollectionCallback(callbackId: string): void {
    this.collectionCallbacks.func.delete(callbackId);
    if (this.collectionCallbacks.func.size === 0) {
      this.unregisterCollectionListener();
    }
  }

  /** 
   * ドキュメント用のエントリを作成し、リスナーを登録 
   */
  private createDocumentCallbackEntry(documentId: string): Callback<Read> {
    const docRef = doc(this.readCollectionRef, documentId);
    const unsubscribe = onSnapshot(docRef, docSnapshot => {
      this.callbacks.get(documentId)?.func.forEach(cb => cb(docSnapshot));
    });
    const entry = { func: new Map(), unsubscribe };
    this.callbacks.set(documentId, entry);
    return entry;
  }

  /**
   * ドキュメントリスナーを解除
   */
  private unregisterDocumentListener(documentId: string): void {
    const callbackEntry = this.callbacks.get(documentId);
    callbackEntry?.unsubscribe?.();
  }

  /**
   * コレクションリスナーを登録
   */
  private registerCollectionListener(): void {
    const unsubscribe = onSnapshot(this.readCollectionRef, querySnapshot => {
      this.collectionCallbacks.func.forEach(cb => cb(querySnapshot));
    });
    this.collectionCallbacks.unsubscribe = unsubscribe;
  }

  /**
   * コレクションリスナーを解除
   */
  private unregisterCollectionListener(): void {
    this.collectionCallbacks.unsubscribe?.();
    this.collectionCallbacks.unsubscribe = undefined;
  }
}

export default CallbacksHandler;
