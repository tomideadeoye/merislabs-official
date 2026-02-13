'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const Analysis = () => {
    return (
        <div id="analysis" className="max-w-[210mm] w-full mx-auto bg-white p-16 relative text-[#0A1930] overflow-hidden flex-grow">

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-8 border-b-2 border-[#009fe3] pb-4 relative z-10">
                <h2 className="text-3xl font-serif font-bold text-[#0A1930]">4. ANALYSIS</h2>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] relative z-10 text-justify">
                <p className="text-base leading-relaxed text-slate-700 text-justify">
                    The amendments were necessitated by evolving regulatory directives, changes in jurisprudence regarding banker-customer contracts, the Bank&apos;s post-merger documentation harmonisation needs, and emerging risks in credit operations, FX markets, and collateral enforcement.
                </p>

                {/* Highlight Box - Inverted Colors */}
                <div className="my-8 p-6 bg-[#009fe3] text-white rounded-xl shadow-lg border-l-8 border-[#0A1930] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle2 className="w-24 h-24 text-[#0A1930]" />
                    </div>
                    <h3 className="text-white font-black text-base mb-2 uppercase tracking-wider opacity-80">Outcome</h3>
                    <p className="text-white text-base leading-relaxed m-0 relative z-10 font-semibold text-justify">
                        The revised suite now constitutes a unified documentation ecosystem that eliminates duplication and drafting inconsistencies, strengthens security creation and enforcement mechanics, enhances clarity in borrower undertakings, and aligns FX exposure provisions with regulatory expectations.
                    </p>
                </div>

                <div className="mt-8">
                    <p className="font-bold text-[#0A1930] text-lg mb-5 flex items-center gap-2">
                        <span className="w-2 h-8 bg-[#009fe3] rounded-full inline-block"></span>
                        The documentation now materially complies with:
                    </p>

                    <div className="space-y-4 not-prose">
                        {[
                            { letter: 'A', text: 'CBN prudential and consumer-protection directives' },
                            { letter: 'B', text: 'LMA standards' },
                            { letter: 'C', text: 'NFIU documentation standards for financial institutions' },
                            { letter: 'D', text: 'Judicial standards requiring fairness of terms and clarity in loan transactions' }
                        ].map((item, index) => (
                            <div key={index} className="p-4 bg-white border border-slate-200 rounded-lg group hover:border-[#0A1930]/30 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-[#0A1930] rounded-lg w-10 h-10 flex items-center justify-center shrink-0 border border-[#0A1930]/20">
                                        <span className="font-serif font-bold text-lg text-white">{item.letter}</span>
                                    </div>
                                    <p className="text-[15px] font-medium text-[#0A1930] leading-tight">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
