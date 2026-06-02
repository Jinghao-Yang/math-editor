import { syncQueue, type SyncQueueItem } from "./queue";
import { outlineClient, HttpError } from "@/lib/outline/client";
import { createDocument, updateDocumentSyncStatus } from "@/lib/store/db";

export type SyncManagerStatus = "idle" | "syncing" | "online" | "offline" | "error";

const RETRY_DELAYS = [1000, 3000, 5000];

class SyncManager {
  private status: SyncManagerStatus = "idle";
  private isRunning = false;
  private syncSuccessCallbacks: Array<(item: SyncQueueItem) => void> = [];
  private syncErrorCallbacks: Array<(item: SyncQueueItem, error: Error) => void> = [];
  private statusChangeCallbacks: Array<(status: SyncManagerStatus) => void> = [];

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.updateNetworkStatus();

    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    window.removeEventListener("online", this.handleOnline);
    window.removeEventListener("offline", this.handleOffline);
  }

  private handleOnline = (): void => {
    this.setStatus("online");
    this.sync();
  };

  private handleOffline = (): void => {
    this.setStatus("offline");
  };

  private updateNetworkStatus(): void {
    if (navigator.onLine) {
      this.setStatus("online");
    } else {
      this.setStatus("offline");
    }
  }

  private setStatus(newStatus: SyncManagerStatus): void {
    this.status = newStatus;
    this.statusChangeCallbacks.forEach((cb) => cb(newStatus));
  }

  getStatus(): SyncManagerStatus {
    return this.status;
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  async sync(): Promise<void> {
    if (!navigator.onLine) {
      this.setStatus("offline");
      return;
    }

    const pending = syncQueue.getPending();
    if (pending.length === 0) {
      this.setStatus("idle");
      return;
    }

    this.setStatus("syncing");

    for (const item of pending) {
      await this.processItem(item);
    }

    if (syncQueue.getPending().length === 0) {
      if (syncQueue.getFailed().length > 0) {
        this.setStatus("error");
      } else {
        this.setStatus("idle");
      }
    }
  }

  private async processItem(item: SyncQueueItem): Promise<void> {
    try {
      let docId = item.payload.outlineDocId;

      if (docId) {
        await outlineClient.updateDocument(docId, item.payload.title, item.payload.markdown);
      } else {
        const newDoc = await outlineClient.createDocument(item.payload.title, item.payload.markdown);
        docId = newDoc.id;
      }

      createDocument({
        id: item.payload.documentId,
        title: item.payload.title,
        outlineId: docId,
        syncStatus: "synced",
      });

      updateDocumentSyncStatus(item.payload.documentId, "synced");
      syncQueue.remove(item.id);

      this.syncSuccessCallbacks.forEach((cb) => cb(item));
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (err instanceof HttpError && err.status === 401) {
        updateDocumentSyncStatus(item.payload.documentId, "failed");
        this.setStatus("error");
        this.syncErrorCallbacks.forEach((cb) => cb(item, err));
        return;
      }

      syncQueue.incrementRetry(item.id);

      if (item.retries + 1 < 3) {
        const delay = RETRY_DELAYS[item.retries] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
        await this.delay(delay);
      } else {
        updateDocumentSyncStatus(item.payload.documentId, "failed");
        this.syncErrorCallbacks.forEach((cb) => cb(item, err));
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onSyncSuccess(callback: (item: SyncQueueItem) => void): void {
    this.syncSuccessCallbacks.push(callback);
  }

  onSyncError(callback: (item: SyncQueueItem, error: Error) => void): void {
    this.syncErrorCallbacks.push(callback);
  }

  onStatusChange(callback: (status: SyncManagerStatus) => void): void {
    this.statusChangeCallbacks.push(callback);
  }

  removeSyncSuccessCallback(callback: (item: SyncQueueItem) => void): void {
    this.syncSuccessCallbacks = this.syncSuccessCallbacks.filter((cb) => cb !== callback);
  }

  removeSyncErrorCallback(callback: (item: SyncQueueItem, error: Error) => void): void {
    this.syncErrorCallbacks = this.syncErrorCallbacks.filter((cb) => cb !== callback);
  }

  removeStatusChangeCallback(callback: (status: SyncManagerStatus) => void): void {
    this.statusChangeCallbacks = this.statusChangeCallbacks.filter((cb) => cb !== callback);
  }
}

export const syncManager = new SyncManager();
