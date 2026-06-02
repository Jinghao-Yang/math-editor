"use client";

import { cn } from "@/lib/utils";
import { List, LayoutGrid, Calendar } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/tailwind/ui/dropdown-menu";

export type ViewType = "list" | "kanban" | "calendar";

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const viewOptions: { value: ViewType; label: string; icon: React.ElementType }[] = [
  { value: "list", label: "List", icon: List },
  { value: "kanban", label: "Board", icon: LayoutGrid },
  { value: "calendar", label: "Calendar", icon: Calendar },
];

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const currentOption = viewOptions.find((opt) => opt.value === currentView);
  const CurrentIcon = currentOption?.icon || List;

  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
      {viewOptions.map((option) => {
        const Icon = option.icon;
        const isActive = currentView === option.value;
        
        return (
          <Button
            key={option.value}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange(option.value)}
            className={cn(
              "gap-1.5 h-8",
              isActive && "bg-background shadow-sm"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

export function ViewToggleDropdown({ 
  currentView, 
  onViewChange,
  className 
}: ViewToggleProps & { className?: string }) {
  const currentOption = viewOptions.find((opt) => opt.value === currentView);
  const CurrentIcon = currentOption?.icon || List;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-1.5", className)}>
          <CurrentIcon className="h-4 w-4" />
          <span>{currentOption?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onViewChange(option.value)}
              className={cn(
                "gap-2",
                currentView === option.value && "bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
