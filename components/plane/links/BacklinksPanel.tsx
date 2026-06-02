"use client";

import { useMemo } from 'react';
import { Link2, FileText, ArrowRight } from 'lucide-react';

interface Backlink {
  id: string;
  sourceDocId: string;
  targetDocId: string;
  targetTitle: string;
}

interface BacklinksPanelProps {
  docId: string;
  backlinks: Backlink[];
  onNavigate: (docId: string) => void;
}

export function BacklinksPanel({ docId, backlinks, onNavigate }: BacklinksPanelProps) {
  const filteredBacklinks = useMemo(
    () => backlinks.filter((link) => link.targetDocId === docId),
    [backlinks, docId]
  );

  if (filteredBacklinks.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <Link2 className="w-4 h-4" />
          <span>反向链接</span>
        </div>
        <div className="text-gray-400 text-sm">暂无反向链接</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
        <Link2 className="w-4 h-4" />
        <span>反向链接 ({filteredBacklinks.length})</span>
      </div>
      <div className="space-y-2">
        {filteredBacklinks.map((backlink) => (
          <button
            key={backlink.id}
            onClick={() => onNavigate(backlink.sourceDocId)}
            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left group"
          >
            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-700 truncate">
              {backlink.targetTitle}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}