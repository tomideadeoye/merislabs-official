'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BrandContext, defaultBrand } from './types';
import type { BrandConfig, RegisteredSlideData, AspectRatio } from './types';
import { getSlideComponent } from './registry';

export interface DeckShellProps {
  slides: RegisteredSlideData[]
  brand?: Partial<BrandConfig>
  aspectRatio?: AspectRatio
  showControls?: boolean
}

export function DeckShell({
  slides,
  brand,
  aspectRatio = '16:9',
  showControls = true,
}: DeckShellProps) {
  const [index, setIndex] = useState(0);
  const [printMode, setPrintMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedBrand: BrandConfig = { ...defaultBrand, ...brand };

  const total = slides.length;
  const current = slides[index];
  const SlideComponent = current ? getSlideComponent(current.type) : null;

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(i, total - 1)));
  }, [total]);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (printMode) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goPrev();
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          break;
        case 'End':
          e.preventDefault();
          goTo(total - 1);
          break;
        case 'p':
          if (e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          setPrintMode((p) => !p);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, goTo, total, printMode]);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400 text-lg">
        No slides to display
      </div>
    );
  }

  if (printMode) {
    return (
      <PrintView
        slides={slides}
        brand={resolvedBrand}
        onExit={() => setPrintMode(false)}
      />
    );
  }

  const aspectClass =
    aspectRatio === '4:3' ? 'aspect-[4/3]' :
    aspectRatio === 'a4' ? 'aspect-[1/1.414]' :
    'aspect-video';

  return (
    <BrandContext.Provider value={resolvedBrand}>
      <div className="w-full bg-gray-100 rounded-2xl overflow-hidden shadow-xl" ref={containerRef}>
        <div className={`relative w-full ${aspectClass} overflow-hidden`}>
          {SlideComponent ? (
            <SlideComponent
              slide={current}
              slideNumber={index + 1}
              totalSlides={total}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
              Unknown slide type: {current.type}
            </div>
          )}
        </div>

        {showControls && (
          <NavBar
            index={index}
            total={total}
            onPrev={goPrev}
            onNext={goNext}
            onPrint={() => setPrintMode(true)}
            goTo={goTo}
          />
        )}
      </div>
    </BrandContext.Provider>
  );
}

// ── Navigation Bar ──

function NavBar({
  index,
  total,
  onPrev,
  onNext,
  onPrint,
  goTo,
}: {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onPrint: () => void
  goTo: (i: number) => void
}) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 hover:bg-gray-100"
        >
          ← Prev
        </button>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 hover:bg-gray-100"
        >
          Next →
        </button>
      </div>

      <div className="text-sm text-gray-500 font-mono">
        {index + 1} / {total}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrint}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
          title="Print View (P)"
        >
          🖨️
        </button>
      </div>
    </div>
  );
}

// ── Print View ──

function PrintView({
  slides,
  brand,
  onExit,
}: {
  slides: RegisteredSlideData[]
  brand: BrandConfig
  onExit: () => void
}) {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b sticky top-0 z-50">
        <button
          onClick={onExit}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Exit Print View
        </button>
        <span className="text-sm text-gray-500">{slides.length} slides</span>
      </div>
      <div className="p-6 space-y-6">
        {slides.map((slide, i) => {
          const SlideComponent = getSlideComponent(slide.type);
          return (
            <div key={i} className="border rounded-xl overflow-hidden">
              <div className="aspect-video relative">
                <BrandContext.Provider value={brand}>
                  {SlideComponent ? (
                    <SlideComponent
                      slide={slide}
                      slideNumber={i + 1}
                      totalSlides={slides.length}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Unknown type: {slide.type}
                    </div>
                  )}
                </BrandContext.Provider>
              </div>
              {slide.speakerNote && (
                <div className="px-6 py-3 bg-yellow-50 text-sm text-gray-600 border-t italic">
                  💬 {slide.speakerNote}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
