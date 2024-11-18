import { CollectionReference, DocumentData, DocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { BaseDocumentRead } from "../../../types/firebase/db/baseTypes";
import CallbacksHandler from "./callbacksHandler";
import { parseDocumentSnapshot, parseQuerySnapshot } from "./utils";

export class CallbacksManager<Read extends BaseDocumentRead> {
  private callbacksInstances: Map<string, CallbacksHandler<Read>> = new Map();

  getInstance(
    collectionRef: CollectionReference<DocumentData>
  ): CallbacksHandler<Read> {
    const key = collectionRef.path;

    if (!this.callbacksInstances.has(key)) {
      this.callbacksInstances.set(key, new CallbacksHandler<Read>(collectionRef));
    }

    return this.callbacksInstances.get(key) as CallbacksHandler<Read>;
  }
}

export class ReadCallbacksManager<
  Read extends BaseDocumentRead
> {
  private callbacksHandler: CallbacksHandler<Read>;
  private callbackMap: Map<string, Map<(data: Read | null) => void, (snapshot: DocumentSnapshot<Read>) => void>>;
  private collectionCallbackMap: Map<(data: Read[]) => void, (snapshot: QuerySnapshot<Read>) => void>;

  constructor(
    callbacksHandler: CallbacksHandler<Read>
  ) {
    this.callbacksHandler = callbacksHandler;
    this.callbackMap = new Map();
    this.collectionCallbackMap = new Map();
  }

  /**
   * ドキュメント単体のコールバックを追加
   */
  addReadCallback(documentId: string, callback: (data: Read | null) => void): void {
    if (!this.callbackMap.has(documentId)) {
      this.callbackMap.set(documentId, new Map());
    }

    const mappedCallbacks = this.callbackMap.get(documentId)!;

    if (!mappedCallbacks.has(callback)) {
      const wrappedCallback = (snapshot: DocumentSnapshot<Read>) => {
        callback(parseDocumentSnapshot<Read>(snapshot));
      };
      mappedCallbacks.set(callback, wrappedCallback);

      this.callbacksHandler.addCallback(documentId, wrappedCallback);
    }
  }

  /**
   * ドキュメント単体のコールバックを削除
   */
  removeReadCallback(documentId: string, callback: (data: Read | null) => void): void {
    const mappedCallbacks = this.callbackMap.get(documentId);

    if (mappedCallbacks) {
      const wrappedCallback = mappedCallbacks.get(callback);

      if (wrappedCallback) {
        this.callbacksHandler.removeCallback(documentId, wrappedCallback);
        mappedCallbacks.delete(callback);

        if (mappedCallbacks.size === 0) {
          this.callbackMap.delete(documentId);
        }
      }
    }
  }

  /**
   * コレクション全体のコールバックを追加
   */
  addCollectionCallback(callback: (data: Read[]) => void): void {
    if (!this.collectionCallbackMap.has(callback)) {
      const wrappedCallback = (snapshot: QuerySnapshot<Read>) => {
        const data = parseQuerySnapshot<Read>(snapshot);
        callback(data);
      };
      this.collectionCallbackMap.set(callback, wrappedCallback);

      this.callbacksHandler.addCollectionCallback(wrappedCallback);
    }
  }

  /**
   * コレクション全体のコールバックを削除
   */
  removeCollectionCallback(callback: (data: Read[]) => void): void {
    const wrappedCallback = this.collectionCallbackMap.get(callback);

    if (wrappedCallback) {
      this.callbacksHandler.removeCollectionCallback(wrappedCallback);
      this.collectionCallbackMap.delete(callback);
    }
  }
}