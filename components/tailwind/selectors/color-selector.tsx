import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "@/lib/editor-core";

import { Button } from "@/components/tailwind/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import { useI18n } from "@/lib/i18n";
import { type TranslationKey } from "@/lib/i18n";

export interface BubbleColorMenuItem {
  nameKey: TranslationKey;
  color: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    nameKey: "selectors.default" as const,
    color: "var(--novel-black)",
  },
  {
    nameKey: "selectors.purple" as const,
    color: "#9333EA",
  },
  {
    nameKey: "selectors.red" as const,
    color: "#E00000",
  },
  {
    nameKey: "selectors.yellow" as const,
    color: "#EAB308",
  },
  {
    nameKey: "selectors.blue" as const,
    color: "#2563EB",
  },
  {
    nameKey: "selectors.green" as const,
    color: "#008A00",
  },
  {
    nameKey: "selectors.orange" as const,
    color: "#FFA500",
  },
  {
    nameKey: "selectors.pink" as const,
    color: "#BA4081",
  },
  {
    nameKey: "selectors.gray" as const,
    color: "#A8A29E",
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    nameKey: "selectors.default" as const,
    color: "var(--novel-highlight-default)",
  },
  {
    nameKey: "selectors.purple" as const,
    color: "var(--novel-highlight-purple)",
  },
  {
    nameKey: "selectors.red" as const,
    color: "var(--novel-highlight-red)",
  },
  {
    nameKey: "selectors.yellow" as const,
    color: "var(--novel-highlight-yellow)",
  },
  {
    nameKey: "selectors.blue" as const,
    color: "var(--novel-highlight-blue)",
  },
  {
    nameKey: "selectors.green" as const,
    color: "var(--novel-highlight-green)",
  },
  {
    nameKey: "selectors.orange" as const,
    color: "var(--novel-highlight-orange)",
  },
  {
    nameKey: "selectors.pink" as const,
    color: "var(--novel-highlight-pink)",
  },
  {
    nameKey: "selectors.gray" as const,
    color: "var(--novel-highlight-gray)",
  },
];

interface ColorSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
  const { editor } = useEditor();
  const { t } = useI18n();

  if (!editor) return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }));

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive("highlight", { color }));

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" className="gap-2 rounded-none" variant="ghost">
          <span
            className="rounded-sm px-1"
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color,
            }}
          >
            A
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={5}
        className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl "
        align="start"
      >
        <div className="flex flex-col">
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">{t("selectors.color")}</div>
          {TEXT_COLORS.map(({ nameKey, color }) => {
            const isDefault = nameKey === "selectors.default";
            return (
              <EditorBubbleItem
                key={nameKey}
                onSelect={() => {
                  editor.commands.unsetColor();
                  if (!isDefault) {
                    editor
                      .chain()
                      .focus()
                      .setColor(color || "")
                      .run();
                  }
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-sm border px-2 py-px font-medium" style={{ color }}>
                    A
                  </div>
                  <span>{t(nameKey)}</span>
                </div>
              </EditorBubbleItem>
            );
          })}
        </div>
        <div>
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">{t("selectors.background")}</div>
          {HIGHLIGHT_COLORS.map(({ nameKey, color }) => {
            const isDefault = nameKey === "selectors.default";
            return (
              <EditorBubbleItem
                key={nameKey}
                onSelect={() => {
                  editor.commands.unsetHighlight();
                  if (!isDefault) {
                    editor.chain().focus().setHighlight({ color }).run();
                  }
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-sm border px-2 py-px font-medium" style={{ backgroundColor: color }}>
                    A
                  </div>
                  <span>{t(nameKey)}</span>
                </div>
                {editor.isActive("highlight", { color }) && <Check className="h-4 w-4" />}
              </EditorBubbleItem>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
