'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Analysis = () => {
    return (
        <div id="analysis" className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl p-16 mb-12 print:mb-0 print:shadow-none print:break-after-page min-h-[297mm] relative text-[#0A1930] shrink-0">
            <div className="flex items-center gap-3 mb-8 border-b border-[#C8B273]/30 pb-4">
                <AlertTriangle className="w-8 h-8 text-[#C8B273]" />
                <h2 className="text-3xl font-serif font-bold text-[#0A1930]">4. ANALYSIS</h2>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify">

                <p>
                    The amendments were necessitated by evolving regulatory directives, changes in jurisprudence regarding banker-customer contracts, the Bank’s post-merger documentation harmonisation needs, and emerging risks in credit operations, FX markets, and collateral enforcement.
                </p>
                <p>
                    The revised suite now constitutes a unified documentation ecosystem that eliminates duplication and drafting inconsistencies, strengthens security creation and enforcement mechanics, enhances clarity in borrower undertakings, and aligns FX exposure provisions with regulatory expectations.
                </p>
                <p>
                    The documentation now materially complies with:
                </p>
                <ol className="space-y-2 list-none pl-0">
                    <li className="flex gap-2"><strong>i)</strong> <span>CBN prudential and consumer-protection directives;</span></li>
                    <li className="flex gap-2"><strong>ii)</strong> <span>LMA standards;</span></li>
                    <li className="flex gap-2"><strong>iii)</strong> <span>NFIU documentation standards for financial institutions; and</span></li>
                    <li className="flex gap-2"><strong>iv)</strong> <span>Judicial standards requiring fairness of terms and clarity in loan transactions.</span></li>
                </ol>
            </div>
        </div>
    );
};
