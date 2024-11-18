import { 
  DocumentSnapshot, 
  QuerySnapshot, 
  doc, 
  onSnapshot, 
  CollectionReference, 
  Unsubscribe 
} from "firebase/firestore";
import { BaseDocumentRead } from "../../../types/firebase/db/baseTypes";

// 個別ドキュメント用のコールバック
export interface Callback<Read extends BaseDocumentRead> {
  unsubscribe?: Unsubscribe;
  func: Array<(snapshot: DocumentSnapshot<Read>) => void>;
}

// コレクション全体用のコールバック
export interface CollectionCallback<Read extends BaseDocumentRead> {
  unsubscribe?: Unsubscribe;
  func: Array<(snapshot: QuerySnapshot<Read>) => void>;
}

class CallbacksHandler<Read extends BaseDocumentRead> {
  private readCollectionRef: CollectionReference<Read>;
  private callbacks: Map<string, Callback<Read>> = new Map();
  private collectionCallbacks: CollectionCallback<Read> = { func: [] };

  constructor(collectionReference: CollectionReference) {
    this.readCollectionRef = collectionReference as CollectionReference<Read>;
  }

  /**
   * 個別ドキュメントのコールバックを追加
   */
  addCallback(documentId: string, callback: (snapshot: DocumentSnapshot<Read>) => void): void {
    const callbackEntry = this.callbacks.get(documentId) ?? this.createDocumentCallbackEntry(documentId);
    if (!callbackEntry.func.includes(callback)) {
      callbackEntry.func.push(callback);
    }
  }

  /**
   * 個別ドキュメントのコールバックを削除
   */
  removeCallback(documentId: string, callback: (snapshot: DocumentSnapshot<Read>) => void): void {
    const callbackEntry = this.callbacks.get(documentId);
    if (callbackEntry) {
      callbackEntry.func = callbackEntry.func.filter(cb => cb !== callback);
      if (callbackEntry.func.length === 0) {
        this.unregisterDocumentListener(documentId);
        this.callbacks.delete(documentId);
      }
    }
  }

  /**
   * コレクション全体のコールバックを追加
   */
  addCollectionCallback(callback: (snapshot: QuerySnapshot<Read>) => void): void {
    if (!this.collectionCallbacks.func.includes(callback)) {
      this.collectionCallbacks.func.push(callback);
    }
    if (!this.collectionCallbacks.unsubscribe) {
      this.registerCollectionListener();
    }
  }

  /**
   * コレクション全体のコールバックを削除
   */
  removeCollectionCallback(callback: (snapshot: QuerySnapshot<Read>) => void): void {
    this.collectionCallbacks.func = this.collectionCallbacks.func.filter(cb => cb !== callback);
    if (this.collectionCallbacks.func.length === 0) {
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
    const entry = { func: [], unsubscribe };
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
