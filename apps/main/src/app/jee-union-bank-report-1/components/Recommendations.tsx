'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ImplementationRoadmap } from './ImplementationRoadmap';

export const Recommendations = () => {
    return (
        <>
            <div id="recommendations" className="max-w-[210mm] w-full mx-auto bg-white p-16 relative text-[#0A1930] overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

                <div className="flex items-center gap-3 mb-8 border-b border-[#009fe3]/30 pb-4 relative z-10">

                    <h2 className="text-3xl font-serif font-bold text-[#0A1930]">6. RECOMMENDATIONS</h2>
                </div>

                <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify prose-li:text-justify font-sans relative z-10">
                    <p>
                        To ensure the long-term effectiveness, integrity, and sustainability of the revised documentation suite, we recommend the implementation of a structured governance and compliance framework. While the documentation has been substantively strengthened, its continued robustness will depend on disciplined adoption, regulatory responsiveness, and institutional oversight. The recommendations below are designed to embed the revised standards across the Bank’s operations and mitigate future legal and regulatory risks.
                    </p>

                    <div className="mt-12 space-y-12">
                        <section>
                            <h3 id="recom-short" className="text-xl font-bold mb-4 text-[#0A1930] scroll-mt-20">6.1. Governance and Sustainability Measures</h3>
                            <p>To preserve alignment with evolving regulatory and market standards, the Bank should:</p>
                            <ul className="space-y-4 list-none pl-0 mt-6">
                                <li className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#009fe3] mt-2 shrink-0" />
                                    <span>Establish an <strong>annual documentation review cycle</strong> to reassess templates against regulatory updates, judicial developments, and market practice.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#009fe3] mt-2 shrink-0" />
                                    <span>Implement a <strong>structured regulatory monitoring mechanism</strong> to track CBN circulars, legislative amendments, and material court decisions affecting credit and security documentation.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#009fe3] mt-2 shrink-0" />
                                    <span>Adopt a <strong>centralised, live document management system</strong> with strict version control protocols to prevent unauthorised modifications and ensure consistent usage of approved templates.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3 id="recom-strategic" className="text-xl font-bold mb-4 text-[#0A1930] scroll-mt-20">6.2. Risk Mitigation and Compliance</h3>
                            <p>To ensure uniform implementation and minimise operational risk, the Bank should:</p>
                            <ul className="space-y-4 list-none pl-0 mt-6">
                                <li className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#009fe3] mt-2 shrink-0" />
                                    <span>Conduct <strong>mandatory training sessions</strong> for Credit, Legal, Risk, and Operations teams on the revised templates and their practical deployment.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#009fe3] mt-2 shrink-0" />
                                    <span>Implement a <strong>unified Legal Documentation Policy</strong> applicable across all branches and business units.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#009fe3] mt-2 shrink-0" />
                                    <span>Conduct <strong>periodic internal compliance audits</strong> to verify consistent application of the approved documentation suite.</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify font-sans relative z-10">
                <h3 className="text-xl font-bold mb-4 text-[#0A1930] scroll-mt-20">6.3. Implementation Timelines</h3>
                <p className="mb-8">
                    We recommend the following phased implementation approach:
                </p>

                <ImplementationRoadmap />


            </div>
        </>
    );
};
