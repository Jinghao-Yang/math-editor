'use client';

import { MousePointer2, Highlighter, Type, Square, Palette } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface AnnotationToolbarProps {
  selectedTool: 'select' | 'highlight' | 'text' | 'rectangle';
  onToolSelect: (tool: 'select' | 'highlight' | 'text' | 'rectangle') => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colors = [
  '#ffff00', // 黄色
  '#ff9900', // 橙色
  '#ff6666', // 红色
  '#66ff66', // 绿色
  '#66ffff', // 青色
  '#6666ff', // 蓝色
  '#ff66ff', // 粉色
];

export function PdfAnnotationToolbar({
  selectedTool,
  onToolSelect,
  selectedColor,
  onColorSelect,
}: AnnotationToolbarProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-white">
      <div className="flex items-center gap-1 mr-4">
        <button
          type="button"
          onClick={() => onToolSelect('select')}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={t("pdf.select")}
        >
          <MousePointer2 className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => onToolSelect('highlight')}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === 'highlight' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={t("pdf.highlight")}
        >
          <Highlighter className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => onToolSelect('text')}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={t("pdf.text")}
        >
          <Type className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => onToolSelect('rectangle')}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === 'rectangle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={t("pdf.rectangle")}
        >
          <Square className="w-5 h-5" />
        </button>
      </div>
      <div className="h-6 w-px bg-gray-200 mx-2" />
      <div className="flex items-center gap-1">
        <Palette className="w-4 h-4 text-gray-500" />
        <div className="flex items-center gap-1">
          {colors.map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => onColorSelect(color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                selectedColor === color ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
