"use client";

import { useEffect, useState } from "react";
import {
  PlaneLayout,
  ViewToggle,
  KanbanView,
  CalendarView,
  KnowledgeBaseLayout,
  type ViewType,
} from "@/components/plane";
import { Button } from "@/components/tailwind/ui/button";
import { Plus } from "lucide-react";
import { createDocument, getAllProjects } from "@/lib/store/db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { Label } from "@/components/tailwind/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tailwind/ui/select";
import { useKnowledgeBaseDocumentSelection } from "@/hooks/use-knowledge-base-document-selection";
import { useI18n } from "@/lib/i18n";

interface ProjectOption {
  "project/id": string;
  "project/name": string;
}

export default function DocumentsPage() {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [mode, setMode] = useState<"browse" | "edit">("browse");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocProjectId, setNewDocProjectId] = useState("");
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { selectedDocumentId, handleSelectDocument, clearSelectedDocument } = useKnowledgeBaseDocumentSelection();
  const { t } = useI18n();

  useEffect(() => {
    try {
      setProjects(getAllProjects() as unknown as ProjectOption[]);
    } catch {
      setProjects([]);
    }
  }, []);

  const handleCreateDocument = () => {
    const docId = `doc-${Date.now()}`;
    createDocument({
      id: docId,
      title: newDocTitle.trim() || t("common.untitledDocument"),
      projectId: newDocProjectId || undefined,
    });
    setNewDocTitle("");
    setNewDocProjectId("");
    setIsCreateOpen(false);
    setRefreshKey((k) => k + 1);
    handleSelectDocument(docId);
    setMode("edit");
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
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5 rounded-xl bg-math-brand text-white hover:opacity-90">
                      <Plus className="h-4 w-4" />
                      {t("knowledgeBase.newDocument")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("knowledgeBase.createDocumentTitle")}</DialogTitle>
                      <DialogDescription>
                        {t("knowledgeBase.createDocumentDescription")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">{t("knowledgeBase.documentTitleLabel")}</Label>
                        <Input
                          id="title"
                          placeholder={t("knowledgeBase.documentTitlePlaceholder")}
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project">{t("knowledgeBase.projectOptionalLabel")}</Label>
                        <Select value={newDocProjectId} onValueChange={setNewDocProjectId}>
                          <SelectTrigger id="project">
                            <SelectValue placeholder={t("common.noProject")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">
                              {t("common.noProject")}
                            </SelectItem>
                            {projects.map((p) => (
                              <SelectItem key={p["project/id"]} value={p["project/id"]}>
                                {p["project/name"]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                        {t("common.cancel")}
                      </Button>
                      <Button onClick={handleCreateDocument}>{t("knowledgeBase.createDocumentAction")}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                  key={`cal-${refreshKey}`}
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
