"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  AlertCircle,
  ArrowRight,
  FileText,
  Hash,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/tailwind/ui/command";
import { FeedbackState } from "@/components/tailwind/ui/feedback-state";
import { Button } from "@/components/tailwind/ui/button";
import { getAllDocuments, getConn } from "@/lib/store/db";
import {
  extractTextFromContent,
  initializeSearchIndex,
  replaceIndex,
  search,
  type HighlightRange,
  type SearchDocument,
  type SearchResult,
} from "@/lib/search/indexer";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onResultClick?: (result: SearchResult) => void;
}

interface SearchContentStateProps {
  typeDocumentLabel: string;
  typeBlockLabel: string;
  groupHeading: string;
  preparingTitle: string;
  preparingDescription: string;
  unavailableTitle: string;
  retryLabel: string;
  emptyQueryTitle: string;
  emptyQueryDescriptionWithCount: string;
  emptyQueryDescriptionWithoutCount: string;
  loadingTitle: string;
  loadingDescription: string;
  emptyResultsTitle: string;
  emptyResultsDescription: string;
  isPreparing: boolean;
  errorMessage: string | null;
  query: string;
  indexedDocumentCount: number;
  isLoading: boolean;
  results: SearchResult[];
  onRetry: () => void;
  onResultClick: (result: SearchResult) => void;
}

function buildSearchDocuments(fallbackTitle: string): SearchDocument[] {
  const documents = getAllDocuments();

  return documents
    .map((doc) => {
      const id = typeof doc["document/id"] === "string" ? doc["document/id"] : null;
      if (!id) {
        return null;
      }

      const title =
        typeof doc["document/title"] === "string" && doc["document/title"].trim()
          ? doc["document/title"]
          : fallbackTitle;
      const contentSource =
        doc["document/content"] ?? doc["document/markdown"] ?? doc["document/html"] ?? "";
      const content = extractTextFromContent(contentSource);
      const updatedAt =
        typeof doc["document/updatedAt"] === "string"
          ? doc["document/updatedAt"]
          : new Date().toISOString();

      return {
        id,
        title,
        content,
        type: "document" as const,
        docId: id,
        updatedAt,
      };
    })
    .filter((doc) => doc !== null) as SearchDocument[];
}

function prepareSearchIndexDocuments(fallbackTitle: string) {
  const { ydoc } = getConn();
  initializeSearchIndex(ydoc);
  const documents = buildSearchDocuments(fallbackTitle);
  replaceIndex(documents);
  return documents.length;
}

function getPrepareIndexErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

function HighlightedText({ text, highlights }: { text: string; highlights: HighlightRange[] }) {
  if (!highlights.length) {
    return <span>{text}</span>;
  }

  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const highlight of sortedHighlights) {
    if (highlight.start > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex, highlight.start)}</span>
      );
    }

    if (highlight.start < lastIndex) continue;

    parts.push(
      <mark
        key={`highlight-${highlight.start}`}
        className="bg-yellow-200 dark:bg-yellow-800 text-inherit px-0.5 rounded"
      >
        {text.slice(highlight.start, highlight.end)}
      </mark>
    );

    lastIndex = highlight.end;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
}

