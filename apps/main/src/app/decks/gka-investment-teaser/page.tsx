'use client';

import React, { useState, useEffect } from 'react';
import { DownloadControls } from '@merislabs/ui';
import { CoverPage } from './components/CoverPage';
import { Page1 } from './components/Page1';
import { Page2 } from './components/Page2';
import { PageWrapper } from './components/PageWrapper';

export default function GKAInvestmentTeaserPage() {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        document.title = "GK&A Logistics - Investment Teaser | Ikorodu Regional Inland Port - 2026";
    }, []);

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
                        background-color: #ffffff !important;
                    }

                    main {
                        padding-top: 0 !important;
                    }
                }

                :root {
                    --gka-orange: #f06600;
                    --gka-orange-light: #ff8533;
                    --gka-charcoal: #211B1B;
                    --gka-cream: #F9F7ED;
                }

                .page-wrapper {
                    background-color: #ffffff !important;
                    color: #454545;
                    font-family: 'Inter', sans-serif;
                }

                h1, h2, h3, h4 {
                    color: var(--gka-charcoal);
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

            <DownloadControls primaryColor="#f06600" />

            <div className="flex flex-col items-center py-12 px-4 gap-12 print:p-0 print:gap-0 bg-slate-50 min-h-screen">
                <PageWrapper pageNumber="1" isCover={true}>
                    <CoverPage />
                </PageWrapper>

                <PageWrapper pageNumber="2" isCover={false}>
                    <Page1 />
                </PageWrapper>

                <PageWrapper pageNumber="3" isCover={false}>
                    <Page2 />
                </PageWrapper>
            </div>
        </div>
    );
}
