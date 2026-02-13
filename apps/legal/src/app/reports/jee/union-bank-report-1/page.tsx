'use client';

import React, { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import { DownloadControls } from './components/DownloadControls';
import { CoverPage } from './components/CoverPage';
import { TableOfContents } from './components/TableOfContents';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { ScopeOfWork, ScopeAssumptions, ScopeFramework } from './components/ScopeOfWork';
import { KeyFindingsPage1, KeyFindingsPage2, KeyFindingsPage3, KeyFindingsPage4, KeyFindingsPage5 } from './components/KeyFindings';
import { Analysis } from './components/AnalysisAndRecommendations';
import { RiskConsiderations } from './components/RiskConsiderations';
import { Recommendations } from './components/Recommendations';
import { ImplementationRoadmap } from './components/ImplementationRoadmap';
import { Conclusion } from './components/Conclusion';
import { BackCover } from './components/BackCover';
import { PageWrapper } from './components/PageWrapper';

export default function UnionBankReportPage() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto print:static print:bg-white print:overflow-visible">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }

                    .page-wrapper {
                        page-break-after: always;
                    }

                    .page-wrapper:last-child {
                        page-break-after: avoid;
                    }

                    .no-print, button {
                        display: none !important;
                    }

                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow-x: hidden !important;
                        background-color: #F9F7ED !important;
                    }

                    main {
                        padding-top: 0 !important;
                    }
                }

                :root {
                    --jee-red: #E80000;
                    --jee-charcoal: #211B1B;
                    --jee-cream: #F9F7ED;
                    --union-blue: #009fe3;
                }

                .page-wrapper {
                    background-color: var(--jee-cream) !important;
                    color: #454545;
                    font-family: 'Inter', sans-serif;
                }

                h1, h2, h3, h4 {
                    color: var(--jee-charcoal);
                    font-family: 'Playfair Display', serif;
                    text-justify: none !important;
                    text-align: left !important;
                }

                h1.text-center, h2.text-center, h3.text-center, h4.text-center {
                    text-align: center !important;
                }

                .page-wrapper p:not(.no-justify):not(.text-center),
                .page-wrapper li:not(.no-justify):not(.text-center),
                .page-wrapper div:not(.no-justify):not(.text-center):not(.title-container):not(.header-wrapper):not(.heading-text),
                .page-wrapper span:not(.no-justify):not(.text-center):not(.heading-text) {
                    text-align: justify !important;
                    text-justify: inter-word;
                }

                /* Explicitly prevent justification for headings and tagged items */
                h1, h2, h3, h4, .no-justify, .heading-text {
                    text-align: left !important;
                    text-justify: none !important;
                    word-spacing: normal !important;
                    letter-spacing: normal;
                }

                h1.text-center, h2.text-center, h3.text-center, h4.text-center, .text-center {
                    text-align: center !important;
                    text-justify: none !important;
                }

                .text-center {
                    text-align: center !important;
                }
            ` }} />

            <DownloadControls />

            <div className="flex flex-col items-center py-12 px-4 gap-12 print:p-0 print:gap-0 bg-slate-50 min-h-screen">
                <PageWrapper pageNumber="1" isCover={true} isBackCover={false}>
                    <CoverPage />
                </PageWrapper>

                <PageWrapper pageNumber="2" isCover={false} isBackCover={false}>
                    <TableOfContents />
                </PageWrapper>

                <PageWrapper pageNumber="3" isCover={false} isBackCover={false}>
                    <ExecutiveSummary />
                </PageWrapper>

                <PageWrapper pageNumber="4" isCover={false} isBackCover={false}>
                    <ScopeOfWork />
                </PageWrapper>

                <PageWrapper pageNumber="5" isCover={false} isBackCover={false}>
                    <ScopeAssumptions />
                </PageWrapper>

                <PageWrapper pageNumber="6" isCover={false} isBackCover={false}>
                    <ScopeFramework />
                </PageWrapper>

                <PageWrapper pageNumber="7" isCover={false} isBackCover={false}>
                    <KeyFindingsPage1 />
                </PageWrapper>

                <PageWrapper pageNumber="8" isCover={false} isBackCover={false}>
                    <KeyFindingsPage2 />
                </PageWrapper>

                <PageWrapper pageNumber="9" isCover={false} isBackCover={false}>
                    <KeyFindingsPage3 />
                </PageWrapper>

                <PageWrapper pageNumber="10" isCover={false} isBackCover={false}>
                    <KeyFindingsPage4 />
                </PageWrapper>

                <PageWrapper pageNumber="11" isCover={false} isBackCover={false}>
                    <KeyFindingsPage5 />
                </PageWrapper>

                <PageWrapper pageNumber="12" isCover={false} isBackCover={false}>
                    <Analysis />
                </PageWrapper>

                <PageWrapper pageNumber="13" isCover={false} isBackCover={false}>
                    <RiskConsiderations />
                </PageWrapper>

                <PageWrapper pageNumber="14" isCover={false} isBackCover={false}>
                    <Recommendations />
                </PageWrapper>

                <PageWrapper pageNumber="15" isCover={false} isBackCover={false}>
                    <ImplementationRoadmap />
                </PageWrapper>

                <PageWrapper pageNumber="16" isCover={false} isBackCover={false}>
                    <Conclusion />
                </PageWrapper>

                <PageWrapper pageNumber="17" isCover={false} isBackCover={true}>
                    <BackCover />
                </PageWrapper>
            </div>
        </div>
    );
}
