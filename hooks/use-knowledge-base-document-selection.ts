"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useKnowledgeBaseDocumentSelection() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const docId = searchParams.get("doc");
    setSelectedDocumentId(docId || null);
  }, [searchParams]);

  const updateDocumentQuery = useCallback(
    (docId: string | null) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (docId) {
        nextParams.set("doc", docId);
      } else {
        nextParams.delete("doc");
      }

      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleSelectDocument = useCallback(
    (docId: string) => {
      const normalizedId = docId.trim();
      if (!normalizedId) {
        setSelectedDocumentId(null);
        updateDocumentQuery(null);
        return;
      }

      setSelectedDocumentId(normalizedId);
      updateDocumentQuery(normalizedId);
    },
    [updateDocumentQuery]
  );

  const clearSelectedDocument = useCallback(() => {
    setSelectedDocumentId(null);
    updateDocumentQuery(null);
  }, [updateDocumentQuery]);

  return {
    selectedDocumentId,
    handleSelectDocument,
    clearSelectedDocument,
  };
}
