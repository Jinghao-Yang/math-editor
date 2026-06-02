import { Index } from "flexsearch";
import * as Y from "yjs";

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  type: "document" | "block";
  docId: string;
  blockId?: string;
  projectId?: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  type: "document" | "block";
  docId: string;
  blockId?: string;
  projectId?: string;
  score: number;
  highlights: HighlightRange[];
}

export interface HighlightRange {
  start: number;
  end: number;
}

interface SearchIndex {
  add(id: string, text: string): void;
  search(query: string, options?: { limit?: number }): readonly unknown[];
  remove(id: string): void;
}

let searchIndex: SearchIndex | null = null;
let documentStore: Map<string, SearchDocument> = new Map();
let ydoc: Y.Doc | null = null;
let searchIndexMap: Y.Map<string> | null = null;

export function tokenizeChinese(text: string): string[] {
  const tokens: string[] = [];
  let currentToken = "";
  let isChinese = false;

  for (const char of text) {
    const isChineseChar = /[\u4e00-\u9fff]/.test(char);

    if (isChineseChar) {
      if (currentToken && !isChinese) {
        tokens.push(currentToken.toLowerCase());
        currentToken = "";
      }
      currentToken += char;
      isChinese = true;
    } else if (/\s/.test(char)) {
      if (currentToken) {
        tokens.push(currentToken.toLowerCase());
      }
      currentToken = "";
      isChinese = false;
    } else if (/[a-zA-Z0-9]/.test(char)) {
      if (isChinese && currentToken) {
        tokens.push(currentToken);
        currentToken = "";
      }
      currentToken += char;
      isChinese = false;
    } else {
      if (currentToken) {
        tokens.push(currentToken.toLowerCase());
        currentToken = "";
      }
      isChinese = false;
    }
  }

  if (currentToken) {
    tokens.push(currentToken.toLowerCase());
  }

  const bigrams: string[] = [];
  for (const token of tokens) {
    if (/[\u4e00-\u9fff]/.test(token)) {
      for (let i = 0; i < token.length - 1; i++) {
        bigrams.push(token.slice(i, i + 2));
      }
      if (token.length === 1) {
        bigrams.push(token);
      }
    } else {
      bigrams.push(token);
    }
  }

  return bigrams;
}

function createSearchIndex(): SearchIndex {
  return new Index({
    tokenize: "forward",
    resolution: 9,
    cache: 100,
  }) as SearchIndex;
}

export function initializeSearchIndex(doc?: Y.Doc): void {
  if (searchIndex) {
    return;
  }

  if (doc) {
    ydoc = doc;
    searchIndexMap = ydoc.getMap("searchIndex");
    loadIndexFromYjs();
  }

  searchIndex = createSearchIndex();

  reindexAll();
}

export function loadIndexFromYjs(): void {
  if (!searchIndexMap || !searchIndex) return;

  documentStore.clear();

  searchIndexMap.forEach((value, key) => {
    try {
      const doc: SearchDocument = JSON.parse(value);
      documentStore.set(key, doc);
      const indexedText = tokenizeChinese(`${doc.title} ${doc.content}`).join(" ");
      searchIndex!.add(key, indexedText);
    } catch (e) {
      console.error(`Failed to parse search document ${key}:`, e);
    }
  });
}

export function saveIndexToYjs(): void {
  if (!searchIndexMap) return;

  documentStore.forEach((doc, id) => {
    searchIndexMap!.set(id, JSON.stringify(doc));
  });
}

export function addToIndex(doc: SearchDocument): void {
  if (!searchIndex) {
    initializeSearchIndex();
  }

  documentStore.set(doc.id, doc);
  const indexedText = tokenizeChinese(`${doc.title} ${doc.content}`).join(" ");
  searchIndex!.add(doc.id, indexedText);

  if (searchIndexMap) {
    searchIndexMap.set(doc.id, JSON.stringify(doc));
  }
}

export function removeFromIndex(id: string): void {
  if (!searchIndex) return;

  documentStore.delete(id);
  searchIndex!.remove(id);

  if (searchIndexMap) {
    searchIndexMap.delete(id);
  }
}

export function updateInIndex(doc: SearchDocument): void {
  removeFromIndex(doc.id);
  addToIndex(doc);
}

