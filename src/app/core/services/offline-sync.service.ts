import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private dbName = 'PrepTrackOfflineDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initIndexedDb();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.syncPendingChanges());
    }
  }

  private initIndexedDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) return resolve(this.db);
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported'));
      }

      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('outbox')) {
          db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(this.db!);
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }

  async getCached<T>(key: string): Promise<T | null> {
    try {
      const db = await this.initIndexedDb();
      return new Promise((resolve) => {
        const transaction = db.transaction('cache', 'readonly');
        const store = transaction.objectStore('cache');
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? req.result.value : null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async setCached<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.initIndexedDb();
      return new Promise((resolve) => {
        const transaction = db.transaction('cache', 'readwrite');
        const store = transaction.objectStore('cache');
        store.put({ key, value, timestamp: Date.now() });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve();
      });
    } catch {
      // Ignore in unsupported environments
    }
  }

  async enqueueSync(table: string, action: 'insert' | 'update' | 'delete', payload: any): Promise<void> {
    try {
      const db = await this.initIndexedDb();
      return new Promise((resolve) => {
        const transaction = db.transaction('outbox', 'readwrite');
        const store = transaction.objectStore('outbox');
        store.add({
          table,
          action,
          payload,
          user_id: this.authService.currentUser()?.id,
          createdAt: Date.now()
        });
        transaction.oncomplete = () => resolve();
      });
    } catch {
      // Fallback
    }
  }

  async syncPendingChanges(): Promise<void> {
    if (!navigator.onLine || !this.supabaseService.isRealSupabaseConfigured) return;

    try {
      const db = await this.initIndexedDb();
      const transaction = db.transaction('outbox', 'readwrite');
      const store = transaction.objectStore('outbox');
      const req = store.getAll();

      req.onsuccess = async () => {
        const items = req.result || [];
        for (const item of items) {
          try {
            if (item.action === 'insert' || item.action === 'update') {
              await this.supabaseService.clientInstance
                .from(item.table)
                .upsert(item.payload);
            } else if (item.action === 'delete') {
              await this.supabaseService.clientInstance
                .from(item.table)
                .delete()
                .eq('id', item.payload.id);
            }
          } catch (e) {
            console.error('Failed syncing outbox item:', item, e);
          }
        }

        // Clear outbox after processing
        const clearTx = db.transaction('outbox', 'readwrite');
        clearTx.objectStore('outbox').clear();
      };
    } catch (e) {
      console.error('Offline sync error:', e);
    }
  }
}
