"use client";

import { useState, useEffect, useCallback } from "react";
import { Link2, Unlink, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/tailwind/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tailwind/ui/popover";
import { getAllProjects, queryData, transactData } from "@/lib/store/db";
import { useI18n } from "@/lib/i18n";

interface DocumentAssociationProps {
  documentId: string;
  onAssociationChange?: () => void;
}

interface ProjectItem {
  "project/id"?: string;
  "project/name"?: string;
}

export function updateDocumentProject(documentId: string, projectId: string | null) {
  const txData: Record<string, unknown> = {
    "document/id": documentId,
  };

  if (projectId) {
    txData["document/project"] = ["project/id", projectId];
  } else {
    txData["document/project"] = null;
  }

  return transactData([txData]);
}

export function DocumentAssociation({ documentId, onAssociationChange }: DocumentAssociationProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const loadData = useCallback(() => {
    const allProjects = getAllProjects() as ProjectItem[];
    setProjects(allProjects);

    const results = queryData(
      [
        "?find",
        ["?p"],
        "?where",
        [
          ["?e", "document/id", documentId],
          ["?e", "document/project", "?p"],
        ],
      ]
    ) as unknown[][];

    if (results.length > 0) {
      const projectEntity = results[0][0] as Record<string, unknown>;
      const pid = projectEntity["project/id"] as string | undefined;
      const pname = projectEntity["project/name"] as string | undefined;
      setCurrentProjectId(pid || null);
      setCurrentProjectName(pname || null);
    } else {
      setCurrentProjectId(null);
      setCurrentProjectName(null);
    }
  }, [documentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAssociate = (projectId: string | null) => {
    updateDocumentProject(documentId, projectId);
    loadData();
    onAssociationChange?.();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5",
            currentProjectId && "border-primary/50 text-primary"
          )}
        >
          {currentProjectId ? (
            <Link2 className="h-3.5 w-3.5" />
          ) : (
            <Unlink className="h-3.5 w-3.5" />
          )}
          <span className="max-w-[120px] truncate">
            {currentProjectName || t("project.associate")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="space-y-1">
          {currentProjectId && (
            <button
              type="button"
              onClick={() => handleAssociate(null)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span>{t("project.removeAssociation")}</span>
              <Unlink className="h-3.5 w-3.5" />
            </button>
          )}
          {projects.length === 0 ? (
            <div className="px-2 py-3 text-center text-sm text-muted-foreground">
              {t("project.noProjectsAvailable")}
            </div>
          ) : (
            projects.map((project) => {
              const pid = project["project/id"] || "";
              const pname = project["project/name"] || t("common.untitledProject");
              const isSelected = currentProjectId === pid;

              return (
                <button
                  type="button"
                  key={pid}
                  onClick={() => handleAssociate(pid)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 text-foreground"
                  )}
                >
                  <span className="truncate">{pname}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
