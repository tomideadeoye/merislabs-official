'use client';

import React from 'react';
import { Search, CheckCircle2 } from 'lucide-react';

export const Analysis = () => {
    return (
        <div id="analysis" className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl p-16 mb-12 print:mb-0 print:shadow-none print:break-after-page min-h-[297mm] relative text-[#0A1930] shrink-0 overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-10 border-b-2 border-[#009fe3] pb-4 relative z-10">
                <h2 className="text-3xl font-serif font-bold text-[#0A1930]">4. ANALYSIS</h2>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify relative z-10">
                <p className="text-lg leading-relaxed text-slate-700">
                    The amendments were necessitated by evolving regulatory directives, changes in jurisprudence regarding banker-customer contracts, the Bank’s post-merger documentation harmonisation needs, and emerging risks in credit operations, FX markets, and collateral enforcement.
                </p>

                {/* Highlight Box */}
                <div className="my-10 p-8 bg-[#0A1930] text-white rounded-xl shadow-lg border-l-8 border-[#009fe3] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle2 className="w-32 h-32 text-white" />
                    </div>
                    <h3 className="text-[#009fe3] font-bold text-lg mb-3 uppercase tracking-wider">Outcome</h3>
                    <p className="text-white/90 text-lg leading-relaxed m-0 relative z-10 font-medium">
                        "The revised suite now constitutes a unified documentation ecosystem that eliminates duplication and drafting inconsistencies, strengthens security creation and enforcement mechanics, enhances clarity in borrower undertakings, and aligns FX exposure provisions with regulatory expectations."
                    </p>
                </div>

                <div className="mt-12">
                    <p className="font-bold text-[#0A1930] text-xl mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-[#009fe3] rounded-full inline-block"></span>
                        The documentation now materially complies with:

                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                        {/* Card 1: CBN */}
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-md transition-shadow group cursor-default">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#009fe3]/10 rounded-lg group-hover:bg-[#009fe3]/20 transition-colors w-12 h-12 flex items-center justify-center">
                                    <span className="font-serif font-bold text-xl text-[#0A1930]">A</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">CBN prudential and consumer-protection directives</p>
                            </div>
                        </div>

                        {/* Card 2: LMA */}
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-md transition-shadow group cursor-default">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#009fe3]/10 rounded-lg group-hover:bg-[#009fe3]/20 transition-colors w-12 h-12 flex items-center justify-center">
                                    <span className="font-serif font-bold text-xl text-[#0A1930]">B</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">LMA standards</p>
                            </div>
                        </div>

                        {/* Card 3: NFIU */}
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-md transition-shadow group cursor-default">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#009fe3]/10 rounded-lg group-hover:bg-[#009fe3]/20 transition-colors w-12 h-12 flex items-center justify-center">
                                    <span className="font-serif font-bold text-xl text-[#0A1930]">C</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">NFIU documentation standards for financial institutions</p>
                            </div>
                        </div>

                        {/* Card 4: Judicial */}
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-md transition-shadow group cursor-default">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#009fe3]/10 rounded-lg group-hover:bg-[#009fe3]/20 transition-colors w-12 h-12 flex items-center justify-center">
                                    <span className="font-serif font-bold text-xl text-[#0A1930]">D</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">Judicial standards requiring fairness of terms and clarity in loan transactions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
