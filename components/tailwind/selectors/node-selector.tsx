import {
  Check,
  CheckSquare,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  type LucideIcon,
  TextIcon,
  TextQuote,
} from "lucide-react";
import { EditorBubbleItem, useEditor } from "@/lib/editor-core";

import { Button } from "@/components/tailwind/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import { Popover } from "@radix-ui/react-popover";
import { useI18n } from "@/lib/i18n";
import { type TranslationKey } from "@/lib/i18n";

export type SelectorItem = {
  nameKey: TranslationKey;
  icon: LucideIcon;
  command: (editor: ReturnType<typeof useEditor>["editor"]) => void;
  isActive: (editor: ReturnType<typeof useEditor>["editor"]) => boolean;
};

const ITEM_KEYS = {
  text: "selectors.text" as const,
  heading1: "selectors.heading1" as const,
  heading2: "selectors.heading2" as const,
  heading3: "selectors.heading3" as const,
  todoList: "selectors.todoList" as const,
  bulletList: "selectors.bulletList" as const,
  numberedList: "selectors.numberedList" as const,
  quote: "selectors.quote" as const,
  code: "selectors.code" as const,
};

const items: SelectorItem[] = [
  {
    nameKey: ITEM_KEYS.text,
    icon: TextIcon,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) =>
      editor.isActive("paragraph") && !editor.isActive("bulletList") && !editor.isActive("orderedList"),
  },
  {
    nameKey: ITEM_KEYS.heading1,
    icon: Heading1,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    nameKey: ITEM_KEYS.heading2,
    icon: Heading2,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    nameKey: ITEM_KEYS.heading3,
    icon: Heading3,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
  },
  {
    nameKey: ITEM_KEYS.todoList,
    icon: CheckSquare,
    command: (editor) => editor.chain().focus().clearNodes().toggleTaskList().run(),
    isActive: (editor) => editor.isActive("taskItem"),
  },
  {
    nameKey: ITEM_KEYS.bulletList,
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList"),
  },
  {
    nameKey: ITEM_KEYS.numberedList,
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList"),
  },
  {
    nameKey: ITEM_KEYS.quote,
    icon: TextQuote,
    command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote"),
  },
  {
    nameKey: ITEM_KEYS.code,
    icon: Code,
    command: (editor) => editor.chain().focus().clearNodes().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive("codeBlock"),
  },
];
interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();
  const { t } = useI18n();
  if (!editor) return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? items[0];
  const activeName = activeItem.isActive(editor) ? t(activeItem.nameKey) : t("selectors.multiple");

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild className="gap-2 rounded-none border-none hover:bg-accent focus:ring-0">
        <Button size="sm" variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-sm">{activeName}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item) => (
          <EditorBubbleItem
            key={item.nameKey}
            onSelect={(editor) => {
              item.command(editor);
              onOpenChange(false);
            }}
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border p-1">
                <item.icon className="h-3 w-3" />
              </div>
              <span>{t(item.nameKey)}</span>
            </div>
            {activeItem.nameKey === item.nameKey && <Check className="h-4 w-4" />}
          </EditorBubbleItem>
        ))}
      </PopoverContent>
    </Popover>
  );
};
