"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  Inbox,
  Clock,
  Star,
  Search,
  Settings,
  HelpCircle,
  CheckSquare,
  FileText,
  PenTool,
  Menu,
} from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/tailwind/ui/sheet";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  index?: string;
  activeDot?: boolean;
}

interface NavGroup {
  label: string;
  index: string;
  items: NavItem[];
}

export function PlaneLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const primaryItems: NavItem[] = [
    { href: "/knowledge-base/inbox", label: "Inbox", icon: Inbox },
    { href: "/knowledge-base/today", label: "Today", icon: Inbox, activeDot: true },
    { href: "/knowledge-base/recent", label: "Recent", icon: Clock },
    { href: "/knowledge-base/favorites", label: "Favorites", icon: Star },
  ];

  const spaceItems: NavItem[] = [
    { href: "/knowledge-base", label: "Project", index: "01", icon: Inbox },
    { href: "/knowledge-base/mathematics", label: "Mathematics", index: "02", icon: Inbox },
    { href: "/knowledge-base/personal", label: "Personal", index: "03", icon: Inbox },
  ];

  const knowledgeItems: NavItem[] = [
    { href: "/knowledge-base/notes", label: "Notes", icon: PenTool },
    { href: "/knowledge-base/documents", label: "Documents", icon: FileText },
    { href: "/knowledge-base/inquiries", label: "Inquiries", icon: HelpCircle },
    { href: "/knowledge-base/tasks", label: "Tasks", icon: CheckSquare },
  ];

  const isActive = (href: string) => {
    if (href === "/knowledge-base") {
      return pathname === "/knowledge-base";
    }
    return pathname.startsWith(href);
  };

  const handleCreateNew = () => {
    setSearchOpen(true);
  };

  const renderNavItem = (item: NavItem) => {
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
        <span className="truncate">{item.label}</span>
        {item.index && <span className="font-mono text-[10px] opacity-40">{item.index}</span>}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] bg-white hairline-r flex-shrink-0 z-20 h-screen fixed left-0 top-0 select-none">
        {/* Brand Header */}
        <div className="h-20 px-8 flex items-center justify-between hairline-b bg-white">
          <span className="font-sys text-base font-bold tracking-widest text-text-main">AXIOM</span>
          <span className="font-mono text-[9px] text-text-muted opacity-60">v0.6</span>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 text-xs text-text-muted font-medium">
          {/* + New Action */}
          <div className="pb-2">
            <button
              type="button"
              onClick={handleCreateNew}
              className="w-full flex items-center justify-center gap-2 py-2 border border-text-main hover:bg-text-main hover:text-white text-text-main transition-all font-sys text-xs font-semibold"
            >
              + New
            </button>
          </div>

          {/* Search Bar */}
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

          {/* Standard States */}
          <div className="space-y-2.5">
            {primaryItems.map(renderNavItem)}
          </div>

          <div className="h-px bg-grid-line" />

          {/* Spaces Section */}
          <div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted opacity-50 mb-3">Space</div>
            <div className="space-y-2.5">
              {spaceItems.map(renderNavItem)}
            </div>
          </div>

          <div className="h-px bg-grid-line" />

          {/* Knowledge Section */}
          <div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted opacity-50 mb-3">Knowledge</div>
            <div className="space-y-2.5">
              {knowledgeItems.map(renderNavItem)}
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

      {/* Main Content (Offset left sidebar width) */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        {children}
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}