const DB_NAME = 'webos';
const DB_VERSION = 1;

export class IndexedDBStore {
  constructor() { this.db = null; }
  async open() {
    if (this.db) return this.db;
    this.db = await new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'path' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this.db;
  }
  async put(store, value) {
    const db = await this.open();
    await new Promise((res, rej) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    });
  }
  async get(store, key) {
    const db = await this.open();
    return await new Promise((res, rej) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error);
    });
  }
  async all(store) {
    const db = await this.open();
    return await new Promise((res, rej) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => res(req.result || []); req.onerror = () => rej(req.error);
    });
  }
  async delete(store, key) {
    const db = await this.open();
    await new Promise((res, rej) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    });
  }
}
