"use client";

import type React from "react";
import { ArrowLeft, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import Editor from "@/components/tailwind/editor";
import { useI18n } from "@/lib/i18n";

interface KnowledgeBaseLayoutProps {
  children: React.ReactNode;
  mode: "browse" | "edit";
  documentId: string | null;
  onBack: () => void;
}

export function KnowledgeBaseLayout({
  children,
  mode,
  documentId,
  onBack,
}: KnowledgeBaseLayoutProps) {
  const { t } = useI18n();

  if (mode === "edit" && documentId) {
    return (
      <div className="flex h-full min-h-[calc(100vh-7rem)] w-full flex-col overflow-hidden rounded-[16px] border border-math-border bg-math-surface">
        <div className="flex items-center gap-2 border-b border-math-border bg-math-hover/50 px-4 py-3 md:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-xl text-math-text-secondary"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("knowledgeBase.backToList")}
          </Button>
          <ChevronRight className="h-4 w-4 text-math-text-tertiary" />
          <div className="flex items-center gap-1.5 text-sm text-math-text-secondary">
            <FileText className="h-4 w-4" />
            <span>{t("knowledgeBase.editingDocument")}</span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-3 py-3 md:px-6">
          <Editor documentId={documentId} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-7rem)] w-full flex-col overflow-hidden rounded-[16px] border border-math-border bg-math-surface">
      <div className="min-h-0 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