export function reindexAll(): void {
  if (!searchIndex) return;

  searchIndex = createSearchIndex();

  documentStore.forEach((doc, id) => {
    const indexedText = tokenizeChinese(`${doc.title} ${doc.content}`).join(" ");
    searchIndex!.add(id, indexedText);
  });
}

export function extractTextFromContent(content: unknown): string {
  if (!content) return "";

  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content.map(extractTextFromContent).join(" ");
  }

  if (typeof content === "object" && content !== null) {
    const obj = content as Record<string, unknown>;
    if (obj.text && typeof obj.text === "string") {
      return obj.text;
    }
    if (obj.content && Array.isArray(obj.content)) {
      return extractTextFromContent(obj.content);
    }
  }

  return "";
}

export function findHighlights(text: string, query: string): HighlightRange[] {
  const highlights: HighlightRange[] = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const queryTokens = tokenizeChinese(query);

  for (const token of queryTokens) {
    if (!token) continue;

    let startPos = 0;
    while (true) {
      const index = lowerText.indexOf(token, startPos);
      if (index === -1) break;

      highlights.push({
        start: index,
        end: index + token.length,
      });

      startPos = index + 1;
    }
  }

  let index = 0;
  while (true) {
    const pos = lowerText.indexOf(lowerQuery, index);
    if (pos === -1) break;

    highlights.push({
      start: pos,
      end: pos + query.length,
    });

    index = pos + 1;
  }

  return mergeHighlights(highlights);
}

function mergeHighlights(highlights: HighlightRange[]): HighlightRange[] {
  if (highlights.length === 0) return [];

  highlights.sort((a, b) => a.start - b.start);

  const merged: HighlightRange[] = [];
  let current = highlights[0];

  for (let i = 1; i < highlights.length; i++) {
    if (highlights[i].start <= current.end) {
      current = {
        start: current.start,
        end: Math.max(current.end, highlights[i].end),
      };
    } else {
      merged.push(current);
      current = highlights[i];
    }
  }
  merged.push(current);

  return merged;
}

export function createSnippet(text: string, query: string, maxLength = 150): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let bestPos = lowerText.indexOf(lowerQuery);
  if (bestPos === -1) {
    const tokens = tokenizeChinese(query);
    for (const token of tokens) {
      const pos = lowerText.indexOf(token);
      if (pos !== -1) {
        bestPos = pos;
        break;
      }
    }
  }

  if (bestPos === -1) {
    return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
  }

  const contextLength = Math.floor((maxLength - query.length) / 2);
  let start = Math.max(0, bestPos - contextLength);
  const end = Math.min(text.length, start + maxLength);

  if (end === text.length) {
    start = Math.max(0, end - maxLength);
  }

  let snippet = text.slice(start, end);

  if (start > 0) {
    snippet = "..." + snippet;
  }
  if (end < text.length) {
    snippet = snippet + "...";
  }

  return snippet;
}

export function search(query: string, limit = 20): SearchResult[] {
  if (!searchIndex || !query.trim()) {
    return [];
  }

  const startTime = performance.now();

  const tokenizedQuery = tokenizeChinese(query).join(" ");
  const results = searchIndex.search(tokenizedQuery, { limit: limit * 2 }) as string[];

  const searchResults: SearchResult[] = [];

  for (const id of results) {
    const doc = documentStore.get(id);
    if (!doc) continue;

    const fullText = `${doc.title} ${doc.content}`;
    const highlights = findHighlights(fullText, query);
    const snippet = createSnippet(doc.content, query);

    searchResults.push({
      id: doc.id,
      title: doc.title,
      snippet,
      type: doc.type,
      docId: doc.docId,
      blockId: doc.blockId,
      projectId: doc.projectId,
      score: 1,
      highlights,
    });

    if (searchResults.length >= limit) break;
  }

  const endTime = performance.now();
  console.log(`Search completed in ${endTime - startTime}ms`);

  return searchResults;
}

export function getDocumentCount(): number {
  return documentStore.size;
}

export function clearIndex(): void {
  if (searchIndex) {
    searchIndex = createSearchIndex();
  }
  documentStore.clear();

  if (searchIndexMap) {
    searchIndexMap.clear();
  }
}
