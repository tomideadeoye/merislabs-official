'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DownloadControls } from '../union-bank-report-1/components/DownloadControls';
import { SlideWrapper } from './components/SlideWrapper';
import { CoverSlide } from './components/CoverSlide';
import { TOCSlide } from './components/TOCSlide';
import { LitigationSlide } from './components/LitigationSlide';
import { ClosedCasesSlide } from './components/ClosedCasesSlide';
import { PrioritiesSlide } from './components/PrioritiesSlide';
import { ValueAddSlide } from './components/ValueAddSlide';
import { ThankYouSlide } from './components/ThankYouSlide';
import { SectionHeaderSlide } from './components/SectionHeaderSlide';

import { litigationCases, closedCases2025 } from './data';

function BakerHughesReportContent() {
    const searchParams = useSearchParams();
    const [viewMode, setViewMode] = useState<'scroll' | 'deck'>('scroll');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scale, setScale] = useState(1);

    // Initial check for URL parameters
    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'deck' || mode === 'presentation') {
            setViewMode('deck');
        }

        const slideIdx = searchParams.get('slide');
        if (slideIdx) {
            const idx = parseInt(slideIdx) - 1;
            if (!isNaN(idx)) setCurrentSlide(idx);
        }
    }, [searchParams]);

    // Scaling engine
    const handleResize = useCallback(() => {
        if (typeof window === 'undefined') return;
        const w = 1122.52; // 297mm in px
        const h = 631.18;  // 167mm in px
        const winW = window.innerWidth * 0.95;
        const winH = (window.innerHeight - 80) * 0.9;
        const newScale = Math.min(winW / w, winH / h);
        setScale(newScale);
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    useEffect(() => {
        document.title = "Baker Hughes Group Status Report 2026";
    }, []);

    // Define all slides in a flat array for the deck view
    const allSlides = [
        { type: 'cover', component: <CoverSlide />, hideHeader: true },
        { type: 'toc', component: <TOCSlide />, title: "Directory" },
        {
            type: 'header',
            component: <SectionHeaderSlide sectionNumber={1} title="Pending Litigation" subtitle="Update on all active legal matters across Nigeria" />,
            hideHeader: true
        },
        ...litigationCases.map((caseData) => ({ type: 'litigation', component: <LitigationSlide data={caseData} />, title: "Active Litigation" })),
        {
            type: 'header',
            component: <SectionHeaderSlide sectionNumber={2} title="Completed Matters" subtitle="Update on closed cases in 2025" />,
            hideHeader: true
        },
        ...closedCases2025.map((caseItem, idx) => ({
            type: 'closed',
            component: <ClosedCasesSlide data={caseItem} index={idx} total={closedCases2025.length} />,
            title: "Resolved Cases"
        })),
        {
            type: 'header',
            component: <SectionHeaderSlide sectionNumber={3} title="Future Strategy" subtitle="Our Priorities and Value-Add Services for 2026" />,
            hideHeader: true
        },
        { type: 'priorities', component: <PrioritiesSlide />, title: "Execution Priorities" },
        { type: 'value-add', component: <ValueAddSlide />, title: "Value-Add Advisory" },
        { type: 'thank-you', component: <ThankYouSlide />, hideHeader: true },
    ];

    const nextSlide = useCallback(() => {
        if (currentSlide < allSlides.length - 1) setCurrentSlide(currentSlide + 1);
    }, [currentSlide, allSlides.length]);

    const prevSlide = useCallback(() => {
        if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
    }, [currentSlide]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (viewMode !== 'deck') return;
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'f') {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [viewMode, nextSlide, prevSlide]);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] overflow-hidden flex flex-col">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                    .page-wrapper {
                        page-break-after: always;
                    }
                    .no-print, .deck-controls {
                        display: none !important;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background-color: white !important;
                    }
                    .fixed {
                        position: static !important;
                        overflow: visible !important;
                    }
                }
            ` }} />

            {/* Top Toolbar */}
            <div className="no-print h-16 shrink-0 bg-[#111] border-b border-white/5 flex items-center justify-between px-8 z-[10000]">
                <div className="flex items-center space-x-6">
                    <div className="flex bg-white/5 p-1 rounded-sm">
                        <button
                            onClick={() => setViewMode('scroll')}
                            className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${viewMode === 'scroll' ? 'bg-red-600 text-white' : 'text-white/40 hover:text-white'}`}
                        >
                            Document
                        </button>
                        <button
                            onClick={() => setViewMode('deck')}
                            className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${viewMode === 'deck' ? 'bg-red-600 text-white' : 'text-white/40 hover:text-white'}`}
                        >
                            Presentation
                        </button>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">
                        Baker Hughes Group // Status Report 2026
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <DownloadControls />
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-grow relative ${viewMode === 'scroll' ? 'overflow-y-auto scroll-smooth bg-gray-900/50' : 'overflow-hidden flex items-center justify-center p-8 bg-black'}`}>

                {viewMode === 'scroll' ? (
                    <div className="flex flex-col items-center py-12 gap-12 print:p-0 print:gap-0">
                        {allSlides.map((slide, idx) => (
                            <SlideWrapper key={idx} pageNumber={idx + 1} hideHeader={slide.hideHeader}>
                                {slide.component}
                            </SlideWrapper>
                        ))}
                    </div>
                ) : (
                    <div className="relative group w-full h-full flex items-center justify-center overflow-hidden bg-black">
                        <div
                            className="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_100px_rgba(232,0,0,0.1)]"
                            style={{
                                transform: `scale(${scale})`,
                                transformOrigin: 'center center'
                            }}
                        >
                            <SlideWrapper
                                pageNumber={currentSlide + 1}
                                hideHeader={allSlides[currentSlide]?.hideHeader}
                            >
                                {allSlides[currentSlide]?.component}
                            </SlideWrapper>
                        </div>

                        {/* Deck Navigation - Overlay */}
                        <div className="deck-controls absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-8 bg-black/60 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                className="text-white/40 hover:text-red-500 disabled:opacity-10 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>

                            <div className="flex items-center space-x-3 pointer-events-none">
                                <span className="text-red-500 font-mono font-bold text-sm">
                                    {String(currentSlide + 1).padStart(2, '0')}
                                </span>
                                <div className="h-1 w-12 bg-white/10 rounded-full relative">
                                    <div
                                        className="absolute h-full bg-red-600 transition-all duration-300 rounded-full"
                                        style={{ width: `${((currentSlide + 1) / allSlides.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-white/20 font-mono text-sm">
                                    {String(allSlides.length).padStart(2, '0')}
                                </span>
                            </div>

                            <button
                                onClick={nextSlide}
                                disabled={currentSlide === allSlides.length - 1}
                                className="text-white/40 hover:text-red-500 disabled:opacity-10 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>

                        {/* Title Indicator Top Right */}
                        <div className="absolute top-8 right-12 text-white/10 font-mono text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                            {allSlides[currentSlide].title || "System Module"}
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(232, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
}

export default function BakerHughesReportPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <BakerHughesReportContent />
        </Suspense>
    );
}
