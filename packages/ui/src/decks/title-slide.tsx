'use client';

import React from 'react';
import type { TitleSlideData } from './types';
import { useBrand } from './types';

export function TitleSlide({ slide }: { slide: TitleSlideData }) {
  const brand = useBrand();

  return (
    <div className="w-full h-full relative overflow-hidden">
      {slide.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('${slide.backgroundImage}')` }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${brand.primary}dd, ${brand.primary}cc)` }}
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: brand.accent,
          opacity: 0.1,
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{
          background: `linear-gradient(to right, ${brand.accent}, white, ${brand.accent})`,
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-20 text-center">
        {slide.logos && slide.logos.length > 0 && (
          <div className="mb-10 flex items-center justify-center space-x-8">
            {slide.logos.map((logo, i) => (
              <img key={i} src={logo} alt="" className="h-20 w-auto drop-shadow-lg" />
            ))}
          </div>
        )}

        <h1
          className="text-[2.5rem] leading-tight font-bold mb-6 max-w-5xl"
          style={{
            color: '#fff',
            fontFamily: brand.fontHeading,
          }}
        >
          {slide.title}
        </h1>

        <div
          className="w-40 h-1.5 my-6"
          style={{
            background: `linear-gradient(to right, transparent, ${brand.accent}, transparent)`,
          }}
        />

        {slide.subtitle && (
          <h2
            className="text-2xl mb-8 tracking-wide font-light"
            style={{ color: 'rgba(255,255,255,0.9)', fontFamily: brand.fontBody }}
          >
            {slide.subtitle}
          </h2>
        )}

        {slide.presenter && (
          <p className="text-white/60 text-sm tracking-[0.2em] uppercase mt-4">
            Presented by {slide.presenter}
          </p>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to right, transparent, ${brand.accent}, transparent)`,
        }}
      />
    </div>
  );
}
