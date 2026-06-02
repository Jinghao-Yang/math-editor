"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/tailwind/ui/button";
import { syncManager, type SyncManagerStatus } from "@/lib/sync/manager";
import { syncQueue } from "@/lib/sync/queue";
import { cn } from "@/lib/utils";
import { Loader, Wifi, WifiOff, AlertCircle, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";

export function SyncStatusBar() {
  const [status, setStatus] = useState<SyncManagerStatus>("idle");
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateCounts = useCallback(() => {
    setPendingCount(syncQueue.getPendingCount());
    setFailedCount(syncQueue.getFailedCount());
  }, []);

  useEffect(() => {
    const handleStatusChange = (newStatus: SyncManagerStatus) => {
      setStatus(newStatus);
      updateCounts();
    };

    const handleSyncSuccess = () => {
      updateCounts();
      setErrorMessage(null);
    };

    const handleSyncError = (_item: unknown, error: Error) => {
      updateCounts();
      setErrorMessage(error.message);
    };

    syncManager.onStatusChange(handleStatusChange);
    syncManager.onSyncSuccess(handleSyncSuccess);
    syncManager.onSyncError(handleSyncError);

    updateCounts();

    return () => {
      syncManager.removeStatusChangeCallback(handleStatusChange);
      syncManager.removeSyncSuccessCallback(handleSyncSuccess);
      syncManager.removeSyncErrorCallback(handleSyncError);
    };
  }, [updateCounts]);

  const handleRetry = () => {
    setErrorMessage(null);
    syncManager.sync();
  };

  const handleClearQueue = () => {
    syncQueue.clear();
    updateCounts();
    setErrorMessage(null);
    setStatus("idle");
  };

  const isOnline = status !== "offline";
  const isSyncing = status === "syncing";
  const hasErrors = failedCount > 0 || status === "error";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 shadow-sm">
      {/* 网络状态指示器 */}
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            isOnline ? "bg-green-500" : "bg-red-500",
            isSyncing && "animate-pulse bg-yellow-500"
          )}
        />
        {isOnline ? (
          <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <WifiOff className="h-3.5 w-3.5 text-red-500" />
        )}
        <span className="text-xs text-muted-foreground">
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* 分隔线 */}
      <div className="h-4 w-px bg-border" />

      {/* 同步状态 */}
      <div className="flex items-center gap-1.5">
        {isSyncing ? (
          <>
            <Loader className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Syncing...</span>
          </>
        ) : hasErrors ? (
          <>
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs text-red-500">Sync failed</span>
          </>
        ) : pendingCount > 0 ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs text-muted-foreground">{pendingCount} pending</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs text-muted-foreground">Synced</span>
          </>
        )}
      </div>

      {/* 错误提示和按钮 */}
      {hasErrors && (
        <>
          <div className="h-4 w-px bg-border" />
          <Button
            variant="outline"
            size="sm"
            className="h-6 gap-1 px-2 text-xs"
            onClick={handleRetry}
          >
            <RotateCcw className="h-3 w-3" />
            Retry
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 gap-1 px-2 text-xs"
            onClick={handleClearQueue}
          >
            <Trash2 className="h-3 w-3" />
            Clear Queue
          </Button>
        </>
      )}

      {/* 错误消息 */}
      {errorMessage && (
        <span className="ml-1 max-w-[200px] truncate text-xs text-red-500" title={errorMessage}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
