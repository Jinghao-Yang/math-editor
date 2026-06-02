"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import Editor from "@/components/tailwind/editor";
import { cn } from "@/lib/utils";

interface KnowledgeBaseLayoutProps {
  children: React.ReactNode;
}

export function KnowledgeBaseLayout({ children }: KnowledgeBaseLayoutProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  return (
    <div className="flex h-full w-full">
      {/* Left Panel - Document List */}
      <div
        className={cn(
          "h-full overflow-y-auto transition-all duration-300 ease-in-out",
          selectedDocumentId ? "hidden md:block w-1/2 lg:w-2/5 xl:w-1/3" : "w-full"
        )}
      >
        {React.cloneElement(children as React.ReactElement, {
          onSelectDocument: setSelectedDocumentId,
          selectedDocumentId,
        })}
      </div>

      {/* Right Panel - Editor */}
      {selectedDocumentId && (
        <div className="h-full w-full md:w-1/2 lg:w-3/5 xl:w-2/3 relative overflow-hidden animate-in slide-in-from-right-4 duration-300">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-20">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedDocumentId(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Editor Container */}
          <div className="h-full overflow-y-auto pt-2">
            <Editor documentId={selectedDocumentId} />
          </div>
        </div>
      )}
    </div>
  );
}
