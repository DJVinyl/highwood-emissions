import { PendingReadings } from '../types/types';

const DB_NAME = 'emissions-ingestion-db';
const DB_VERSION = 1;
const STORE_NAME = 'pending-readings';

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('siteId', 'siteId', { unique: false });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async savePendingReadings(data: PendingReadings): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingReadingsBySiteId(siteId: string): Promise<PendingReadings | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('siteId');
      const request = index.get(siteId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingReadingsById(id: string): Promise<PendingReadings | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deletePendingReadings(id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPendingReadings(): Promise<PendingReadings[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async updateRetryCount(id: string, retryCount: number): Promise<void> {
    {
      if (!this.db) {
        await this.init();
      }
    }
    const pending = await this.getPendingReadingsById(id);
    if (pending) {
      pending.retryCount = retryCount;
      pending.lastRetryAt = new Date();
      await this.savePendingReadings(pending);
    }
  }

  async updateReadings(
    id: string,
    readings: {
      reading: number;
      takenAt: Date;
      siteId: string;
    }[],
  ): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    const pending = await this.getPendingReadingsById(id);
    if (pending) {
      pending.readings = readings;
      await this.savePendingReadings(pending);
    }
  }
}

export const indexedDBManager = new IndexedDBManager();

export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

export function calculateBackoffDelay(retryCount: number): number {
  const baseDelayInSecs = 1_000;
  const maxDelayInSecs = 60_000;
  const delay = Math.min(baseDelayInSecs * Math.pow(2, retryCount), maxDelayInSecs);
  return delay;
}
