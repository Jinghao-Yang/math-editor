"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface StageCard {
  id: string;
  title: string;
}

interface StageColumn {
  id: string;
  title: string;
  cards: StageCard[];
}

export function KanbanView() {
  const { t } = useI18n();
  const [columns, setColumns] = useState<StageColumn[]>([
    {
      id: "lit",
      title: "Literature",
      cards: [
        { id: "c1", title: "Heine–Borel origins" },
        { id: "c2", title: "Tychonoff's theorem" }
      ]
    },
    {
      id: "conj",
      title: "Conjecture",
      cards: [
        { id: "c3", title: "Compactness ↔ sequential" },
        { id: "c4", title: "Non-Hausdorff products" }
      ]
    },
    {
      id: "proof",
      title: "Proof",
      cards: [{ id: "c5", title: "Lemma 2.4: finite subcover" }]
    },
    {
      id: "writing",
      title: "Writing",
      cards: [{ id: "c6", title: "Draft: introduction" }]
    },
    {
      id: "pub",
      title: "Published",
      cards: []
    }
  ]);

  const draggedCardId = useRef<string | null>(null);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    draggedCardId.current = cardId;
    e.dataTransfer.setData("text/plain", cardId);
    (e.target as HTMLElement).style.opacity = "0.4";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = "1";
    draggedCardId.current = null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.borderColor = "var(--swiss-red)";
  };

  const handleDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.borderColor = "var(--grid-line)";
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.borderColor = "var(--grid-line)";
    
    const cardId = e.dataTransfer.getData("text/plain") || draggedCardId.current;
    if (!cardId) return;

    setColumns(prev => {
      // 找出拖拽卡片的原始信息
      let foundCard: StageCard | null = null;
      const nextCols = prev.map(col => {
        const remainingCards = col.cards.filter(c => {
          if (c.id === cardId) {
            foundCard = c;
            return false;
          }
          return true;
        });
        return { ...col, cards: remainingCards };
      });

      // 将卡片追加到目标列
      if (foundCard) {
        return nextCols.map(col => {
          if (col.id === targetColId) {
            return { ...col, cards: [...col.cards, foundCard!] };
          }
          return col;
        });
      }
      return prev;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-human text-3xl font-normal">Research Pipeline</h2>
        <p className="text-[var(--text-muted)] font-sys text-sm mt-1">Drag and drop cards across stages to visually manage the research pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {columns.map(col => (
          <div
            key={col.id}
            className="stage-column"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="column-header">{col.title}</div>
            
            {col.cards.length === 0 ? (
              <div className="text-neutral-400 italic text-[11px] p-2 select-none">
                (empty)
              </div>
            ) : (
              col.cards.map(card => (
                <div
                  key={card.id}
                  className="stage-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id)}
                  onDragEnd={handleDragEnd}
                >
                  {card.title}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}