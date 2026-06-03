"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/tailwind/ui/button";
import { FeedbackState } from "@/components/tailwind/ui/feedback-state";
import { useI18n } from "@/lib/i18n";
import { syncManager, type SyncManagerStatus } from "@/lib/sync/manager";
import { syncQueue } from "@/lib/sync/queue";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Loader,
  RotateCcw,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";

export function SyncStatusBar() {
  const { t } = useI18n();
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

  const syncSummary = (() => {
    if (isSyncing) {
      return {
        label: t("sync.status.syncingLabel"),
        description:
          pendingCount > 0
            ? t("sync.status.syncingPendingDescription", { count: pendingCount })
            : t("sync.status.syncingDescription"),
        tone: "info" as const,
        icon: <Loader className="h-4 w-4 animate-spin" />,
      };
    }

    if (hasErrors) {
      return {
        label: t("sync.status.errorLabel"),
        description:
          failedCount > 0
            ? t("sync.status.errorWithCountDescription", { count: failedCount })
            : t("sync.status.errorDescription"),
        tone: "error" as const,
        icon: <AlertCircle className="h-4 w-4" />,
      };
    }

    if (pendingCount > 0) {
      return {
        label: t("sync.status.queuedLabel"),
        description: t("sync.status.queuedDescription", { count: pendingCount }),
        tone: "warning" as const,
        icon: <CheckCircle2 className="h-4 w-4" />,
      };
    }

    return {
      label: t("sync.status.syncedLabel"),
      description: t("sync.status.syncedDescription"),
      tone: "success" as const,
      icon: <CheckCircle2 className="h-4 w-4" />,
    };
  })();

  return (
    <div className="ui-panel flex flex-col gap-3 px-4 py-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-subtle",
              isOnline
                ? "border-[hsl(var(--success)/0.24)] bg-[hsl(var(--success)/0.10)] text-foreground"
                : "border-[hsl(var(--destructive)/0.24)] bg-[hsl(var(--destructive)/0.08)] text-foreground"
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isSyncing
                  ? "animate-pulse bg-[hsl(var(--warning))]"
                  : isOnline
                    ? "bg-[hsl(var(--success))]"
                    : "bg-[hsl(var(--destructive))]"
              )}
            />
            {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            <span>{isOnline ? t("sync.network.online") : t("sync.network.offline")}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span>{t("sync.counters.pending", { count: pendingCount })}</span>
            <span className="text-border">/</span>
            <span>{t("sync.counters.failed", { count: failedCount })}</span>
          </div>
        </div>
        {!hasErrors ? (
          <span className="text-xs text-muted-foreground">{syncSummary.description}</span>
        ) : null}
      </div>

      <FeedbackState
        compact
        icon={syncSummary.icon}
        title={syncSummary.label}
        description={errorMessage ?? syncSummary.description}
        tone={syncSummary.tone}
        action={
          hasErrors ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3 text-xs"
                onClick={handleRetry}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t("sync.actions.retry")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3 text-xs"
                onClick={handleClearQueue}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("sync.actions.clearQueue")}
              </Button>
            </>
          ) : undefined
        }
      />
    </div>
  );
}
