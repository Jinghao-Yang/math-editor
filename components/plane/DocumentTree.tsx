'use client';

import { useState, useCallback, useMemo } from 'react';
import { ChevronRight, Plus, FileText, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

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

// ---- 纯函数 ----

function buildTree(documents: DocumentItem[]): DocumentItem[] {
  const map = new Map<string, DocumentItem>();
  const roots: DocumentItem[] = [];

  for (const doc of documents) {
    map.set(doc.id, { ...doc, children: [] });
  }

  for (const doc of documents) {
    const item = map.get(doc.id);
    if (!item) continue;
    if (doc.parentId && map.has(doc.parentId)) {
      const parent = map.get(doc.parentId);
      parent?.children?.push(item);
    } else {
      roots.push(item);
    }
  }

  roots.sort((a, b) => a.order - b.order);

  const sortChildren = (items: DocumentItem[]) => {
    for (const item of items) {
      if (item.children) {
        item.children.sort((a, b) => a.order - b.order);
        sortChildren(item.children);
      }
    }
  };
  sortChildren(roots);

  return roots;
}

// ---- 子组件 ----

interface TreeNodeProps {
  item: DocumentItem;
  depth: number;
  expandedIds: Set<string>;
  selectedId: string | undefined;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onCreateChild: (parentId: string | null) => void;
}

function TreeNode({
  item,
  depth,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
  onCreateChild,
}: TreeNodeProps) {
  const hasChildren = Boolean(item.children?.length);
  const isExpanded = expandedIds.has(item.id);
  const isSelected = selectedId === item.id;

  return (
    <div>
      <div
        className={cn(
          'group relative flex items-center gap-1 px-2 py-[7px] rounded-md cursor-pointer',
          'transition-colors duration-fast',
          isSelected ? 'bg-[#EEF2FF] text-[#5E6AD2]' : 'text-[#111827] hover:bg-[#F3F4F6]'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(item.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(item.id);
          }
        }}
      >
        {isSelected && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#5E6AD2]" />
        )}

        {hasChildren ? (
          <button
            type="button"
            className="p-0.5 rounded-sm hover:bg-[#E5E7EB] transition-colors duration-fast shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.id);
            }}
          >
            <span
              className={cn(
                'block transition-transform duration-200',
                isExpanded && 'rotate-90'
              )}
            >
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </span>
          </button>
        ) : (
          <span className="w-[22px] shrink-0" />
        )}

        {hasChildren ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 shrink-0 text-[#5E6AD2]/70" />
          ) : (
            <Folder className="w-4 h-4 shrink-0 text-[#5E6AD2]/70" />
          )
        ) : (
          <FileText className="w-4 h-4 shrink-0 text-[#9CA3AF]" />
        )}

        <span className="flex-1 truncate text-sm">{item.title}</span>

        <button
          type="button"
          className={cn(
            'p-1 rounded-sm hover:bg-[#E5E7EB] transition-all duration-fast shrink-0',
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onCreateChild(item.id);
          }}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div
        className={cn(
          'grid transition-all duration-200 ease-out',
          isExpanded && hasChildren ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          {hasChildren &&
            item.children?.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                depth={depth + 1}
                expandedIds={expandedIds}
                selectedId={selectedId}
                onToggle={onToggle}
                onSelect={onSelect}
                onCreateChild={onCreateChild}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

// ---- 主组件 ----

export function DocumentTree({
  documents,
  selectedId,
  onSelect,
  onCreateChild,
  onReorder: _onReorder,
}: DocumentTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { t } = useI18n();

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

  const tree = useMemo(() => buildTree(documents), [documents]);

  return (
    <div className="h-full overflow-auto py-1">
      <div className="px-2">
        <div className="flex items-center justify-between px-2 py-1.5 mb-1">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            {t("plane.documentTree")}
          </span>
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-fast"
            onClick={() => onCreateChild(null)}
          >
            <Plus className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>
        </div>
        {tree.length === 0 ? (
          <div className="px-4 py-8 text-center text-[#9CA3AF] text-xs">
            {t("plane.noDocuments")}
          </div>
        ) : (
          tree.map((item) => (
            <TreeNode
              key={item.id}
              item={item}
              depth={0}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggle={toggleExpand}
              onSelect={onSelect}
              onCreateChild={onCreateChild}
            />
          ))
        )}
      </div>
    </div>
  );
}
