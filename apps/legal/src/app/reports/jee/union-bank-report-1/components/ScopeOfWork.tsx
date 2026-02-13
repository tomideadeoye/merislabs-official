'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] aspect-square rounded-full border-[2px] border-[#E80000]" />
    </div>
);

export const ScopeOfWork = () => {
    return (
        <div id="scope" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow font-sans">
            <BackgroundPattern />

            <div className="flex items-center gap-4 mb-8 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">02</span>
                <h2 className="text-3xl font-serif font-black text-[#211B1B] uppercase">SCOPE OF WORK</h2>
            </div>

            <div className="prose prose-slate max-w-none relative z-10 flex flex-col gap-8">
                <div>
                    <h3 className="text-xl font-black text-[#211B1B] mb-4 uppercase">2.1. Nature of the Review</h3>
                    <p className="text-justify text-[#211B1B]/80 leading-relaxed text-lg">
                        The Firm conducted a full-scale review and standardisation of the Bank's facility and ancillary documentation. The process included clause-by-clause legal analysis, gap identification and risk mapping, regulatory compliance assessment, judicial enforceability review, benchmarking against LMA and industry standards, and harmonisation of definitions, representations, undertakings and enforcement provisions.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-black text-[#211B1B] mb-4 uppercase">2.2. Documents Reviewed</h3>
                    <p className="text-justify text-[#211B1B]/80 leading-relaxed text-lg mb-6">
                        A total of twenty-four (24) documents were reviewed, including multiple variants. These comprised:
                    </p>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-3 not-prose text-[13px] text-[#211B1B]">
                        <div className="space-y-3">
                            {[
                                { l: "a", t: "All Asset Debenture" },
                                { l: "c", t: "BOI Facility Agreement" },
                                { l: "e", t: "General Indemnity (3 variants)" },
                                { l: "g", t: "Letter of Consent to Register Tripartite Legal Mortgage" },
                                { l: "i", t: "Letter of Hypothecation (3 variants)" },
                                { l: "k", t: "Overdraft Agreement (3 variants)" },
                                { l: "m", t: "Undertaking to Domicile Sales Proceeds (2 variants)" }
                            ].map((item) => (
                                <div key={item.l} className="flex gap-3 items-start">
                                    <span className="font-black text-[#E80000] min-w-[24px] uppercase">{item.l})</span>
                                    <span className="leading-tight font-medium">{item.t}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            {[
                                { l: "b", t: "Bid Bond" },
                                { l: "d", t: "Consolidated FX Trade Master Agreement (2 variants)" },
                                { l: "f", t: "Irrevocable Undertaking for Domiciliation" },
                                { l: "h", t: "Letter of Domiciliation of Contract Proceeds" },
                                { l: "j", t: "Offer Letters (6 variants)" },
                                { l: "l", t: "Personal Guarantee" }
                            ].map((item) => (
                                <div key={item.l} className="flex gap-3 items-start">
                                    <span className="font-black text-[#E80000] min-w-[24px] uppercase">{item.l})</span>
                                    <span className="leading-tight font-medium">{item.t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ScopeAssumptions = () => {
    return (
        <div id="scope-assumptions" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow font-sans">
            <BackgroundPattern />

            <div className="prose prose-slate max-w-none relative z-10">
                <h3 className="text-xl font-black text-[#211B1B] mb-6 uppercase tracking-tight">2.3. Assumptions & Limitations</h3>
                <p className="text-justify text-[#211B1B]/80 leading-relaxed text-lg mb-8">
                    Our review was based solely on the documentation provided by the Bank, and we assumed such documentation to be authentic and complete. We further assumed that operational references within the templates accurately reflect current internal processes unless otherwise indicated.
                </p>

                <div className="bg-[#211B1B]/5 border-2 border-[#E80000]/10 p-8 rounded-xl relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-1 bg-[#E80000]"></div>
                        <span className="text-[#211B1B] font-black text-xs uppercase tracking-[0.2em]">Exclusions & Constraints</span>
                    </div>
                    <ul className="space-y-4 list-none pl-0 text-[#211B1B]/90 text-sm">
                        {[
                            "Tax structuring advisory;",
                            "Off-balance sheet accounting assessments;",
                            "Transaction-specific due diligence;",
                            "Independent verification of collateral assets;",
                            "Litigation risk analysis unrelated to documentation enforceability; and",
                            "ESG advisory beyond clause-level alignment where relevant."
                        ].map((exclusion, i) => (
                            <li key={i} className="flex gap-4 items-start">
                                <span className="font-black text-[#E80000] min-w-[24px]">({['i', 'ii', 'iii', 'iv', 'v', 'vi'][i]})</span>
                                <span className="text-justify leading-relaxed">{exclusion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export const ScopeFramework = () => {
    return (
        <div id="scope-framework" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow font-sans">
            <BackgroundPattern />

            <div className="prose prose-slate max-w-none relative z-10">
                <h3 className="text-xl font-black text-[#211B1B] mb-6 uppercase">2.4. Legal and Regulatory Framework Considered</h3>
                <p className="text-justify text-[#211B1B]/80 leading-relaxed text-lg mb-8">
                    The review was conducted with reference to applicable statutory, regulatory, and judicial authorities, including:
                </p>

                <div className="grid grid-cols-1 gap-12 mt-8">
                    <div className="space-y-6">
                        <h4 className="font-black text-xs text-[#E80000] uppercase tracking-wider border-b border-[#211B1B]/10 pb-2">Statutory & Regulatory Authorities</h4>
                        <ul className="text-sm space-y-4 text-[#211B1B] list-none pl-0">
                            {[
                                "Nigeria Tax Act 2025",
                                "Companies and Allied Matters Act (CAMA) 2020",
                                "Banks and Other Financial Institutions Act (BOFIA) 2020",
                                "CBN Prudential Guidelines for Deposit Money Banks 2019",
                                "CBN Customer Protection Regulations 2019",
                                "CBN Trade and Exchange Department FX Manual 2018",
                                "CBN Guide to Charges by Banks and Institutions 2019"
                            ].map((doc, idx) => (
                                <li key={idx} className="flex items-center gap-4 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#E80000] group-hover:scale-150 transition-transform"></div>
                                    <span className="font-bold border-b border-transparent hover:border-[#E80000] cursor-pointer transition-all">{doc}</span>
                                    <ExternalLink className="w-3 h-3 text-[#E80000] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black text-xs text-[#E80000] uppercase tracking-wider border-b border-[#211B1B]/10 pb-2">Significant Judicial Precedents</h4>
                        <ul className="text-sm space-y-4 text-[#211B1B] list-none pl-0 italic">
                            {[
                                "UBA Plc v Midas Samdra Nig. Limited (2020) LPELR-51254 (CA)",
                                "First Bank v. Pan Bisbilder (1990) 2 NWLR (Pt. 134) 647 C.A",
                                "F.B.N. (Nig.) Ltd. v. Osunsedo (1997) 11 NWLR (Pt. 527) 132 C.A",
                                "Thor Ltd v. FCMB Ltd (2005) LPELR-3242 (SC)",
                                "Owena Mass Transportation Co. Ltd v. Enterprise Bank (2014) LPELR-22100 (CA)",
                                "Everly United Associates Ltd. & Anor v FBN LTD. (2025) LPELR- 81736 (CA)"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="not-italic font-black min-w-[30px] text-[#E80000]">({['i', 'ii', 'iii', 'iv', 'v', 'vi'][i]})</span>
                                    <span className="text-justify leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
