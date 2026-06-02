"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  CheckCircle2,
  Circle,
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
  const router = useRouter();
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
    return new Date(dateStr).toLocaleDateString("en-US", {
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
      return <Badge variant="default">Completed</Badge>;
    } else if (cycle.status === "paused") {
      return <Badge variant="secondary">Paused</Badge>;
    } else if (now < start) {
      return <Badge variant="outline">Upcoming</Badge>;
    } else if (now > end) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-500">Active</Badge>;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Overdue";
    if (diff === 0) return "Due today";
    if (diff === 1) return "1 day left";
    return `${diff} days left`;
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
    if (confirm("Are you sure you want to delete this cycle?")) {
      deleteCycle(cycleId);
      loadCycles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cycles</h2>
          <p className="text-muted-foreground">
            Track your learning progress over time
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
              <Plus className="h-4 w-4" />
              New Cycle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Cycle</DialogTitle>
              <DialogDescription>
                Create a learning cycle to track your progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Calculus Week 1"
                  value={newCycleName}
                  onChange={(e) => setNewCycleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What will you learn in this cycle?"
                  value={newCycleDescription}
                  onChange={(e) => setNewCycleDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCycleStartDate.split("T")[0]}
                    onChange={(e) => setNewCycleStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
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
                Cancel
              </Button>
              <Button onClick={handleCreateCycle} disabled={!newCycleName.trim()}>
                Create Cycle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {cycles.length === 0 ? (
        <Card className="border-dashed border-2 bg-gradient-to-b from-muted/30 to-transparent">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-6 ring-1 ring-amber-200/50 dark:ring-amber-700/30">
              <CalendarClock className="h-10 w-10 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No cycles yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create your first learning cycle to track progress and stay organized
            </p>
            <Button onClick={() => setIsCreateOpen(true)} size="lg" className="gap-2 rounded-xl shadow-sm shadow-primary/20">
              <Plus className="h-5 w-5" />
              Create Your First Cycle
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
                className="group relative hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-border/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-4 pb-2 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 ring-1 ring-amber-200/50 dark:ring-amber-700/30">
                        <CalendarClock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <CardTitle className="text-base font-semibold truncate">
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
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {getCycleStatusBadge(cycle)}
                    <span className="text-xs text-muted-foreground">
                      {getDaysRemaining(cycle.endDate)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  {cycle.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {cycle.description}
                    </p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {progress.completed} / {progress.total} documents
                      </span>
                      <span className="font-medium">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
