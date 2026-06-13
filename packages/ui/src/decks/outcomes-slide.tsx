'use client';

import React from 'react';
import type { OutcomesSlideData } from './types';
import { useBrand } from './types';

function renderText(bullet: { text: string; bold?: string }) {
  const brand = useBrand();
  if (!bullet.bold) return <span>{bullet.text}</span>;
  const parts = bullet.text.split(bullet.bold);
  return (
    <span>
      {parts[0]}
      <strong style={{ color: brand.primary }}>{bullet.bold}</strong>
      {parts[1]}
    </span>
  );
}

export function OutcomesSlide({
  slide,
  slideNumber,
}: {
  slide: OutcomesSlideData;
  slideNumber: number;
}) {
  const brand = useBrand();

  return (
    <div className="w-full h-full flex relative overflow-hidden" style={{ background: brand.background }}>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-tl-[200px] opacity-50"
        style={{ background: brand.cardBackground }}
      />
      <div
        className="w-3"
        style={{ background: `linear-gradient(to bottom, ${brand.primary}, ${brand.highlight || brand.primary}, ${brand.accent})` }}
      />

      <div className="flex-1 flex flex-col p-10 relative z-10">
        <div className="flex items-start justify-between mb-8">
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

        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-5">
          {slide.bullets.map((bullet, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 border-2 flex items-center shadow-md hover:shadow-xl transition-shadow"
              style={{
                background: `linear-gradient(135deg, white, ${brand.cardBackground})`,
                borderColor: `${brand.primary}11`,
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${brand.accent}, ${brand.highlight || brand.primary})` }}
              >
                <span className="text-white text-2xl font-bold">✓</span>
              </div>
              <span className="text-base font-medium leading-snug" style={{ color: brand.text }}>
                {renderText(bullet)}
              </span>
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
