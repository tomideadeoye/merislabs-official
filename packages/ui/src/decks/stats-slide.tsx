'use client';

import React from 'react';
import type { StatsSlideData } from './types';
import { useBrand } from './types';

function abbreviate(val: string): string {
  const match = val.match(/^([₦£$€])?([\d,]+(?:\.\d+)?)$/);
  if (!match) return val;
  const sym = match[1] || '';
  const num = parseFloat(match[2].replace(/,/g, ''));
  if (isNaN(num)) return val;
  if (num >= 1_000_000_000) return `${sym}${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${sym}${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${sym}${(num / 1_000).toFixed(1)}K`;
  return val;
}

export function StatsSlide({
  slide,
  slideNumber,
}: {
  slide: StatsSlideData;
  slideNumber: number;
}) {
  const brand = useBrand();

  return (
    <div className="w-full h-full flex relative overflow-hidden" style={{ background: brand.background }}>
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: `${brand.primary}11` }}
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

        <div className={`flex-1 flex items-center ${slide.sideImage ? 'gap-6' : 'justify-center'}`}>
          <div className={`grid grid-cols-3 gap-8 ${slide.sideImage ? 'flex-1' : 'w-full max-w-5xl'}`}>
            {slide.stats.map((stat, i) => (
              <div key={i} className="text-center flex flex-col items-center">
                <div
                  className="rounded-2xl px-8 py-6 shadow-2xl mb-3 min-w-[200px] border border-white/10"
                  style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.highlight || brand.primary})` }}
                >
                  <span
                    className={`${slide.sideImage ? 'text-4xl' : 'text-5xl'} font-bold text-white block whitespace-nowrap`}
                    style={{ fontFamily: brand.fontHeading }}
                  >
                    {abbreviate(stat.value)}
                  </span>
                </div>
                <p className="font-bold text-base mt-1" style={{ color: brand.primary }}>
                  {stat.label}
                </p>
                {stat.subtext && (
                  <p className="text-xs mt-1" style={{ color: brand.textLight }}>
                    {stat.subtext}
                  </p>
                )}
              </div>
            ))}
          </div>

          {slide.sideImage && (
            <div className="w-[35%] h-full flex items-center">
              <div className="relative w-full h-[280px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img src={slide.sideImage} alt="" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${brand.primary}55, transparent)` }}
                />
              </div>
            </div>
          )}
        </div>

        {slide.bullets && slide.bullets.length > 0 && (
          <div
            className="rounded-xl px-6 py-4 mt-4 border-l-4 flex items-center gap-4"
            style={{
              background: `${brand.accent}11`,
              borderLeftColor: brand.accent,
            }}
          >
            <span className="text-2xl">🏆</span>
            <div>
              <span className="font-bold text-base" style={{ color: brand.primary }}>
                {slide.bullets[0].bold || 'Key metric'}
              </span>
              <span className="text-base ml-2" style={{ color: brand.text }}>
                {slide.bullets[0].text}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t mt-4" style={{ borderColor: brand.textLight + '33' }}>
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
