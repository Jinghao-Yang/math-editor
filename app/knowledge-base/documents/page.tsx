"use client";

import { useState, useEffect } from "react";
import { PlaneLayout, ViewToggle, KanbanView, CalendarView, KnowledgeBaseLayout, type ViewType } from "@/components/plane";
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

interface ProjectOption { "project/id": string; "project/name": string }

export default function DocumentsPage() {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocProjectId, setNewDocProjectId] = useState("");
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

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
      title: newDocTitle.trim() || "Untitled Document",
      projectId: newDocProjectId || undefined,
    });
    setNewDocTitle("");
    setNewDocProjectId("");
    setIsCreateOpen(false);
    setRefreshKey((k) => k + 1);
    setSelectedDocumentId(docId);
  };

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
                <h2 className="text-2xl font-bold">Documents</h2>
                <p className="text-muted-foreground">
                  View and manage your documents
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
                      <Plus className="h-4 w-4" />
                      New Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Document</DialogTitle>
                      <DialogDescription>
                        Create a new document and start writing
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Document title"
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project">Project (optional)</Label>
                        <select
                          id="project"
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                          value={newDocProjectId}
                          onChange={(e) => setNewDocProjectId(e.target.value)}
                        >
                          <option value="">No project</option>
                          {projects.map((p) => (
                            <option key={p["project/id"]} value={p["project/id"]}>
                              {p["project/name"]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateDocument}>
                        Create Document
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
              </div>
            </div>

            <ViewContainer>
              {currentView === "kanban" && (
                <KanbanView 
                  key={`kanban-${refreshKey}`} 
                  onSelectDocument={handleSelectDocument}
                  selectedDocumentId={selectedDocumentId}
                />
              )}
              {currentView === "calendar" && (
                <CalendarView 
                  key={`cal-${refreshKey}`} 
                  onSelectDocument={handleSelectDocument}
                  selectedDocumentId={selectedDocumentId}
                />
              )}
              {currentView === "list" && (
                <KanbanView 
                  key={`list-${refreshKey}`} 
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
