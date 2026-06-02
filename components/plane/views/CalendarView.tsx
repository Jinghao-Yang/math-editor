"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllProjects, getAllDocuments } from "@/lib/store/db";
import { FileText, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Badge } from "@/components/tailwind/ui/badge";

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
  selectedDocumentId 
}: CalendarViewProps) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const loadData = useCallback(() => {
    try {
      const allDocs = getAllDocuments() as unknown as DocumentData[];
      setDocuments(allDocs.filter((d) => d["document/id"]));
    } catch {
      setDocuments([]);
    }
    try {
      setProjects(getAllProjects() as unknown as ProjectData[]);
    } catch {
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const projectsMap = useCallback(() => {
    const map: Record<string, string> = {};
    for (const project of projects) {
      if (project["project/id"] && project["project/name"]) {
        map[project["project/id"]] = project["project/name"];
      }
    }
    return map;
  }, [projects]);

  const pmap = projectsMap();

  const groupByDate = () => {
    const groups: Record<string, DocumentData[]> = {};

    for (const doc of documents) {
      const dateStr = doc["document/updatedAt"];
      if (!dateStr) continue;

      const date = new Date(dateStr);
      const key = date.toISOString().split("T")[0];

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(doc);
    }

    return groups;
  };

  const groupedByDate = groupByDate();

  const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split("T")[0]) {
      return "Today";
    } else if (dateStr === yesterday.toISOString().split("T")[0]) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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

  return (
    <div className="space-y-6">
      {documents.length === 0 ? (
        <Card className="border-dashed border-2 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 flex items-center justify-center mx-auto mb-6 ring-1 ring-violet-200/50 dark:ring-violet-700/30">
              <Calendar className="h-10 w-10 text-violet-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
            <p className="text-muted-foreground">
              Create and edit documents to see them organized by date.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateStr) => {
            const docs = groupedByDate[dateStr];
            return (
              <div key={dateStr} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">
                      {formatDate(dateStr)}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {docs.length} {docs.length === 1 ? "document" : "documents"}
                  </Badge>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <div className="space-y-2 pl-6 border-l-2 border-border">
                  {docs.map((doc) => {
                    const docId = doc["document/id"];
                    const projectName = doc["document/project"]?.["project/id"]
                      ? pmap[doc["document/project"]["project/id"]]
                      : null;
                    
                    return (
                      <Card 
                        key={docId}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onSelectDocument && docId) {
                            onSelectDocument(docId);
                          }
                        }}
                        className={cn(
                          "group hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-200 border-border/50 overflow-hidden cursor-pointer",
                          selectedDocumentId === docId && "border-primary/50 shadow-md"
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
                                {doc["document/title"] || "Untitled"}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(doc["document/updatedAt"])}</span>
                              </div>
                              {projectName && (
                                <Badge variant="outline" className="text-xs">
                                  {projectName}
                                </Badge>
                              )}
                            </div>
                            <Badge 
                              variant={getSyncBadgeVariant(doc["document/syncStatus"])} 
                              className="text-xs"
                            >
                              {doc["document/syncStatus"] || "unsynced"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
