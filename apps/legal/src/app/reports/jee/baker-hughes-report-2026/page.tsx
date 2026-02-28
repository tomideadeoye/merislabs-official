'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DownloadControls } from '@merislabs/ui';
import SlideWrapper from './components/SlideWrapper';
import CoverSlide from './components/CoverSlide';
import TOCSlide from './components/TOCSlide';
import LitigationSlide from './components/LitigationSlide';
import PrioritiesSlide from './components/PrioritiesSlide';
import ValueAddSlide from './components/ValueAddSlide';
import ThankYouSlide from './components/ThankYouSlide';
import SectionHeaderSlide from './components/SectionHeaderSlide';
import { NavigationContext } from './components/NavigationContext';

import { litigationCases } from './data';

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

    const goToSlideById = useCallback((id: string) => {
        let targetIdx = -1;
        if (id === 'toc') targetIdx = 1;
        if (id === '01') targetIdx = 2; // Pending Litigation Header
        if (id === '02') targetIdx = 3 + litigationCases.length; // Future Strategy Header
        if (id === '03') targetIdx = 4 + litigationCases.length; // Value Add (after priorities)

        // Support for granular case navigation: case:litigation:0, case:closed:1, etc.
        if (id.startsWith('case:')) {
            const [, type, indexStr] = id.split(':');
            const index = parseInt(indexStr);
            if (type === 'litigation') targetIdx = 3 + index;
        }

        if (targetIdx !== -1) {
            if (viewMode === 'deck') {
                setCurrentSlide(targetIdx);
            } else {
                const el = document.getElementById(`slide-${targetIdx}`);
                if (el) {
                    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                }
            }
        }
    }, [viewMode]);


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
            component: <SectionHeaderSlide sectionNumber={2} title="Future Strategy" subtitle="Our Priorities and Value-Add Services for 2026" />,
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
        <NavigationContext.Provider value={{
            goToSlideById,
            currentSlide,
            totalSlides: allSlides.length,
            viewMode
        }}>
            <div className="fixed inset-0 z-[9999] bg-[#F9F7ED] overflow-hidden flex flex-col">
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

                {/* Top Toolbar - DARK THEME */}
                <div className="no-print h-16 shrink-0 bg-[#F9F7ED] border-b border-[#211B1B]/10 flex items-center justify-between px-8 z-[10000]">
                    <div className="flex items-center space-x-6">
                        <div className="flex bg-[#211B1B]/5 p-1 rounded-sm">
                            <button
                                onClick={() => setViewMode('scroll')}
                                className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${viewMode === 'scroll' ? 'bg-red-600 text-[#211B1B] shadow-lg' : 'text-[#211B1B]/40 hover:text-[#211B1B]'}`}
                            >
                                Document
                            </button>
                            <button
                                onClick={() => setViewMode('deck')}
                                className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${viewMode === 'deck' ? 'bg-red-600 text-[#211B1B] shadow-lg' : 'text-[#211B1B]/40 hover:text-[#211B1B]'}`}
                            >
                                Presentation
                            </button>
                        </div>
                        <div className="h-4 w-px bg-[#211B1B]/10" />
                        <span className="text-[#211B1B]/40 text-[10px] font-mono tracking-widest uppercase">
                            Baker Hughes Group . Status Report 2026
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <DownloadControls />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`flex-grow relative ${viewMode === 'scroll' ? 'overflow-y-auto scroll-smooth bg-gray-100' : 'overflow-hidden flex items-center justify-center p-8 bg-gray-100'}`}>

                    {viewMode === 'scroll' ? (
                        <div className="flex flex-col items-center py-12 gap-12 print:p-0 print:gap-0">
                            {allSlides.map((slide, idx) => (
                                <div key={idx} id={`slide-${idx}`} className="w-full flex justify-center">
                                    <SlideWrapper pageNumber={idx + 1} hideHeader={slide.hideHeader}>
                                        {slide.component}
                                    </SlideWrapper>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative group w-full h-full flex items-center justify-center overflow-hidden bg-gray-100">
                            <div
                                className="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_150px_rgba(0,0,0,0.5)]"
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
                                {viewMode === 'deck' && (
                                    <>
                                        {/* Persistent Bottom Controls - DARK */}
                                        <div className="deck-controls absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-8 bg-[#F9F7ED]/90 backdrop-blur-xl shadow-2xl border border-[#211B1B]/10 px-8 py-3 rounded-full z-[1000] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            <button
                                                onClick={prevSlide}
                                                disabled={currentSlide === 0}
                                                className="text-[#211B1B]/40 hover:text-red-500 disabled:opacity-10 transition-colors p-2"
                                                title="Previous Slide"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                            </button>

                                            <div className="flex items-center space-x-4">
                                                <div className="h-1 w-12 bg-[#211B1B]/10 rounded-full relative">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all duration-300"
                                                        style={{ width: `${((currentSlide + 1) / allSlides.length) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-[#211B1B]/40 font-mono text-xs font-bold">
                                                    {String(currentSlide + 1).padStart(2, '0')} / {allSlides.length}
                                                </span>
                                            </div>

                                            <button
                                                onClick={nextSlide}
                                                disabled={currentSlide === allSlides.length - 1}
                                                className="text-[#211B1B] bg-red-600 hover:bg-red-700 disabled:bg-[#211B1B]/5 px-6 py-2 rounded-full shadow-lg transition-all flex items-center space-x-3 group/btn"
                                                title="Next Slide"
                                            >
                                                <span className="font-bold text-[10px] tracking-widest uppercase">Next Page</span>
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>

                                        {/* Side Navigation Zones */}
                                        <div
                                            onClick={prevSlide}
                                            className="absolute left-0 top-0 bottom-0 w-32 cursor-pointer z-[500] group/prev hidden sm:block"
                                        >
                                            <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/prev:opacity-30 transition-opacity">
                                                <svg className="w-12 h-12 text-[#211B1B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7" /></svg>
                                            </div>
                                        </div>
                                        <div
                                            onClick={nextSlide}
                                            className="absolute right-0 top-0 bottom-0 w-32 cursor-pointer z-[500] group/next hidden sm:block"
                                        >
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/next:opacity-30 transition-opacity text-right">
                                                <svg className="w-12 h-12 text-[#211B1B] inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5l7 7-7 7" /></svg>
                                            </div>
                                        </div>

                                        <div className="absolute top-8 right-12 text-[#211B1B]/10 font-mono text-[9px] tracking-[0.3em] uppercase pointer-events-none">
                                            Keys: SPACE / ARROWS
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(232, 0, 0, 0.5);
                }
            `}</style>
        </NavigationContext.Provider>
    );
}

export default function BakerHughesReportPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
            <BakerHughesReportContent />
        </Suspense>
    );
}
