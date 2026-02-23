'use client';

import React, { useEffect } from 'react';
import { DownloadControls } from '../union-bank-report-1/components/DownloadControls';
import { SlideWrapper } from './components/SlideWrapper';
import { CoverSlide } from './components/CoverSlide';
import { TOCSlide } from './components/TOCSlide';
import { LitigationSlide } from './components/LitigationSlide';
import { ClosedCasesSlide } from './components/ClosedCasesSlide';
import { PrioritiesSlide } from './components/PrioritiesSlide';
import { ValueAddSlide } from './components/ValueAddSlide';
import { ThankYouSlide } from './components/ThankYouSlide';

import { litigationCases, closedCases2025 } from './data';

export default function BakerHughesReportPage() {
    useEffect(() => {
        document.title = "Baker Hughes Group Status Report 2026";
    }, []);

    let slideCounter = 1;

    return (
        <div className="fixed inset-0 z-[9999] bg-gray-100 overflow-y-auto print:static print:bg-white print:overflow-visible">
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
                        background-color: white !important;
                    }
                }
            ` }} />

            <DownloadControls />

            <div className="flex flex-col items-center py-10 px-4 gap-8 print:p-0 print:gap-0 bg-gray-200 min-h-screen">

                <SlideWrapper pageNumber={slideCounter++} hideHeader>
                    <CoverSlide />
                </SlideWrapper>

                <SlideWrapper pageNumber={slideCounter++}>
                    <TOCSlide />
                </SlideWrapper>

                {litigationCases.map((caseData, idx) => (
                    <SlideWrapper key={idx} pageNumber={slideCounter++}>
                        <LitigationSlide data={caseData} />
                    </SlideWrapper>
                ))}

                {closedCases2025.map((caseItem, idx) => (
                    <SlideWrapper key={idx + 20} pageNumber={slideCounter++}>
                        <ClosedCasesSlide data={caseItem} index={idx} total={closedCases2025.length} />
                    </SlideWrapper>
                ))}

                <SlideWrapper pageNumber={slideCounter++}>
                    <PrioritiesSlide />
                </SlideWrapper>

                <SlideWrapper pageNumber={slideCounter++}>
                    <ValueAddSlide />
                </SlideWrapper>

                <SlideWrapper pageNumber={slideCounter++} hideHeader>
                    <ThankYouSlide />
                </SlideWrapper>

            </div>
        </div>
    );
}
