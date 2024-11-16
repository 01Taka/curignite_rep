import { DocumentSnapshot, QuerySnapshot, doc, onSnapshot, CollectionReference, Unsubscribe, getDoc, DocumentData } from "firebase/firestore";
import { BaseDocumentRead } from "../../../types/firebase/db/baseTypes";

export interface Callback<Read extends BaseDocumentRead> {
  unsubscribe?: Unsubscribe;
  func: Array<(data: Read) => void>;
}

export interface CollectionCallback<Read extends BaseDocumentRead> {
  unsubscribe?: Unsubscribe;
  func: Array<(data: Read[]) => void>;
}

class CallbacksHandler<Read extends BaseDocumentRead> {
  private writeCollectionRef: CollectionReference<Read>;
  private callbacks: Map<string, Callback<Read>> = new Map();
  private collectionCallbacks: CollectionCallback<Read> = { func: [] };

  constructor(collectionReference: CollectionReference<DocumentData, DocumentData>) {
    this.writeCollectionRef = collectionReference as CollectionReference<Read>;
  }

  addCallback(documentId: string, callback: (data: Read) => void): void {
    if (!this.callbacks.has(documentId)) {
      this.callbacks.set(documentId, { func: [] });
      this.registerSnapshotListener(documentId);
    }
    const callbackEntry = this.callbacks.get(documentId)!;
    if (!callbackEntry.func.includes(callback)) {
      callbackEntry.func.push(callback);
    }
  }

  removeCallback(documentId: string, callback: (data: Read) => void): void {
    const callbackEntry = this.callbacks.get(documentId);
    if (callbackEntry) {
      callbackEntry.func = callbackEntry.func.filter(cb => cb !== callback);
      if (callbackEntry.func.length === 0) {
        this.removeSnapshotListener(documentId);
        this.callbacks.delete(documentId);
      }
    }
  }

  async executeCallbacks(documentId: string): Promise<void> {
    try {
      const docSnapshot = await this.readAsDocumentSnapshot(documentId);
      this.handleSnapshotCallback(docSnapshot);
    } catch (error) {
      console.error(`Error executing callback for document ID ${documentId}:`, error);
    }
  }

  private async readAsDocumentSnapshot(documentId: string): Promise<DocumentSnapshot<Read>> {
    const docRef = doc(this.writeCollectionRef, documentId);
    return getDoc(docRef);
  }

  private handleSnapshotCallback(docSnapshot: DocumentSnapshot<Read>): void {
    const callbackEntry = this.callbacks.get(docSnapshot.id);
    if (callbackEntry) {
      const data = { ...docSnapshot.data(), docId: docSnapshot.id } as Read;
      callbackEntry.func.forEach(callback => callback(data));
    }
  }

  private registerSnapshotListener(documentId: string): void {
    const docRef = doc(this.writeCollectionRef, documentId);
    const unsubscribe = onSnapshot(docRef, (docSnapshot: DocumentSnapshot<Read>) => {
      this.handleSnapshotCallback(docSnapshot);
    });
    this.callbacks.get(documentId)!.unsubscribe = unsubscribe;
  }

  private removeSnapshotListener(documentId: string): void {
    const callbackEntry = this.callbacks.get(documentId);
    if (callbackEntry?.unsubscribe) {
      callbackEntry.unsubscribe();
    }
  }

  addCollectionCallback(callback: (data: Read[]) => void): void {
    if (!this.collectionCallbacks.func.includes(callback)) {
      this.collectionCallbacks.func.push(callback);
    }
    if (!this.collectionCallbacks.unsubscribe) {
      this.registerCollectionSnapshotListener();
    }
  }

  removeCollectionCallback(callback: (data: Read[]) => void): void {
    this.collectionCallbacks.func = this.collectionCallbacks.func.filter(cb => cb !== callback);
    if (this.collectionCallbacks.func.length === 0) {
      this.removeCollectionSnapshotListener();
    }
  }

  private registerCollectionSnapshotListener(): void {
    const unsubscribe = onSnapshot(this.writeCollectionRef, (querySnapshot: QuerySnapshot<Read>) => {
      const docsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id,
      })) as Read[];
      this.collectionCallbacks.func.forEach(callback => callback(docsData));
    });
    this.collectionCallbacks.unsubscribe = unsubscribe;
  }

  private removeCollectionSnapshotListener(): void {
    if (this.collectionCallbacks.unsubscribe) {
      this.collectionCallbacks.unsubscribe();
      this.collectionCallbacks.unsubscribe = undefined;
    }
  }
}

export default CallbacksHandler;
