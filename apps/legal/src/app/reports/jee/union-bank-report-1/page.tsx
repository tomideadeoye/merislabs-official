'use client';

import React, { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import { PageWrapper } from './components/PageWrapper';
import { CoverPage } from './components/CoverPage';
import { TableOfContents } from './components/TableOfContents';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { ScopeOfWork } from './components/ScopeOfWork';
import { KeyFindingsPage1, KeyFindingsPage2, KeyFindingsPage3, KeyFindingsPage4 } from './components/KeyFindings';
import { Analysis } from './components/AnalysisAndRecommendations';
import { RiskConsiderations } from './components/RiskConsiderations';
import { Recommendations } from './components/Recommendations';
import { ImplementationRoadmap } from './components/ImplementationRoadmap';
import { Conclusion } from './components/Conclusion';
import { BackCover } from './components/BackCover';
import { DownloadControls } from './components/DownloadControls';

export default function UnionBankReportPage() {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages (excluding cover and back cover since they don't have page numbers)
    // Cover page: 1, Table of Contents: 1, Executive Summary: 1, Scope of Work: 1, Key Findings: 1, Analysis: 1,
    // Risk Considerations: 1, Recommendations: 1, Conclusion: 1, Back Cover: 1
    const totalPages = 10;

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto print:static print:bg-white print:overflow-visible">
            {/* Print Cleanup Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }

                    /* Ensure proper page breaking */
                    .page-wrapper {
                        page-break-after: always;
                    }

                    .page-wrapper:last-child {
                        page-break-after: avoid;
                    }

                    /* Hide interactive elements during printing */
                    .no-print, button {
                        display: none !important;
                    }

                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow-x: hidden !important;
                    }

                    /* Reset root layout padding for print */
                    main {
                        padding-top: 0 !important;
                        margin-top: 0 !important;
                        display: block !important;
                    }

                    /* Ensure header is hidden in print if not already */
                    header, .nav-header {
                        display: none !important;
                    }

                    .page-wrapper {
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        page-break-after: always;
                    }
                }

                /* Force justification on all report content for both screen and print, except explicitly centered items */
                .page-wrapper p:not(.no-justify):not(.text-center),
                .page-wrapper li:not(.no-justify):not(.text-center),
                .page-wrapper span:not(.no-justify):not(.text-center) {
                    text-align: justify !important;
                    text-justify: inter-word;
                }
            ` }} />

            {/* Premium Download Control Suite */}
            <DownloadControls />

            {/* Scrollable Content Container */}
            <div className="min-h-full w-full flex flex-col items-center pt-0 px-8 pb-20 print:p-0 print:m-0 print:block print:bg-white">
                {/* Cover Page - No page number or footer */}
                <PageWrapper pageNumber="1" isCover={true} isBackCover={false}>
                    <CoverPage />
                </PageWrapper>

                {/* Table of Contents - Page 2 */}
                <PageWrapper pageNumber="2" isCover={false} isBackCover={false}>
                    <TableOfContents />
                </PageWrapper>

                {/* Executive Summary - Page 3 */}
                <PageWrapper pageNumber="3" isCover={false} isBackCover={false}>
                    <ExecutiveSummary />
                </PageWrapper>

                {/* Scope of Work - Page 4 */}
                <PageWrapper pageNumber="4" isCover={false} isBackCover={false}>
                    <div id="scope" className="max-w-[210mm] w-full mx-auto bg-white p-16 relative text-[#0A1930] overflow-hidden flex flex-col flex-grow">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

                        <div className="flex items-center gap-3 mb-8 border-b border-[#009fe3]/30 pb-4 relative z-10">
                            <h2 className="text-3xl font-serif font-bold text-[#0A1930]">2. SCOPE OF WORK</h2>
                        </div>

                        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify prose-li:text-justify">
                            <h3 id="nature-review" className="text-xl font-bold mt-6 mb-3 scroll-mt-20">2.1. Nature of the Review</h3>
                            <p>
                                The Firm conducted a full-scale review and standardisation of the Bank's facility and ancillary documentation. The process included clause-by-clause legal analysis, gap identification and risk mapping, regulatory compliance assessment, judicial enforceability review, benchmarking against LMA and industry standards, and harmonisation of definitions, representations, undertakings and enforcement provisions.
                            </p>
                            <p>
                                The review was undertaken in alignment with the Bank's strategic priorities, including documentation harmonisation and enhanced credit governance.
                            </p>

                            <h3 id="docs-reviewed" className="text-xl font-bold mt-8 mb-3 scroll-mt-20">2.2. Documents Reviewed</h3>
                            <p>A total of twenty-four (24) documents were reviewed, including multiple variants. These comprised:</p>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 not-prose text-[13px] text-[#0A1930]">
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">a)</span> <span>All Asset Debenture</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">b)</span> <span>Bid Bond</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">c)</span> <span>BOI Facility Agreement</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">d)</span> <span>Consolidated FX Trade Master Agreement (2 variants)</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">e)</span> <span>General Indemnity (3 variants)</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">f)</span> <span>Irrevocable Undertaking for Domiciliation of Sales Proceeds</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">g)</span> <span>Letter of Consent to Register Tripartite Legal Mortgage</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">h)</span> <span>Letter of Domiciliation of Contract Proceeds to Offtakers</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">i)</span> <span>Letter of Hypothecation (3 variants)</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">j)</span> <span>Offer Letters (6 variants)</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">k)</span> <span>Overdraft Agreement (3 variants)</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">l)</span> <span>Personal Guarantee</span></div>
                                <div className="flex gap-2"><span className="font-bold min-w-[20px]">m)</span> <span>Undertaking to Domicile Sales Proceeds (2 variants)</span></div>
                            </div>
                        </div>
                    </div>
                </PageWrapper>

                {/* Section 2.3 Assumptions & Limitations - Page 5 */}
                <PageWrapper pageNumber="5" isCover={false} isBackCover={false}>
                    <div className="max-w-[210mm] w-full mx-auto bg-white p-16 relative text-[#0A1930] overflow-hidden flex flex-col flex-grow">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />
                        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify prose-li:text-justify">
                            <h3 id="scope-2.3" className="text-xl font-bold mb-3 scroll-mt-20">2.3. Assumptions & Limitations</h3>
                            <p>
                                Our review was based solely on the documentation provided by the Bank, and we assumed such documentation to be authentic and complete. We further assumed that operational references within the templates accurately reflect current internal processes unless otherwise indicated.
                            </p>
                            <div className="bg-[#009fe3]/10 p-6 rounded-lg text-sm border border-[#009fe3]/20 mt-6 relative z-10">
                                <strong className="text-[#0A1930] block mb-3 uppercase tracking-wider text-xs">Exclusions:</strong>
                                <p className="mb-4">The scope did not extend to the following:</p>
                                <ul className="space-y-2 list-none pl-0 text-[#0A1930]/80">
                                    {[
                                        "Tax structuring advisory;",
                                        "Off-balance sheet accounting assessments;",
                                        "Transaction-specific due diligence;",
                                        "Independent verification of collateral assets;",
                                        "Litigation risk analysis unrelated to documentation enforceability; and",
                                        "ESG advisory beyond clause-level alignment where relevant."
                                    ].map((exclusion, i) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <span className="font-bold text-[#009fe3] min-w-[20px]">({['i', 'ii', 'iii', 'iv', 'v', 'vi'][i]})</span>
                                            <span className="text-justify">{exclusion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </PageWrapper>

                {/* Section 2.4 Legal and Regulatory Framework - Page 6 */}
                <PageWrapper pageNumber="6" isCover={false} isBackCover={false}>
                    <div className="max-w-[210mm] w-full mx-auto bg-white p-16 relative text-[#0A1930] overflow-hidden flex flex-col flex-grow">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />
                        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify prose-li:text-justify">
                            <h3 id="scope-2.4" className="text-xl font-bold mb-3 scroll-mt-20">2.4. Legal and Regulatory Framework Considered</h3>
                            <p>The review was conducted with reference to applicable statutory, regulatory, and judicial authorities, including:</p>

                            <div className="mt-8 space-y-8">
                                <div>
                                    <h4 className="font-bold text-sm text-[#009fe3] uppercase mb-4 tracking-wide border-b border-[#009fe3]/20 pb-2">(A) Statutory and Regulatory Authorities</h4>
                                    <ul className="text-sm space-y-3 text-[#0A1930] list-none pl-0">
                                        {[
                                            "Nigeria Tax Act 2025",
                                            "Companies and Allied Matters Act (CAMA) 2020",
                                            "Banks and Other Financial Institutions Act (BOFIA) 2020"
                                        ].map((doc, idx) => (
                                            <li key={idx} className="flex items-center gap-3 group">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#009fe3] shadow-[0_0_8px_rgba(0,159,227,0.5)] shrink-0"></span>
                                                <a
                                                    href={idx === 0 ? "https://legal.merislabs.com/legal/nigeria-tax-act.pdf" :
                                                        idx === 1 ? "https://legal.merislabs.com/legal/cama.pdf" :
                                                            "https://legal.merislabs.com/legal/bofia.pdf"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-[#009fe3] transition-colors flex items-center gap-2 font-medium"
                                                >
                                                    {doc}
                                                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </li>
                                        ))}
                                        <li className="flex items-center gap-3 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#009fe3] shadow-[0_0_8px_rgba(0,159,227,0.5)] shrink-0"></span>
                                            <a
                                                href="/union-bank/cbn-prudential-guidelines-2019.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-[#009fe3] transition-colors flex items-center gap-2 font-medium"
                                            >
                                                CBN Prudential Guidelines for Deposit Money Banks in Nigeria 2019
                                                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </li>
                                        <li className="flex items-center gap-3 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#009fe3] shadow-[0_0_8px_rgba(0,159,227,0.5)] shrink-0"></span>
                                            <a
                                                href="/union-bank/cbn-consumer-protection-regulations-2019.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-[#009fe3] transition-colors flex items-center gap-2 font-medium"
                                            >
                                                CBN Customer Protection Regulations 2019
                                                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </li>
                                        <li className="flex items-center gap-3 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#009fe3] shadow-[0_0_8px_rgba(0,159,227,0.5)] shrink-0"></span>
                                            <a
                                                href="/union-bank/cbn-fx-manual-2018.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-[#009fe3] transition-colors flex items-center gap-2 font-medium"
                                            >
                                                CBN Trade and Exchange Department FX Manual 2018
                                                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </li>
                                        <li className="flex items-center gap-3 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#009fe3] shadow-[0_0_8px_rgba(0,159,227,0.5)] shrink-0"></span>
                                            <a
                                                href="/union-bank/cbn-guide-to-charges-2019.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-[#009fe3] transition-colors flex items-center gap-2 font-medium"
                                            >
                                                CBN Guide to Charges by Banks, other Financial and Non-Bank Financial Institutions 2019
                                                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </li>
                                        <li className="flex items-center gap-3 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#009fe3] shadow-[0_0_8px_rgba(0,159,227,0.5)] shrink-0"></span>
                                            <a
                                                href="/union-bank/cbn-new-offer-letter-clause-2019.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-[#009fe3] transition-colors flex items-center gap-2 font-medium"
                                            >
                                                CBN Letter to All Banks – New Offer Letter Clause for Credit Facilities 2019
                                                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </li>
                                        <li className="flex items-center gap-3 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#009fe3] shadow-[0_0_8px_rgba(0,159,227,0.5)] shrink-0"></span>
                                            <a
                                                href="/union-bank/cbn-aml-cft-regulations-2022.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-[#009fe3] transition-colors flex items-center gap-2 font-medium"
                                            >
                                                CBN (Anti Money Laundering Combating the Financing of Terrorism and Countering Proliferation Financing of Weapons of Mass Destruction in Financial Institutions) Regulations 2022
                                                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-sm text-[#009fe3] uppercase mb-4 tracking-wide border-b border-[#009fe3]/20 pb-2">(B) Judicial Authorities</h4>
                                    <ul className="text-sm space-y-3 text-[#0A1930] list-none pl-0 italic">
                                        <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px] text-[#009fe3]">(I)</span> <span>UBA Plc v Midas Samdra Nig. Limited (2020) LPELR-51254 (CA)</span></li>
                                        <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px] text-[#009fe3]">(II)</span> <span>First Bank v. Pan Bisbilder (1990) 2 NWLR (Pt. 134) 647 C.A</span></li>
                                        <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px] text-[#009fe3]">(III)</span> <span>F.B.N. (Nig.) Ltd. v. Osunsedo (1997) 11 NWLR (Pt. 527) 132 C.A</span></li>
                                        <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px] text-[#009fe3]">(IV)</span> <span>Thor Ltd v. FCMB Ltd (2005) LPELR-3242 (SC)</span></li>
                                        <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px] text-[#009fe3]">(V)</span> <span>Owena Mass Transportation Co. Ltd v. Enterprise Bank (2014) LPELR-22100 (CA)</span></li>
                                        <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px] text-[#009fe3]">(VI)</span> <span>Everly United Associates Ltd. & Anor v FBN LTD. (2025) LPELR- 81736 (CA)</span></li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </PageWrapper>

                {/* Key Findings - Page 7 */}
                <PageWrapper pageNumber="7" isCover={false} isBackCover={false}>
                    <KeyFindingsPage1 />
                </PageWrapper>

                {/* Key Findings continued - Page 8 */}
                <PageWrapper pageNumber="8" isCover={false} isBackCover={false}>
                    <KeyFindingsPage2 />
                </PageWrapper>

                {/* Key Findings continued - Page 9 */}
                <PageWrapper pageNumber="9" isCover={false} isBackCover={false}>
                    <KeyFindingsPage3 />
                </PageWrapper>

                {/* Key Findings continued - Page 10 */}
                <PageWrapper pageNumber="10" isCover={false} isBackCover={false}>
                    <KeyFindingsPage4 />
                </PageWrapper>

                {/* Analysis - Page 11 */}
                <PageWrapper pageNumber="11" isCover={false} isBackCover={false}>
                    <Analysis />
                </PageWrapper>

                {/* Risk Considerations - Page 12 */}
                <PageWrapper pageNumber="12" isCover={false} isBackCover={false}>
                    <RiskConsiderations />
                </PageWrapper>

                {/* Recommendations - Page 13 */}
                <PageWrapper pageNumber="13" isCover={false} isBackCover={false}>
                    <Recommendations />
                </PageWrapper>

                {/* Section 6.3 Implementation Timelines - Page 14 */}
                <PageWrapper pageNumber="14" isCover={false} isBackCover={false}>
                    <div className="max-w-[210mm] w-full mx-auto bg-white p-16 relative text-[#0A1930] overflow-hidden flex flex-col flex-grow">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

                        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify font-sans relative z-10">
                            <h3 id="roadmap" className="text-xl font-bold mb-4 text-[#0A1930] scroll-mt-20">6.3. Implementation Timelines</h3>

                            <p className="mb-8">
                                We recommend the following phased implementation approach:
                            </p>

                            <ImplementationRoadmap />
                        </div>
                    </div>
                </PageWrapper>

                {/* Conclusion - Page 15 */}
                <PageWrapper pageNumber="15" isCover={false} isBackCover={false}>
                    <Conclusion />
                </PageWrapper>

                {/* Back Cover - No page number or footer */}
                <PageWrapper pageNumber="16" isCover={false} isBackCover={true}>
                    <BackCover />
                </PageWrapper>
            </div>
        </div>
    );
}
