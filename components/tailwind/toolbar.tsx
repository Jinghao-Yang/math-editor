"use client";

import { Button } from "@/components/tailwind/ui/button";
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

export const Toolbar = () => {
  const { editor } = useEditor();

  if (!editor) return null;

  const items = [
    {
      name: "bold",
      icon: BoldIcon,
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      name: "italic",
      icon: ItalicIcon,
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      name: "underline",
      icon: UnderlineIcon,
      command: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      name: "strike",
      icon: StrikethroughIcon,
      command: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      name: "code",
      icon: CodeIcon,
      command: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
    {
      name: "heading1",
      icon: Heading1Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "heading2",
      icon: Heading2Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      name: "heading3",
      icon: Heading3Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      name: "bulletList",
      icon: ListIcon,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      name: "orderedList",
      icon: ListOrderedIcon,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      name: "blockquote",
      icon: QuoteIcon,
      command: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      name: "codeBlock",
      icon: Code2Icon,
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-md border border-muted bg-background p-1 shadow-sm">
      {items.map((item) => (
        <Button
          key={item.name}
          variant="ghost"
          size="sm"
          className="h-8 w-8 px-0"
          onClick={(e) => {
            e.preventDefault();
            item.command();
          }}
        >
          <item.icon
            className={cn("h-4 w-4", {
              "text-blue-600": item.isActive(),
            })}
          />
        </Button>
      ))}
    </div>
  );
};
