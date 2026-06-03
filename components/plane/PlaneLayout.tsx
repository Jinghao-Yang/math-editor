"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  FolderKanban,
  FileText,
  CalendarClock,
  Layers,
  Menu,
  ArrowLeft,
  Search,
  BookOpen,
  Home,
} from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/tailwind/ui/sheet";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navIconColorMap: Record<string, string> = {
  "/knowledge-base": "text-math-orange",
  "/knowledge-base/documents": "text-math-blue",
  "/knowledge-base/cycles": "text-math-emerald",
  "/knowledge-base/modules": "text-math-brand",
};

export function PlaneLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      label: "Workspace",
      items: [{ href: "/knowledge-base", label: "Projects", icon: FolderKanban }],
    },
    {
      label: "Library",
      items: [
        { href: "/knowledge-base/documents", label: "Documents", icon: FileText },
        { href: "/knowledge-base/cycles", label: "Cycles", icon: CalendarClock },
        { href: "/knowledge-base/modules", label: "Modules", icon: Layers },
      ],
    },
  ];

  const allNavItems = navGroups.flatMap((g) => g.items);

  const isActive = (href: string) => {
    if (href === "/knowledge-base") {
      return pathname === "/knowledge-base";
    }
    return pathname.startsWith(href);
  };

  const currentPage = allNavItems.find((item) => isActive(item.href));

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors",
          active
            ? "bg-math-hover font-medium text-math-text"
            : "text-math-text-secondary hover:bg-math-hover/50"
        )}
      >
        <Icon className={cn("w-4 h-4", navIconColorMap[item.href] || "text-math-text-tertiary")} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-math-bg">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] bg-math-surface border-r border-math-border flex-shrink-0">
        {/* Logo & Workspace */}
        <div className="h-16 flex items-center px-5 border-b border-math-border">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white mr-3 shadow-md">
            <BookOpen className="w-4 h-4" />
          </div>
          <Link href="/" className="font-bold text-[16px] tracking-tight text-math-text flex-1">
            MathSpace
          </Link>
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between bg-math-hover rounded-xl px-3 py-2 text-math-text-secondary hover:bg-gray-200 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="text-sm">Search objects...</span>
            </div>
            <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded shadow-sm text-math-text-tertiary group-hover:text-math-text-secondary">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 space-y-6 pb-6">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              <div className="text-[11px] font-bold text-math-text-tertiary uppercase tracking-wider px-2 mb-2">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map(renderNavItem)}
              </div>
            </div>
          ))}
        </div>

        {/* User area */}
        <div className="border-t border-math-border p-4">
          <Link
            href="/"
            className="w-full flex items-center gap-3 hover:bg-math-hover p-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-math-text-tertiary" />
            <span className="text-sm text-math-text-secondary">{t("knowledgeBase.backToHome")}</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-math-border flex items-center justify-between px-6 gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex items-center justify-between h-14 border-b border-math-border -mx-6 px-6 mb-2">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-sm text-math-text">MathSpace</span>
                </Link>
              </div>
              <nav className="flex-1 space-y-6">
                {navGroups.map((group, gi) => (
                  <div key={gi}>
                    <div className="text-[11px] font-bold text-math-text-tertiary uppercase tracking-wider px-3 mb-2">
                      {group.label}
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                          <SheetClose key={item.href} asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors",
                                active
                                  ? "bg-math-hover font-medium text-math-text"
                                  : "text-math-text-secondary hover:bg-math-hover/50"
                              )}
                            >
                              <Icon className={cn(
                                "w-4 h-4",
                                navIconColorMap[item.href] || "text-math-text-tertiary"
                              )} />
                              <span>{item.label}</span>
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
              <div className="border-t border-math-border pt-3">
                <SheetClose asChild>
                  <Link href="/">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-math-text-secondary rounded-xl" size="sm">
                      <ArrowLeft className="h-4 w-4" />
                      <span>{t("knowledgeBase.backToHome")}</span>
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-math-text-secondary hover:text-math-text mr-1">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <span className="hidden sm:inline text-math-text-tertiary">/</span>
            <Link
              href="/knowledge-base"
              className="hidden sm:inline text-sm text-math-text-secondary hover:text-math-text"
            >
              {t("knowledgeBase.breadcrumbRoot")}
            </Link>
            {currentPage && currentPage.href !== "/knowledge-base" && (
              <>
                <span className="hidden sm:inline text-math-text-tertiary">/</span>
                <span className="text-sm font-semibold text-math-text">{currentPage.label}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                "inline-flex h-10 min-w-[220px] items-center gap-3 rounded-xl border border-math-border bg-math-hover px-3 text-sm font-medium text-math-text-secondary",
                "transition hover:bg-[#E5E7EB] hover:text-math-text",
                "sm:min-w-[280px]"
              )}
            >
              <Search className="h-4 w-4 text-math-text-tertiary" />
              <span className="flex-1 text-left">{t("search.trigger")}</span>
              <kbd className="hidden h-6 select-none items-center rounded-lg border border-math-border bg-math-surface px-2 font-mono text-[11px] font-medium text-math-text-tertiary sm:inline-flex">
                Ctrl K
              </kbd>
            </button>
            <LanguageSwitcher compact className="sm:hidden" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-math-bg canvas-grid">
          {children}
        </main>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
