import { CollectionReference, DocumentData } from "firebase/firestore";
import { BaseDocumentRead } from "../../../types/firebase/db/baseTypes";
import CallbacksHandler from "./callbacksHandler";

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