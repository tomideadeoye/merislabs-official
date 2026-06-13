'use client';

import React from 'react';
import type { ContentSlideData } from './types';
import { useBrand } from './types';

function renderBulletText(bullet: { text: string; bold?: string; emphasis?: boolean }) {
  const brand = useBrand();
  if (!bullet.bold) {
    return (
      <span style={bullet.emphasis ? { fontWeight: 600, color: brand.primary } : {}}>
        {bullet.text}
      </span>
    );
  }
  const parts = bullet.text.split(bullet.bold);
  return (
    <span style={bullet.emphasis ? { fontWeight: 600, color: brand.primary } : {}}>
      {parts[0]}
      <strong style={{ fontWeight: 700, color: brand.primary }}>{bullet.bold}</strong>
      {parts[1]}
    </span>
  );
}

export function ContentSlide({
  slide,
  slideNumber,
}: {
  slide: ContentSlideData;
  slideNumber: number;
}) {
  const brand = useBrand();
  const hasImage = slide.sideImage || (slide.partnerLogos && slide.partnerLogos.length > 0);

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

      <div className="flex-1 flex flex-col p-10 relative z-10" style={hasImage ? { paddingRight: '1.5rem' } : {}}>
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

        <div className={`flex-1 flex ${hasImage ? 'gap-8' : ''}`}>
          <ul className={`flex-1 flex flex-col justify-center space-y-5 ${hasImage ? 'max-w-[55%]' : ''}`}>
            {slide.bullets?.map((bullet, i) => (
              <li key={i} className="flex items-start group">
                <div
                  className="w-3 h-3 rounded-full mt-1.5 mr-5 flex-shrink-0 group-hover:scale-125 transition-transform"
                  style={{ background: brand.accent }}
                />
                <span className="text-lg leading-relaxed" style={{ color: brand.text }}>
                  {renderBulletText({ text: bullet.text, bold: bullet.bold, emphasis: bullet.emphasis })}
                </span>
              </li>
            ))}
          </ul>

          {slide.sideImage && (
            <div className="w-[40%] flex items-center justify-center">
              <div className="relative w-full h-full max-h-[350px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img src={slide.sideImage} alt="" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${brand.primary}55, transparent)` }}
                />
              </div>
            </div>
          )}

          {slide.partnerLogos && slide.partnerLogos.length > 0 && (
            <div
              className="w-[35%] flex flex-col items-center justify-center gap-4 rounded-2xl p-6 border"
              style={{ background: brand.cardBackground, borderColor: `${brand.primary}22` }}
            >
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: brand.textLight }}>
                Partners
              </p>
              {slide.partnerLogos.map((logo, i) => (
                <img key={i} src={logo} alt="" className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
              ))}
            </div>
          )}
        </div>

        {slide.footer && (
          <div className="flex items-center justify-between pt-6 border-t mt-auto" style={{ borderColor: brand.textLight + '33' }}>
            {brand.logos?.footer && (
              <img src={brand.logos.footer} alt="" className="h-8" style={{ opacity: 0.7 }} />
            )}
            <span className="text-sm tracking-wide" style={{ color: brand.textLight }}>
              {slide.footer}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
