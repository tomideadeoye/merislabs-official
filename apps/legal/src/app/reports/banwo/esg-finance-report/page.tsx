'use client';

import React from 'react';
import { PageWrapper } from './components/PageWrapper';
import { CoverPage } from './components/CoverPage';
import {
  TableOfContents, 
  IntroductionSection, 
  MarketContextSection,
  DemandSideInternalSection,
  DemandSideExternalSection,
  SupplySideSection,
  SupplySideInfoGapSection,
  SupplySideContSection,
  TheWayForwardSection,
  ConclusionSection,
  FootnotesPage,
  BackCover 
} from './components/ContentPages';
import { Download as DownloadIcon } from 'lucide-react';

const ReportPage = () => {
  const pages = [
    <CoverPage key="cover" />,
    <TableOfContents key="toc" />,
    <IntroductionSection key="intro" />,
    <MarketContextSection key="market" />,
    <DemandSideInternalSection key="demand-int" />,
    <DemandSideExternalSection key="demand-ext" />,
    <SupplySideSection key="supply" />,
    <SupplySideInfoGapSection key="supply-info" />,
    <SupplySideContSection key="supply-cont" />,
    <TheWayForwardSection key="way" />,
    <ConclusionSection key="conc" />,
    <FootnotesPage key="fn" />,
    <BackCover key="back" />
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 print:p-0 print:bg-white overflow-x-hidden relative">
      {/* Download Action Button */}
      <button 
        onClick={() => window.print()}
        className="fixed top-8 right-8 z-[100] flex items-center gap-2 px-6 py-3 bg-[#05386f] text-white text-xs font-bold rounded-full hover:bg-[#D4AF37] transition-all shadow-xl uppercase tracking-widest print:hidden"
      >
        <DownloadIcon className="w-4 h-4" />
        Download PDF
      </button>

      <div className="max-w-[210mm] mx-auto space-y-8 print:space-y-0">
        {pages.map((page, index) => {
          const isCover = index === 0;
          const isBackCover = index === pages.length - 1;
          return (
            <PageWrapper 
              key={index} 
              pageNumber={(index + 1).toString()}
              isCover={isCover}
              isBackCover={isBackCover}
            >
              {page}
            </PageWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default ReportPage;
