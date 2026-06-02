'use client';

import React, { useState, useCallback, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { PdfAnnotationToolbar } from './AnnotationToolbar';

// 设置 PDF.js worker
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface PdfAnnotation {
  id: string;
  pageIndex: number;
  type: 'highlight' | 'underline' | 'strikethrough' | 'text' | 'rectangle' | 'circle';
  content?: string;
  position: { x: number; y: number; width: number; height: number };
  color: string;
  referencedDocId?: string;
  createdAt: string;
  updatedAt: string;
}

interface PdfViewerProps {
  pdfUrl?: string;
  onUpload?: (file: File) => void;
  annotations?: PdfAnnotation[];
  onAnnotationAdd?: (annotation: PdfAnnotation) => void;
  onAnnotationDelete?: (annotationId: string) => void;
}

export function PdfViewer({ 
  pdfUrl, onUpload, annotations = [], onAnnotationAdd, onAnnotationDelete }: PdfViewerProps) {
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'select' | 'highlight' | 'text' | 'rectangle'>('select');
  const [selectedColor, setSelectedColor] = useState('#ffff00');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = URL.createObjectURL(file);
      const pdfDocument = await pdfjs.getDocument({ url }).promise;
      setPdf(pdfDocument);
      setPageCount(pdfDocument.numPages);
      setCurrentPage(1);
      URL.revokeObjectURL(url);
      if (onUpload) {
        onUpload(file);
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
    } finally {
      setLoading(false);
    }
  }, [onUpload]);

  const renderPage = useCallback(async (pageNumber: number) => {
    if (!pdf || !canvasRef.current) return;

    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport,
        canvas: canvas,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  }, [pdf, scale]);

  React.useEffect(() => {
    if (pdf) {
      renderPage(currentPage);
    }
  }, [pdf, currentPage, renderPage]);

  React.useEffect(() => {
    if (!pdf && pdfUrl) {
      setLoading(true);
      pdfjs.getDocument({ url: pdfUrl }).promise.then((pdfDocument) => {
        setPdf(pdfDocument);
        setPageCount(pdfDocument.numPages);
        setCurrentPage(1);
        setLoading(false);
      }).catch((error) => {
        console.error('Error loading PDF:', error);
        setLoading(false);
      });
    }
  }, [pdf, pdfUrl]);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
            <Upload className="w-4 h-4" />
            <span>上传PDF</span>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {pdf && (
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-1 rounded hover:bg-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <span className="text-sm">
                {currentPage} / {pageCount}
              </span>
              <button onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))} className="p-1 rounded hover:bg-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleZoomOut} className="p-2 rounded hover:bg-gray-100">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="p-2 rounded hover:bg-gray-100">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
      {pdf && (
        <PdfAnnotationToolbar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      )}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div ref={containerRef} className="relative inline-block bg-white shadow-lg">
          {!pdf ? (
            <div className="flex items-center justify-center min-h-[400px] text-gray-400">
              请上传PDF文件
            </div>
          ) : (
            <canvas ref={canvasRef} />
          )}
        </div>
      </div>
    </div>
  );
}
