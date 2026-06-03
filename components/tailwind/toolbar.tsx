"use client";

import { Button } from "@/components/tailwind/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useEditor } from "@/lib/editor-core";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Code2Icon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tailwind/ui/tooltip";

interface ToolbarItem {
  name: string;
  label: string;
  icon: typeof BoldIcon;
  command: () => void;
  isActive: () => boolean;
  shortcut?: string;
}

interface ToolbarGroup {
  id: string;
  label: string;
  items: ToolbarItem[];
}

export const Toolbar = () => {
  const { t } = useI18n();
  const { editor } = useEditor();

  if (!editor) return null;

  const textFormatting: ToolbarItem[] = [
    {
      name: "bold",
      label: t("editor.toolbar.items.bold"),
      icon: BoldIcon,
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      shortcut: "Ctrl+B",
    },
    {
      name: "italic",
      label: t("editor.toolbar.items.italic"),
      icon: ItalicIcon,
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      shortcut: "Ctrl+I",
    },
    {
      name: "underline",
      label: t("editor.toolbar.items.underline"),
      icon: UnderlineIcon,
      command: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
      shortcut: "Ctrl+U",
    },
    {
      name: "strike",
      label: t("editor.toolbar.items.strike"),
      icon: StrikethroughIcon,
      command: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      name: "code",
      label: t("editor.toolbar.items.inlineCode"),
      icon: CodeIcon,
      command: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
      shortcut: "Ctrl+`",
    },
  ];

  const headings: ToolbarItem[] = [
    {
      name: "heading1",
      label: t("editor.toolbar.items.heading1"),
      icon: Heading1Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "heading2",
      label: t("editor.toolbar.items.heading2"),
      icon: Heading2Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      name: "heading3",
      label: t("editor.toolbar.items.heading3"),
      icon: Heading3Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
  ];

  const lists: ToolbarItem[] = [
    {
      name: "bulletList",
      label: t("editor.toolbar.items.bulletList"),
      icon: ListIcon,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      name: "orderedList",
      label: t("editor.toolbar.items.orderedList"),
      icon: ListOrderedIcon,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
  ];

  const blocks: ToolbarItem[] = [
    {
      name: "blockquote",
      label: t("editor.toolbar.items.blockquote"),
      icon: QuoteIcon,
      command: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      name: "codeBlock",
      label: t("editor.toolbar.items.codeBlock"),
      icon: Code2Icon,
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
  ];

  const toolbarGroups: ToolbarGroup[] = [
    { id: "text", label: t("editor.toolbar.groups.text"), items: textFormatting },
    { id: "heading", label: t("editor.toolbar.groups.heading"), items: headings },
    { id: "list", label: t("editor.toolbar.groups.list"), items: lists },
    { id: "block", label: t("editor.toolbar.groups.block"), items: blocks },
  ];

  const renderToolbarItems = (items: ToolbarItem[]) => (
    items.map((item) => (
      <Tooltip key={item.name}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label={item.label}
            aria-pressed={item.isActive()}
            className={cn(
              "h-9 w-9 rounded-xl border border-transparent px-0 transition-all duration-200 ease-out",
              "hover:border-border/70 hover:bg-accent hover:text-accent-foreground",
              item.isActive() && "border-primary/20 bg-primary/10 text-primary shadow-subtle"
            )}
            onClick={(e) => {
              e.preventDefault();
              item.command();
            }}
          >
            <item.icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="space-y-1 text-xs">
          <p className="font-medium">{item.label}</p>
          {item.shortcut ? <p className="text-[11px] text-muted-foreground">{item.shortcut}</p> : null}
        </TooltipContent>
      </Tooltip>
    ))
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap items-center gap-2 rounded-[20px] border border-border/70 bg-card/95 p-2 shadow-subtle">
        {toolbarGroups.map((group) => (
          <div
            key={group.id}
            className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/80 px-2 py-1.5"
          >
            <span className="hidden whitespace-nowrap px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:inline-flex">
              {group.label}
            </span>
            <div className="flex items-center gap-1">
              {renderToolbarItems(group.items)}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};
