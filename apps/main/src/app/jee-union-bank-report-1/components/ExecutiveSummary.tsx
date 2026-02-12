'use client';

import React from 'react';
import { FileText } from 'lucide-react';

export const ExecutiveSummary = () => {
    return (
        <div id="summary" className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl p-16 mb-12 print:mb-0 print:shadow-none print:break-after-page min-h-[297mm] relative text-[#0A1930] shrink-0 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-8 border-b border-[#009fe3]/30 pb-4 relative z-10">
                <h2 className="text-3xl font-serif font-bold text-[#0A1930]">1. EXECUTIVE SUMMARY</h2>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify font-sans relative z-10 prose-li:text-justify">
                <p className="text-lg leading-relaxed font-medium">
                    <strong>Jackson, Etti & Edu</strong> was engaged by <strong>Union Bank of Nigeria Plc</strong> ("the Bank") to undertake a comprehensive review and standardisation of its credit and collateral documentation suite.
                </p>
                <p>
                    This exercise was necessitated by the evolving regulatory landscape, recent judicial authorities on banker–customer relationships and enforceability of securities, and Industry best practices within the Nigerian and international banking markets.
                </p>
                <p>
                    Onerous provisions were refined, ambiguities clarified, and drafting inconsistencies harmonised to ensure clearer risk allocation, improved operational usability, and stronger litigation resilience.
                </p>

                <div className="bg-[#0A1930]/5 border-l-4 border-[#0A1930] p-6 my-8 rounded-r-lg">
                    <h3 className="text-[#0A1930] font-bold text-lg mt-0 mb-3">Following completion of the review, we are satisfied that the revised documentation suite reflects:</h3>
                    <ul className="m-0 pl-0 space-y-2 list-none">
                        <li className="flex gap-2"><strong>i)</strong> <span>A unified and internally consistent structure;</span></li>
                        <li className="flex gap-2"><strong>ii)</strong> <span>Enhanced clarity of commercial and risk terms;</span></li>
                        <li className="flex gap-2"><strong>iii)</strong> <span>Improved regulatory alignment; and</span></li>
                        <li className="flex gap-2"><strong>iv)</strong> <span>Greater robustness against current judicial, regulatory, and market realities.</span></li>
                    </ul>
                </div>

                <p className="italic text-gray-600">
                    We also recommend the institutionalisation of a structured governance framework to preserve the integrity of the revised suite, including periodic reviews, regulatory monitoring, and targeted staff training.
                </p>
            </div>
        </div>
    );
};
