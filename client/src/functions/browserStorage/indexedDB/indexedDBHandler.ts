export class IndexedDBHandler<T extends string> {
  constructor(
    private dbName: string,
    private dbStoreNames: T[],
    private version: number = 1,
    private timeout: number = 5000
  ) { }

  getStoreHandler<U>(storeName: T): IndexedDBStoreHandler<U> {
    return new IndexedDBStoreHandler<U>(this.openDB.bind(this), storeName);
  }

  private async openDB(): Promise<IDBDatabase> {
    try {
      return await Promise.race([
        this.openDatabaseRequest(),
        this.timeoutPromise('openDB operation'),
      ]);
    } catch (error) {
      throw new Error(`Error opening database: ${error}`);
    }
  }

  private openDatabaseRequest(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.dbStoreNames.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            console.log(`Object store ${storeName} created`);
          }
        });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(`Failed to open database: ${(request.error || "Unknown error")}`);
    });
  }

  private timeoutPromise(operation: string): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(
        () => reject(`${operation} timed out after ${this.timeout}ms for database: ${this.dbName}`),
        this.timeout
      )
    );
  }

  public async deleteDatabase(): Promise<void> {
    try {
      await Promise.race([this.deleteDatabaseRequest(), this.timeoutPromise('Delete operation')]);
    } catch (error) {
      throw new Error(`Error deleting database: ${error}`);
    }
  }

  private deleteDatabaseRequest(): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(this.dbName);

      deleteRequest.onsuccess = () => {
        console.log(`Database ${this.dbName} deleted successfully`);
        resolve();
      };

      deleteRequest.onerror = () =>
        reject(`Failed to delete database: ${(deleteRequest.error || "Unknown error")}`);
      deleteRequest.onblocked = () => reject(`Delete operation blocked for database: ${this.dbName}`);
    });
  }
}

class IndexedDBStoreHandler<T> {
  constructor(private dbPromise: () => Promise<IDBDatabase>, private storeName: string) {}

  private async withTransaction<R>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<R>
  ): Promise<R> {
    const db = await this.dbPromise();
    return new Promise<R>((resolve, reject) => {
      const transaction = db.transaction(this.storeName, mode);
      const store = transaction.objectStore(this.storeName);
      const request = operation(store);
  
      request.onsuccess = () => resolve(request.result as R);
      request.onerror = () => reject(`Failed operation on ${this.storeName}: ${(request.error || "Unknown error")}`);
  
      transaction.oncomplete = () => console.log(`Transaction on ${this.storeName} completed successfully`);
      transaction.onerror = () => reject(`Transaction failed on ${this.storeName}: ${(transaction.error || "Unknown error")}`);
    });
  }  

  public addData(data: T): Promise<IDBValidKey> {
    return this.withTransaction('readwrite', (store) => store.add(data));
  }

  public getData(id: number): Promise<T | null> {
    return this.withTransaction('readonly', (store) => store.get(id));
  }

  public getAllData(): Promise<T[]> {
    return this.withTransaction('readonly', (store) => store.getAll());
  }

  public async updateData(id: number, updatedData: Partial<T>): Promise<void> {
    const currentData = await this.getData(id);
    if (!currentData) {
      throw new Error(`Data with ID ${id} not found`);
    }
  
    const mergedData = { ...currentData, ...updatedData };
    await this.withTransaction('readwrite', (store) => store.put(mergedData));
  }

  public deleteData(id: number): Promise<void> {
    return this.withTransaction('readwrite', (store) => store.delete(id));
  }

  public clearStore(): Promise<void> {
    return this.withTransaction('readwrite', (store) => store.clear());
  }
}