'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] aspect-square rounded-full border-[2px] border-[#E80000]" />
    </div>
);

export const Analysis = () => {
    return (
        <div id="analysis" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BackgroundPattern />

            <div className="flex items-center gap-4 mb-8 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">04</span>
                <h2 className="text-3xl font-serif font-black text-[#211B1B] uppercase no-justify">ANALYSIS</h2>
            </div>

            <div className="relative z-10 space-y-8 flex flex-col">
                <p className="text-lg leading-relaxed text-[#211B1B]/80 text-justify">
                    The amendments were necessitated by evolving regulatory directives, changes in jurisprudence regarding banker-customer contracts, the Bank's post-merger documentation harmonisation needs, and emerging risks in credit operations, FX markets, and collateral enforcement.
                </p>

                {/* Highlight Box - JEE Implementation */}
                <div className="my-8 p-10 bg-[#211B1B] text-white rounded-2xl shadow-2xl border-l-[12px] border-[#E80000] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CheckCircle2 className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-white font-black text-xs mb-6 uppercase tracking-wider border-b border-white/10 pb-2 w-fit">
                            Review Outcome
                        </h3>
                        <p className="text-white text-lg leading-relaxed m-0 text-justify">
                            The revised suite now constitutes a unified documentation ecosystem that eliminates duplication and drafting inconsistencies, strengthens security creation and enforcement mechanics, enhances clarity in borrower undertakings, and aligns FX exposure provisions with regulatory expectations.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-1 bg-[#E80000]"></div>
                        <p className="font-black text-[#211B1B] text-xs uppercase tracking-[0.3em]">Compliance Benchmarks Met</p>
                    </div>

                    <ul className="space-y-3 list-none pl-0">
                        {[
                            'CBN Prudential and Consumer-Protection Directives',
                            'LMA International Standards',
                            'NFIU Documentation Standards',
                            'Judicial Standards on Fairness and Clarity'
                        ].map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E80000] mt-2 shrink-0"></div>
                                <span className="text-[15px] font-bold text-[#211B1B]/80 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
