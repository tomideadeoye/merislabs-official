"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useSearchParams } from 'next/navigation';

// Import Conference Brochure directly
import ConferenceBrochure from '../../components/reports/nicarb-pages/ConferenceBrochure';

// Import Pitch Deck slides and components
import { slides, Slide, BulletPoint } from '../../components/reports/nicarb-pages/pitch-deck/slides';

// Slide dimensions for 16:9 aspect ratio (print-ready)
const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

// Helper: Render bullet with bold text
function renderBulletText(bullet: BulletPoint) {
    if (!bullet.bold) {
        return <span className={bullet.emphasis ? 'font-semibold text-[#064802]' : ''}>{bullet.text}</span>;
    }

    const parts = bullet.text.split(bullet.bold);
    return (
        <span className={bullet.emphasis ? 'font-semibold text-[#064802]' : ''}>
            {parts[0]}<strong className="font-bold text-[#064802]">{bullet.bold}</strong>{parts[1]}
        </span>
    );
}

// ============================================
// SLIDE COMPONENTS - SPECIALIZED LAYOUTS
// ============================================

function TitleSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Background image - subtle, faded */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-15"
                style={{ backgroundImage: "url('/nicarb/committee-images/nicarb event.jpeg')" }}
            />
            {/* Background overlay - lighter green */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#064802]/95 via-[#075302]/90 to-[#064802]/95" />

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a9ce46]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />

            {/* Lime top bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#a9ce46] via-[#f0f7ee] to-[#a9ce46]" />

            {/* Content - vertically centered */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-20 text-center">
                {/* Logos side by side */}
                <div className="mb-10 flex items-center justify-center space-x-12">
                    {slide.logos?.map((logo: string, index: number) => (
                        <img key={index} src={logo} alt="NICArb Logo" className="h-24 w-auto drop-shadow-lg" />
                    ))}
                    <div className="w-px h-20 bg-white/30" />
                    <div className="flex flex-col items-center">
                        <div className="text-[#a9ce46] text-xs font-semibold tracking-[0.3em] mb-1">FEDERAL GOVERNMENT OF</div>
                        <div className="text-white text-3xl font-bold tracking-wider">NIGERIA</div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-[2.5rem] leading-tight font-bold text-white mb-6 max-w-5xl" style={{ fontFamily: 'Georgia, serif' }}>
                    {slide.title}
                </h1>

                {/* Lime divider */}
                <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-[#a9ce46] to-transparent my-6" />

                {/* Subtitle */}
                <h2 className="text-2xl text-white/90 mb-8 tracking-wide font-light">
                    {slide.subtitle}
                </h2>

                {/* Presenter */}
                <p className="text-white/60 text-sm tracking-[0.2em] uppercase mt-4">
                    Presented by {slide.presenter}
                </p>
            </div>

            {/* Bottom lime line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a9ce46] to-transparent" />
        </div>
    );
}

function ContentSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    const hasImage = slide.sideImage || slide.partnerLogos;

    return (
        <div className="w-full h-full flex relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f0f7f2] rounded-tl-[200px] opacity-50" />

            {/* Left accent bar */}
            <div className="w-3 bg-gradient-to-b from-[#064802] via-[#075302] to-[#a9ce46]" />

            {/* Main content */}
            <div className={`flex-1 flex flex-col p-10 relative z-10 ${hasImage ? 'pr-6' : ''}`}>
                {/* Header row */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            {slide.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#a9ce46] to-[#a9ce46]/30 rounded-full" />
                    </div>
                    <div className="text-[#075302]/20 text-8xl font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        {String(slideNumber).padStart(2, '0')}
                    </div>
                </div>

                {/* Highlight callout box */}
                {slide.highlight && (
                    <div className="bg-gradient-to-r from-[#064802] to-[#075302] p-5 mb-6 rounded-xl shadow-lg">
                        <p className="text-white text-lg leading-relaxed font-medium">
                            {slide.highlight}
                        </p>
                    </div>
                )}

                {/* Content area with optional side image */}
                <div className={`flex-1 flex ${hasImage ? 'gap-8' : ''}`}>
                    {/* Bullets column */}
                    <ul className={`flex-1 flex flex-col justify-center space-y-5 ${hasImage ? 'max-w-[55%]' : ''}`}>
                        {slide.bullets?.map((bullet, index) => (
                            <li key={index} className="flex items-start group">
                                <div className="w-3 h-3 bg-[#a9ce46] rounded-full mt-1.5 mr-5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                <span className="text-gray-700 text-lg leading-relaxed">
                                    {renderBulletText(bullet)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Side image */}
                    {slide.sideImage && (
                        <div className="w-[40%] flex items-center justify-center">
                            <div className="relative w-full h-full max-h-[350px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                                <img
                                    src={slide.sideImage}
                                    alt="NICArb"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#064802]/30 to-transparent" />
                            </div>
                        </div>
                    )}

                    {/* Partner logos */}
                    {slide.partnerLogos && (
                        <div className="w-[35%] flex flex-col items-center justify-center gap-4 bg-white/80 rounded-2xl p-6 border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">International Partners</p>
                            {slide.partnerLogos.map((logo: string, index: number) => (
                                <img
                                    key={index}
                                    src={logo}
                                    alt="Partner"
                                    className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-auto">
                    <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="NICArb" className="h-8 opacity-70" />
                    <span className="text-gray-400 text-sm tracking-wide">NICArb–FGN Collaboration Proposal</span>
                </div>
            </div>
        </div>
    );
}

function TwoColumnSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full flex relative overflow-hidden">
            {/* Background */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f0f7f2] rounded-tl-[200px] opacity-50" />

            {/* Left accent bar */}
            <div className="w-3 bg-gradient-to-b from-[#064802] via-[#075302] to-[#a9ce46]" />

            <div className="flex-1 flex flex-col p-10 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            {slide.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#a9ce46] to-[#a9ce46]/30 rounded-full" />
                    </div>
                    <div className="text-[#075302]/20 text-8xl font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        {String(slideNumber).padStart(2, '0')}
                    </div>
                </div>

                {/* Highlight */}
                {slide.highlight && (
                    <div className="bg-gradient-to-r from-[#064802] to-[#075302] p-5 mb-6 rounded-xl shadow-lg">
                        <p className="text-white text-lg leading-relaxed font-medium">{slide.highlight}</p>
                    </div>
                )}

                {/* Two columns */}
                <div className="flex-1 grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="bg-gradient-to-br from-[#f8faf8] to-[#f0f5f1] rounded-2xl p-6 border border-[#075302]/10">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-[#a9ce46] rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-xl">⚠️</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#064802]">{slide.leftColumn?.title}</h3>
                        </div>
                        <ul className="space-y-3">
                            {slide.leftColumn?.items.map((item: string, i: number) => (
                                <li key={i} className="flex items-start">
                                    <div className="w-2 h-2 bg-[#a9ce46] rounded-full mt-2 mr-3" />
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column */}
                    <div className="bg-gradient-to-br from-[#f8faf8] to-[#f0f5f1] rounded-2xl p-6 border border-[#075302]/10">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-[#064802] rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-xl">🔧</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#064802]">{slide.rightColumn?.title}</h3>
                        </div>
                        <ul className="space-y-3">
                            {slide.rightColumn?.items.map((item: string, i: number) => (
                                <li key={i} className="flex items-start">
                                    <div className="w-2 h-2 bg-[#064802] rounded-full mt-2 mr-3" />
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-auto">
                    <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="NICArb" className="h-8 opacity-70" />
                    <span className="text-gray-400 text-sm tracking-wide">NICArb–FGN Collaboration Proposal</span>
                </div>
            </div>
        </div>
    );
}

function QuoteSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full flex relative overflow-hidden">
            {/* Background */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f0f7f2] rounded-tl-[200px] opacity-50" />

            {/* Left accent bar */}
            <div className="w-3 bg-gradient-to-b from-[#064802] via-[#075302] to-[#a9ce46]" />

            <div className="flex-1 flex flex-col p-10 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            {slide.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#a9ce46] to-[#a9ce46]/30 rounded-full" />
                    </div>
                    <div className="text-[#075302]/20 text-8xl font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        {String(slideNumber).padStart(2, '0')}
                    </div>
                </div>

                {/* Quote - prominent */}
                <div className="bg-gradient-to-br from-[#064802] to-[#075302] p-8 rounded-2xl my-4 relative shadow-xl">
                    <div className="absolute top-4 left-6 text-[#a9ce46] text-7xl opacity-40" style={{ fontFamily: 'Georgia, serif' }}>&ldquo;</div>
                    <p className="text-white text-2xl font-medium text-center px-12 py-4 leading-relaxed relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
                        {slide.quote}
                    </p>
                    <p className="text-[#a9ce46] text-base text-center mt-4 tracking-wider font-medium">— {slide.quoteAuthor}</p>
                </div>

                {/* Bullets */}
                <ul className="flex-1 flex flex-col justify-center space-y-4 mt-4">
                    {slide.bullets?.map((bullet: BulletPoint, index: number) => (
                        <li key={index} className="flex items-start">
                            <div className="w-3 h-3 bg-[#a9ce46] rounded-full mt-1.5 mr-4 flex-shrink-0" />
                            <span className="text-gray-700 text-base leading-relaxed">{renderBulletText(bullet)}</span>
                        </li>
                    ))}
                </ul>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-auto">
                    <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="NICArb" className="h-8 opacity-70" />
                    <span className="text-gray-400 text-sm tracking-wide">NICArb–FGN Collaboration Proposal</span>
                </div>
            </div>
        </div>
    );
}

function AreasSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full flex relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #064802 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            {/* Left accent bar */}
            <div className="w-3 bg-gradient-to-b from-[#064802] via-[#075302] to-[#a9ce46]" />

            <div className="flex-1 flex flex-col p-10 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            {slide.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#a9ce46] to-[#a9ce46]/30 rounded-full" />
                    </div>
                    <div className="text-[#075302]/20 text-8xl font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        {String(slideNumber).padStart(2, '0')}
                    </div>
                </div>

                {/* Areas grid - 2 rows x 3 cols */}
                <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-5">
                    {slide.areas?.map((area: Slide['areas'][number], index: number) => (
                        <div key={index} className="bg-white rounded-2xl p-5 border-2 border-[#075302]/10 hover:border-[#a9ce46] transition-all hover:shadow-xl group flex flex-col items-center justify-center text-center">
                            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{area.icon}</div>
                            <h3 className="text-[#064802] font-bold text-xl mb-2">{area.title}</h3>
                            <p className="text-gray-600 text-sm">{area.description}</p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                    <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="NICArb" className="h-8 opacity-70" />
                    <span className="text-gray-400 text-sm tracking-wide">NICArb–FGN Collaboration Proposal</span>
                </div>
            </div>
        </div>
    );
}

function StatsSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    const hasImage = slide.sideImage;

    // Helper to abbreviate large currency values for display
    const abbreviateValue = (val: string) => {
        // Extract currency symbol and numeric part
        const match = val.match(/^([₦£$])?([\d,]+(?:\.\d+)?)$/);
        if (!match) return val;
        const symbol = match[1] || '';
        const numStr = match[2].replace(/,/g, '');
        const num = parseFloat(numStr);
        if (isNaN(num)) return val;
        if (num >= 1_000_000_000) return `${symbol}${(num / 1_000_000_000).toFixed(2)}B`;
        if (num >= 1_000_000) return `${symbol}${(num / 1_000_000).toFixed(2)}M`;
        if (num >= 1_000) return `${symbol}${(num / 1_000).toFixed(1)}K`;
        return val;
    };

    return (
        <div className="w-full h-full flex relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#064802]/5 rounded-full blur-3xl" />

            {/* Left accent bar */}
            <div className="w-3 bg-gradient-to-b from-[#064802] via-[#075302] to-[#a9ce46]" />

            <div className="flex-1 flex flex-col p-10 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            {slide.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#a9ce46] to-[#a9ce46]/30 rounded-full" />
                    </div>
                    <div className="text-[#075302]/20 text-8xl font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        {String(slideNumber).padStart(2, '0')}
                    </div>
                </div>

                {/* Stats + optional image */}
                <div className={`flex-1 flex items-center ${hasImage ? 'gap-6' : 'justify-center'}`}>
                    {/* Stats column */}
                    <div className={`grid grid-cols-3 gap-8 ${hasImage ? 'flex-1' : 'w-full max-w-5xl'}`}>
                        {slide.stats?.map((stat: { value: string; label: string; subtext?: string }, index: number) => (
                            <div key={index} className="text-center flex flex-col items-center">
                                <div className="bg-gradient-to-br from-[#064802] to-[#075302] rounded-2xl px-8 py-6 shadow-2xl mb-3 min-w-[200px] border border-white/10">
                                    <span className={`${hasImage ? 'text-4xl' : 'text-5xl'} font-bold text-white block whitespace-nowrap`} style={{ fontFamily: 'Georgia, serif' }}>
                                        {abbreviateValue(stat.value)}
                                    </span>
                                </div>
                                <p className="text-[#064802] font-bold text-base mt-1">{stat.label.replace('Total Aggregated Claims ', '')}</p>
                                {stat.subtext && <p className="text-gray-500 text-xs mt-1">{stat.subtext}</p>}
                            </div>
                        ))}
                    </div>

                    {/* Side image - NICArb event photo */}
                    {hasImage && (
                        <div className="w-[35%] h-full flex items-center">
                            <div className="relative w-full h-[280px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                                <img
                                    src={slide.sideImage}
                                    alt="NICArb Conference"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#064802]/50 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <p className="text-white text-xs font-semibold drop-shadow-lg">NICArb Annual Conference</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Largest single dispute callout */}
                {slide.bullets && slide.bullets.length > 0 && (
                    <div className="bg-gradient-to-r from-[#a9ce46]/10 to-transparent rounded-xl px-6 py-4 mt-4 border-l-4 border-[#a9ce46] flex items-center gap-4">
                        <span className="text-2xl">🏆</span>
                        <div>
                            <span className="text-[#064802] font-bold text-base">{slide.bullets[0].bold || 'Largest single dispute recorded'}</span>
                            <span className="text-gray-700 text-base ml-2">{slide.bullets[0].text.replace(slide.bullets[0].bold || '', '').replace('—', '').trim()}</span>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-4">
                    <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="NICArb" className="h-8 opacity-70" />
                    <span className="text-gray-400 text-sm tracking-wide">NICArb–FGN Collaboration Proposal</span>
                </div>
            </div>
        </div>
    );
}

function OutcomesSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full flex relative overflow-hidden">
            {/* Background */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f0f7f2] rounded-tl-[200px] opacity-50" />

            {/* Left accent bar */}
            <div className="w-3 bg-gradient-to-b from-[#064802] via-[#075302] to-[#a9ce46]" />

            <div className="flex-1 flex flex-col p-10 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            {slide.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#a9ce46] to-[#a9ce46]/30 rounded-full" />
                    </div>
                    <div className="text-[#075302]/20 text-8xl font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        {String(slideNumber).padStart(2, '0')}
                    </div>
                </div>

                {/* Outcomes grid - 2x3 with prominent checkmarks */}
                <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-5">
                    {slide.bullets?.map((bullet: BulletPoint, index: number) => (
                        <div key={index} className="bg-gradient-to-br from-white to-[#f8faf8] rounded-2xl p-5 border-2 border-[#075302]/10 flex items-center shadow-md hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#a9ce46] to-[#559203] rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
                                <span className="text-white text-2xl font-bold">✓</span>
                            </div>
                            <span className="text-gray-800 text-base font-medium leading-snug">{renderBulletText(bullet)}</span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                    <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="NICArb" className="h-8 opacity-70" />
                    <span className="text-gray-400 text-sm tracking-wide">NICArb–FGN Collaboration Proposal</span>
                </div>
            </div>
        </div>
    );
}

function RoadmapSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full flex relative overflow-hidden">
            {/* Background */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f0f7f2] rounded-tl-[200px] opacity-50" />

            {/* Left accent bar */}
            <div className="w-3 bg-gradient-to-b from-[#064802] via-[#075302] to-[#a9ce46]" />

            <div className="flex-1 flex flex-col p-10 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            {slide.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#a9ce46] to-[#a9ce46]/30 rounded-full" />
                    </div>
                    <div className="text-[#075302]/20 text-8xl font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        {String(slideNumber).padStart(2, '0')}
                    </div>
                </div>

                {/* Highlight */}
                {slide.highlight && (
                    <div className="bg-gradient-to-r from-[#064802] to-[#075302] p-5 mb-6 rounded-xl shadow-lg">
                        <p className="text-white text-lg leading-relaxed font-medium text-center">{slide.highlight}</p>
                    </div>
                )}

                {/* Roadmap - horizontal arrow timeline */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-full max-w-5xl">
                        {/* Arrow line */}
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-[#064802] via-[#075302] to-[#a9ce46] transform -translate-y-1/2 rounded-full" />
                        {/* Arrow head */}
                        <div className="absolute top-1/2 right-0 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[20px] border-l-[#a9ce46] transform -translate-y-1/2 translate-x-2" />

                        {/* Steps */}
                        <div className="relative flex justify-between">
                            {slide.roadmapSteps?.map((step: Slide['roadmapSteps'][number], index: number) => (
                                <div key={index} className="flex flex-col items-center" style={{ width: '18%' }}>
                                    {/* Circle with number */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#064802] to-[#075302] rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-4">
                                        <span className="text-white text-2xl font-bold">{step.step}</span>
                                    </div>
                                    {/* Label */}
                                    <div className="text-center mt-2">
                                        <h4 className="text-[#064802] font-bold text-lg">{step.title}</h4>
                                        <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-auto">
                    <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="NICArb" className="h-8 opacity-70" />
                    <span className="text-gray-400 text-sm tracking-wide">NICArb–FGN Collaboration Proposal</span>
                </div>
            </div>
        </div>
    );
}

function ComparisonSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full flex relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#fafafa] to-[#f0f5f1]" />

            {/* Left accent bar */}
            <div className="w-3 bg-gradient-to-b from-[#064802] via-[#075302] to-[#a9ce46]" />

            <div className="flex-1 flex flex-col p-10 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            {slide.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#a9ce46] to-[#a9ce46]/30 rounded-full" />
                    </div>
                    <div className="text-[#075302]/20 text-8xl font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        {String(slideNumber).padStart(2, '0')}
                    </div>
                </div>

                {/* Two comparison boxes */}
                <div className="flex-1 grid grid-cols-2 gap-6">
                    {/* Left: Status Quo (Negative) */}
                    <div className="bg-white rounded-2xl border-2 border-red-200 shadow-lg flex flex-col overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4">
                            <h3 className="text-white text-2xl font-bold text-center">{slide.comparisonLeft?.title}</h3>
                        </div>
                        <div className="flex-1 p-6 flex flex-col">
                            <ul className="flex-1 space-y-4">
                                {slide.comparisonLeft?.items.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                            <span className="text-red-600 text-sm">✗</span>
                                        </div>
                                        <span className="text-gray-700 text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-red-100">
                                <p className="text-red-700 font-bold text-center text-lg">{slide.comparisonLeft?.result}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: With Partnership (Positive) */}
                    <div className="bg-white rounded-2xl border-2 border-green-200 shadow-lg flex flex-col overflow-hidden">
                        <div className="bg-gradient-to-r from-[#064802] to-[#075302] p-4">
                            <h3 className="text-white text-2xl font-bold text-center">{slide.comparisonRight?.title}</h3>
                        </div>
                        <div className="flex-1 p-6 flex flex-col">
                            <ul className="flex-1 space-y-4">
                                {slide.comparisonRight?.items.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                            <span className="text-green-600 text-sm">✓</span>
                                        </div>
                                        <span className="text-gray-700 text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-green-100">
                                <p className="text-[#064802] font-bold text-center text-lg">{slide.comparisonRight?.result}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                    <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="NICArb" className="h-8 opacity-70" />
                    <span className="text-gray-400 text-sm tracking-wide">NICArb–FGN Collaboration Proposal</span>
                </div>
            </div>
        </div>
    );
}

function ThankYouSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Subtle background image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-5"
                style={{ backgroundImage: "url('/nicarb/committee-images/nicarb event.jpeg')" }}
            />
            {/* White background overlay for fresh look */}
            <div className="absolute inset-0 bg-white/95" />
            {/* Lime accent bar at top */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#a9ce46] via-[#f0f7ee] to-[#a9ce46]" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
                <h1 className="text-6xl font-bold text-[#064802] mb-6" style={{ fontFamily: 'Georgia, serif' }}>Thank You</h1>
                <p className="text-2xl text-gray-600 mb-12 font-light">For your consideration of this partnership proposal</p>

                <div className="flex flex-col items-center gap-8 mb-12">
                    <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="NICArb" className="h-24 drop-shadow-md" />
                </div>

                <div className="grid grid-cols-2 gap-16 text-left max-w-4xl w-full border-t border-gray-200 pt-10">
                    <div>
                        <h3 className="flex items-center text-[#a9ce46] font-bold text-sm tracking-[0.2em] uppercase mb-4">
                            <span className="w-6 h-0.5 bg-[#a9ce46] mr-3"></span>Corporate Head Office
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            10 Adedeji Adekola Street<br />
                            off Freedom Way, Lekki Phase 1<br />
                            Lagos, Nigeria
                        </p>
                    </div>
                    <div>
                        <h3 className="flex items-center text-[#a9ce46] font-bold text-sm tracking-[0.2em] uppercase mb-4">
                            <span className="w-6 h-0.5 bg-[#a9ce46] mr-3"></span>Contact
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            <span className="font-semibold">Phone:</span> 090 8718 7401-14<br />
                            <span className="font-semibold">Email:</span> info@nicarb.org<br />
                            <span className="font-semibold">Web:</span> www.nicarb.org
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NicarbConferenceClient() {
    const { setTheme } = useTheme();
    const searchParams = useSearchParams();
    const view = searchParams.get('view');

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPrintMode, setIsPrintMode] = useState(false);
    const [showPitchDeck, setShowPitchDeck] = useState(view === 'pitch-deck');

    useEffect(() => {
        setTheme('light');
    }, [setTheme]);

    useEffect(() => {
        setShowPitchDeck(view === 'pitch-deck');
    }, [view]);

    const nextSlide = useCallback(() => {
        if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    }, [currentSlide]);

    const prevSlide = useCallback(() => {
        if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
    }, [currentSlide]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!showPitchDeck) return;
            if (event.key === 'ArrowRight' || event.key === ' ') {
                event.preventDefault();
                nextSlide();
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                prevSlide();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, showPitchDeck]);

    const renderSlideContent = (slideData: Slide, index: number) => {
        switch (slideData.type) {
            case 'title':
                return <TitleSlide slide={slideData} />;
            case 'quote':
                return <QuoteSlide slide={slideData} slideNumber={index + 1} />;
            case 'areas':
                return <AreasSlide slide={slideData} slideNumber={index + 1} />;
            case 'stats':
                return <StatsSlide slide={slideData} slideNumber={index + 1} />;
            case 'outcomes':
                return <OutcomesSlide slide={slideData} slideNumber={index + 1} />;
            case 'roadmap':
                return <RoadmapSlide slide={slideData} slideNumber={index + 1} />;
            case 'twoColumn':
                return <TwoColumnSlide slide={slideData} slideNumber={index + 1} />;
            case 'comparison':
                return <ComparisonSlide slide={slideData} slideNumber={index + 1} />;
            case 'thankyou':
                return <ThankYouSlide slide={slideData} />;
            default:
                return <ContentSlide slide={slideData} slideNumber={index + 1} />;
        }
    };

    // Pitch Deck View
    if (showPitchDeck) {
        const slide = slides[currentSlide];

        if (isPrintMode) {
            return (
                <div className="print-container bg-white min-h-screen">
                    <style jsx global>{`
                        @media print {
                            @page { size: A4 landscape; margin: 0; }
                            html, body { margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact !important; }
                            .print-slide { width: 297mm !important; height: 210mm !important; page-break-after: always; }
                            .no-print { display: none !important; }
                        }
                    `}</style>
                    <div className="print-instructions bg-green-50 border-b p-4 sticky top-0 z-50 no-print">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            <h3 className="font-bold text-green-800">Print → Layout → Landscape</h3>
                            <button onClick={() => setIsPrintMode(false)} className="px-4 py-2 bg-green-600 text-white rounded-lg">← Back</button>
                        </div>
                    </div>
                    <div className="p-8">
                        {slides.map((s: Slide, i: number) => (
                            <div key={i} className="print-slide mb-8" style={{ aspectRatio: '16/9', maxWidth: '1120px', margin: '0 auto 20px' }}>
                                {renderSlideContent(s, i)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
                {/* View Toggle */}
                <div className="no-print absolute top-4 left-4 flex gap-2">
                    <button onClick={() => setShowPitchDeck(false)} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 border border-white/20">
                        ← Brochure
                    </button>
                </div>

                <div className="relative bg-white shadow-2xl overflow-hidden" style={{ width: `${SLIDE_WIDTH}px`, height: `${SLIDE_HEIGHT}px`, maxWidth: '95vw', maxHeight: '85vh', aspectRatio: '16/9' }}>
                    {renderSlideContent(slide, currentSlide)}
                </div>

                {/* Navigation */}
                <div className="no-print absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
                    <button onClick={prevSlide} disabled={currentSlide === 0} className="px-5 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30 hover:bg-white/20 border border-white/20">← Previous</button>
                    <div className="flex items-center space-x-2">
                        {slides.map((_: Slide, i: number) => (
                            <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`} />
                        ))}
                    </div>
                    <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="px-5 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30 hover:bg-white/20 border border-white/20">Next →</button>
                </div>

                <div className="no-print absolute bottom-4 right-4 flex items-center space-x-4">
                    <span className="text-white/60 text-sm font-mono">{currentSlide + 1} / {slides.length}</span>
                    <button onClick={() => setIsPrintMode(true)} className="px-3 py-1 text-xs bg-white/10 text-white rounded hover:bg-white/20">Print View</button>
                </div>
            </div>
        );
    }

    // Conference Brochure View
    return (
        <div className="min-h-screen bg-gray-100">
            {/* View Toggle & Print Button */}
            <div className="fixed top-4 right-4 z-50 print:hidden flex gap-2">
                <button
                    onClick={() => setShowPitchDeck(true)}
                    className="bg-[#064802] text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-[#053a02] transition-all"
                >
                    View Pitch Deck
                </button>
                <button
                    onClick={() => window.print()}
                    className="bg-gradient-to-r from-[#a9ce46] to-[#064802] text-white px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print / Save PDF
                </button>
            </div>

            {/* Conference Brochure Component */}
            <ConferenceBrochure />

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    nav, header, .no-print, button, .fixed {
                        display: none !important;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
}
