"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getModules,
  deleteModule,
  createModule,
  getDocumentsByModule,
} from "@/lib/store/db";
import {
  Layers,
  Trash2,
  MoreHorizontal,
  Plus,
  FileText,
} from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Badge } from "@/components/tailwind/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/tailwind/ui/dropdown-menu";
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
import { Textarea } from "@/components/tailwind/ui/textarea";

interface ModuleData {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export function ModuleList() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");

  const [modules, setModules] = useState<ModuleData[]>([]);

  const loadModules = useCallback(() => {
    try {
      const data = getModules() as unknown as ModuleData[];
      setModules(data);
    } catch {
      setModules([]);
    }
  }, []);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const getModuleStats = (moduleId: string) => {
    try {
      const docs = getDocumentsByModule(moduleId);
      return { total: docs.length };
    } catch {
      return { total: 0 };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCreateModule = () => {
    if (!newModuleName.trim()) return;
    createModule(
      newModuleName.trim(),
      newModuleDescription.trim()
    );
    setNewModuleName("");
    setNewModuleDescription("");
    setIsCreateOpen(false);
    loadModules();
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm("Are you sure you want to delete this module?")) {
      deleteModule(moduleId);
      loadModules();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Modules</h2>
          <p className="text-muted-foreground">
            Organize your knowledge into modules
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
              <Plus className="h-4 w-4" />
              New Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
              <DialogDescription>
                Create a module to organize related documents
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Linear Algebra"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What topics does this module cover?"
                  value={newModuleDescription}
                  onChange={(e) => setNewModuleDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateModule} disabled={!newModuleName.trim()}>
                Create Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {modules.length === 0 ? (
        <Card className="border-dashed border-2 bg-gradient-to-b from-muted/30 to-transparent">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-6 ring-1 ring-blue-200/50 dark:ring-blue-700/30">
              <Layers className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No modules yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create modules to organize your knowledge into logical groups
            </p>
            <Button onClick={() => setIsCreateOpen(true)} size="lg" className="gap-2 rounded-xl shadow-sm shadow-primary/20">
              <Plus className="h-5 w-5" />
              Create Your First Module
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const stats = getModuleStats(module.id);
            
            return (
              <Card 
                key={module.id} 
                className="group relative hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-border/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-4 pb-2 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0 ring-1 ring-blue-200/50 dark:ring-blue-700/30">
                        <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-base font-semibold truncate">
                        {module.name}
                      </CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteModule(module.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  {module.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {module.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <FileText className="h-3 w-3" />
                      {stats.total} {stats.total === 1 ? "document" : "documents"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created {formatDate(module.createdAt)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
