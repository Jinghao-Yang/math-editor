"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { getAllProjects, getAllDocuments } from "@/lib/store/db";
import { FileText, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface DocumentData {
  "document/id"?: string;
  "document/title"?: string;
  "document/updatedAt"?: string;
  "document/syncStatus"?: string;
  "document/project"?: {
    "project/id"?: string;
    "project/name"?: string;
  };
}

interface ProjectData {
  "project/id": string;
  "project/name": string;
}

interface CalendarViewProps {
  onSelectDocument?: (docId: string) => void;
  selectedDocumentId?: string | null;
}

export function CalendarView({
  onSelectDocument,
  selectedDocumentId,
}: CalendarViewProps) {
  const { locale, t } = useI18n();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const loadData = useCallback(() => {
    const allDocs = getAllDocuments() as unknown as DocumentData[];
    setDocuments(allDocs.filter((d) => d["document/id"]));
    setProjects(getAllProjects() as unknown as ProjectData[]);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const projectNames = Object.fromEntries(
    projects
      .filter((p) => p["project/id"] && p["project/name"])
      .map((p) => [p["project/id"], p["project/name"]])
  );

  const groupedByDate = (() => {
    const groups: Record<string, DocumentData[]> = {};
    for (const doc of documents) {
      const dateStr = doc["document/updatedAt"];
      if (!dateStr) continue;
      const key = new Date(dateStr).toISOString().split("T")[0];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(doc);
    }
    return groups;
  })();

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    if (dateStr === today) return t("knowledgeBase.today");
    if (dateStr === yesterday) return t("knowledgeBase.yesterday");

    return new Date(dateStr).toLocaleDateString(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
    });

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-14 md:py-16 rounded-[16px] border border-math-border bg-math-surface">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF2FF] text-math-brand">
          <CalendarIcon className="h-7 w-7" />
        </div>
        <h3 className="mt-6 max-w-sm text-balance text-center text-lg font-semibold text-math-text">
          {t("knowledgeBase.calendarEmptyTitle")}
        </h3>
        <p className="mt-2 max-w-md text-balance text-center text-sm leading-relaxed text-math-text-secondary">
          {t("knowledgeBase.calendarEmptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((dateStr) => {
        const docs = groupedByDate[dateStr];
        return (
          <div key={dateStr}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF] text-math-brand">
                  <CalendarIcon className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-sm font-semibold tracking-tight text-math-text">
                  {formatDateLabel(dateStr)}
                </h3>
              </div>
              <span className="text-xs font-medium tabular-nums text-math-text-tertiary">
                · {docs.length}
              </span>
              <div className="flex-1 h-px bg-math-border" />
            </div>

            <div className="ml-9 space-y-2 border-l-2 border-math-border pl-5">
              {docs.map((doc) => {
                const docId = doc["document/id"];
                const projectName =
                  doc["document/project"]?.["project/id"]
                    ? projectNames[doc["document/project"]["project/id"]]
                    : null;

                return (
                  <button
                    type="button"
                    key={docId}
                    onClick={() => docId && onSelectDocument?.(docId)}
                    className={cn(
                      "w-full text-left",
                      "object-card p-5",
                      "cursor-pointer",
                      selectedDocumentId === docId && "selected"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-math-hover text-math-text-secondary">
                          <FileText className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[20px] font-bold tracking-tight leading-snug truncate text-math-text">
                            {doc["document/title"] ||
                              t("common.untitledDocument")}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[14px] text-math-text-secondary">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(doc["document/updatedAt"] || "")}
                            </span>
                            {projectName && (
                              <span className="px-2.5 py-1 bg-math-hover text-math-text-secondary rounded-full text-[11px] font-medium border border-math-border">
                                {projectName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
