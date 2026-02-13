'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllCases, highClaimCases } from '@merislabs/data';
import {
    sectionOrder,
    sectionLabels,
    sortByRisk,
    getClaimValue,
    getCurrency,
    getCategory,
    getStatus
} from './utils';
import PrintGlobalStyles from './components/PrintGlobalStyles';
import CoverPage from './components/CoverPage';
import TableOfContents, { TocItem, TocPageData } from './components/TableOfContents';
import SectionCover from './components/SectionCover';
import CaseCard from './components/CaseCard';
import AppendixASummary from './components/appendices/AppendixASummary';
import AppendixBLowValue from './components/appendices/AppendixBLowValue';
import AppendixCLitigationThemes from './components/appendices/AppendixCLitigationThemes';
import AppendixDDormant from './components/appendices/AppendixDDormant';
import AppendixEPending from './components/appendices/AppendixEPending';
import AppendixFBlacklisted from './components/appendices/AppendixFBlacklisted';
import BackCover from './components/BackCover';

export default function PrintAllCasesContent() {
    console.log('[PRINT_ALL_CASES] Initializing PrintAllCasesPage component');
    const searchParams = useSearchParams();
    const shouldAutoPrint = searchParams.get('autoPrint') === 'true';

    useEffect(() => {
        // DEBUG: Log DOM structure to find the blank page culprit
        console.log('=== PRINT DEBUG START ===');

        if (shouldAutoPrint) {
            // Small delay to ensure styles are loaded
            const timer = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [shouldAutoPrint]);

    // Get and group cases by section in display order
    const rawCases = getAllCases();
    const priorityCases = highClaimCases.map((c: any) => ({
        ...c,
        section: 'priority-matters',
    }));

    const grouped = sectionOrder.map(key => {
        const items = key === 'priority-matters'
            ? priorityCases.slice()
            : rawCases.filter((c: any) => c.section === key);
        items.sort(sortByRisk);
        return {
            key,
            label: sectionLabels[key],
            items,
        };
    }).filter(g => g.items.length > 0);

    // Unique cases = all cases EXCEPT the 'priority-matters' section (which are duplicates)
    const uniqueRawCases = rawCases.filter((c: any) => c.section !== 'priority-matters');
    const allCasesForAppendix = uniqueRawCases;

    const totalCases = allCasesForAppendix.length;
    const claimsByCurrency: Record<string, { count: number; total: number }> = {};
    let unascertainedCasesCount = 0;

    allCasesForAppendix.forEach((c: any) => {
        const currency = getCurrency(c);
        const value = getClaimValue(c);

        if (currency === 'Unascertained' || value <= 0) {
            unascertainedCasesCount++;
            return;
        }

        if (!claimsByCurrency[currency]) {
            claimsByCurrency[currency] = { count: 0, total: 0 };
        }
        claimsByCurrency[currency].count++;
        claimsByCurrency[currency].total += value;
    });

    const priorityClaimsByCurrency: Record<string, { count: number; total: number }> = {};
    priorityCases.forEach((c: any) => {
        const currency = getCurrency(c);
        const value = getClaimValue(c);
        if (!priorityClaimsByCurrency[currency]) {
            priorityClaimsByCurrency[currency] = { count: 0, total: 0 };
        }
        priorityClaimsByCurrency[currency].count++;
        if (value > 0) {
            priorityClaimsByCurrency[currency].total += value;
        }
    });

    const LOW_VALUE_THRESHOLD = 15_000_000;
    const casesWithClaims = allCasesForAppendix
        .filter((c: any) => getClaimValue(c) > 0)
        .map((c: any) => ({ ...c, _claimValue: getClaimValue(c), _currency: getCurrency(c) }));
    const lowValueCases = casesWithClaims
        .filter((c: any) => c._currency === 'NGN' && c._claimValue <= LOW_VALUE_THRESHOLD)
        .sort((a, b) => a._claimValue - b._claimValue);

    const themeGroups: Record<string, {
        againstBank: { count: number; ngnTotal: number; usdTotal: number };
        forBank: { count: number; ngnTotal: number; usdTotal: number };
    }> = {};

    allCasesForAppendix.forEach((c: any) => {
        const category = getCategory(c);
        const section = c.section || c.ReportSection || '';
        const isAgainstBank = section.includes('against') || section.includes('matters-against');
        const currency = getCurrency(c);
        const value = getClaimValue(c);

        if (!themeGroups[category]) {
            themeGroups[category] = {
                againstBank: { count: 0, ngnTotal: 0, usdTotal: 0 },
                forBank: { count: 0, ngnTotal: 0, usdTotal: 0 },
            };
        }

        const bucket = isAgainstBank ? themeGroups[category].againstBank : themeGroups[category].forBank;
        bucket.count++;
        if (currency === 'USD') {
            bucket.usdTotal += value;
        } else {
            bucket.ngnTotal += value;
        }
    });

    const dormantCases = allCasesForAppendix.filter((c: any) =>
        getStatus(c).includes('dormant')
    );

    const pendingCases = allCasesForAppendix.filter((c: any) =>
        getStatus(c).includes('pending')
    );

    const blacklistedCases = allCasesForAppendix.filter((c: any) => {
        const status = getStatus(c);
        return status.includes('abeyance') ||
            status.includes('struck out') ||
            status.includes('abandoned') ||
            status.includes('concluded') ||
            status.includes('settled');
    });

    const ENTRIES_PER_TOC_PAGE = 49;
    const tocItems: TocItem[] = [];

    grouped.forEach(g => {
        tocItems.push({ type: 'section', label: g.label, pageNumber: 0, id: g.key });
        g.items.forEach((c: any, idx: number) => {
            const title = c.Parties || c.parties || c.SuitNo || c.suitNo || `Case ${idx + 1}`;
            const caseId = c.CaseID || c.id;
            tocItems.push({
                type: 'case',
                label: title,
                pageNumber: 0,
                id: `${g.key}-${caseId}`
            });
        });
    });

    const ROWS_PER_PAGE = 25;
    const appendixPageCounts = {
        a: 1,
        b: Math.max(1, Math.ceil(lowValueCases.length / ROWS_PER_PAGE)),
        c: 1,
        d: Math.max(1, Math.ceil(dormantCases.length / ROWS_PER_PAGE)),
        e: Math.max(1, Math.ceil(pendingCases.slice(0, 50).length / ROWS_PER_PAGE)),
        f: Math.max(1, Math.ceil(blacklistedCases.length / ROWS_PER_PAGE)),
    };

    tocItems.push({ type: 'section', label: 'APPENDIX A: SUMMARY STATISTICS', pageNumber: 0, id: 'appendix-a', isFirstInSection: true });
    tocItems.push({ type: 'section', label: 'APPENDIX B: LOW-VALUE CLAIMS', pageNumber: 0, id: 'appendix-b' });
    tocItems.push({ type: 'section', label: 'APPENDIX C: LITIGATION THEMES', pageNumber: 0, id: 'appendix-c' });
    tocItems.push({ type: 'section', label: 'APPENDIX D: DORMANT MATTERS', pageNumber: 0, id: 'appendix-d' });
    tocItems.push({ type: 'section', label: 'APPENDIX E: PENDING MATTERS', pageNumber: 0, id: 'appendix-e' });
    tocItems.push({ type: 'section', label: 'APPENDIX F: ABANDONED/CONCLUDED MATTERS', pageNumber: 0, id: 'appendix-f' });
    tocItems.push({ type: 'section', label: 'RELIANCE & CONFIDENTIALITY CLAUSES', pageNumber: 0, id: 'legal-clauses' });

    const tocPageCount = Math.ceil(tocItems.length / ENTRIES_PER_TOC_PAGE);
    let currentPage = 2 + tocPageCount;
    let tocItemIndex = 0;

    grouped.forEach(g => {
        if (tocItems[tocItemIndex]) {
            tocItems[tocItemIndex].pageNumber = currentPage;
        }
        tocItemIndex++;
        currentPage++;
        g.items.forEach(() => {
            if (tocItems[tocItemIndex]) {
                tocItems[tocItemIndex].pageNumber = currentPage;
            }
            tocItemIndex++;
            currentPage++;
        });
    });

    const appendixKeys = ['a', 'b', 'c', 'd', 'e', 'f'] as const;
    appendixKeys.forEach(key => {
        if (tocItems[tocItemIndex]) {
            tocItems[tocItemIndex].pageNumber = currentPage;
            currentPage += appendixPageCounts[key];
            tocItemIndex++;
        }
    });

    const tocPages: TocPageData[] = [];
    for (let i = 0; i < tocPageCount; i++) {
        const start = i * ENTRIES_PER_TOC_PAGE;
        const end = start + ENTRIES_PER_TOC_PAGE;
        tocPages.push({
            pageNumber: 2 + i,
            items: tocItems.slice(start, end)
        });
    }

    return (
        <>
            <PrintGlobalStyles />
            <CoverPage />
            <div className="print-container" style={{ pageBreakBefore: 'always' }}>
                <div className="no-print flex gap-4 mb-4 items-center justify-center w-full">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-400 font-medium px-4 py-2 rounded" onClick={() => window.print()}>
                        Print (Browser)
                    </button>
                    <a
                        href="/Ecobank_Litigation_Audit_Report_2025.pdf"
                        download="Ecobank_Litigation_Audit_Report_2025.pdf"
                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded shadow flex items-center gap-2"
                        style={{ textDecoration: 'none' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download Final Report
                    </a>
                </div>

                <div className="page-footer">
                    <img src="/law-firm-logo/jackson etti and edu logo.png" alt="Jackson, Etti & Edu" style={{ height: '30px', width: 'auto' }} />
                    <img src="/client-logo/Ecobank_Logo.svg.png" alt="Ecobank" style={{ height: '30px', width: 'auto' }} />
                </div>

                <TableOfContents pages={tocPages} />

                {grouped.map((g, index) => (
                    <div key={g.key}>
                        <SectionCover
                            sectionKey={g.key}
                            label={g.label}
                            index={index}
                            itemCount={g.items.length}
                        />
                        {g.items.map((caseItem: any, idx: number) => (
                            <CaseCard
                                key={idx}
                                caseItem={caseItem}
                                sectionKey={g.key}
                            />
                        ))}
                    </div>
                ))}

                <div id="section-appendix-a">
                    <AppendixASummary
                        totalCases={totalCases}
                        claimsByCurrency={claimsByCurrency}
                        priorityClaimsByCurrency={priorityClaimsByCurrency}
                        priorityCasesCount={priorityCases.length}
                        pendingCasesCount={pendingCases.length}
                        dormantCasesCount={dormantCases.length}
                        unascertainedCasesCount={unascertainedCasesCount}
                        grouped={grouped}
                    />
                </div>

                <div id="section-appendix-b">
                    <AppendixBLowValue lowValueCases={lowValueCases} />
                </div>

                <div id="section-appendix-c">
                    <AppendixCLitigationThemes themeGroups={themeGroups} />
                </div>

                <div id="section-appendix-d">
                    <AppendixDDormant dormantCases={dormantCases} />
                </div>

                <div id="section-appendix-e">
                    <AppendixEPending pendingCases={pendingCases} />
                </div>

                <div id="section-appendix-f">
                    <AppendixFBlacklisted blacklistedCases={blacklistedCases} />
                </div>
            </div>
            <BackCover />
        </>
    );
}
