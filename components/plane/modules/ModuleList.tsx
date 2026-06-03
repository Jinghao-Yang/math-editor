"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useI18n } from "@/lib/i18n";

interface ModuleData {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export function ModuleList() {
  const { locale, t } = useI18n();
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
    return new Date(dateStr).toLocaleDateString(locale, {
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
    if (confirm(t("knowledgeBase.deleteModuleConfirm"))) {
      deleteModule(moduleId);
      loadModules();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">{t("knowledgeBase.modulesTitle")}</h2>
          <p className="text-[#6B7280]">
            {t("knowledgeBase.modulesDescription")}
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
              <Plus className="h-4 w-4" />
              {t("knowledgeBase.newModule")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("knowledgeBase.createModuleTitle")}</DialogTitle>
              <DialogDescription>
                {t("knowledgeBase.createModuleDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("knowledgeBase.moduleNameLabel")}</Label>
                <Input
                  id="name"
                  placeholder={t("knowledgeBase.moduleNamePlaceholder")}
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("knowledgeBase.moduleDescriptionLabel")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("knowledgeBase.moduleDescriptionPlaceholder")}
                  value={newModuleDescription}
                  onChange={(e) => setNewModuleDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleCreateModule} disabled={!newModuleName.trim()}>
                {t("knowledgeBase.createModuleAction")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {modules.length === 0 ? (
        <Card className="border-dashed border-2 border-[#E5E7EB] bg-[#F8F9FB]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mb-6">
              <Layers className="h-10 w-10 text-[#5E6AD2]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#111827]">{t("knowledgeBase.noModulesTitle")}</h3>
            <p className="text-[#6B7280] text-center max-w-sm mb-6">
              {t("knowledgeBase.noModulesDescription")}
            </p>
            <Button onClick={() => setIsCreateOpen(true)} size="lg" className="gap-2 rounded-xl">
              <Plus className="h-5 w-5" />
              {t("knowledgeBase.createFirstModuleAction")}
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
                className="group relative hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 border-[#E5E7EB] overflow-hidden"
              >
                <CardHeader className="p-4 pb-2 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                        <Layers className="h-4 w-4 text-[#5E6AD2]" />
                      </div>
                      <CardTitle className="text-base font-semibold truncate text-[#111827]">
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
                          {t("knowledgeBase.deleteModule")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  {module.description && (
                    <p className="text-sm text-[#6B7280] line-clamp-2">
                      {module.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <FileText className="h-3 w-3" />
                      {stats.total === 1
                        ? t("knowledgeBase.moduleDocumentCountOne", { count: stats.total })
                        : t("knowledgeBase.moduleDocumentCountOther", { count: stats.total })}
                    </Badge>
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    {t("knowledgeBase.moduleCreatedAt", { date: formatDate(module.createdAt) })}
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
