"use client";

import { useMemo } from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

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
  documentTitle?: string;
}

export function BacklinksPanel({ docId, backlinks, onNavigate, documentTitle }: BacklinksPanelProps) {
  const { t } = useI18n();

  const filteredBacklinks = useMemo(
    () => backlinks.filter((link) => link.targetDocId === docId),
    [backlinks, docId]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* 检查器头部 */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-grid-line shrink-0">
        <span className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted">Context Panel</span>
        <span className="font-mono text-[9px] text-text-muted">active</span>
      </div>

      {/* 内容轴 */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
        
        {/* 1. Structure 树 */}
        <div>
          <div className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted mb-4">Structure</div>
          <div className="font-mono text-[11px] space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors cursor-pointer">
              <span>⊤</span> General Topology
            </div>
            <div className="flex items-center gap-2 text-text-main font-semibold ml-4">
              <span className="text-swiss-red font-bold">·</span> Compact Space
            </div>
            <div className="flex items-center gap-2 text-text-muted ml-8">
              <span>⊢</span> Heine–Borel
            </div>
            <div className="flex items-center gap-2 text-text-muted ml-8">
              <span>⊢</span> Tychonoff's Theorem
            </div>
          </div>
        </div>

        <div className="h-px bg-grid-line" />

        {/* 2. Attributes 双栏列表 */}
        <div>
          <div className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted mb-4">Attributes</div>
          <div className="space-y-3 font-mono text-[11px]">
            <div className="flex justify-between items-center border-b border-grid-line pb-1.5">
              <span className="text-text-muted">Category</span>
              <span className="bg-gray-100 px-2 py-0.5 border border-grid-line">Point-Set</span>
            </div>
            <div className="flex justify-between items-center border-b border-grid-line pb-1.5">
              <span className="text-text-muted">Foundation</span>
              <span className="bg-gray-100 px-2 py-0.5 border border-grid-line">ZFC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Lean 4</span>
              <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Unverified ↗</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-grid-line" />

        {/* 3. GRAPH 局部知识图谱 (SVG 矢量关系图) */}
        <div>
          <div className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted mb-4">Local Graph</div>
          
          <div className="h-28 bg-canvas border border-grid-line flex items-center justify-center relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" stroke="#E5E4DE" strokeWidth="1">
              <line x1="130" y1="56" x2="60" y2="36" />
              <line x1="130" y1="56" x2="200" y2="36" />
              <line x1="130" y1="56" x2="130" y2="90" />
            </svg>
            {/* 中心主节点 */}
            <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-3.5 h-3.5 bg-swiss-red border border-white"></div>
            </div>
            {/* 辅节点 */}
            <div className="absolute top-[20%] left-[20%] flex flex-col items-center"><div className="w-2.5 h-2.5 bg-gray-400"></div></div>
            <div className="absolute top-[20%] right-[20%] flex flex-col items-center"><div className="w-2.5 h-2.5 bg-gray-400"></div></div>
            <div className="absolute bottom-[10%] left-[50%] transform -translate-x-1/2 flex flex-col items-center"><div className="w-2.5 h-2.5 bg-gray-400"></div></div>
          </div>
        </div>

        <div className="h-px bg-grid-line" />

        {/* 4. Backlinks 反向关联引用 (有引用时呈现) */}
        <div>
          <div className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted mb-4">
            Linked References ({filteredBacklinks.length})
          </div>
          
          {filteredBacklinks.length === 0 ? (
            <div className="font-reading text-sm italic text-text-muted">No linked mentions yet.</div>
          ) : (
            <div className="space-y-1">
              {filteredBacklinks.map((backlink) => (
                <button
                  type="button"
                  key={backlink.id}
                  onClick={() => onNavigate(backlink.sourceDocId)}
                  className="w-full flex items-center justify-between py-2 border-b border-grid-line text-left group font-sys text-[13px] hover:text-swiss-red transition-colors"
                >
                  <span className="font-reading text-base leading-none text-text-main truncate group-hover:text-swiss-red">
                    {backlink.targetTitle}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-grid-line" />

        {/* 5. Completeness 极细进度指示条 */}
        <div className="pt-4 border-t border-grid-line">
          <div className="flex justify-between items-center font-mono text-[9px] text-text-muted uppercase tracking-widest mb-2">
            <span>Completeness</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-swiss-red"></span>
              <span className="text-text-main">80%</span>
            </span>
          </div>
          <div className="h-[2px] w-full bg-grid-line">
            <div className="h-full w-4/5 bg-text-main"></div>
          </div>
        </div>

      </div>
    </div>
  );
}