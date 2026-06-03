"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Inbox, Clock, Star, Search, Settings } from "lucide-react";
import { SearchDialog } from "@/components/search/SearchDialog";

interface NavItem {
  href: string;
  label: string;
  symbol?: string;
  activeDot?: boolean;
}

export function PlaneLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [quickInput, setQuickInput] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const primaryItems: NavItem[] = [
    { href: "/knowledge-base/inbox", label: "Inbox" },
    { href: "/knowledge-base/today", label: "Today", activeDot: true },
    { href: "/knowledge-base/recent", label: "Recent" },
    { href: "/knowledge-base/favorites", label: "Favorites" },
  ];

  const spaceItems: NavItem[] = [
    { href: "/knowledge-base", label: "Project" },
    { href: "/knowledge-base/mathematics", label: "Mathematics" },
    { href: "/knowledge-base/personal", label: "Personal" },
  ];

  const knowledgeItems: NavItem[] = [
    { href: "/knowledge-base/notes", label: "Notes", symbol: "⊢" },
    { href: "/knowledge-base/documents", label: "Documents", symbol: "≔" },
    { href: "/knowledge-base/inquiries", label: "Inquiries", symbol: "∴" },
    { href: "/knowledge-base/tasks", label: "Tasks", symbol: "∵" },
  ];

  const isActive = (href: string) => {
    if (href === "/knowledge-base") {
      return pathname === "/knowledge-base";
    }
    return pathname.startsWith(href);
  };

  // 触发全局状态气泡
  const triggerToast = (text: string) => {
    setToastText(text);
    setToastVisible(true);
  };

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  // 全局键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && quickInput.trim()) {
        e.preventDefault();
        triggerToast(`Captured: ${quickInput}`);
        setQuickInput("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickInput]);

  return (
    <div className="flex min-h-screen bg-canvas paper-texture">
      {/* 侧边栏 */}
      <aside className="hidden md:flex flex-col w-[260px] bg-white axis-r flex-shrink-0 z-20 h-screen fixed left-0 top-0 select-none">
        <div className="h-20 px-6 flex items-center justify-between axis-b bg-white">
          <span className="font-sys text-base font-bold tracking-widest text-text-main">AXIOM</span>
          <span className="font-mono text-[9px] text-text-muted opacity-60">v0.6</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-xs text-text-muted font-medium hide-scrollbar">
          {/* + New */}
          <div className="pb-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 border border-text-main hover:bg-text-main hover:text-white text-text-main transition-all font-sys text-xs font-semibold"
            >
              + New
            </button>
          </div>

          {/* 搜索岛 (⌘K) */}
          <div className="pb-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between py-2 border-b border-grid-line hover:text-text-main transition-all group text-left"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                Search
              </span>
              <kbd className="font-mono text-[9px] opacity-40">⌘K</kbd>
            </button>
          </div>

          {/* 常规状态 */}
          <div className="space-y-2.5">
            {primaryItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "nav-item w-full flex items-center justify-between py-1.5 relative text-xs font-medium font-sys",
                    active ? "text-text-main font-semibold" : "text-text-muted hover:text-text-main"
                  )}
                >
                  {item.activeDot && active && <div className="absolute -left-4 indicator-dot" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="h-px bg-grid-line" />

          {/* Space */}
          <div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted opacity-50 mb-3">Space</div>
            <div className="space-y-2.5">
              {spaceItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "nav-item w-full flex items-center justify-between py-1.5 relative text-xs font-medium font-sys",
                      active ? "text-text-main font-semibold" : "text-text-muted hover:text-text-main"
                    )}
                  >
                    <span>🧬 {item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-grid-line" />

          {/* 核心：具有数学/逻辑符号树的 Knowledge 目录 */}
          <div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted opacity-50 mb-3">Knowledge</div>
            <div className="space-y-2.5">
              {knowledgeItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "nav-item w-full flex items-center gap-3 py-1.5 relative text-xs font-medium font-sys",
                      active ? "text-text-main font-semibold" : "text-text-muted hover:text-text-main"
                    )}
                  >
                    <span className="font-mono text-sm opacity-60">{item.symbol}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-grid-line" />

          {/* Settings */}
          <div>
            <div
              onClick={() => router.push("/settings")}
              className="nav-item flex items-center gap-2 py-1 cursor-pointer hover:text-text-main"
            >
              <Settings className="w-3.5 h-3.5 opacity-40" />
              Settings
            </div>
          </div>
        </div>
      </aside>

      {/* 主界面偏置 */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px] relative pb-12">
        {children}

        {/* 捕获栏 (Quick Capture) */}
        <div className="quick-capture">
          <span className="text-[9px] font-mono tracking-widest uppercase text-text-muted">Capture</span>
          <input
            type="text"
            placeholder="Type to capture a thought, idea, or task..."
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
          />
          <span className="text-[9px] font-mono tracking-widest uppercase text-text-muted">⌘⏎</span>
        </div>
      </div>

      {/* 状态 Toast */}
      <div
        className={cn(
          "fixed bottom-16 right-6 bg-black text-white font-mono text-xs px-4 py-2 border border-black shadow-lg transition-all duration-300 z-50",
          toastVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {toastText}
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}