'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DownloadControls } from '@merislabs/ui';
import { NavigationContext } from './components/NavigationContext';
import SlideWrapper from './components/SlideWrapper';
import CoverSlide from './components/CoverSlide';
import TOCSlide from './components/TOCSlide';
import SectionHeaderSlide from './components/SectionHeaderSlide';
import ExecutiveSummarySlide from './components/ExecutiveSummarySlide';
import PersonalCaseSlide from './components/PersonalCaseSlide';
import PlatformsSlide from './components/PlatformsSlide';
import MarketAnalysisSlide from './components/MarketAnalysisSlide';
import StrategicObjectivesSlide from './components/StrategicObjectivesSlide';
import ImplementationSlide from './components/ImplementationSlide';
import InternationalReferralSlide from './components/InternationalReferralSlide';
import TeamDevelopmentSlide from './components/TeamDevelopmentSlide';
import FinancialSlide from './components/FinancialSlide';
import RevenueModelSlide from './components/RevenueModelSlide';
import SuccessFactorsSlide from './components/SuccessFactorsSlide';
import ConclusionSlide from './components/ConclusionSlide';
import ThankYouSlide from './components/ThankYouSlide';

const slideIdMap: Record<string, number> = {
  toc: 1,
  'executive-summary': 2,
  'personal-case': 4,
  'platform-1': 6,
  'market-analysis': 8,
  'strategic-objectives': 10,
  implementation: 12,
  'international-referral': 14,
  'team-development': 16,
  financial: 18,
  'revenue-model': 20,
  'success-factors': 22,
  conclusion: 24,
};

function PspPresentationContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'scroll' | 'deck'>('scroll');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    document.title = 'JEE – Project Fortify – Presentation 2026';
    const mode = searchParams.get('mode');
    if (mode === 'deck' || mode === 'presentation') setViewMode('deck');
    const slideIdx = searchParams.get('slide');
    if (slideIdx) {
      const idx = parseInt(slideIdx) - 1;
      if (!isNaN(idx)) setCurrentSlide(idx);
    }
  }, [searchParams]);

  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return;
    const w = 1122.52;
    const h = 631.18;
    const winW = window.innerWidth * 0.95;
    const winH = (window.innerHeight - 80) * 0.9;
    setScale(Math.min(winW / w, winH / h));
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const goToSlideById = useCallback(
    (id: string) => {
      const targetIdx = slideIdMap[id] ?? -1;
      if (targetIdx === -1) return;
      if (viewMode === 'deck') {
        setCurrentSlide(targetIdx);
      } else {
        const el = document.getElementById(`slide-${targetIdx}`);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    },
    [viewMode]
  );

  const allSlides = [
    { component: <CoverSlide />, hideHeader: true },
    { component: <TOCSlide />, hideHeader: false },
    // Section 01
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={1}
          title="Executive Summary"
          subtitle="Strategic rationale & financial target"
          bgLetter="E"
        />
      ),
      hideHeader: true,
    },
    { component: <ExecutiveSummarySlide />, hideHeader: false },
    // Section 02
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={2}
          title="Personal Case"
          subtitle="Commercial impact & contributions"
          bgLetter="P"
        />
      ),
      hideHeader: true,
    },
    { component: <PersonalCaseSlide />, hideHeader: false },
    // Section 03
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={3}
          title="Three Platforms"
          subtitle="The proposed business model"
          bgLetter="3"
        />
      ),
      hideHeader: true,
    },
    { component: <PlatformsSlide />, hideHeader: false },
    // Section 04
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={4}
          title="Market & Competitive Landscape"
          subtitle="Market drivers & competitor positioning"
          bgLetter="M"
        />
      ),
      hideHeader: true,
    },
    { component: <MarketAnalysisSlide />, hideHeader: false },
    // Section 05
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={5}
          title="Strategic Objectives"
          subtitle="Seven interrelated objectives"
          bgLetter="S"
        />
      ),
      hideHeader: true,
    },
    { component: <StrategicObjectivesSlide />, hideHeader: false },
    // Section 06
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={6}
          title="Implementation"
          subtitle="Five strategic workstreams · 24-month cycle"
          bgLetter="I"
        />
      ),
      hideHeader: true,
    },
    { component: <ImplementationSlide />, hideHeader: false },
    // Section 07
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={7}
          title="International Referral Architecture"
          subtitle="IR3 UK initiative & cross-border pipeline"
          bgLetter="R"
        />
      ),
      hideHeader: true,
    },
    { component: <InternationalReferralSlide />, hideHeader: false },
    // Section 08
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={8}
          title="Team Development"
          subtitle="Team architecture & knowledge management"
          bgLetter="T"
        />
      ),
      hideHeader: true,
    },
    { component: <TeamDevelopmentSlide />, hideHeader: false },
    // Section 09
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={9}
          title="Financial Requirements"
          subtitle="₦139M–₦211M investment framework"
          bgLetter="F"
        />
      ),
      hideHeader: true,
    },
    { component: <FinancialSlide />, hideHeader: false },
    // Section 10
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={10}
          title="Revenue Model & Projections"
          subtitle="Bottom-up USD 500,000 target"
          bgLetter="R"
        />
      ),
      hideHeader: true,
    },
    { component: <RevenueModelSlide />, hideHeader: false },
    // Section 11
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={11}
          title="Success Factors & KPIs"
          subtitle="Measuring Project Fortify performance"
          bgLetter="S"
        />
      ),
      hideHeader: true,
    },
    { component: <SuccessFactorsSlide />, hideHeader: false },
    // Section 12
    {
      component: (
        <SectionHeaderSlide
          sectionNumber={12}
          title="Conclusion"
          subtitle="Commitment to partnership & firm growth"
          bgLetter="C"
        />
      ),
      hideHeader: true,
    },
    { component: <ConclusionSlide />, hideHeader: false },
    { component: <ThankYouSlide />, hideHeader: true },
  ];

  const nextSlide = useCallback(() => {
    if (currentSlide < allSlides.length - 1) setCurrentSlide((s) => s + 1);
  }, [currentSlide, allSlides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide((s) => s - 1);
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'deck') return;
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, nextSlide, prevSlide]);

  return (
    <NavigationContext.Provider value={{ goToSlideById, currentSlide, totalSlides: allSlides.length, viewMode }}>
      <div className="fixed inset-0 z-[9999] bg-[#F9F7ED] overflow-hidden flex flex-col">
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    @media print {
                        @page {
                            size: 297mm 167mm;
                            margin: 0;
                        }
                        *, *::before, *::after {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        body, html {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 297mm !important;
                            background: white !important;
                        }
                        .no-print, .deck-controls { display: none !important; }
                        .fixed {
                            position: static !important;
                            overflow: visible !important;
                            height: auto !important;
                        }
                        .page-wrapper {
                            display: block !important;
                            width: 297mm !important;
                            height: 167mm !important;
                            max-height: 167mm !important;
                            min-height: 167mm !important;
                            overflow: hidden !important;
                            page-break-after: always !important;
                            page-break-inside: avoid !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            box-sizing: border-box !important;
                            position: relative !important;
                        }
                        .page-wrapper:last-child {
                            page-break-after: avoid !important;
                        }
                    }
                `,
          }}
        />

        {/* Toolbar */}
        <div className="no-print h-16 shrink-0 bg-[#F9F7ED] border-b border-[#211B1B]/10 flex items-center justify-between px-8 z-[10000]">
          <div className="flex items-center space-x-6">
            <div className="flex bg-[#211B1B]/5 p-1 rounded-sm">
              {(['scroll', 'deck'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${viewMode === mode ? 'bg-red-600 text-white shadow-lg' : 'text-[#211B1B]/40 hover:text-[#211B1B]'}`}
                >
                  {mode === 'scroll' ? 'Document' : 'Presentation'}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-[#211B1B]/10" />
            <span className="text-[#211B1B]/30 text-[10px] font-mono tracking-widest uppercase">
              Project Fortify · CLDR Business Plan · 2026–2028
            </span>
          </div>
          <DownloadControls />
        </div>

        {/* Content */}
        <div
          className={`flex-grow relative ${viewMode === 'scroll' ? 'overflow-y-auto scroll-smooth bg-gray-100' : 'overflow-hidden flex items-center justify-center bg-gray-100'}`}
        >
          {viewMode === 'scroll' ? (
            <div className="print-slide-container flex flex-col items-center py-12 gap-12 print:p-0 print:gap-0">
              {allSlides.map((slide, idx) => (
                <div key={idx} id={`slide-${idx}`} className="w-full flex justify-center">
                  <SlideWrapper pageNumber={idx + 1} hideHeader={slide.hideHeader}>
                    {slide.component}
                  </SlideWrapper>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative group w-full h-full flex items-center justify-center overflow-hidden">
              <div
                className="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_150px_rgba(0,0,0,0.4)]"
                style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
              >
                <SlideWrapper pageNumber={currentSlide + 1} hideHeader={allSlides[currentSlide]?.hideHeader}>
                  {allSlides[currentSlide]?.component}
                </SlideWrapper>

                {/* Deck controls */}
                <div className="deck-controls absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-8 bg-[#F9F7ED]/90 backdrop-blur-xl shadow-2xl border border-[#211B1B]/10 px-8 py-3 rounded-full z-[1000] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="text-[#211B1B]/40 hover:text-red-500 disabled:opacity-10 transition-colors p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
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
                    className="text-white bg-red-600 hover:bg-red-700 disabled:bg-[#211B1B]/5 disabled:text-[#211B1B]/20 px-6 py-2 rounded-full shadow-lg transition-all flex items-center space-x-3"
                  >
                    <span className="font-bold text-[10px] tracking-widest uppercase">Next</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Side nav zones */}
                <div
                  onClick={prevSlide}
                  className="absolute left-0 top-0 bottom-0 w-32 cursor-pointer z-[500] hidden sm:block group/prev"
                >
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/prev:opacity-20 transition-opacity">
                    <svg className="w-12 h-12 text-[#211B1B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </div>
                <div
                  onClick={nextSlide}
                  className="absolute right-0 top-0 bottom-0 w-32 cursor-pointer z-[500] hidden sm:block group/next"
                >
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/next:opacity-20 transition-opacity">
                    <svg className="w-12 h-12 text-[#211B1B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="absolute top-8 right-12 text-[#211B1B]/10 font-mono text-[9px] tracking-[0.3em] uppercase pointer-events-none">
                  Keys: SPACE / ARROWS / F
                </div>
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
          background: rgba(232, 0, 0, 0.4);
        }
      `}</style>
    </NavigationContext.Provider>
  );
}

export default function PspPresentationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <PspPresentationContent />
    </Suspense>
  );
}
