"use client";

import { useState } from "react";
import { PlaneLayout, ViewToggle, KanbanView, CalendarView, KnowledgeBaseLayout, type ViewType } from "@/components/plane";
import { Button } from "@/components/tailwind/ui/button";
import { Plus } from "lucide-react";
import { createProject } from "@/lib/store/db";
import { useKnowledgeBaseDocumentSelection } from "@/hooks/use-knowledge-base-document-selection";
import { useI18n } from "@/lib/i18n";

export default function KnowledgeBasePage() {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [mode, setMode] = useState<"browse" | "edit">("browse");
  const [refreshKey, setRefreshKey] = useState(0);
  const { selectedDocumentId, handleSelectDocument, clearSelectedDocument } = useKnowledgeBaseDocumentSelection();
  const { t } = useI18n();

  const handleCreateProject = () => {
    createProject(t("common.untitledProject"));
    setRefreshKey((k) => k + 1);
  };

  const handleDocumentSelect = (docId: string) => {
    handleSelectDocument(docId);
    setMode("edit");
  };

  return (
    <PlaneLayout>
      <div className="h-full w-full canvas-grid">
        <KnowledgeBaseLayout
          mode={mode}
          documentId={selectedDocumentId}
          onBack={() => {
            setMode("browse");
            clearSelectedDocument();
          }}
        >
          {mode === "browse" && (
            <div className="h-full overflow-auto p-4 md:p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Button size="sm" className="gap-1.5 rounded-xl bg-math-brand text-white hover:opacity-90" onClick={handleCreateProject}>
                  <Plus className="h-4 w-4" />
                  {t("knowledgeBase.newProject")}
                </Button>
                <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
              </div>

              {currentView === "kanban" && (
                <KanbanView
                  key={`kanban-${refreshKey}`}
                  onSelectDocument={handleDocumentSelect}
                  selectedDocumentId={selectedDocumentId}
                />
              )}
              {currentView === "calendar" && (
                <CalendarView
                  key={`calendar-${refreshKey}`}
                  onSelectDocument={handleDocumentSelect}
                  selectedDocumentId={selectedDocumentId}
                />
              )}
              {currentView === "list" && (
                <KanbanView
                  key={`list-${refreshKey}`}
                  onSelectDocument={handleDocumentSelect}
                  selectedDocumentId={selectedDocumentId}
                />
              )}
            </div>
          )}
        </KnowledgeBaseLayout>
      </div>
    </PlaneLayout>
  );
}
