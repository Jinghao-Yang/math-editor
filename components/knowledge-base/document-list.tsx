"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Clock } from "lucide-react";
import { EmptyStateHero } from "@/components/tailwind/ui/EmptyStateHero";
import { cn } from "@/lib/utils";
import { queryData, getAllProjects } from "@/lib/store/db";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

interface DocumentListProps {
  projectId?: string | null;
}

interface DocumentItem {
  "document/id"?: string;
  "document/title"?: string;
  "document/outlineId"?: string;
  "document/syncStatus"?: string;
  "document/updatedAt"?: string;
  "document/project"?: {
    "project/id"?: string;
    "project/name"?: string;
  } | null;
}

interface ProjectItem {
  "project/id"?: string;
  "project/name"?: string;
}

export function DocumentList({ projectId }: DocumentListProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [projectsMap, setProjectsMap] = useState<Record<string, string>>({});
  const { t } = useI18n();

  const loadDocuments = useCallback(() => {
    const allProjects = getAllProjects() as ProjectItem[];
    const pmap: Record<string, string> = {};
    for (const p of allProjects) {
      const pid = p["project/id"];
      if (pid) {
        pmap[pid] = p["project/name"] || t("common.untitledProject");
      }
    }
    setProjectsMap(pmap);

    const results = queryData<unknown[]>(
      [
        "?find",
        ["?e"],
        "?where",
        projectId
          ? [
              ["?p", "project/id", projectId],
              ["?e", "document/project", "?p"],
            ]
          : [["?e", "document/id", "?id"]],
      ]
    );

    const loadedDocs: DocumentItem[] = results.map((result: unknown) => {
      const entity = (result as unknown[])[0] as Record<string, unknown>;
      return entity as DocumentItem;
    });

    setDocuments(loadedDocs.filter((d) => d["document/id"]));
  }, [projectId, t]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  if (documents.length === 0) {
    return (
      <EmptyStateHero
        icon={<FileText className="h-7 w-7" />}
        title={t("knowledgeBase.documentListEmptyTitle")}
        description={t("knowledgeBase.documentListEmptyDescription")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((doc) => {
        const docId = doc["document/id"] || "";
        const title = doc["document/title"] || t("common.untitledDocument");
        const updatedAt = doc["document/updatedAt"];
        const projectRef = doc["document/project"];
        const associatedProjectId =
          projectRef && typeof projectRef === "object"
            ? projectRef["project/id"]
            : null;
        const associatedProjectName = associatedProjectId
          ? projectsMap[associatedProjectId]
          : null;

        return (
          <Link
            key={docId}
            href={`/knowledge-base/documents?doc=${docId}`}
            className={cn("object-card p-5 flex flex-col cursor-pointer")}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-math-hover">
                <FileText className="h-4 w-4 text-math-text-secondary" />
              </div>
              <h3 className="text-[20px] font-bold tracking-tight leading-snug line-clamp-2 text-math-text">
                {title}
              </h3>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2">
              {associatedProjectName ? (
                <span className="px-2.5 py-1 bg-math-hover text-math-text-secondary rounded-full text-[11px] font-medium border border-math-border">
                  {associatedProjectName}
                </span>
              ) : (
                <span />
              )}
              {updatedAt && (
                <div className="flex items-center gap-1 text-[14px] text-math-text-secondary shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
