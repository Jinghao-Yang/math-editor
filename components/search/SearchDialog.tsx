"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { FileText, Hash, Search, Loader2 } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/tailwind/ui/command";
import { search, type SearchResult, type HighlightRange } from "@/lib/search/indexer";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onResultClick?: (result: SearchResult) => void;
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

export function SearchDialog({ open, onOpenChange, onResultClick }: SearchDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

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

  const performSearch = useDebouncedCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const startTime = performance.now();
    const searchResults = search(searchQuery, 20);
    const endTime = performance.now();

    console.log(`Search took ${endTime - startTime}ms`);

    setResults(searchResults);
    setIsLoading(false);
  }, 300);

  const handleInputChange = React.useCallback(
    (value: string) => {
      setQuery(value);
      if (value.trim()) {
        setIsLoading(true);
      }
      performSearch(value);
    },
    [performSearch]
  );

  const handleResultClick = React.useCallback(
    (result: SearchResult) => {
      setOpen(false);
      setQuery("");
      setResults([]);

      if (onResultClick) {
        onResultClick(result);
      } else {
        router.push(`/knowledge-base?doc=${result.docId}`);
      }
    },
    [onResultClick, router, setOpen]
  );

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case "block":
        return <Hash className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <Command shouldFilter={false}>
        <div className="flex items-center border-b px-4">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <input
            placeholder="搜索文档内容... (支持中文)"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>
        <CommandList>
          {query.trim() === "" ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              输入关键词开始搜索
            </div>
          ) : isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              搜索中...
            </div>
          ) : results.length === 0 ? (
            <CommandEmpty>未找到相关结果</CommandEmpty>
          ) : (
            <CommandGroup heading="搜索结果">
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  value={result.id}
                  onSelect={() => handleResultClick(result)}
                  className="flex flex-col items-start gap-1 py-3"
                >
                  <div className="flex items-center gap-2 w-full">
                    {getTypeIcon(result.type)}
                    <span className="font-medium">{result.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {result.type === "document" ? "文档" : "块"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2 pl-6">
                    <HighlightedText text={result.snippet} highlights={result.highlights} />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        {results.length > 0 && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            找到 {results.length} 个结果 · 按 ↑↓ 选择 · 按 Enter 打开
          </div>
        )}
      </Command>
    </CommandDialog>
  );
}

export function SearchButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          "h-9 px-4 py-2 w-full max-w-sm justify-start text-muted-foreground"
        )}
      >
        <Search className="h-4 w-4" />
        <span>搜索...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export default SearchDialog;
