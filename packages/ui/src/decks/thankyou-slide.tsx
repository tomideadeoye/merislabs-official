'use client';

import React from 'react';
import type { ThankYouSlideData } from './types';
import { useBrand } from './types';

export function ThankYouSlide({ slide }: { slide: ThankYouSlideData }) {
  const brand = useBrand();

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: 'white' }}>
      {slide.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url('${slide.backgroundImage}')` }}
        />
      )}
      <div className="absolute inset-0 bg-white/95" />
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{
          background: `linear-gradient(to right, ${brand.accent}, white, ${brand.accent})`,
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
        <h1
          className="text-6xl font-bold mb-6"
          style={{ color: brand.primary, fontFamily: brand.fontHeading }}
        >
          {slide.title || 'Thank You'}
        </h1>
        {slide.subtitle && (
          <p className="text-2xl mb-12 font-light" style={{ color: brand.textLight }}>
            {slide.subtitle}
          </p>
        )}

        <div className="flex flex-col items-center gap-8 mb-12">
          {brand.logos?.header && (
            <img src={brand.logos.header} alt="" className="h-24 drop-shadow-md" />
          )}
        </div>

        {slide.contactBlocks && slide.contactBlocks.length > 0 && (
          <div className="grid grid-cols-2 gap-16 text-left max-w-4xl w-full border-t pt-10" style={{ borderColor: brand.textLight + '33' }}>
            {slide.contactBlocks.map((block, i) => (
              <div key={i}>
                <h3
                  className="flex items-center font-bold text-sm tracking-[0.2em] uppercase mb-4"
                  style={{ color: brand.accent }}
                >
                  <span className="w-6 h-0.5 mr-3" style={{ background: brand.accent }} />
                  {block.heading}
                </h3>
                <div style={{ color: brand.textLight }}>
                  {block.lines.map((line, j) => (
                    <p key={j} className="leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {slide.cta && (
          <p className="mt-8 text-lg font-medium" style={{ color: brand.primary }}>
            {slide.cta}
          </p>
        )}
      </div>
    </div>
  );
}
