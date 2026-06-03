import { Button } from "@/components/tailwind/ui/button";
import { cn } from "@/lib/utils";
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react";
import { EditorBubbleItem, useEditor } from "@/lib/editor-core";
import type { SelectorItem } from "./node-selector";

const TEXT_BUTTON_KEYS = {
  bold: "editor.toolbar.items.bold" as const,
  italic: "editor.toolbar.items.italic" as const,
  underline: "editor.toolbar.items.underline" as const,
  strike: "editor.toolbar.items.strike" as const,
  code: "editor.toolbar.items.inlineCode" as const,
};

export const TextButtons = () => {
  const { editor } = useEditor();
  if (!editor) return null;
  const items: SelectorItem[] = [
    {
      nameKey: TEXT_BUTTON_KEYS.bold,
      isActive: (editor) => editor.isActive("bold"),
      command: (editor) => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      nameKey: TEXT_BUTTON_KEYS.italic,
      isActive: (editor) => editor.isActive("italic"),
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      nameKey: TEXT_BUTTON_KEYS.underline,
      isActive: (editor) => editor.isActive("underline"),
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      nameKey: TEXT_BUTTON_KEYS.strike,
      isActive: (editor) => editor.isActive("strike"),
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      nameKey: TEXT_BUTTON_KEYS.code,
      isActive: (editor) => editor.isActive("code"),
      command: (editor) => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];
  return (
    <div className="flex">
      {items.map((item) => (
        <EditorBubbleItem
          key={item.nameKey}
          onSelect={(editor) => {
            item.command(editor);
          }}
        >
          <Button size="sm" className="rounded-none" variant="ghost" type="button">
            <item.icon
              className={cn("h-4 w-4 transition-colors duration-200", {
                "text-primary": item.isActive(editor),
              })}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};
