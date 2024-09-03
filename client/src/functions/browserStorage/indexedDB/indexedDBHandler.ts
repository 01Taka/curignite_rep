export class IndexedDBHandler<T> {
  private dbName: string;
  private storeName: string;
  private version: number;

  constructor(dbName: string, storeName: string, version: number = 1) {
      this.dbName = dbName;
      this.storeName = storeName;
      this.version = version;
  }

  private openDB(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
          const request = indexedDB.open(this.dbName, this.version);

          request.onupgradeneeded = (event) => {
              const db = (event.target as IDBOpenDBRequest).result;
              if (!db.objectStoreNames.contains(this.storeName)) {
                  db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
              }
          };

          request.onsuccess = () => {
              resolve(request.result);
          };

          request.onerror = (event) => {
              reject(`Failed to open database: ${(event.target as IDBOpenDBRequest).error}`);
          };
      });
  }

  public async addData(data: T): Promise<number> {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);

          const request = store.add(data);
          request.onsuccess = () => {
              resolve(request.result as number);  // Return the auto-incremented ID
          };

          request.onerror = () => {
              reject(`Failed to add data: ${request.error}`);
          };
      });
  }

  public async getData(id: number): Promise<T | null> {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, 'readonly');
          const store = transaction.objectStore(this.storeName);

          const request = store.get(id);
          request.onsuccess = () => {
              resolve(request.result || null);
          };

          request.onerror = () => {
              reject(`Failed to get data: ${request.error}`);
          };
      });
  }

  public async getAllData(): Promise<T[]> {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, 'readonly');
          const store = transaction.objectStore(this.storeName);

          const request = store.getAll();
          request.onsuccess = () => {
              resolve(request.result);
          };

          request.onerror = () => {
              reject(`Failed to get all data: ${request.error}`);
          };
      });
  }

  public async updateData(id: number, updatedData: Partial<T>): Promise<void> {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);

          const request = store.get(id);
          request.onsuccess = () => {
              const data = request.result;
              if (data) {
                  const updated = { ...data, ...updatedData };
                  const updateRequest = store.put(updated);
                  updateRequest.onsuccess = () => {
                      resolve();
                  };
                  updateRequest.onerror = () => {
                      reject(`Failed to update data: ${updateRequest.error}`);
                  };
              } else {
                  reject(`Data with ID ${id} not found`);
              }
          };
          request.onerror = () => {
              reject(`Failed to retrieve data for update: ${request.error}`);
          };
      });
  }

  public async deleteData(id: number): Promise<void> {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);

          const request = store.delete(id);
          request.onsuccess = () => {
              resolve();
          };

          request.onerror = () => {
              reject(`Failed to delete data: ${request.error}`);
          };
      });
  }

  public async clearStore(): Promise<void> {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);

          const request = store.clear();
          request.onsuccess = () => {
              resolve();
          };

          request.onerror = () => {
              reject(`Failed to clear store: ${request.error}`);
          };
      });
  }
}
