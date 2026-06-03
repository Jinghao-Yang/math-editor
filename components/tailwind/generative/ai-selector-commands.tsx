import { ArrowDownWideNarrow, CheckCheck, RefreshCcwDot, StepForward, WrapText } from "lucide-react";
import { getPrevText, useEditor } from "@/lib/editor-core";
import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";
import { useI18n } from "@/lib/i18n";

const options = [
  {
    value: "improve",
    labelKey: "ai.improveWriting" as const,
    icon: RefreshCcwDot,
  },
  {
    value: "fix",
    labelKey: "ai.fixGrammar" as const,
    icon: CheckCheck,
  },
  {
    value: "shorter",
    labelKey: "ai.makeShorter" as const,
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    labelKey: "ai.makeLonger" as const,
    icon: WrapText,
  },
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();
  const { t } = useI18n();

  return (
    <>
      <CommandGroup heading={t("ai.editOrReview")}>
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              onSelect(text, value);
            }}
            className="flex gap-2 px-4"
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4 text-purple-500" />
            {t(option.labelKey)}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading={t("ai.useAiMore")}>
        <CommandItem
          onSelect={() => {
            const pos = editor.state.selection.from;
            const text = getPrevText(editor, pos);
            onSelect(text, "continue");
          }}
          value="continue"
          className="gap-2 px-4"
        >
          <StepForward className="h-4 w-4 text-purple-500" />
          {t("ai.continueWriting")}
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AISelectorCommands;
