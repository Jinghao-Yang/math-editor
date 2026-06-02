"use client";

import { useState, useCallback, useEffect } from "react";
import { FolderKanban } from "lucide-react";
import { ProjectList } from "./project-list";
import { ProjectForm } from "./project-form";
import { cn } from "@/lib/utils";

interface ProjectPanelProps {
  className?: string;
  onSelectProject?: (projectId: string | null) => void;
  selectedProjectId?: string | null;
}

export function ProjectPanel({ className, onSelectProject, selectedProjectId: externalSelectedProjectId }: ProjectPanelProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(externalSelectedProjectId ?? null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (externalSelectedProjectId !== undefined) {
      setSelectedProjectId(externalSelectedProjectId);
    }
  }, [externalSelectedProjectId]);

  const handleSelectProject = useCallback((projectId: string | null) => {
    setSelectedProjectId(projectId);
    onSelectProject?.(projectId);
  }, [onSelectProject]);

  const handleProjectCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div
      className={cn(
        "rounded-lg border border-muted bg-background shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-muted px-4 py-3">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Projects</h3>
        </div>
        <ProjectForm onProjectCreated={handleProjectCreated} />
      </div>
      <div className="p-2">
        <ProjectList
          key={refreshKey}
          onSelectProject={handleSelectProject}
          selectedProjectId={selectedProjectId}
        />
      </div>
    </div>
  );
}
