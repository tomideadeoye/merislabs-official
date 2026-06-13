'use client';

import React from 'react';
import type { TwoColumnSlideData } from './types';
import { useBrand } from './types';

export function TwoColumnSlide({
  slide,
  slideNumber,
}: {
  slide: TwoColumnSlideData;
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

        {slide.highlight && (
          <div
            className="p-5 mb-6 rounded-xl shadow-lg"
            style={{ background: `linear-gradient(to right, ${brand.primary}, ${brand.highlight || brand.primary})` }}
          >
            <p className="text-white text-lg leading-relaxed font-medium">{slide.highlight}</p>
          </div>
        )}

        <div className="flex-1 grid grid-cols-2 gap-8">
          {[slide.leftColumn, slide.rightColumn].map((col, ci) => (
            <div
              key={ci}
              className="rounded-2xl p-6 border"
              style={{
                background: `linear-gradient(135deg, ${brand.cardBackground}, ${brand.cardBackground})`,
                borderColor: `${brand.primary}11`,
              }}
            >
              <div className="flex items-center mb-4">
                {col.icon && (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                    style={{ background: ci === 0 ? brand.accent : brand.primary }}
                  >
                    <span className="text-white text-xl">{col.icon}</span>
                  </div>
                )}
                <h3
                  className="text-xl font-bold"
                  style={{ color: brand.primary, fontFamily: brand.fontHeading }}
                >
                  {col.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {col.items.map((item, j) => (
                  <li key={j} className="flex items-start">
                    <div
                      className="w-2 h-2 rounded-full mt-2 mr-3"
                      style={{ background: ci === 0 ? brand.accent : brand.primary }}
                    />
                    <span style={{ color: brand.text }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

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
