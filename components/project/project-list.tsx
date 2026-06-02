"use client";

import { useState, useEffect, useCallback } from "react";
import { FolderOpen, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllProjects, getProjectDocuments } from "@/lib/store/db";

interface ProjectListProps {
  onSelectProject?: (projectId: string | null) => void;
  selectedProjectId?: string | null;
}

interface ProjectItem {
  "project/id"?: string;
  "project/name"?: string;
  "project/description"?: string;
}

export function ProjectList({ onSelectProject, selectedProjectId }: ProjectListProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [docCounts, setDocCounts] = useState<Record<string, number>>({});

  const loadProjects = useCallback(() => {
    const allProjects = getAllProjects() as ProjectItem[];
    setProjects(allProjects);

    const counts: Record<string, number> = {};
    for (const project of allProjects) {
      const projectId = project["project/id"];
      if (projectId) {
        const docs = getProjectDocuments(projectId);
        counts[projectId] = docs.length;
      }
    }
    setDocCounts(counts);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <FolderOpen className="mb-2 h-8 w-8 opacity-50" />
        <p className="text-sm">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {projects.map((project) => {
        const projectId = project["project/id"] || "";
        const name = project["project/name"] || "Untitled Project";
        const description = project["project/description"];
        const isSelected = selectedProjectId === projectId;
        const docCount = docCounts[projectId] || 0;

        return (
          <button
            key={projectId}
            onClick={() => onSelectProject?.(isSelected ? null : projectId)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
              isSelected
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50 text-foreground"
            )}
          >
            <div className="flex flex-col items-start gap-0.5 min-w-0">
              <span className="font-medium truncate">{name}</span>
              {description && (
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {description}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                {docCount}
              </span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isSelected && "rotate-90"
                )}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
