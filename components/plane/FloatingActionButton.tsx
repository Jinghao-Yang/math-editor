"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, FolderKanban, CalendarClock, Layers, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createProject, createDocument } from "@/lib/store/db";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

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
      title: t("common.untitledDocument"),
    });
    setOpen(false);
    router.push(`/knowledge-base/documents?doc=${docId}`);
  };

  const handleCreateProject = () => {
    createProject(t("common.untitledProject"));
    setOpen(false);
  };

  const menuItems: FabMenuItem[] = [
    {
      id: "document",
      label: t("plane.fabNewDocument"),
      description: t("plane.fabNewDocumentDesc"),
      icon: FileText,
      action: handleCreateDocument,
    },
    {
      id: "project",
      label: t("plane.fabNewProject"),
      description: t("plane.fabNewProjectDesc"),
      icon: FolderKanban,
      action: handleCreateProject,
    },
    {
      id: "cycle",
      label: t("plane.fabNewCycle"),
      description: t("plane.fabNewCycleDesc"),
      icon: CalendarClock,
      action: () => {
        setOpen(false);
        router.push("/knowledge-base/cycles");
      },
    },
    {
      id: "module",
      label: t("plane.fabNewModule"),
      description: t("plane.fabNewModuleDesc"),
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
        <div className="absolute bottom-16 right-0 mb-2 w-64 rounded-lg border border-[#E5E7EB] bg-surface shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-2 border-b border-[#E5E7EB]">
            <p className="text-xs font-medium text-[#6B7280] px-2 py-1">{t("plane.fabCreateNew")}</p>
          </div>
          <div className="p-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm hover:bg-[#F3F4F6] transition-colors"
                >
                  <Icon className="h-4 w-4 text-[#6B7280] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#111827]">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-[#9CA3AF] truncate">{item.description}</div>
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
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "h-14 w-14 rounded-full bg-[#5E6AD2] text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center",
          "focus:outline-none focus:ring-2 focus:ring-[#5E6AD2] focus:ring-offset-2",
          open && "rotate-45"
        )}
        aria-label={open ? t("plane.fabCloseMenu") : t("plane.fabCreateNew")}
      >
        {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </div>
  );
}
