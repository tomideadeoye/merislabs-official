'use client';

import { useEffect } from 'react';
import { DownloadControls } from '@merislabs/ui';
import { PageWrapper } from './components/PageWrapper';
import { CoverPage } from './components/CoverPage';
import { TableOfContents } from './components/TableOfContents';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { PersonalCase } from './components/PersonalCase';
import { Platform1, Platform2 } from './components/ProposedBusiness';
import { ImplementationPlan, ImplementationPlanContinued } from './components/ImplementationPlan';
import { FinancialRequirements } from './components/FinancialRequirements';
import { SuccessFactors } from './components/SuccessFactors';
import { Conclusion } from './components/Conclusion';
import { BackCover } from './components/BackCover';

export default function PspBusinessPlanPage() {
    useEffect(() => {
        document.title = 'JEE – Project Fortify – CLDR Business Plan (2026–2028)';
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto print:static print:bg-white print:overflow-visible">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    .page-wrapper {
                        page-break-after: always;
                        page-break-inside: avoid;
                        margin: 0 !important;
                        padding: 0 !important;
                        display: block !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        max-height: 297mm !important;
                        overflow: hidden !important;
                        box-sizing: border-box !important;
                    }
                    .page-wrapper:last-child { page-break-after: avoid; }
                    .no-print, button { display: none !important; }
                    body, html {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background-color: #F9F7ED !important;
                        width: 210mm !important;
                    }
                    .print-container {
                        display: block !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        gap: 0 !important;
                        width: 210mm !important;
                    }
                    main { padding-top: 0 !important; }
                }

                :root {
                    --jee-red: #E80000;
                    --jee-charcoal: #211B1B;
                    --jee-cream: #F9F7ED;
                }

                .page-wrapper {
                    background-color: var(--jee-cream) !important;
                    color: #454545;
                    font-family: 'Inter', sans-serif;
                }

                h1, h2, h3, h4 {
                    color: var(--jee-charcoal);
                    font-family: 'Playfair Display', serif;
                    text-align: left !important;
                }

                h1.text-center, h2.text-center, h3.text-center, h4.text-center {
                    text-align: center !important;
                }

                .page-wrapper p:not(.no-justify):not(.text-center),
                .page-wrapper li:not(.no-justify):not(.text-center) {
                    text-align: justify !important;
                    text-justify: inter-word;
                }

                h1, h2, h3, h4, .no-justify {
                    text-align: left !important;
                    text-justify: none !important;
                    word-spacing: normal !important;
                }
            `}} />

            <DownloadControls />

            <div className="print-container flex flex-col items-center py-12 px-4 gap-12 print:p-0 print:gap-0 bg-slate-50 min-h-screen">
                <PageWrapper pageNumber="1" isCover={true}>
                    <CoverPage />
                </PageWrapper>

                <PageWrapper pageNumber="2">
                    <TableOfContents />
                </PageWrapper>

                <PageWrapper pageNumber="3">
                    <ExecutiveSummary />
                </PageWrapper>

                <PageWrapper pageNumber="4">
                    <PersonalCase />
                </PageWrapper>

                <PageWrapper pageNumber="5">
                    <Platform1 />
                </PageWrapper>

                <PageWrapper pageNumber="6">
                    <Platform2 />
                </PageWrapper>

                <PageWrapper pageNumber="7">
                    <ImplementationPlan />
                </PageWrapper>

                <PageWrapper pageNumber="8">
                    <ImplementationPlanContinued />
                </PageWrapper>

                <PageWrapper pageNumber="9">
                    <FinancialRequirements />
                </PageWrapper>

                <PageWrapper pageNumber="10">
                    <SuccessFactors />
                </PageWrapper>

                <PageWrapper pageNumber="11">
                    <Conclusion />
                </PageWrapper>

                <PageWrapper pageNumber="12" isBackCover={true}>
                    <BackCover />
                </PageWrapper>
            </div>
        </div>
    );
}
