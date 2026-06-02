"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
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

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export function PlaneLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { href: "/knowledge-base", label: "Projects", icon: FolderKanban },
    { href: "/knowledge-base/documents", label: "Documents", icon: FileText },
    { href: "/knowledge-base/cycles", label: "Cycles", icon: CalendarClock },
    { href: "/knowledge-base/modules", label: "Modules", icon: Layers },
  ];

  const isActive = (href: string) => {
    if (href === "/knowledge-base") {
      return pathname === "/knowledge-base";
    }
    return pathname.startsWith(href);
  };

  const currentPage = navItems.find((item) => isActive(item.href));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/40 bg-background/80 backdrop-blur-sm transition-all duration-300 shadow-sm",
          sidebarCollapsed ? "w-[68px]" : "w-60"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-border/40">
          {!sidebarCollapsed ? (
            <Link href="/knowledge-base" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Math Editor
                </span>
                <span className="text-[10px] text-muted-foreground">Knowledge Base</span>
              </div>
            </Link>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn("h-7 w-7 rounded-lg hover:bg-muted", sidebarCollapsed && "mx-auto -mr-1")}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {!sidebarCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Navigation
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  sidebarCollapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                  active
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {active && !sidebarCollapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
                )}
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[11px] bg-primary/10 text-primary font-medium px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border/40">
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full text-muted-foreground hover:text-foreground transition-colors rounded-lg",
                sidebarCollapsed ? "justify-center p-2.5" : "justify-start gap-3 px-3 py-2.5"
              )}
              size="sm"
              title="Back to Editor"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm">Back to Editor</span>}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border/40 bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 gap-4 shadow-sm">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumb + Title */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mr-1">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <span className="hidden sm:inline text-muted-foreground/50">/</span>
            <Link href="/knowledge-base" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors">
              Knowledge Base
            </Link>
            {currentPage && currentPage.href !== "/knowledge-base" && (
              <>
                <span className="hidden sm:inline text-muted-foreground/50">/</span>
                <span className="text-sm font-semibold text-foreground">
                  {currentPage.label}
                </span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-right-2 duration-300">
          {children}
        </main>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background z-50 md:hidden flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between h-14 px-4 border-b border-border/40">
              <Link href="/knowledge-base" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Math Editor
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Navigation
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-border/40">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground rounded-lg" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Editor</span>
                </Button>
              </Link>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
