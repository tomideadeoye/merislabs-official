'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { JEE_WEBSITE_URL } from '../../constants';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] aspect-square rounded-full border-[2px] border-[#E80000]" />
    </div>
);

export const ExecutiveSummary = () => {
    return (
        <div id="summary" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BackgroundPattern />

            <div className="flex items-center gap-4 mb-8 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">01</span>
                <h2 className="text-3xl font-serif font-black text-[#211B1B] uppercase no-justify">EXECUTIVE SUMMARY</h2>
            </div>

            <div className="prose prose-slate max-w-none relative z-10 flex flex-col gap-6">
                <p className="text-lg leading-relaxed text-[#211B1B] text-justify">
                    <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="text-[#211B1B] font-bold hover:text-[#E80000] transition-colors underline decoration-[#E80000]/30 hover:decoration-[#E80000] underline-offset-4">Jackson, Etti & Edu</a> was engaged by <strong>Union Bank of Nigeria Plc</strong> ("the Bank") to undertake a comprehensive review and standardisation of its credit and collateral documentation suite.
                </p>
                <p className="text-justify text-[#211B1B]/80 leading-relaxed text-lg">
                    This exercise was necessitated by the evolving regulatory landscape, recent judicial authorities on banker–customer relationships and enforceability of securities, and Industry best practices within the Nigerian and international banking markets.
                </p>
                <p className="text-justify text-[#211B1B]/80 leading-relaxed text-lg">
                    Onerous provisions were refined, ambiguities clarified, and drafting inconsistencies harmonised to ensure clearer risk allocation, improved operational usability, and stronger litigation resilience.
                </p>

                <div className="bg-[#211B1B]/5 border-l-4 border-[#E80000] p-8 my-4 rounded-r-xl">
                    <h3 className="text-[#211B1B] font-black text-xl mt-0 mb-6 uppercase no-justify">Outcome Satisfaction Checklist</h3>
                    <ul className="m-0 pl-0 space-y-4 list-none text-lg">
                        {[
                            "A unified and internally consistent structure;",
                            "Enhanced clarity of commercial and risk terms;",
                            "Improved regulatory alignment; and",
                            "Greater robustness against current judicial, regulatory, and market realities."
                        ].map((item, i) => (
                            <li key={i} className="flex gap-4 items-start">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-[#E80000] shrink-0"></div>
                                <span className="text-justify font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="italic text-[#211B1B]/60 text-lg border-t border-[#211B1B]/10 pt-6 text-justify">
                    We also recommend the institutionalisation of a structured governance framework to preserve the integrity of the revised suite, including periodic reviews, regulatory monitoring, and targeted staff training.
                </p>
            </div>
        </div>
    );
};
