'use client';

import React from 'react';
import { PageWrapper } from './components/PageWrapper';
import { CoverPage } from './components/CoverPage';
import {
  TableOfContents, 
  IntroductionSection, 
  MarketContextSection,
  DemandSideSection,
  SupplySideSection,
  SupplySideInfoGapSection,
  SupplySideContSection,
  TheWayForwardSection,
  ConclusionSection,
  FootnotesPage1,
  FootnotesPage2,
  FootnotesPage3,
  BackCover 
} from './components/ContentPages';

const ReportPage = () => {
  const pages = [
    <CoverPage key="cover" />,
    <TableOfContents key="toc" />,
    <IntroductionSection key="intro" />,
    <MarketContextSection key="market" />,
    <DemandSideSection key="demand" />,
    <SupplySideSection key="supply" />,
    <SupplySideInfoGapSection key="supply-info" />,
    <SupplySideContSection key="supply-cont" />,
    <TheWayForwardSection key="way" />,
    <ConclusionSection key="conc" />,
    <FootnotesPage1 key="fn1" />,
    <FootnotesPage2 key="fn2" />,
    <FootnotesPage3 key="fn3" />,
    <BackCover key="back" />
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 print:p-0 print:bg-white overflow-x-hidden">
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
