"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllProjects, getProjectDocuments, createDocument } from "@/lib/store/db";
import { FileText, Calendar, MoreHorizontal, ExternalLink, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Badge } from "@/components/tailwind/ui/badge";
import { Button } from "@/components/tailwind/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/tailwind/ui/dropdown-menu";

interface KanbanViewProps {
  groupBy?: "project" | "module";
  onSelectDocument?: (docId: string) => void;
  selectedDocumentId?: string | null;
}

interface DocumentData {
  id: string;
  title: string;
  updatedAt: string;
  syncStatus: string;
  outlineId?: string;
  projectId?: string;
}

interface ProjectData {
  "project/id": string;
  "project/name": string;
}

export function KanbanView({ 
  groupBy = "project", 
  onSelectDocument,
  selectedDocumentId 
}: KanbanViewProps) {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectDocuments, setProjectDocuments] = useState<Record<string, DocumentData[]>>({});
  const [uncategorizedDocs, setUncategorizedDocs] = useState<DocumentData[]>([]);

  const loadData = useCallback(() => {
    try {
      const allProjects = getAllProjects() as unknown as ProjectData[];
      setProjects(allProjects);

      const docsMap: Record<string, DocumentData[]> = {};
      const categorizedIds = new Set<string>();

      for (const project of allProjects) {
        const pid = project["project/id"];
        if (pid) {
          try {
            const docs = getProjectDocuments(pid) as unknown as DocumentData[];
            docsMap[pid] = docs;
            docs.forEach((d) => { if (d.id) categorizedIds.add(d.id); });
          } catch {
            docsMap[pid] = [];
          }
        }
      }
      setProjectDocuments(docsMap);

      try {
        const allDocs = getProjectDocuments("") as unknown as DocumentData[];
        setUncategorizedDocs(allDocs.filter((doc) => !categorizedIds.has(doc.id)));
      } catch {
        setUncategorizedDocs([]);
      }
    } catch {
      setProjects([]);
      setProjectDocuments({});
      setUncategorizedDocs([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createDocInProject = (projectId: string) => {
    const docId = `doc-${Date.now()}`;
    createDocument({
      id: docId,
      title: "Untitled Document",
      projectId,
    });
    loadData();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSyncBadgeVariant = (status: string) => {
    switch (status) {
      case "synced":
        return "default" as const;
      case "pending":
        return "secondary" as const;
      case "failed":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const DocumentCard = ({ doc }: { doc: DocumentData }) => (
    <Card 
      onClick={(e) => {
        e.preventDefault();
        if (onSelectDocument) {
          onSelectDocument(doc.id);
        }
      }}
      className={cn(
        "group cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-200 border-border/50 overflow-hidden",
        selectedDocumentId === doc.id && "border-primary/50 shadow-md"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="p-3.5 pb-1.5 relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-muted/60 flex items-center justify-center flex-shrink-0">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-semibold truncate">
              {doc.title || "Untitled"}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/?doc=${doc.id}`} className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open in new tab
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(doc.updatedAt)}</span>
          </div>
          <Badge variant={getSyncBadgeVariant(doc.syncStatus)} className="text-xs">
            {doc.syncStatus || "unsynced"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {projects.length === 0 && uncategorizedDocs.length === 0 ? (
        <Card className="border-dashed border-2 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-200/50 dark:ring-emerald-700/30">
              <FileText className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Create a project and add some documents to see them here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Grouped by Projects */}
          {projects.map((project) => {
            const pid = project["project/id"];
            const docs = projectDocuments[pid] || [];
            
            return (
              <div key={pid} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-500/30" />
                    {project["project/name"] || "Untitled Project"}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {docs.length} {docs.length === 1 ? "doc" : "docs"}
                  </Badge>
                </div>
                
                {docs.length === 0 ? (
                  <div className={cn(
                    "rounded-lg border-2 border-dashed p-6 text-center",
                    "border-muted-foreground/20 bg-muted/20"
                  )}>
                    <p className="text-sm text-muted-foreground">
                      No documents in this project
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {docs.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Uncategorized */}
          {uncategorizedDocs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Uncategorized
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {uncategorizedDocs.length} {uncategorizedDocs.length === 1 ? "doc" : "docs"}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {uncategorizedDocs.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