function renderTypeIcon(type: SearchResult["type"]) {
  switch (type) {
    case "document":
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    case "block":
      return <Hash className="h-4 w-4 text-muted-foreground" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
}

function getFooterText(
  resultsLength: number,
  searchDuration: number | null,
  resultsLabel: string,
  continueTypingLabel: string
) {
  const label = resultsLength > 0 ? resultsLabel : continueTypingLabel;

  return `${label}${searchDuration !== null ? ` · ${searchDuration}ms` : ""}`;
}

function SearchResultsList({
  results,
  onResultClick,
  typeDocumentLabel,
  typeBlockLabel,
  groupHeading,
}: {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  typeDocumentLabel: string;
  typeBlockLabel: string;
  groupHeading: string;
}) {
  return (
    <CommandGroup heading={groupHeading}>
      {results.map((result) => (
        <CommandItem
          key={result.id}
          value={result.id}
          onSelect={() => onResultClick(result)}
          className="group flex flex-col items-start gap-2 rounded-xl border border-transparent bg-transparent px-3 py-3 aria-selected:border-primary/20 aria-selected:bg-primary/5"
        >
          <div className="flex w-full items-center gap-2">
            {renderTypeIcon(result.type)}
            <span className="min-w-0 flex-1 truncate font-medium text-foreground">
              {result.title}
            </span>
            <span className="rounded-full border border-border/70 bg-background/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {result.type === "document" ? typeDocumentLabel : typeBlockLabel}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground/60 opacity-0 transition-opacity group-aria-selected:opacity-100" />
          </div>
          <div className="line-clamp-2 pl-6 text-sm leading-6 text-muted-foreground">
            <HighlightedText text={result.snippet} highlights={result.highlights} />
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

function SearchContentState({
  typeDocumentLabel,
  typeBlockLabel,
  groupHeading,
  preparingTitle,
  preparingDescription,
  unavailableTitle,
  retryLabel,
  emptyQueryTitle,
  emptyQueryDescriptionWithCount,
  emptyQueryDescriptionWithoutCount,
  loadingTitle,
  loadingDescription,
  emptyResultsTitle,
  emptyResultsDescription,
  isPreparing,
  errorMessage,
  query,
  indexedDocumentCount,
  isLoading,
  results,
  onRetry,
  onResultClick,
}: SearchContentStateProps) {
  const isQueryEmpty = query.trim() === "";

  if (isPreparing) {
    return (
      <FeedbackState
        icon={<Loader2 className="h-5 w-5 animate-spin" />}
        title={preparingTitle}
        description={preparingDescription}
        tone="info"
        className="m-2"
      />
    );
  }

  if (errorMessage) {
    return (
      <FeedbackState
        icon={<AlertCircle className="h-5 w-5" />}
        title={unavailableTitle}
        description={errorMessage}
        tone="error"
        className="m-2"
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-lg"
            onClick={onRetry}
          >
            {retryLabel}
          </Button>
        }
      />
    );
  }

  if (isQueryEmpty) {
    return (
      <FeedbackState
        icon={<Sparkles className="h-5 w-5" />}
        title={emptyQueryTitle}
        description={
          indexedDocumentCount > 0
            ? emptyQueryDescriptionWithCount
            : emptyQueryDescriptionWithoutCount
        }
        tone="neutral"
        className="m-2"
      />
    );
  }

  if (isLoading) {
    return (
      <FeedbackState
        icon={<Loader2 className="h-5 w-5 animate-spin" />}
        title={loadingTitle}
        description={loadingDescription}
        tone="info"
        className="m-2"
      />
    );
  }

  if (results.length === 0) {
    return (
      <FeedbackState
        icon={<Search className="h-5 w-5" />}
        title={emptyResultsTitle}
        description={emptyResultsDescription}
        tone="warning"
        className="m-2"
      />
    );
  }

  return (
    <SearchResultsList
      results={results}
      onResultClick={onResultClick}
      typeDocumentLabel={typeDocumentLabel}
      typeBlockLabel={typeBlockLabel}
      groupHeading={groupHeading}
    />
  );
}

export function SearchDialog({ open, onOpenChange, onResultClick }: SearchDialogProps) {
  const { t } = useI18n();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [indexedDocumentCount, setIndexedDocumentCount] = React.useState(0);
  const [isPreparing, setIsPreparing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [searchDuration, setSearchDuration] = React.useState<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const groupHeading = t("search.groupHeading", { count: results.length });
  const typeDocumentLabel = t("search.type.document");
  const typeBlockLabel = t("search.type.block");
  const preparingTitle = t("search.preparing.title");
  const preparingDescription = t("search.preparing.description");
  const prepareErrorFallback = t("search.preparing.errorFallback");
  const unavailableTitle = t("search.unavailable.title");
  const retryLabel = t("search.unavailable.retry");
  const emptyQueryTitle = t("search.emptyQuery.title");
  const emptyQueryDescriptionWithCount = t("search.emptyQuery.descriptionWithCount", {
    count: indexedDocumentCount,
  });
  const emptyQueryDescriptionWithoutCount = t("search.emptyQuery.descriptionWithoutCount");
  const loadingTitle = t("search.loading.title");
  const loadingDescription = t("search.loading.description");
  const emptyResultsTitle = t("search.emptyResults.title", { query });
  const emptyResultsDescription = t("search.emptyResults.description");
  const footerResults = t("search.footer.results", { count: results.length });
  const footerContinueTyping = t("search.footer.continueTyping");
  const footerNavigationHint = t("search.footer.navigationHint");
  const inputPlaceholder = t("search.inputPlaceholder");
  const untitledDocument = t("search.untitledDocument");
  const searchErrorFallback = t("search.errorFallback");

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, onOpenChange]
  );

  const isQueryEmpty = query.trim() === "";

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setOpen]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !isOpen) {
      return;
    }

    const retryToken = refreshKey;
    void retryToken;
    let cancelled = false;
    setIsPreparing(true);
    setErrorMessage(null);

    const prepareIndex = () => {
      try {
        const documentCount = prepareSearchIndexDocuments(untitledDocument);
        if (cancelled) return;
        setIndexedDocumentCount(documentCount);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(getPrepareIndexErrorMessage(error, prepareErrorFallback));
      }

      if (cancelled) return;
      setIsPreparing(false);
    };

    const timer = window.setTimeout(prepareIndex, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isOpen, prepareErrorFallback, refreshKey, untitledDocument]);

  React.useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setIsPreparing(false);
      setIsLoading(false);
      setErrorMessage(null);
      setSearchDuration(null);
    }
  }, [isOpen]);

  const performSearch = useDebouncedCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      setSearchDuration(null);
      return;
    }

    try {
      const startTime = performance.now();
      const searchResults = search(searchQuery, 20);
      const endTime = performance.now();

      setResults(searchResults);
      setSearchDuration(Math.round(endTime - startTime));
      setErrorMessage(null);
    } catch (error) {
      setResults([]);
      setSearchDuration(null);
      setErrorMessage(error instanceof Error ? error.message : searchErrorFallback);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  React.useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setIsLoading(false);
      setSearchDuration(null);
      return;
    }

    if (isPreparing) {
      return;
    }

    setIsLoading(true);
    performSearch(query);
  }, [query, isPreparing, performSearch]);

  const handleInputChange = React.useCallback(
    (value: string) => {
      setQuery(value);
      if (!value.trim()) {
        setErrorMessage(null);
      }
    },
    []
  );

  const handleResultClick = React.useCallback(
    (result: SearchResult) => {
      setOpen(false);
      setQuery("");
      setResults([]);

      if (onResultClick) {
        onResultClick(result);
      } else {
        const workspacePath =
          pathname === "/knowledge-base" || pathname === "/knowledge-base/documents"
            ? pathname
            : "/knowledge-base/documents";
        router.push(`${workspacePath}?doc=${result.docId}`);
      }
    },
    [onResultClick, pathname, router, setOpen]
  );

  const handleRetry = React.useCallback(() => {
    setErrorMessage(null);
    setRefreshKey((current) => current + 1);
  }, []);

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <Command shouldFilter={false}>
        <div className="border-b border-border/70 bg-muted/20 px-4 py-3">
          <div className="ui-field flex items-center gap-3 border-border/60 bg-background/90 px-3 shadow-subtle">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {isPreparing || isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
            <input
              placeholder={inputPlaceholder}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
              className="flex h-12 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="hidden items-center gap-2 sm:flex">
              <kbd className="pointer-events-none inline-flex h-6 select-none items-center rounded-lg border border-border/70 bg-muted/70 px-2 font-mono text-[11px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>
          </div>
        </div>
        <CommandList className="max-h-[420px] p-2">
          <SearchContentState
            typeDocumentLabel={typeDocumentLabel}
            typeBlockLabel={typeBlockLabel}
            groupHeading={groupHeading}
            preparingTitle={preparingTitle}
            preparingDescription={preparingDescription}
            unavailableTitle={unavailableTitle}
            retryLabel={retryLabel}
            emptyQueryTitle={emptyQueryTitle}
            emptyQueryDescriptionWithCount={emptyQueryDescriptionWithCount}
            emptyQueryDescriptionWithoutCount={emptyQueryDescriptionWithoutCount}
            loadingTitle={loadingTitle}
            loadingDescription={loadingDescription}
            emptyResultsTitle={emptyResultsTitle}
            emptyResultsDescription={emptyResultsDescription}
            isPreparing={isPreparing}
            errorMessage={errorMessage}
            query={query}
            indexedDocumentCount={indexedDocumentCount}
            isLoading={isLoading}
            results={results}
            onRetry={handleRetry}
            onResultClick={handleResultClick}
          />
        </CommandList>
        {(results.length > 0 || !isQueryEmpty) && !isPreparing && !errorMessage && (
          <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
            <span>
              {getFooterText(results.length, searchDuration, footerResults, footerContinueTyping)}
            </span>
            <span className="hidden sm:inline">{footerNavigationHint}</span>
          </div>
        )}
      </Command>
    </CommandDialog>
  );
}

export function SearchButton() {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "ui-field inline-flex h-10 w-full max-w-sm items-center justify-start gap-3 whitespace-nowrap px-3 text-sm font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        )}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Search className="h-4 w-4" />
        </span>
        <span>{t("search.trigger")}</span>
        <kbd className="pointer-events-none ml-auto hidden h-6 select-none items-center rounded-lg border border-border/70 bg-muted/70 px-2 font-mono text-[11px] font-medium opacity-100 sm:flex">
          Ctrl K
        </kbd>
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export default SearchDialog;
