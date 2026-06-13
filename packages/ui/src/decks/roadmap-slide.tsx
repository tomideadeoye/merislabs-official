'use client';

import React from 'react';
import type { RoadmapSlideData } from './types';
import { useBrand } from './types';

export function RoadmapSlide({
  slide,
  slideNumber,
}: {
  slide: RoadmapSlideData;
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

        {slide.highlight && (
          <div
            className="p-5 mb-6 rounded-xl shadow-lg"
            style={{ background: `linear-gradient(to right, ${brand.primary}, ${brand.highlight || brand.primary})` }}
          >
            <p className="text-white text-lg leading-relaxed font-medium text-center">
              {slide.highlight}
            </p>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-5xl">
            <div
              className="absolute top-1/2 left-0 right-0 h-2 rounded-full"
              style={{
                background: `linear-gradient(to right, ${brand.primary}, ${brand.highlight || brand.primary}, ${brand.accent})`,
                transform: 'translateY(-50%)',
              }}
            />
            <div
              className="absolute top-1/2 right-0 w-0 h-0"
              style={{
                transform: 'translateY(-50%) translateX(2px)',
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent',
                borderLeft: `20px solid ${brand.accent}`,
              }}
            />

            <div className="relative flex justify-between">
              {slide.roadmapSteps.map((step) => (
                <div key={step.step} className="flex flex-col items-center" style={{ width: `${90 / slide.roadmapSteps.length}%` }}>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-4"
                    style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.highlight || brand.primary})` }}
                  >
                    <span className="text-white text-2xl font-bold">{step.step}</span>
                  </div>
                  <div className="text-center mt-2">
                    <h4 className="font-bold text-lg" style={{ color: brand.primary, fontFamily: brand.fontHeading }}>
                      {step.title}
                    </h4>
                    <p className="text-sm mt-1" style={{ color: brand.textLight }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t mt-auto" style={{ borderColor: brand.textLight + '33' }}>
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
