'use client';

import { useEffect } from 'react';
import { DownloadControls } from '@merislabs/ui';
import { PageWrapper } from './components/PageWrapper';
import { CoverPage } from './components/CoverPage';
import { TableOfContents } from './components/TableOfContents';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { PersonalCase, PersonalCaseContinued } from './components/PersonalCase';
import { Platform1, Platform2 } from './components/ProposedBusiness';
import { MarketAnalysis, CompetitiveLandscape, CompetitiveLandscapeTier2 } from './components/MarketAnalysis';
import { StrategicObjectives } from './components/StrategicObjectives';
import { ImplementationPlan, ImplementationPlanContinued } from './components/ImplementationPlan';
import { InternationalReferral } from './components/InternationalReferral';
import { TeamDevelopment, TeamDevelopmentContinued } from './components/TeamDevelopment';
import { FinancialRequirements, FinancialROI } from './components/FinancialRequirements';
import { RevenueModel } from './components/RevenueModel';
import { Profitability } from './components/Profitability';
import { SuccessFactors, RiskRegister } from './components/SuccessFactors';
import { PhasedTimeline } from './components/PhasedTimeline';
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
                    @page { size: 210mm 297mm; margin: 0; }
                    *, *::before, *::after {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .page-wrapper {
                        page-break-after: always;
                        page-break-inside: avoid;
                        margin: 0 !important;
                        padding: 0 !important;
                        display: block !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        max-height: 297mm !important;
                        min-height: 297mm !important;
                        overflow: hidden !important;
                        box-sizing: border-box !important;
                    }
                    .page-wrapper:last-child { page-break-after: avoid; }
                    .no-print, button { display: none !important; }
                    body, html {
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
                :root { --jee-red: #E80000; --jee-charcoal: #211B1B; --jee-cream: #F9F7ED; }
                .page-wrapper { background-color: var(--jee-cream) !important; color: #454545; font-family: 'Inter', sans-serif; }
                h1, h2, h3, h4 { color: var(--jee-charcoal); font-family: 'Playfair Display', serif; text-align: left !important; }
                .page-wrapper p:not(.no-justify):not(.text-center), .page-wrapper li:not(.no-justify):not(.text-center) { text-align: justify !important; text-justify: inter-word; }
                h1, h2, h3, h4, .no-justify { text-align: left !important; text-justify: none !important; word-spacing: normal !important; }
            `}} />

            <DownloadControls />

            <div className="print-container flex flex-col items-center py-12 px-4 gap-12 print:p-0 print:gap-0 bg-slate-50 min-h-screen">
                {/* 1  */}<PageWrapper pageNumber="1" isCover={true}><CoverPage /></PageWrapper>
                {/* 2  */}<PageWrapper pageNumber="2"><TableOfContents /></PageWrapper>
                {/* 3  */}<PageWrapper pageNumber="3"><ExecutiveSummary /></PageWrapper>
                {/* 4  */}<PageWrapper pageNumber="4"><PersonalCase /></PageWrapper>
                {/* 5  */}<PageWrapper pageNumber="5"><PersonalCaseContinued /></PageWrapper>
                {/* 6  */}<PageWrapper pageNumber="6"><Platform1 /></PageWrapper>
                {/* 7  */}<PageWrapper pageNumber="7"><Platform2 /></PageWrapper>
                {/* 8  */}<PageWrapper pageNumber="8"><MarketAnalysis /></PageWrapper>
                {/* 9  */}<PageWrapper pageNumber="9"><CompetitiveLandscape /></PageWrapper>
                {/* 10 */}<PageWrapper pageNumber="10"><CompetitiveLandscapeTier2 /></PageWrapper>
                {/* 11 */}<PageWrapper pageNumber="11"><StrategicObjectives /></PageWrapper>
                {/* 12 */}<PageWrapper pageNumber="12"><ImplementationPlan /></PageWrapper>
                {/* 13 */}<PageWrapper pageNumber="13"><ImplementationPlanContinued /></PageWrapper>
                {/* 14 */}<PageWrapper pageNumber="14"><InternationalReferral /></PageWrapper>
                {/* 15 */}<PageWrapper pageNumber="15"><TeamDevelopment /></PageWrapper>
                {/* 16 */}<PageWrapper pageNumber="16"><TeamDevelopmentContinued /></PageWrapper>
                {/* 17 */}<PageWrapper pageNumber="17"><FinancialRequirements /></PageWrapper>
                {/* 18 */}<PageWrapper pageNumber="18"><FinancialROI /></PageWrapper>
                {/* 19 */}<PageWrapper pageNumber="19"><RevenueModel /></PageWrapper>
                {/* 20 */}<PageWrapper pageNumber="20"><Profitability /></PageWrapper>
                {/* 21 */}<PageWrapper pageNumber="21"><SuccessFactors /></PageWrapper>
                {/* 22 */}<PageWrapper pageNumber="22"><RiskRegister /></PageWrapper>
                {/* 23 */}<PageWrapper pageNumber="23"><PhasedTimeline /></PageWrapper>
                {/* 24 */}<PageWrapper pageNumber="24"><Conclusion /></PageWrapper>
                {/* 25 */}<PageWrapper pageNumber="25" isBackCover={true}><BackCover /></PageWrapper>
            </div>
        </div>
    );
}
