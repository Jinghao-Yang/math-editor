"use client";

import { useMemo } from 'react';
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
      <div className="h-20 px-6 flex items-center justify-between border-b border-grid-line shrink-0">
        <span className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted">Context Panel</span>
        <span className="font-mono text-[9px] text-text-muted">active</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
        
        {/* 1. Structure (使用严格的逻辑运算符) */}
        <div>
          <div className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted mb-4">Structure</div>
          <div className="font-mono text-[11px] space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors cursor-pointer">
              <span>⊤</span> General Topology
            </div>
            <div className="flex items-center gap-2 text-text-main font-semibold ml-4">
              <span className="text-swiss-red font-bold">·</span> {documentTitle || "Compact Space"}
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

        {/* 2. Backlinks 反向关系 */}
        <div>
          <div className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted mb-3">Backlinks</div>
          <div className="space-y-1">
            <div className="backlink-item" onClick={() => onNavigate("hb")}>
              <span>Heine–Borel theorem</span>
              <span className="text-text-muted text-[10px]">2 references</span>
            </div>
            <div className="backlink-item" onClick={() => onNavigate("tyc")}>
              <span>Tychonoff's theorem</span>
              <span className="text-text-muted text-[10px]">1 reference</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-grid-line" />

        {/* 3. GRAPH 局部知识图谱 (SVG 带点击事件) */}
        <div>
          <div className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted mb-4">Local Graph</div>
          <div className="h-32 bg-[#FAF9F6] border border-grid-line relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" stroke="#D1D0CB" strokeWidth="1">
              <line x1="150" y1="60" x2="80" y2="30" />
              <line x1="150" y1="60" x2="220" y2="30" />
              <line x1="150" y1="60" x2="150" y2="100" />
              <line x1="80" y1="30" x2="30" y2="60" />
              <line x1="220" y1="30" x2="270" y2="60" />
            </svg>
            
            {/* 可交互节点 */}
            <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" onClick={() => onNavigate("compact")}>
              <div className="w-4 h-4 bg-swiss-red border border-white shadow-sm hover:scale-110 transition-transform"></div>
            </div>
            <div className="absolute top-[15%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" onClick={() => onNavigate("hb")}>
              <div className="w-3 h-3 bg-gray-400 border border-white hover:scale-110 transition-transform"></div>
            </div>
            <div className="absolute top-[15%] right-[20%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" onClick={() => onNavigate("tyc")}>
              <div className="w-3 h-3 bg-gray-400 border border-white hover:scale-110 transition-transform"></div>
            </div>
          </div>
        </div>

        <div className="h-px bg-grid-line" />

        {/* 4. Attributes */}
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

        {/* 5. Tools */}
        <div>
          <div className="font-sys text-[10px] uppercase tracking-[0.15em] text-text-muted mb-4">Tools</div>
          <ul className="space-y-1.5 font-sys text-xs">
            <li className="group flex justify-between items-center cursor-pointer p-1">
              <span className="flex items-center gap-2"><span className="font-mono text-text-muted">⇢</span> Trace Origin</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-swiss-red">→</span>
            </li>
          </ul>
        </div>

        {/* 6. Progress */}
        <div className="pt-4 border-t border-grid-line">
          <div className="flex justify-between items-center font-mono text-[9px] text-text-muted uppercase tracking-widest mb-2">
            <span>Completeness</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-swiss-red"></span>
              <span className="text-black">80%</span>
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