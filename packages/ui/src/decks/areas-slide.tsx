'use client';

import React from 'react';
import type { AreasSlideData } from './types';
import { useBrand } from './types';

export function AreasSlide({
  slide,
  slideNumber,
}: {
  slide: AreasSlideData;
  slideNumber: number;
}) {
  const brand = useBrand();

  return (
    <div className="w-full h-full flex relative overflow-hidden" style={{ background: brand.background }}>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${brand.primary} 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
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
          {slide.areas.map((area, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 border-2 flex flex-col items-center justify-center text-center transition-all hover:shadow-xl group"
              style={{
                background: 'white',
                borderColor: `${brand.primary}11`,
              }}
            >
              <div
                className="text-5xl mb-3 group-hover:scale-110 transition-transform"
              >
                {area.icon}
              </div>
              <h3
                className="font-bold text-xl mb-2"
                style={{ color: brand.primary, fontFamily: brand.fontHeading }}
              >
                {area.title}
              </h3>
              <p className="text-sm" style={{ color: brand.textLight }}>
                {area.description}
              </p>
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
