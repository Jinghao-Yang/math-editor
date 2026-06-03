﻿"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateHeroProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode[];
  className?: string;
}

export function EmptyStateHero({
  icon,
  title,
  description,
  primaryAction,
  secondaryActions,
  className,
}: EmptyStateHeroProps) {
  return (
    <div
      className={cn(
        "ui-panel flex flex-col items-center justify-center px-6 py-14 md:py-16",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/10">
        <div className="flex h-12 w-12 items-center justify-center">
          {icon}
        </div>
      </div>

      <h3 className="mt-6 max-w-sm text-balance text-center text-lg font-semibold text-foreground">
        {title}
      </h3>

      {description ? (
        <p className="mt-2 max-w-md text-balance text-center text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}

      {primaryAction || (secondaryActions && secondaryActions.length > 0) ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {primaryAction ? (
            <div>{primaryAction}</div>
          ) : null}
          {secondaryActions?.map((action) => action)}
        </div>
      ) : null}
    </div>
  );
}
