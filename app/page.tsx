"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { Button } from "@/components/tailwind/ui/button";
import { useI18n } from "@/lib/i18n";

export default function Page() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen bg-math-bg canvas-grid">
      {/* Header */}
      <header className="sticky top-0 z-10 h-16 bg-white/80 backdrop-blur-md border-b border-math-border flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-[16px] tracking-tight text-math-text">
            MathSpace
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-math-text sm:text-5xl lg:text-6xl">
            {t("home.heroTitle")}
          </h1>
          <p className="text-lg leading-relaxed text-math-text-secondary">
            {t("home.heroDescription")}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Button
              asChild
              size="lg"
              className="gap-2 rounded-full px-8 bg-math-brand text-white hover:opacity-90"
            >
              <Link href="/knowledge-base">
                {t("home.primaryAction")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="gap-2 rounded-full px-6"
            >
              <Link href="/knowledge-base/documents">
                <Search className="h-4 w-4" />
                {t("home.secondaryAction")}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
