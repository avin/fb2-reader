// Определение интерфейса для объекта события, чтобы улучшить типизацию
interface CustomEventTarget extends EventTarget {
  result: IDBDatabase;
}

export function dbWriteBook({ bookString, hash }) {
  return new Promise<void>((resolve, reject) => {
    const dbPromise: IDBOpenDBRequest = indexedDB.open('fb2Reader', 1);

    dbPromise.onupgradeneeded = (event) => {
      const db: IDBDatabase = (event.target as CustomEventTarget).result;
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'hash' });
      }
    };

    dbPromise.onsuccess = async (event) => {
      const db: IDBDatabase = (event.target as CustomEventTarget).result;

      const transaction = db.transaction('books', 'readwrite');
      const store = transaction.objectStore('books');
      const request = store.put({ hash: hash, bookString });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('Ошибка при сохранении строки:', request.error);
        reject();
      };
    };

    dbPromise.onerror = (event) => {
      console.error('Ошибка при открытии базы данных:', dbPromise.error);
      reject();
    };
  });
}

export function dbReadBook({ hash }) {
  return new Promise<string>((resolve, reject) => {
    const dbPromise: IDBOpenDBRequest = indexedDB.open('fb2Reader', 1);

    dbPromise.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as CustomEventTarget).result;
      const transaction = db.transaction('books', 'readonly');
      const store = transaction.objectStore('books');
      console.log('~~', hash);
      const request = store.get(hash);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.bookString);
        } else {
          console.error('Запись не найдена');
          reject();
        }
      };

      request.onerror = () => {
        console.error('Ошибка при чтении записи:', request.error);
        reject();
      };
    };

    dbPromise.onerror = (event) => {
      console.error('Ошибка при открытии базы данных:', dbPromise.error);
      reject();
    };
  });
}
