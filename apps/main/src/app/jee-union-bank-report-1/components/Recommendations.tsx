'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Recommendations = () => {
    return (
        <div id="recommendations" className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl p-16 mb-12 print:mb-0 print:shadow-none print:break-after-page min-h-[297mm] relative text-[#0A1930] shrink-0">
            <div className="flex items-center gap-3 mb-8 border-b border-[#C8B273]/30 pb-4">
                <ShieldCheck className="w-8 h-8 text-[#C8B273]" />
                <h2 className="text-3xl font-serif font-bold text-[#0A1930]">6. RECOMMENDATIONS</h2>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify prose-li:text-justify">
                <p>
                    To ensure the long-term effectiveness, integrity, and sustainability of the revised documentation suite, we recommend the implementation of a structured governance and compliance framework. While the documentation has been substantively strengthened, its continued robustness will depend on disciplined adoption, regulatory responsiveness, and institutional oversight. The recommendations below are designed to embed the revised standards across the Bank’s operations and mitigate future legal and regulatory risks.
                </p>

                <h3 className="text-xl font-bold mt-8 mb-4 text-[#0A1930]">6.1. Governance and Sustainability Measures</h3>
                <p>To preserve alignment with evolving regulatory and market standards, the Bank should:</p>
                <ul className="space-y-4 list-none pl-0">
                    <li className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#C8B273] mt-2 shrink-0" />
                        <span>Establish an <strong>annual documentation review cycle</strong> to reassess templates against regulatory updates, judicial developments, and market practice.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#C8B273] mt-2 shrink-0" />
                        <span>Implement a <strong>structured regulatory monitoring mechanism</strong> to track CBN circulars, legislative amendments, and material court decisions affecting credit and security documentation.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#C8B273] mt-2 shrink-0" />
                        <span>Adopt a <strong>centralised, live document management system</strong> with strict version control protocols to prevent unauthorised modifications and ensure consistent usage of approved templates.</span>
                    </li>
                </ul>

                <h3 className="text-xl font-bold mt-10 mb-4 text-[#0A1930]">6.2. Risk Mitigation and Compliance</h3>
                <p>To ensure uniform implementation and minimise operational risk, the Bank should:</p>
                <ul className="space-y-4">
                    <li className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#C8B273] mt-2 shrink-0" />
                        <span>Conduct <strong>mandatory training sessions</strong> for Credit, Legal, Risk, and Operations teams on the revised templates and their practical deployment.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#C8B273] mt-2 shrink-0" />
                        <span>Implement a <strong>unified Legal Documentation Policy</strong> applicable across all branches and business units.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#C8B273] mt-2 shrink-0" />
                        <span>Conduct <strong>periodic internal compliance audits</strong> to verify consistent application of the approved documentation suite.</span>
                    </li>
                </ul>

                <h3 className="text-xl font-bold mt-10 mb-4 text-[#0A1930]">6.3. Implementation Timelines</h3>
                <p>We recommend the following phased implementation approach:</p>
                <div className="grid grid-cols-3 gap-6 mt-6 not-prose">
                    <div className="p-6 bg-slate-50 border-t-4 border-[#0A1930] rounded-b-lg">
                        <div className="text-[#C8B273] font-bold text-xl mb-2">30 Days</div>
                        <p className="text-sm text-gray-600">Migration to the standardised documentation suite post-report adoption.</p>
                    </div>
                    <div className="p-6 bg-slate-50 border-t-4 border-[#C8B273] rounded-b-lg">
                        <div className="text-[#0A1930] font-bold text-xl mb-2">3 Months</div>
                        <p className="text-sm text-gray-600">Rollout of structured training programmes across key departments.</p>
                    </div>
                    <div className="p-6 bg-slate-50 border-t-4 border-gray-300 rounded-b-lg">
                        <div className="text-gray-400 font-bold text-xl mb-2">12 Months</div>
                        <p className="text-sm text-gray-600">First comprehensive internal documentation compliance audit.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
