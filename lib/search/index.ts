export {
  initializeSearchIndex,
  addToIndex,
  removeFromIndex,
  updateInIndex,
  search,
  clearIndex,
  getDocumentCount,
  extractTextFromContent,
  tokenizeChinese,
  findHighlights,
  createSnippet,
  loadIndexFromYjs,
  saveIndexToYjs,
  type SearchDocument,
  type SearchResult,
  type HighlightRange,
} from "./indexer";

export { useSearchIndex, useSearch, useKeyboardShortcut } from "./hooks";
