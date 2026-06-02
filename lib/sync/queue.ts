export type SyncTaskType = "create" | "update" | "delete";

export interface SyncQueueItem {
  id: string;
  type: SyncTaskType;
  payload: {
    documentId: string;
    title: string;
    markdown: string;
    outlineDocId?: string | null;
  };
  retries: number;
  timestamp: number;
}

const STORAGE_KEY = "sync-queue";

class SyncQueue {
  private items: SyncQueueItem[] = [];
  private debounceTimer: number | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch {
      this.items = [];
    }
  }

  private saveToStorage(): void {
    if (typeof window === "undefined") return;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      } catch {
        // ignore storage errors
      }
    }, 100);
  }

  add(item: Omit<SyncQueueItem, "retries" | "timestamp">): SyncQueueItem {
    const existingIndex = this.items.findIndex((i) => i.id === item.id);
    const newItem: SyncQueueItem = {
      ...item,
      retries: 0,
      timestamp: Date.now(),
    };

    if (existingIndex >= 0) {
      this.items[existingIndex] = newItem;
    } else {
      this.items.push(newItem);
    }

    this.saveToStorage();
    return newItem;
  }

  remove(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    this.saveToStorage();
    return this.items.length < initialLength;
  }

  getAll(): SyncQueueItem[] {
    return [...this.items];
  }

  getPending(): SyncQueueItem[] {
    return this.items.filter((item) => item.retries < 3);
  }

  getFailed(): SyncQueueItem[] {
    return this.items.filter((item) => item.retries >= 3);
  }

  incrementRetry(id: string): boolean {
    const item = this.items.find((i) => i.id === id);
    if (!item) return false;
    item.retries += 1;
    this.saveToStorage();
    return true;
  }

  clear(): void {
    this.items = [];
    this.saveToStorage();
  }

  getCount(): number {
    return this.items.length;
  }

  getPendingCount(): number {
    return this.getPending().length;
  }

  getFailedCount(): number {
    return this.getFailed().length;
  }
}

export const syncQueue = new SyncQueue();
