import { DocumentSnapshot, QuerySnapshot, doc, onSnapshot, CollectionReference, Unsubscribe, getDoc } from "firebase/firestore";
import { BaseDocumentData } from "../../types/firebase/db/baseTypes";

export interface Callback<T extends BaseDocumentData> {
  unsubscribe?: Unsubscribe;
  active: boolean;
  func: Array<(data: T) => void>;
}

export interface CollectionCallback<T extends BaseDocumentData> {
  unsubscribe?: Unsubscribe;
  active: boolean;
  func: Array<(data: T[]) => void>;
}

class FirestoreCallbacks<T extends BaseDocumentData> {
  private callbacks: { [documentId: string]: Callback<T> } = {};
  private collectionCallbacks: CollectionCallback<T> = { active: false, func: [] };

  constructor(private collectionRef: CollectionReference<T>) {}

  addCallback(documentId: string, callback: (data: T) => void): void {
    if (!this.callbacks[documentId]) {
      this.callbacks[documentId] = { active: true, func: [] };
      this.registerSnapshotListener(documentId);
    }
    if (!this.callbacks[documentId].func.includes(callback)) {
      this.callbacks[documentId].func.push(callback);
    }
  }

  removeCallback(documentId: string, callback: (data: T) => void): void {
    const callbackEntry = this.callbacks[documentId];
    if (callbackEntry) {
      callbackEntry.func = callbackEntry.func.filter(cb => cb !== callback);
      if (callbackEntry.func.length === 0) {
        this.removeSnapshotListener(documentId);
        delete this.callbacks[documentId];
      }
    }
  }  

  setActiveState(documentId: string, isActive: boolean): void {
    if (this.callbacks[documentId]) {
      this.callbacks[documentId].active = isActive;
    }
  }

  async executeCallbacks(documentId: string): Promise<void> {
    if (this.callbacks[documentId]) {
      const docSnapshot = await this.readAsDocumentSnapshot(documentId);
      this.handleSnapshotCallback(docSnapshot);
    }
  }

  private async readAsDocumentSnapshot(documentId: string): Promise<DocumentSnapshot<T>> {
    const docRef = doc(this.collectionRef, documentId);
    return await getDoc(docRef);
  }

  private handleSnapshotCallback(docSnapshot: DocumentSnapshot<T>): void {
    const callbackEntry = this.callbacks[docSnapshot.id];
    if (callbackEntry && callbackEntry.active) {
      const data = docSnapshot.data() as T;
      data.docId = docSnapshot.id;
      callbackEntry.func.forEach(callback => callback(data));
    }
  }

  private registerSnapshotListener(documentId: string): void {
    const docRef = doc(this.collectionRef, documentId);
    this.callbacks[documentId].unsubscribe = onSnapshot(docRef, (docSnapshot: DocumentSnapshot<T>) => {
      this.handleSnapshotCallback(docSnapshot);
    });
  }

  private removeSnapshotListener(documentId: string): void {
    if (this.callbacks[documentId] && this.callbacks[documentId].unsubscribe) {
      this.callbacks[documentId].unsubscribe!();
    }
  }

  addCollectionCallback(callback: (data: T[]) => void): void {
    if (!this.collectionCallbacks.func.includes(callback)) {
      this.collectionCallbacks.func.push(callback);
    }
    if (!this.collectionCallbacks.active) {
      this.registerCollectionSnapshotListener();
    }
  }

  removeCollectionCallback(callback: (data: T[]) => void): void {
    this.collectionCallbacks.func = this.collectionCallbacks.func.filter(cb => cb !== callback);
    if (this.collectionCallbacks.func.length === 0) {
      this.removeCollectionSnapshotListener();
    }
  }

  private registerCollectionSnapshotListener(): void {
    this.collectionCallbacks.unsubscribe = onSnapshot(this.collectionRef, (querySnapshot: QuerySnapshot<T>) => {
      const docsData = querySnapshot.docs.map(doc => {
        const data = doc.data() as T;
        data.docId = doc.id;
        return data;
      });
      this.collectionCallbacks.func.forEach(callback => callback(docsData));
    });
    this.collectionCallbacks.active = true;
  }

  private removeCollectionSnapshotListener(): void {
    if (this.collectionCallbacks.unsubscribe) {
      this.collectionCallbacks.unsubscribe!();
      this.collectionCallbacks.active = false;
    }
  }
}

export default FirestoreCallbacks;
