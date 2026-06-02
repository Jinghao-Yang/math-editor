export * from "./editor";

export { ImageResizer } from "@/lib/editor-extensions";
export { UpdatedImage } from "@/lib/editor-extensions";
export { removeAIHighlight, addAIHighlight } from "@/lib/editor-extensions/ai-highlight";

export {
  Command,
  renderItems,
  createSuggestionItems,
  handleCommandNavigation,
  type SuggestionItem,
} from "@/components/editor-core";