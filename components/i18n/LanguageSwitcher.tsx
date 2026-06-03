"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/tailwind/ui/dropdown-menu";
import { SUPPORTED_LOCALES, type Locale, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

const getCompactLabel = (locale: Locale) => (locale === "en" ? "EN" : "中");

export function LanguageSwitcher({ compact = false, className }: LanguageSwitcherProps) {
  const { locale, messages, setLocale } = useI18n();
  const currentLabel = messages.common.languages[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size={compact ? "sm" : "default"}
          className={cn(
            "gap-2 border-border/70 bg-card/90",
            compact ? "rounded-xl px-3" : "rounded-full px-4",
            className,
          )}
          aria-label={`${messages.common.language}: ${currentLabel}`}
        >
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">
            {compact ? getCompactLabel(locale) : currentLabel}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        {SUPPORTED_LOCALES.map((option) => {
          const optionLabel = messages.common.languages[option];
          const isActive = option === locale;

          return (
            <DropdownMenuItem
              key={option}
              className="justify-between gap-4"
              onSelect={() => setLocale(option)}
            >
              <div className="flex min-w-0 flex-col">
                <span className="font-medium">{optionLabel}</span>
                <span className="text-xs text-muted-foreground">{option}</span>
              </div>
              <Check className={cn("h-4 w-4 text-primary", !isActive && "opacity-0")} />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
