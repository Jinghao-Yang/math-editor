"use client";

import * as React from "react";
import {
  initializeSearchIndex,
  addToIndex,
  removeFromIndex,
  updateInIndex,
  search,
  clearIndex,
  getDocumentCount,
  extractTextFromContent,
  type SearchDocument,
  type SearchResult,
} from "@/lib/search/indexer";
import { getConn } from "@/lib/store/db";

export function useSearchIndex() {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [documentCount, setDocumentCount] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const { ydoc } = getConn();
      initializeSearchIndex(ydoc);
      setIsInitialized(true);
      setDocumentCount(getDocumentCount());
    } catch (error) {
      console.error("Failed to initialize search index:", error);
    }
  }, []);

  const addDocument = React.useCallback(
    (doc: SearchDocument) => {
      addToIndex(doc);
      setDocumentCount(getDocumentCount());
    },
    []
  );

  const removeDocument = React.useCallback((id: string) => {
    removeFromIndex(id);
    setDocumentCount(getDocumentCount());
  }, []);

  const updateDocument = React.useCallback(
    (doc: SearchDocument) => {
      updateInIndex(doc);
      setDocumentCount(getDocumentCount());
    },
    []
  );

  const searchDocuments = React.useCallback((query: string, limit?: number): SearchResult[] => {
    return search(query, limit);
  }, []);

  const clearAll = React.useCallback(() => {
    clearIndex();
    setDocumentCount(0);
  }, []);

  return {
    isInitialized,
    documentCount,
    addDocument,
    removeDocument,
    updateDocument,
    searchDocuments,
    clearAll,
    extractTextFromContent,
  };
}

export function useSearch(query: string, limit = 20) {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = search(query, limit);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Search failed"));
    } finally {
      setIsLoading(false);
    }
  }, [query, limit]);

  return { results, isLoading, error };
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { meta?: boolean; ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { meta = false, ctrl = false, shift = false, alt = false } = modifiers;

      const metaMatch = meta ? e.metaKey || e.ctrlKey : true;
      const ctrlMatch = ctrl ? e.ctrlKey : true;
      const shiftMatch = shift ? e.shiftKey : true;
      const altMatch = alt ? e.altKey : true;

      if (e.key.toLowerCase() === key.toLowerCase() && metaMatch && ctrlMatch && shiftMatch && altMatch) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key, callback, modifiers]);
}
