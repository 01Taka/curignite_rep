import { Firestore, CollectionReference, collection, DocumentData } from "firebase/firestore";

class CollectionService {
  private _collectionPaths: string[];
  private _collectionRef?: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, collectionPaths: string | string[]) {
    this._collectionPaths = Array.isArray(collectionPaths) ? collectionPaths : [collectionPaths];
    if (!Array.isArray(collectionPaths)) {
      this._collectionRef = collection(this.firestore, collectionPaths);
    }
  }

  private setCollectionRef(path: string) {
    this._collectionRef = collection(this.firestore, path);
  }

  public setCollectionPath(paths: string[], callbackAtUpdatePath: (newPath: string) => void = () => {}): void {
    if (paths.length !== this._collectionPaths.length - 1) {
      throw new Error(`The number of provided paths (${paths.length}) does not match the expected number (${this._collectionPaths.length - 1}).`);
    }

    const newPath = this._collectionPaths.reduce((path, collectionPath, index) => {
      if (index !== 0) {
        path.push(paths[index - 1]);
      }
      path.push(collectionPath);
      return path;
    }, [] as string[]).join('/');

    if (!this._collectionRef || this._collectionRef.path !== newPath) {
      this.setCollectionRef(newPath);
      callbackAtUpdatePath(newPath);
    }
  }

  public get collectionRef(): CollectionReference<DocumentData> {
    if (!this._collectionRef) {
      throw new Error("Collection reference is not set. Call setCollectionPath first.");
    }
    return this._collectionRef;
  }

  public get collectionPath(): string {
    if (!this._collectionRef) {
      throw new Error("Collection reference is not set. Call setCollectionPath first.");
    }
    return this._collectionRef.path;
  }
}

export default CollectionService;
