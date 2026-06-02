"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Clock, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryData, getAllProjects } from "@/lib/store/db";
import Link from "next/link";

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

  const loadDocuments = useCallback(() => {
    const allProjects = getAllProjects() as ProjectItem[];
    const pmap: Record<string, string> = {};
    for (const p of allProjects) {
      const pid = p["project/id"];
      if (pid) {
        pmap[pid] = p["project/name"] || "Untitled";
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
  }, [projectId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const getSyncIcon = (status?: string) => {
    switch (status) {
      case "synced":
        return <Check className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "error":
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSyncLabel = (status?: string) => {
    switch (status) {
      case "synced":
        return "Synced";
      case "pending":
        return "Pending";
      case "error":
      case "failed":
        return "Error";
      default:
        return status || "Unsynced";
    }
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <FileText className="mb-3 h-12 w-12 opacity-40" />
        <p className="text-sm">No documents yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => {
        const docId = doc["document/id"] || "";
        const title = doc["document/title"] || "Untitled";
        const syncStatus = doc["document/syncStatus"];
        const updatedAt = doc["document/updatedAt"];
        const projectRef = doc["document/project"];
        const associatedProjectId = projectRef && typeof projectRef === "object" ? projectRef["project/id"] : null;
        const associatedProjectName = associatedProjectId ? projectsMap[associatedProjectId] : null;

        return (
          <Link
            key={docId}
            href={`/?doc=${docId}`}
            className="flex items-center justify-between rounded-lg border border-muted bg-background px-4 py-3 shadow-sm transition-colors hover:bg-accent/50"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate">{title}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {associatedProjectName && (
                    <span className="truncate">{associatedProjectName}</span>
                  )}
                  {updatedAt && (
                    <span>{new Date(updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-3">
              {getSyncIcon(syncStatus)}
              <span className={cn(
                "text-xs",
                syncStatus === "synced" && "text-green-600",
                syncStatus === "pending" && "text-yellow-600",
                (syncStatus === "error" || syncStatus === "failed") && "text-red-600"
              )}>
                {getSyncLabel(syncStatus)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
