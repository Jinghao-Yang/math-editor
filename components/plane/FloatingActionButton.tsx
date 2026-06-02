"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, FolderKanban, CalendarClock, Layers, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createProject, createDocument } from "@/lib/store/db";

interface FabMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  action: () => void;
}

export function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateDocument = () => {
    const docId = `doc-${Date.now()}`;
    createDocument({
      id: docId,
      title: "Untitled Document",
    });
    setOpen(false);
    router.push(`/?doc=${docId}`);
  };

  const handleCreateProject = () => {
    createProject("Untitled Project");
    setOpen(false);
  };

  const menuItems: FabMenuItem[] = [
    {
      id: "document",
      label: "New Document",
      description: "Create a new document",
      icon: FileText,
      action: handleCreateDocument,
    },
    {
      id: "project",
      label: "New Project",
      description: "Create a new project",
      icon: FolderKanban,
      action: handleCreateProject,
    },
    {
      id: "cycle",
      label: "New Cycle",
      description: "Create a new learning cycle",
      icon: CalendarClock,
      action: () => {
        setOpen(false);
        router.push("/knowledge-base/cycles");
      },
    },
    {
      id: "module",
      label: "New Module",
      description: "Create a new module",
      icon: Layers,
      action: () => {
        setOpen(false);
        router.push("/knowledge-base/modules");
      },
    },
  ];

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      {/* Menu */}
      {open && (
        <div className="absolute bottom-16 right-0 mb-2 w-64 rounded-lg border border-border bg-background shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-2 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">Create new</p>
          </div>
          <div className="p-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm hover:bg-accent transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-200 flex items-center justify-center",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          open && "rotate-45"
        )}
        aria-label={open ? "Close menu" : "Create new"}
      >
        {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </div>
  );
}