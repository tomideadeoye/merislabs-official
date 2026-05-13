import React from 'react';
import { Metadata } from 'next';
import { PageWrapper } from './components/PageWrapper';

export const metadata: Metadata = {
  title: 'JEE - Project Fortify - Commercial Disputes Growth Plan (2026 - 2028)',
  description: 'Partnership Selection Programme Submission - April 2026',
};
import { CoverPage } from './components/sections/CoverPage';
import { TableOfContents } from './components/sections/TableOfContents';
import { ExecutiveSummary } from './components/sections/ExecutiveSummary';
import { ExecutiveSummaryPart2 } from './components/sections/ExecutiveSummaryPart2';
import { PersonalCase } from './components/sections/PersonalCase';
import { RevenueContributions } from './components/sections/RevenueContributions';
import { MarketVisibility } from './components/sections/MarketVisibility';
import { ProposedBusiness } from './components/sections/ProposedBusiness';
import { Platform2Commercial } from './components/sections/Platform2Commercial';
import { Platform3Arbitration } from './components/sections/Platform3Arbitration';
import { MarketAnalysis } from './components/sections/MarketAnalysis';
import { MarketAndCompetitive } from './components/sections/MarketAndCompetitive';
import { CompetitiveLandscapeTable } from './components/sections/CompetitiveLandscapeTable';
import { JEEDistinctivePosition } from './components/sections/JEEDistinctivePosition';
import { StrategicObjectives } from './components/sections/StrategicObjectives';
import { ImplementationPlan } from './components/sections/ImplementationPlan';
import { InternationalReferral } from './components/sections/InternationalReferral';
import { TeamDevelopment } from './components/sections/TeamDevelopment';
import { TeamDevelopmentAndLeverage } from './components/sections/TeamDevelopmentAndLeverage';
import { FinancialRequirements } from './components/sections/FinancialRequirements';
import { FinancialRequirementsCont } from './components/sections/FinancialRequirementsCont';
import { InvestmentLogicAndROI } from './components/sections/InvestmentLogicAndROI';
import { RevenueModel } from './components/sections/RevenueModel';
import { RevenueModelCont } from './components/sections/RevenueModelCont';
import { Profitability } from './components/sections/Profitability';
import { SuccessFactors } from './components/sections/SuccessFactors';
import { RiskRegister } from './components/sections/RiskRegister';
import { Conclusion } from './components/sections/Conclusion';
import { ConclusionPart2 } from './components/sections/ConclusionPart2';
import { BackCover } from './components/sections/BackCover';

export default function ProjectFortifyReport() {
  return (
    <>
      <PageWrapper pageNumber="cover" isCover={true}><CoverPage /></PageWrapper>
      <PageWrapper pageNumber="toc" breakBefore><TableOfContents /></PageWrapper>
      <PageWrapper pageNumber="1" breakBefore><ExecutiveSummary /></PageWrapper>
      <PageWrapper pageNumber="2" breakBefore><ExecutiveSummaryPart2 /></PageWrapper>
      <PageWrapper pageNumber="3" breakBefore><PersonalCase /></PageWrapper>
      <PageWrapper pageNumber="4" breakBefore><RevenueContributions /></PageWrapper>
      <PageWrapper pageNumber="5" breakBefore><MarketVisibility /></PageWrapper>
      <PageWrapper pageNumber="6" breakBefore><ProposedBusiness /></PageWrapper>
      <PageWrapper pageNumber="7" breakBefore><Platform2Commercial /></PageWrapper>
      <PageWrapper pageNumber="8" breakBefore><Platform3Arbitration /></PageWrapper>
      <PageWrapper pageNumber="9" breakBefore><MarketAndCompetitive /></PageWrapper>
      <PageWrapper pageNumber="10" breakBefore><CompetitiveLandscapeTable /></PageWrapper>
      <PageWrapper pageNumber="11" breakBefore><JEEDistinctivePosition /></PageWrapper>
      <PageWrapper pageNumber="12" breakBefore><StrategicObjectives /></PageWrapper>
      <PageWrapper pageNumber="13" breakBefore><ImplementationPlan workstreamIds={['WS1', 'WS2']} /></PageWrapper>
      <PageWrapper pageNumber="14" breakBefore><ImplementationPlan workstreamIds={['WS3', 'WS4']} showTitle={false} /></PageWrapper>
      <PageWrapper pageNumber="15" breakBefore><ImplementationPlan workstreamIds={['WS5']} showTitle={false} /></PageWrapper>
      <PageWrapper pageNumber="16" breakBefore><InternationalReferral /></PageWrapper>
      <PageWrapper pageNumber="17" breakBefore><TeamDevelopment /></PageWrapper>
      <PageWrapper pageNumber="18" breakBefore><TeamDevelopmentAndLeverage /></PageWrapper>
      <PageWrapper pageNumber="19" breakBefore><FinancialRequirements /></PageWrapper>
      <PageWrapper pageNumber="20" breakBefore><FinancialRequirementsCont /></PageWrapper>
      <PageWrapper pageNumber="21" breakBefore><InvestmentLogicAndROI /></PageWrapper>
      <PageWrapper pageNumber="22" breakBefore><RevenueModel /></PageWrapper>
      <PageWrapper pageNumber="23" breakBefore><RevenueModelCont /></PageWrapper>
      <PageWrapper pageNumber="24" breakBefore><Profitability /></PageWrapper>
      <PageWrapper pageNumber="25" breakBefore><SuccessFactors /></PageWrapper>
      <PageWrapper pageNumber="26" breakBefore><RiskRegister /></PageWrapper>
      <PageWrapper pageNumber="27" breakBefore><Conclusion /></PageWrapper>
      <PageWrapper pageNumber="28" breakBefore><ConclusionPart2 /></PageWrapper>
      <PageWrapper pageNumber="back" isBackCover={true}><BackCover /></PageWrapper>
    </>
  );
}
