'use client';

import React from 'react';
import type { ComparisonSlideData } from './types';
import { useBrand } from './types';

export function ComparisonSlide({
  slide,
  slideNumber,
}: {
  slide: ComparisonSlideData;
  slideNumber: number;
}) {
  const brand = useBrand();

  return (
    <div className="w-full h-full flex relative overflow-hidden" style={{ background: brand.background }}>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${brand.background}, ${brand.cardBackground})` }}
      />
      <div
        className="w-3"
        style={{ background: `linear-gradient(to bottom, ${brand.primary}, ${brand.highlight || brand.primary}, ${brand.accent})` }}
      />

      <div className="flex-1 flex flex-col p-10 relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1
              className="text-4xl font-bold mb-3"
              style={{ color: brand.primary, fontFamily: brand.fontHeading }}
            >
              {slide.title}
            </h1>
            <div
              className="w-24 h-1.5 rounded-full"
              style={{ background: `linear-gradient(to right, ${brand.accent}, ${brand.accent}33)` }}
            />
          </div>
          <div
            className="text-8xl font-bold leading-none"
            style={{ color: `${brand.primary}22`, fontFamily: brand.fontHeading }}
          >
            {String(slideNumber).padStart(2, '0')}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-6">
          {[
            { col: slide.comparisonLeft, side: 'left' as const },
            { col: slide.comparisonRight, side: 'right' as const },
          ].map(({ col, side }) => (
            <div
              key={side}
              className="rounded-2xl shadow-lg flex flex-col overflow-hidden"
              style={{
                background: 'white',
                border: `2px solid ${side === 'left' ? '#fecaca' : `${brand.accent}66`}`,
              }}
            >
              <div
                className="p-4"
                style={{
                  background:
                    side === 'left'
                      ? 'linear-gradient(to right, #dc2626, #ef4444)'
                      : `linear-gradient(to right, ${brand.primary}, ${brand.highlight || brand.primary})`,
                }}
              >
                <h3 className="text-white text-2xl font-bold text-center">{col.title}</h3>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <ul className="flex-1 space-y-4">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-start">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5"
                        style={{
                          background: side === 'left' ? '#fee2e2' : `${brand.accent}22`,
                        }}
                      >
                        <span
                          className="text-sm"
                          style={{
                            color: side === 'left' ? '#dc2626' : brand.primary,
                          }}
                        >
                          {side === 'left' ? '✗' : '✓'}
                        </span>
                      </div>
                      <span className="text-lg" style={{ color: brand.text }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t" style={{ borderColor: side === 'left' ? '#fecaca' : `${brand.accent}33` }}>
                  <p
                    className="font-bold text-center text-lg"
                    style={{ color: side === 'left' ? '#dc2626' : brand.primary }}
                  >
                    {col.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t mt-6" style={{ borderColor: brand.textLight + '33' }}>
          {brand.logos?.footer && (
            <img src={brand.logos.footer} alt="" className="h-8" style={{ opacity: 0.7 }} />
          )}
          <span className="text-sm tracking-wide" style={{ color: brand.textLight }}>
            {slide.subtitle || ''}
          </span>
        </div>
      </div>
    </div>
  );
}
