"use client";

import type React from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import Editor from "@/components/tailwind/editor";
import { useI18n } from "@/lib/i18n";
import { BacklinksPanel } from "./links/BacklinksPanel";

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
      <div className="flex h-full min-h-screen w-full flex-col overflow-hidden bg-canvas relative">
        
        {/* 还原：解构主义物理浮动贴纸 */}
        <div className="float-note hidden xl:block" style={{ right: "340px", top: "100px", transform: "rotate(3deg)" }}>
          ⚡ check Lemma 2.4
        </div>
        <div className="float-note hidden xl:block" style={{ right: "380px", top: "180px", transform: "rotate(-2.5deg)", background: "rgba(255,245,200,0.9)" }}>
          ← see also Heine–Borel
        </div>

        {/* 顶栏 */}
        <div className="flex h-20 items-center justify-between bg-canvas px-16 z-10 border-b border-grid-line shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-text-muted hover:text-text-main font-sys text-[11px] uppercase tracking-widest rounded-none p-0 bg-transparent hover:bg-transparent"
              onClick={onBack}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("knowledgeBase.backToList")}
            </Button>
            <span className="font-serif italic text-sm text-grid-line mx-2">/</span>
            <div className="flex items-center gap-1.5 font-sys text-[11px] uppercase tracking-widest text-text-main">
              <FileText className="h-3.5 w-3.5" />
              <span>{t("knowledgeBase.editingDocument")}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex h-full overflow-hidden">
          {/* 黄金书写区 */}
          <div className="flex-1 overflow-auto px-16 py-12 flex justify-center">
            <div className="w-full max-w-[820px] pl-4">
              <Editor documentId={documentId} />
            </div>
          </div>

          {/* 右侧 Context Panel */}
          <aside className="w-[300px] bg-white hairline-l flex flex-col shrink-0 select-none h-full overflow-hidden hidden lg:flex">
            <BacklinksPanel 
              docId={documentId} 
              backlinks={[]} 
              onNavigate={() => {}} 
              documentTitle="Compactness"
            />
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col overflow-hidden bg-canvas">
      <div className="min-h-0 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}