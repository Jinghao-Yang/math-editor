"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllProjects, getAllDocuments, getProjectDocuments } from "@/lib/store/db";
import { FileText, Calendar, MoreHorizontal, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import { EmptyStateHero } from "@/components/tailwind/ui/EmptyStateHero";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/tailwind/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";

interface KanbanViewProps {
  groupBy?: "project" | "module";
  onSelectDocument?: (docId: string) => void;
  selectedDocumentId?: string | null;
}

interface DocumentData {
  "document/id"?: string;
  "document/title"?: string;
  "document/updatedAt"?: string;
  "document/syncStatus"?: string;
  "document/project"?: {
    "project/id"?: string;
    "project/name"?: string;
  } | null;
}

interface ProjectData {
  "project/id": string;
  "project/name": string;
}

// ---- 纯数据函数 ----

function loadProjects(): ProjectData[] {
  return (getAllProjects() as unknown as ProjectData[]) || [];
}

function loadProjectDocs(projects: ProjectData[]) {
  const docsMap: Record<string, DocumentData[]> = {};
  const categorizedIds = new Set<string>();

  for (const project of projects) {
    const pid = project["project/id"];
    if (!pid) continue;
    try {
      const docs = (getProjectDocuments(pid) as unknown as DocumentData[]).filter(
        (d) => d["document/id"]
      );
      docsMap[pid] = docs;
      for (const doc of docs) {
        if (doc["document/id"]) categorizedIds.add(doc["document/id"]);
      }
    } catch {
      docsMap[pid] = [];
    }
  }

  return { docsMap, categorizedIds };
}

function loadUncategorizedDocs(categorizedIds: Set<string>): DocumentData[] {
  try {
    return ((getAllDocuments() as unknown as DocumentData[]) || []).filter((doc) => {
      const docId = doc["document/id"];
      const hasProject = Boolean(doc["document/project"]?.["project/id"]);
      return typeof docId === "string" && !hasProject && !categorizedIds.has(docId);
    });
  } catch {
    return [];
  }
}

function formatDateFromStr(dateStr: string | undefined, locale: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---- 子组件 ----

function ColumnHeader({ name, count }: { name: string; count: number }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full border-2 border-math-text-tertiary" />
        <h3 className="text-xs font-bold text-math-text-secondary">{name}</h3>
      </div>
      <span className="bg-math-hover text-math-text-tertiary px-1.5 rounded-md text-[10px] tabular-nums">
        {count}
      </span>
    </div>
  );
}

function DocCard({
  doc,
  selected,
  onSelect,
  locale,
  t,
}: {
  doc: DocumentData;
  selected: boolean;
  onSelect: (id: string) => void;
  locale: string;
  t: (key: string) => string;
}) {
  const docId = doc["document/id"];
  if (!docId) return null;

  const title = doc["document/title"] || t("common.untitledDocument");
  const updatedAt = doc["document/updatedAt"];

  return (
    <button
      type="button"
      onClick={() => onSelect(docId)}
      className={cn(
        "w-full text-left",
        "object-card p-5",
        "cursor-pointer relative group",
        selected && "selected"
      )}
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="p-1 hover:bg-math-hover rounded text-math-text-tertiary">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/knowledge-base/documents?doc=${docId}`}
                className="flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {t("knowledgeBase.openInNewTab")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h4 className="text-[20px] font-bold tracking-tight leading-snug text-math-text mb-3 pr-8">
        {title}
      </h4>

      {updatedAt && (
        <div className="flex items-center gap-1.5 text-math-text-secondary text-[14px]">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>{formatDateFromStr(updatedAt, locale)}</span>
        </div>
      )}
    </button>
  );
}

// ---- 主组件 ----

export function KanbanView({
  groupBy: _groupBy = "project",
  onSelectDocument,
  selectedDocumentId,
}: KanbanViewProps) {
  const { locale, t } = useI18n();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectDocuments, setProjectDocuments] = useState<Record<string, DocumentData[]>>({});
  const [uncategorizedDocs, setUncategorizedDocs] = useState<DocumentData[]>([]);

  const refresh = useCallback(() => {
    const allProjects = loadProjects();
    setProjects(allProjects);
    const { docsMap, categorizedIds } = loadProjectDocs(allProjects);
    setProjectDocuments(docsMap);
    setUncategorizedDocs(loadUncategorizedDocs(categorizedIds));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const allColumns = [
    ...projects.map((project) => ({
      id: project["project/id"],
      name: project["project/name"] || t("common.untitledProject"),
      docs: projectDocuments[project["project/id"]] || [],
    })),
    ...(uncategorizedDocs.length > 0
      ? [
          {
            id: "__uncategorized__",
            name: t("knowledgeBase.uncategorized"),
            docs: uncategorizedDocs,
          },
        ]
      : []),
  ];

  if (allColumns.length === 0) {
    return (
      <EmptyStateHero
        icon={<FileText className="h-7 w-7" />}
        title={t("knowledgeBase.kanbanEmptyTitle")}
        description={t("knowledgeBase.kanbanEmptyDescription")}
      />
    );
  }

  return (
    <div className="-mx-2 px-2 pb-2">
      <div className="flex gap-5 overflow-x-auto pb-4 items-start">
        {allColumns.map((column) => (
          <div key={column.id} className="shrink-0 w-72 flex flex-col">
            <ColumnHeader name={column.name} count={column.docs.length} />

            {column.docs.length === 0 ? (
              <div className="flex-1 rounded-[16px] border-2 border-dashed border-math-border bg-math-bg flex items-center justify-center p-8">
                <div className="text-center">
                  <Plus className="h-5 w-5 text-math-text-tertiary mx-auto mb-2" />
                  <p className="text-xs text-math-text-secondary">
                    {t("knowledgeBase.noDocumentsInProject")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {column.docs.map((doc) => (
                  <DocCard
                    key={doc["document/id"]}
                    doc={doc}
                    selected={selectedDocumentId === doc["document/id"]}
                    onSelect={(id) => onSelectDocument?.(id)}
                    locale={locale}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
