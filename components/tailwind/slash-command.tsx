import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Youtube,
} from "lucide-react";
import { Command, createSuggestionItems, renderItems } from "@/components/editor-core";
import type { I18nContextValue } from "@/lib/i18n";
import { uploadFn } from "./image-upload";

type Translate = I18nContextValue["t"];

export const getLocalizedSuggestionItems = (t: Translate) =>
  createSuggestionItems([
    {
      title: t("editor.slashCommand.feedbackTitle"),
      description: t("editor.slashCommand.feedbackDescription"),
      icon: <MessageSquarePlus size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        window.open("/feedback", "_blank");
      },
    },
    {
      title: t("editor.slashCommand.textTitle"),
      description: t("editor.slashCommand.textDescription"),
      searchTerms: ["p", "paragraph"],
      icon: <Text size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
      },
    },
    {
      title: t("editor.slashCommand.todoListTitle"),
      description: t("editor.slashCommand.todoListDescription"),
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      icon: <CheckSquare size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: t("editor.slashCommand.heading1Title"),
      description: t("editor.slashCommand.heading1Description"),
      searchTerms: ["title", "big", "large"],
      icon: <Heading1 size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
      },
    },
    {
      title: t("editor.slashCommand.heading2Title"),
      description: t("editor.slashCommand.heading2Description"),
      searchTerms: ["subtitle", "medium"],
      icon: <Heading2 size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
      },
    },
    {
      title: t("editor.slashCommand.heading3Title"),
      description: t("editor.slashCommand.heading3Description"),
      searchTerms: ["subtitle", "small"],
      icon: <Heading3 size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
      },
    },
    {
      title: t("editor.slashCommand.bulletListTitle"),
      description: t("editor.slashCommand.bulletListDescription"),
      searchTerms: ["unordered", "point"],
      icon: <List size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: t("editor.slashCommand.numberedListTitle"),
      description: t("editor.slashCommand.numberedListDescription"),
      searchTerms: ["ordered"],
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: t("editor.slashCommand.quoteTitle"),
      description: t("editor.slashCommand.quoteDescription"),
      searchTerms: ["blockquote"],
      icon: <TextQuote size={18} />,
      command: ({ editor, range }) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
    },
    {
      title: t("editor.slashCommand.codeTitle"),
      description: t("editor.slashCommand.codeDescription"),
      searchTerms: ["codeblock"],
      icon: <Code size={18} />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: t("editor.slashCommand.imageTitle"),
      description: t("editor.slashCommand.imageDescription"),
      searchTerms: ["photo", "picture", "media"],
      icon: <ImageIcon size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          if (input.files?.length) {
            const file = input.files[0];
            const pos = editor.view.state.selection.from;
            uploadFn(file, editor.view, pos);
          }
        };
        input.click();
      },
    },
    {
      title: t("editor.slashCommand.youtubeTitle"),
      description: t("editor.slashCommand.youtubeDescription"),
      searchTerms: ["video", "youtube", "embed"],
      icon: <Youtube size={18} />,
      command: ({ editor, range }) => {
        const videoLink = prompt(t("editor.slashCommand.prompts.youtubeUrl"));
        const ytregex = new RegExp(
          /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
        );

        if (ytregex.test(videoLink)) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setYoutubeVideo({
              src: videoLink,
            })
            .run();
        } else if (videoLink !== null) {
          alert(t("editor.slashCommand.prompts.youtubeUrlInvalid"));
        }
      },
    },
  ]);

let currentSuggestionItems = createSuggestionItems([]);

export const setSuggestionItems = (items: ReturnType<typeof getLocalizedSuggestionItems>) => {
  currentSuggestionItems = items;
};

export const slashCommand = Command.configure({
  suggestion: {
    items: () => currentSuggestionItems,
    render: renderItems,
  },
});
