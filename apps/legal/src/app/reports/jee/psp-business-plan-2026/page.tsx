'use client';

import { useEffect } from 'react';
import { DownloadControls } from '@merislabs/ui';
import { PageWrapper } from './components/PageWrapper';
import { CoverPage } from './components/CoverPage';
import { TableOfContents } from './components/TableOfContents';
import { ExecutiveSummary, ExecutiveSummaryContinued } from './components/ExecutiveSummary';
import { PersonalCase, PersonalCaseTable, PersonalCaseContinued } from './components/PersonalCase';
import { Platform1, Platform2 } from './components/ProposedBusiness';
import { MarketAnalysis, CompetitiveLandscape, CompetitiveLandscapeTier2 } from './components/MarketAnalysis';
import { StrategicObjectives } from './components/StrategicObjectives';
import { ImplementationPlan, ImplementationPlanContinued } from './components/ImplementationPlan';
import { InternationalReferral } from './components/InternationalReferral';
import { TeamDevelopment, TeamDevelopmentContinued } from './components/TeamDevelopment';
import {
  FinancialRequirements,
  FinancialRequirementsContinued,
  FinancialROI,
} from './components/FinancialRequirements';
import { RevenueModel, RevenueModelContinued } from './components/RevenueModel';
import { Profitability } from './components/Profitability';
import { SuccessFactors, RiskRegister } from './components/SuccessFactors';
import { PhasedTimeline, PhasedTimelinePart2, PhasedTimelinePart3 } from './components/PhasedTimeline';
import { Conclusion, ConclusionPart2 } from './components/Conclusion';
import { BackCover } from './components/BackCover';

export default function PspBusinessPlanPage() {
  useEffect(() => {
    document.title = 'JEE – Project Fortify – CLDR Business Plan (2026–2028)';
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto print:static print:bg-white print:overflow-visible">
      <style
        dangerouslySetInnerHTML={{
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
            `,
        }}
      />

      <DownloadControls />

      <div className="print-container flex flex-col items-center py-12 px-4 gap-12 print:p-0 print:gap-0 bg-slate-50 min-h-screen">
        {/* Section 01: Cover */}
        <PageWrapper pageNumber="1" isCover={true}>
          <CoverPage />
        </PageWrapper>

        {/* Section 02: Table of Contents */}
        <PageWrapper pageNumber="2">
          <TableOfContents />
        </PageWrapper>

        {/* Section 03: Executive Summary (2 pages) */}
        <PageWrapper pageNumber="3">
          <ExecutiveSummary />
        </PageWrapper>
        <PageWrapper pageNumber="4">
          <ExecutiveSummaryContinued />
        </PageWrapper>

        {/* Section 04: Personal Case (3 pages) */}
        <PageWrapper pageNumber="5">
          <PersonalCase />
        </PageWrapper>
        <PageWrapper pageNumber="6">
          <PersonalCaseTable />
        </PageWrapper>
        <PageWrapper pageNumber="7">
          <PersonalCaseContinued />
        </PageWrapper>

        {/* Section 05: Proposed Business - Platforms (2 pages) */}
        <PageWrapper pageNumber="8">
          <Platform1 />
        </PageWrapper>
        <PageWrapper pageNumber="9">
          <Platform2 />
        </PageWrapper>

        {/* Section 06: Market & Competitive Landscape (3 pages) */}
        <PageWrapper pageNumber="10">
          <MarketAnalysis />
        </PageWrapper>
        <PageWrapper pageNumber="11">
          <CompetitiveLandscape />
        </PageWrapper>
        <PageWrapper pageNumber="12">
          <CompetitiveLandscapeTier2 />
        </PageWrapper>

        {/* Section 07: Strategic Objectives */}
        <PageWrapper pageNumber="13">
          <StrategicObjectives />
        </PageWrapper>

        {/* Section 08: Implementation Plan (2 pages) */}
        <PageWrapper pageNumber="14">
          <ImplementationPlan />
        </PageWrapper>
        <PageWrapper pageNumber="15">
          <ImplementationPlanContinued />
        </PageWrapper>

        {/* Section 09: International Referral Architecture */}
        <PageWrapper pageNumber="16">
          <InternationalReferral />
        </PageWrapper>

        {/* Section 10: Team Development (2 pages) */}
        <PageWrapper pageNumber="17">
          <TeamDevelopment />
        </PageWrapper>
        <PageWrapper pageNumber="18">
          <TeamDevelopmentContinued />
        </PageWrapper>

        {/* Section 11: Financial Requirements (3 pages) */}
        <PageWrapper pageNumber="19">
          <FinancialRequirements />
        </PageWrapper>
        <PageWrapper pageNumber="20">
          <FinancialRequirementsContinued />
        </PageWrapper>
        <PageWrapper pageNumber="21">
          <FinancialROI />
        </PageWrapper>

        {/* Section 12: Revenue Model (2 pages) */}
        <PageWrapper pageNumber="22">
          <RevenueModel />
        </PageWrapper>
        <PageWrapper pageNumber="23">
          <RevenueModelContinued />
        </PageWrapper>

        {/* Section 13: Profitability */}
        <PageWrapper pageNumber="24">
          <Profitability />
        </PageWrapper>

        {/* Section 14: Success Factors & Risk Register (2 pages) */}
        <PageWrapper pageNumber="25">
          <SuccessFactors />
        </PageWrapper>
        <PageWrapper pageNumber="26">
          <RiskRegister />
        </PageWrapper>

        {/* Section 15: Phased Implementation (3 pages) */}
        <PageWrapper pageNumber="27">
          <PhasedTimeline />
        </PageWrapper>
        <PageWrapper pageNumber="28">
          <PhasedTimelinePart2 />
        </PageWrapper>
        <PageWrapper pageNumber="29">
          <PhasedTimelinePart3 />
        </PageWrapper>

        {/* Section 16: Conclusion (2 pages) */}
        <PageWrapper pageNumber="30">
          <Conclusion />
        </PageWrapper>
        <PageWrapper pageNumber="31">
          <ConclusionPart2 />
        </PageWrapper>

        {/* Back Cover */}
        <PageWrapper pageNumber="32" isBackCover={true}>
          <BackCover />
        </PageWrapper>
      </div>
    </div>
  );
}
