'use client';

import React from 'react';
import type { QuoteSlideData } from './types';
import { useBrand } from './types';

function renderBulletText(bullet: { text: string; bold?: string }) {
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

export function QuoteSlide({
  slide,
  slideNumber,
}: {
  slide: QuoteSlideData;
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
        <div className="flex items-start justify-between mb-4">
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

        <div
          className="p-8 rounded-2xl my-4 relative shadow-xl"
          style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.highlight || brand.primary})` }}
        >
          <div
            className="absolute top-4 left-6 text-7xl opacity-40"
            style={{ color: brand.accent, fontFamily: brand.fontHeading }}
          >
            &ldquo;
          </div>
          <p
            className="text-white text-2xl font-medium text-center px-12 py-4 leading-relaxed relative z-10"
            style={{ fontFamily: brand.fontHeading }}
          >
            {slide.quote}
          </p>
          {slide.quoteAuthor && (
            <p className="text-center mt-4 tracking-wider font-medium" style={{ color: brand.accent }}>
              — {slide.quoteAuthor}
            </p>
          )}
        </div>

        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="flex-1 flex flex-col justify-center space-y-4 mt-4">
            {slide.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start">
                <div
                  className="w-3 h-3 rounded-full mt-1.5 mr-4 flex-shrink-0"
                  style={{ background: brand.accent }}
                />
                <span className="text-base leading-relaxed" style={{ color: brand.text }}>
                  {renderBulletText(bullet)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {slide.subtitle && (
          <div className="flex items-center justify-between pt-6 border-t mt-auto" style={{ borderColor: brand.textLight + '33' }}>
            {brand.logos?.footer && (
              <img src={brand.logos.footer} alt="" className="h-8" style={{ opacity: 0.7 }} />
            )}
            <span className="text-sm tracking-wide" style={{ color: brand.textLight }}>
              {slide.subtitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
