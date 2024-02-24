export class IndexedDBClient {
  private constructor(private db: IDBDatabase) {}

  static open(
    name: string,
    version: number,
    stores: {
      name: string;
      options?: IDBObjectStoreParameters;
    }[],
  ): Promise<IndexedDBClient> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        stores.forEach((storeObj) => {
          if (!db.objectStoreNames.contains(storeObj.name)) {
            db.createObjectStore(storeObj.name, storeObj.options);
          }
        });
      };

      request.onsuccess = () => {
        resolve(new IndexedDBClient(request.result));
      };

      request.onerror = (event) => {
        reject(new Error(`IndexedDB error: ${request.error?.message}`));
      };
    });
  }

  write(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database has not been initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new Error(`Write operation failed: ${request.error?.message}`));
    });
  }

  read<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database has not been initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Read operation failed: ${request.error?.message}`));
    });
  }

  readAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database has not been initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(new Error(`Read all operation failed: ${request.error?.message}`));
    });
  }

  delete(storeName: string, key: IDBValidKey): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database has not been initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new Error(`Delete operation failed: ${request.error?.message}`));
    });
  }
}
