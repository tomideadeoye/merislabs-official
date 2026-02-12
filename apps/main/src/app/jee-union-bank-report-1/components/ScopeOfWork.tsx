'use client';

import React from 'react';
import { Search, ExternalLink } from 'lucide-react';

export const ScopeOfWork = () => {
    return (
        <div id="scope" className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl p-16 mb-12 print:mb-0 print:shadow-none print:break-after-page min-h-[297mm] relative text-[#0A1930] shrink-0">
            <div className="flex items-center gap-3 mb-8 border-b border-[#C8B273]/30 pb-4">
                <Search className="w-8 h-8 text-[#C8B273]" />
                <h2 className="text-3xl font-serif font-bold text-[#0A1930]">2. SCOPE OF WORK</h2>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930]">
                <h3 className="text-xl font-bold mt-6 mb-3">2.1. Nature of the Review</h3>
                <p>
                    The Firm conducted a full-scale review and standardisation of the Bank’s facility and ancillary documentation. The process included clause-by-clause legal analysis, gap identification and risk mapping, regulatory compliance assessment, judicial enforceability review, benchmarking against LMA and industry standards, and harmonisation of definitions, representations, undertakings and enforcement provisions.
                </p>
                <p>
                    The review was undertaken in alignment with the Bank’s strategic priorities, including documentation harmonisation and enhanced credit governance.
                </p>

                <h3 className="text-xl font-bold mt-8 mb-3">2.2. Documents Reviewed</h3>
                <p>A total of twenty-six (26) documents were reviewed, including multiple variants. These comprised:</p>
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

                <h3 className="text-xl font-bold mt-8 mb-3">2.3. Assumptions & Limitations</h3>
                <p>
                    Our review was based solely on the documentation provided by the Bank, and we assumed such documentation to be authentic and complete. We further assumed that operational references within the templates accurately reflect current internal processes unless otherwise indicated.
                </p>
                <div className="bg-[#C8B273]/10 p-4 rounded text-sm border border-[#C8B273]/20">
                    <strong>Exclusions:</strong> The scope did not extend to (i) Tax structuring advisory; (ii) Off-balance sheet accounting assessments; (iii) Transaction-specific due diligence; (iv) Independent verification of collateral assets; (v) Litigation risk analysis unrelated to documentation enforceability; and (vi) ESG advisory beyond clause-level alignment where relevant.
                </div>

                <h3 className="text-xl font-bold mt-8 mb-3">2.4. Legal and Regulatory Framework Considered</h3>
                <p>The review was conducted with reference to applicable statutory, regulatory, and judicial authorities, including:</p>

                <div className="mt-4 space-y-6">
                    <div>
                        <h4 className="font-bold text-sm text-[#C8B273] uppercase mb-3 tracking-wide">(A) Statutory and Regulatory Authorities</h4>
                        <ul className="text-xs space-y-2 text-[#0A1930] list-none pl-0">
                            <li className="flex gap-2"><span>•</span> <a href="https://legal.merislabs.com/legal/NIGERIA-TAX-ACT-2025.pdf" target="_blank" className="text-[#C8B273] font-bold hover:underline decoration-1 underline-offset-2 flex items-center gap-1">Nigeria Tax Act, 2025 <ExternalLink className="w-3 h-3" /></a></li>
                            <li className="flex gap-2"><span>•</span> <a href="https://legal.merislabs.com/legal/CAMA-2020.pdf" target="_blank" className="text-[#C8B273] font-bold hover:underline decoration-1 underline-offset-2 flex items-center gap-1">Companies and Allied Matters Act (CAMA), 2020 <ExternalLink className="w-3 h-3" /></a></li>
                            <li className="flex gap-2"><span>•</span> <a href="https://legal.merislabs.com/legal/BOFIA-2020-GAZETTE.pdf" target="_blank" className="text-[#C8B273] font-bold hover:underline decoration-1 underline-offset-2 flex items-center gap-1">Banks and Other Financial Institutions Act (BOFIA), 2020 <ExternalLink className="w-3 h-3" /></a></li>
                            <li className="flex gap-2"><span>•</span> <span>CBN Prudential Guidelines for Deposit Money Banks in Nigeria, 2019</span></li>
                            <li className="flex gap-2"><span>•</span> <span>CBN Customer Protection Regulations, 2019</span></li>
                            <li className="flex gap-2"><span>•</span> <span>CBN Trade and Exchange Department FX Manual, 2018</span></li>
                            <li className="flex gap-2"><span>•</span> <span>CBN Guide to Charges by Banks, other Financial and Non-Bank Financial Institutions, 2019</span></li>
                            <li className="flex gap-2"><span>•</span> <span>CBN Letter to All Banks – New Offer Letter Clause for Credit Facilities, 2019</span></li>
                            <li className="flex gap-2"><span>•</span> <span>CBN (Anti Money Laundering, Combating the Financing of Terrorism and Countering Proliferation Financing of Weapons of Mass Destruction in Financial Institutions) Regulations, 2022</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm text-[#C8B273] uppercase mb-3 tracking-wide">(B) Judicial Authorities</h4>
                        <ul className="text-xs space-y-2 text-[#0A1930] list-none pl-0 italic">
                            <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px]">(I)</span> <span>UBA Plc v Midas Samdra Nig. Limited (2020) LPELR-51254 (CA)</span></li>
                            <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px]">(II)</span> <span>First Bank v. Pan Bisbilder (1990) 2 NWLR (Pt. 134) 647 C.A</span></li>
                            <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px]">(III)</span> <span>F.B.N. (Nig.) Ltd. v. Osunsedo (1997) 11 NWLR (Pt. 527) 132 C.A</span></li>
                            <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px]">(IV)</span> <span>Thor Ltd v. FCMB Ltd (2005) LPELR-3242 (SC)</span></li>
                            <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px]">(V)</span> <span>Owena Mass Transportation Co. Ltd v. Enterprise Bank (2014) LPELR-22100 (CA);</span></li>
                            <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px]">(VI)</span> <span>Everly United Associates Ltd. & Anor v FBN LTD. (2025) LPELR- 81736 (CA)</span></li>
                            <li className="flex gap-2"><span className="not-italic font-bold min-w-[30px]">(VII)</span> <span>First Bank v. Pan Bisbilder (1990) 2 NWLR (Pt. 134) 647 C.A,</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
