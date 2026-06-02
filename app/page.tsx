"use client";

import { Suspense } from "react";
import Editor from "@/components/tailwind/editor";
import { SyncStatusBar } from "@/components/sync";
import { Button } from "@/components/tailwind/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, BookOpen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { syncManager } from "@/lib/sync/manager";

function EditorFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    syncManager.start();
    return () => {
      syncManager.stop();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">
      {/* 侧边栏主题切换 */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-10 w-10 rounded-full"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Link href="/knowledge-base">
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full"
            title="Knowledge Base"
          >
            <BookOpen className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <Suspense fallback={<EditorFallback />}>
        <Editor />
      </Suspense>

      {/* 同步状态栏 */}
      <div className="fixed bottom-4 right-4 z-50">
        <SyncStatusBar />
      </div>
    </div>
  );
}
