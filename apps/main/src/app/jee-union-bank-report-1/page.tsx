'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { TableOfContents } from './components/TableOfContents';
import { CoverPage } from './components/CoverPage';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { ScopeOfWork } from './components/ScopeOfWork';
import { KeyFindings } from './components/KeyFindings';
import { Analysis } from './components/AnalysisAndRecommendations';
import { RiskConsiderations } from './components/RiskConsiderations';
import { Recommendations } from './components/Recommendations';
import { Conclusion } from './components/Conclusion';
import { BackCover } from './components/BackCover';

export default function UnionBankReportPage() {
    return (
        <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto print:static print:bg-white print:overflow-visible">
            {/* Print Cleanup Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 12mm 12mm 20mm 12mm;
                        @bottom-right {
                            content: counter(page);
                            font-family: serif;
                            font-size: 10px;
                            color: #94a3b8;
                        }
                    }
                    @page :first {
                        margin: 0 !important;
                        @bottom-right { content: none !important; }
                    }

                    /* Named page for full-bleed back cover */
                    @page fullbleed {
                        margin: 0 !important;
                        @bottom-right { content: none !important; }
                    }

                    .back-cover-print {
                        page: fullbleed;
                    }

                    main { padding-top: 0 !important; }
                    body { background: white !important; }
                    header, .print-hidden { display: none !important; }
                }
            ` }} />

            {/* Print Control FAB - Fixed relative to viewport */}
            <button
                onClick={() => window.print()}
                className="fixed bottom-8 right-8 bg-[#0A1930] text-white p-4 rounded-full shadow-2xl hover:bg-[#C8B273] transition-colors z-[10000] print:hidden flex items-center gap-2 cursor-pointer"
                title="Print / Save as PDF"
            >
                <Printer className="w-6 h-6" />
                <span className="font-bold pr-2">Print Dossier</span>
            </button>

            {/* Scrollable Content Container */}
            <div className="min-h-full w-full flex flex-col items-center p-8 print:p-0 print:block">
                <CoverPage />
                <TableOfContents />
                <ExecutiveSummary />
                <ScopeOfWork />
                <KeyFindings />
                <Analysis />
                <RiskConsiderations />
                <Recommendations />
                <Conclusion />
                <BackCover />
            </div>
        </div>
    );
}
