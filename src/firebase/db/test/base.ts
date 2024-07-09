import { Firestore, DocumentData, DocumentReference, DocumentSnapshot, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, CollectionReference, QueryConstraint, query } from "firebase/firestore";
import { db } from "../../firebase";

class BaseDB<T extends DocumentData> {
  protected collectionRef: CollectionReference<T>;
  private firestore: Firestore;

  constructor(collectionPath: string) {
    this.firestore = db;
    this.collectionRef = collection(this.firestore, collectionPath) as CollectionReference<T>;
  }

  async create(data: T): Promise<DocumentReference<T>> {
    const docRef = await addDoc(this.collectionRef, data);
    return docRef;
  }

  async read(id: string): Promise<DocumentSnapshot<T>> {
    const docRef = doc(this.collectionRef, id);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot;
  }

  async readAsObject(id: string): Promise<T | null> {
    const docSnapshot = await this.read(id);
    if (docSnapshot.exists()) {
      return docSnapshot.data() as T;
    } else {
      return null;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.collectionRef, id) as DocumentReference<T>; // ジェネリック型Tにキャスト
    await updateDoc(docRef, data as T); // dataをT型にキャスト
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }

  async getAll(...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<T>> {
    const q = query(this.collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  async getAllAsObjects(...queryConstraints: QueryConstraint[]): Promise<T[]> {
    const q = query(this.collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as T);
  }

  getSubCollection<K extends DocumentData>(parentId: string, subCollectionPath: string): CollectionReference<K> {
    return collection(this.firestore, `${this.collectionRef.path}/${parentId}/${subCollectionPath}`) as CollectionReference<K>;
  }

  async createInSubCollection<K extends DocumentData>(parentId: string, subCollectionPath: string, data: K): Promise<DocumentReference<K>> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const docRef = await addDoc(subCollectionRef, data);
    return docRef;
  }

  async readFromSubCollection<K extends DocumentData>(parentId: string, subCollectionPath: string, id: string): Promise<DocumentSnapshot<K>> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const docRef = doc(subCollectionRef, id);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot;
  }

  async readAsObjectFromSubCollection<K extends DocumentData>(parentId: string, subCollectionPath: string, id: string): Promise<K | null> {
    const docSnapshot = await this.readFromSubCollection<K>(parentId, subCollectionPath, id);
    if (docSnapshot.exists()) {
      return docSnapshot.data() as K;
    } else {
      return null;
    }
  }

  async updateInSubCollection<K extends DocumentData>(parentId: string, subCollectionPath: string, id: string, data: Partial<K>): Promise<void> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const docRef = doc(subCollectionRef, id) as DocumentReference<K>; // ジェネリック型Kにキャスト
    await updateDoc(docRef, data as K); // dataをK型にキャスト
  }

  async deleteFromSubCollection<K extends DocumentData>(parentId: string, subCollectionPath: string, id: string): Promise<void> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const docRef = doc(subCollectionRef, id);
    await deleteDoc(docRef);
  }

  async getAllFromSubCollection<K extends DocumentData>(parentId: string, subCollectionPath: string, ...queryConstraints: QueryConstraint[]): Promise<QuerySnapshot<K>> {
    const subCollectionRef = this.getSubCollection<K>(parentId, subCollectionPath);
    const q = query(subCollectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }
}

export default BaseDB;
