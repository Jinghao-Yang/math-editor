"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCycles,
  deleteCycle,
  createCycle,
  getDocumentsByCycle,
} from "@/lib/store/db";
import {
  Calendar,
  CalendarClock,
  Trash2,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Badge } from "@/components/tailwind/ui/badge";
import { Progress } from "@/components/tailwind/ui/progress";
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

interface CycleData {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "paused";
  createdAt: string;
  updatedAt: string;
}

export function CycleList() {
  const { locale, t } = useI18n();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCycleName, setNewCycleName] = useState("");
  const [newCycleDescription, setNewCycleDescription] = useState("");
  const [newCycleStartDate, setNewCycleStartDate] = useState("");
  const [newCycleEndDate, setNewCycleEndDate] = useState("");

  const [cycles, setCycles] = useState<CycleData[]>([]);

  const loadCycles = useCallback(() => {
    try {
      const data = getCycles() as unknown as CycleData[];
      setCycles(data);
    } catch {
      setCycles([]);
    }
  }, []);

  useEffect(() => {
    loadCycles();
  }, [loadCycles]);

  const getCycleProgress = (cycleId: string) => {
    try {
      const docs = getDocumentsByCycle(cycleId);
      return { total: docs.length, completed: 0 };
    } catch {
      return { total: 0, completed: 0 };
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

  const getCycleStatusBadge = (cycle: CycleData) => {
    const now = new Date();
    const start = new Date(cycle.startDate);
    const end = new Date(cycle.endDate);
    
    if (cycle.status === "completed") {
      return <Badge variant="default">{t("knowledgeBase.cycleStatusCompleted")}</Badge>;
    }
    if (cycle.status === "paused") {
      return <Badge variant="secondary">{t("knowledgeBase.cycleStatusPaused")}</Badge>;
    }
    if (now < start) {
      return <Badge variant="outline">{t("knowledgeBase.cycleStatusUpcoming")}</Badge>;
    }
    if (now > end) {
      return <Badge variant="destructive">{t("knowledgeBase.cycleStatusOverdue")}</Badge>;
    }
    return <Badge variant="success">{t("knowledgeBase.cycleStatusActive")}</Badge>;
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return t("knowledgeBase.cycleStatusOverdue");
    if (diff === 0) return t("knowledgeBase.cycleDueToday");
    if (diff === 1) return t("knowledgeBase.cycleOneDayLeft");
    return t("knowledgeBase.cycleDaysLeft", { count: diff });
  };

  const handleCreateCycle = () => {
    if (!newCycleName.trim()) return;
    createCycle(
      newCycleName.trim(),
      newCycleStartDate || new Date().toISOString(),
      newCycleEndDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      newCycleDescription.trim()
    );
    setNewCycleName("");
    setNewCycleDescription("");
    setNewCycleStartDate("");
    setNewCycleEndDate("");
    setIsCreateOpen(false);
    loadCycles();
  };

  const handleDeleteCycle = (cycleId: string) => {
    if (confirm(t("knowledgeBase.deleteCycleConfirm"))) {
      deleteCycle(cycleId);
      loadCycles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">{t("knowledgeBase.cyclesTitle")}</h2>
          <p className="text-[#6B7280]">
            {t("knowledgeBase.cyclesDescription")}
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
              <Plus className="h-4 w-4" />
              {t("knowledgeBase.newCycle")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("knowledgeBase.createCycleTitle")}</DialogTitle>
              <DialogDescription>
                {t("knowledgeBase.createCycleDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("knowledgeBase.cycleNameLabel")}</Label>
                <Input
                  id="name"
                  placeholder={t("knowledgeBase.cycleNamePlaceholder")}
                  value={newCycleName}
                  onChange={(e) => setNewCycleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("knowledgeBase.cycleDescriptionLabel")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("knowledgeBase.cycleDescriptionPlaceholder")}
                  value={newCycleDescription}
                  onChange={(e) => setNewCycleDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t("knowledgeBase.startDateLabel")}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCycleStartDate.split("T")[0]}
                    onChange={(e) => setNewCycleStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t("knowledgeBase.endDateLabel")}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCycleEndDate.split("T")[0]}
                    onChange={(e) => setNewCycleEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleCreateCycle} disabled={!newCycleName.trim()}>
                {t("knowledgeBase.createCycleAction")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {cycles.length === 0 ? (
        <Card className="border-dashed border-2 border-[#E5E7EB] bg-[#F8F9FB]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-[#FFF7ED] flex items-center justify-center mb-6">
              <CalendarClock className="h-10 w-10 text-category-orange" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#111827]">{t("knowledgeBase.noCyclesTitle")}</h3>
            <p className="text-[#6B7280] text-center max-w-sm mb-6">
              {t("knowledgeBase.noCyclesDescription")}
            </p>
            <Button onClick={() => setIsCreateOpen(true)} size="lg" className="gap-2 rounded-xl">
              <Plus className="h-5 w-5" />
              {t("knowledgeBase.createFirstCycleAction")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cycles.map((cycle) => {
            const progress = getCycleProgress(cycle.id);
            const progressPercent = progress.total > 0 
              ? Math.round((progress.completed / progress.total) * 100) 
              : 0;
            
            return (
              <Card 
                key={cycle.id} 
                className="group relative hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 border-[#E5E7EB] overflow-hidden"
              >
                <CardHeader className="p-4 pb-2 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#FFF7ED] flex items-center justify-center flex-shrink-0">
                        <CalendarClock className="h-4 w-4 text-category-orange" />
                      </div>
                      <CardTitle className="text-base font-semibold truncate text-[#111827]">
                        {cycle.name}
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
                          onClick={() => handleDeleteCycle(cycle.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("knowledgeBase.deleteCycle")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {getCycleStatusBadge(cycle)}
                    <span className="text-xs text-[#6B7280]">
                      {getDaysRemaining(cycle.endDate)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  {cycle.description && (
                    <p className="text-sm text-[#6B7280] line-clamp-2">
                      {cycle.description}
                    </p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7280]">
                        {t("knowledgeBase.cycleDocumentsProgress", {
                          completed: progress.completed,
                          total: progress.total,
                        })}
                      </span>
                      <span className="font-medium text-[#111827]">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDate(cycle.startDate)} - {formatDate(cycle.endDate)}
                    </span>
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
