"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type FeedbackTone = "neutral" | "info" | "success" | "warning" | "error";

interface FeedbackStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: FeedbackTone;
  compact?: boolean;
  className?: string;
}

const toneStyles: Record<FeedbackTone, { container: string; icon: string; description: string }> = {
  neutral: {
    container: "border-border/60 bg-muted/30 text-foreground",
    icon: "border-border/60 bg-background/90 text-muted-foreground",
    description: "text-muted-foreground",
  },
  info: {
    container: "border-primary/18 bg-primary/4 text-foreground",
    icon: "border-primary/15 bg-primary/10 text-primary",
    description: "text-muted-foreground",
  },
  success: {
    container:
      "border-[hsl(var(--success)/0.25)] bg-[hsl(var(--success)/0.08)] text-foreground",
    icon: "border-[hsl(var(--success)/0.20)] bg-[hsl(var(--success)/0.14)] text-[hsl(var(--success))]",
    description: "text-muted-foreground",
  },
  warning: {
    container:
      "border-[hsl(var(--warning)/0.28)] bg-[hsl(var(--warning)/0.10)] text-foreground",
    icon: "border-[hsl(var(--warning)/0.18)] bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning-foreground))]",
    description: "text-muted-foreground",
  },
  error: {
    container:
      "border-[hsl(var(--destructive)/0.25)] bg-[hsl(var(--destructive)/0.06)] text-foreground",
    icon:
      "border-[hsl(var(--destructive)/0.18)] bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))]",
    description: "text-muted-foreground",
  },
};

export function FeedbackState({
  icon,
  title,
  description,
  action,
  tone = "neutral",
  compact = false,
  className,
}: FeedbackStateProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "rounded-card border px-4 py-4 shadow-subtle",
        compact
          ? "flex items-center gap-3 text-left"
          : "flex flex-col items-center gap-3 text-center",
        styles.container,
        className
      )}
    >
      {icon ? (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-2xl border",
            compact ? "h-10 w-10" : "h-12 w-12",
            styles.icon
          )}
        >
          {icon}
        </div>
      ) : null}
      <div className={cn("min-w-0", compact ? "flex-1 space-y-1" : "max-w-md space-y-1")}>
        <p className="text-sm font-semibold tracking-tight text-foreground">{title}</p>
        {description ? (
          <p className={cn("text-xs leading-5", styles.description)}>{description}</p>
        ) : null}
      </div>
      {action ? (
        <div className={cn("shrink-0", compact ? "flex items-center gap-2" : "pt-1")}>{action}</div>
      ) : null}
    </div>
  );
}
