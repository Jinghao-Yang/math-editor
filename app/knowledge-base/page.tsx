"use client";

import { useState, useCallback } from "react";
import { PlaneLayout, ViewToggle, KanbanView, CalendarView, KnowledgeBaseLayout, type ViewType } from "@/components/plane";
import { Button } from "@/components/tailwind/ui/button";
import { Plus } from "lucide-react";
import { createProject } from "@/lib/store/db";

export default function KnowledgeBasePage() {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [projectName, setProjectName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const handleCreateProject = () => {
    const name = projectName.trim() || "Untitled Project";
    createProject(name);
    setProjectName("");
    setRefreshKey((k) => k + 1);
  };

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleSelectDocument = (docId: string) => {
    setSelectedDocumentId(docId);
  };

  const ViewContainer = ({ children }: { children: React.ReactNode }) => children;

  return (
    <PlaneLayout>
      <div className="h-full w-full">
        <KnowledgeBaseLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Projects</h2>
                <p className="text-muted-foreground">
                  Manage your projects and documents
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5 rounded-lg shadow-sm" onClick={handleCreateProject}>
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
                <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
              </div>
            </div>

            <ViewContainer>
              {currentView === "kanban" && (
                <KanbanView 
                  key={refreshKey} 
                  onSelectDocument={handleSelectDocument}
                  selectedDocumentId={selectedDocumentId}
                />
              )}
              {currentView === "calendar" && (
                <CalendarView 
                  key={refreshKey} 
                  onSelectDocument={handleSelectDocument}
                  selectedDocumentId={selectedDocumentId}
                />
              )}
              {currentView === "list" && (
                <KanbanView 
                  key={refreshKey} 
                  onSelectDocument={handleSelectDocument}
                  selectedDocumentId={selectedDocumentId}
                />
              )}
            </ViewContainer>
          </div>
        </KnowledgeBaseLayout>
      </div>
    </PlaneLayout>
  );
}
