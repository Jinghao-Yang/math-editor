'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronDown, Plus, FileText, Folder, FolderOpen } from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  parentId: string | null;
  order: number;
  children?: DocumentItem[];
}

interface DocumentTreeProps {
  documents: DocumentItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onCreateChild: (parentId: string | null) => void;
  onReorder: (id: string, newParentId: string | null, newOrder: number) => void;
}

export function DocumentTree({ documents, selectedId, onSelect, onCreateChild, onReorder }: DocumentTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const treeStructure = useMemo(() => {
    const map = new Map<string, DocumentItem>();
    const roots: DocumentItem[] = [];

    documents.forEach((doc) => {
      map.set(doc.id, { ...doc, children: [] });
    });

    documents.forEach((doc) => {
      const item = map.get(doc.id)!;
      if (doc.parentId && map.has(doc.parentId)) {
        map.get(doc.parentId)!.children!.push(item);
      } else {
        roots.push(item);
      }
    });

    roots.sort((a, b) => a.order - b.order);

    const sortChildren = (items: DocumentItem[]) => {
      items.forEach((item) => {
        if (item.children) {
          item.children.sort((a, b) => a.order - b.order);
          sortChildren(item.children);
        }
      });
    };
    sortChildren(roots);

    return roots;
  }, [documents]);

  const renderTree = (items: DocumentItem[], depth: number = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedIds.has(item.id);

      return (
        <div key={item.id}>
          <div
            className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-muted transition-colors ${
              selectedId === item.id ? 'bg-primary/10 text-primary' : 'text-foreground'
            }`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => onSelect(item.id)}
          >
            {hasChildren && (
              <button
                className="p-0.5 hover:bg-accent rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            {!hasChildren && <span className="w-4" />}
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-primary" />
              ) : (
                <Folder className="w-4 h-4 text-primary" />
              )
            ) : (
              <FileText className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="flex-1 truncate text-sm">{item.title}</span>
            <button
              className="p-1 opacity-0 hover:opacity-100 hover:bg-accent rounded transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onCreateChild(item.id);
              }}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          {hasChildren && isExpanded && renderTree(item.children!, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-2">
        <div className="flex items-center justify-between px-2 py-1.5 mb-2">
          <span className="text-sm font-medium text-foreground">文档树</span>
          <button
            className="p-1 hover:bg-muted rounded transition-colors"
            onClick={() => onCreateChild(null)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {treeStructure.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            暂无文档
          </div>
        ) : (
          renderTree(treeStructure)
        )}
      </div>
    </div>
  );
}
