'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const RiskConsiderations = () => {
    return (
        <div id="risk-considerations" className="max-w-[210mm] w-full mx-auto bg-white p-16 relative text-[#0A1930] overflow-hidden flex-grow">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-8 border-b border-[#009fe3]/30 pb-4 relative z-10">
                <h2 className="text-3xl font-serif font-bold text-[#0A1930]">5. CURRENT RISKS AND MITIGATIONS CONSIDERATIONS</h2>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] prose-p:text-justify prose-li:text-justify font-sans relative z-10">

                <p>
                    While the revised documentation suite substantially strengthens the Bank’s legal and regulatory position, certain residual implementation and operational risks remain. These risks are not structural deficiencies in the documentation itself, but rather relate to deployment, governance, and evolving regulatory dynamics.
                </p><br />
                <p>
                    Among the key residual risks identified are:
                </p>
                <br />
                <ul className="space-y-4 list-none pl-0">
                    <li className="flex gap-4 p-4 bg-red-50/30 border-l-4 border-red-200 rounded-r-lg">
                        <div className="font-bold text-[#0A1930] shrink-0">i)</div>
                        <p className="m-0 text-sm text-justify">Operational misalignment in the implementation of the revised templates across business units and branches;</p>
                    </li>
                    <li className="flex gap-4 p-4 bg-red-50/30 border-l-4 border-red-200 rounded-r-lg">
                        <div className="font-bold text-[#0A1930] shrink-0">ii)</div>
                        <p className="m-0 text-sm text-justify">Inconsistent deployment or legacy template usage, which may undermine standardisation efforts;</p>
                    </li>
                    <li className="flex gap-4 p-4 bg-red-50/30 border-l-4 border-red-200 rounded-r-lg">
                        <div className="font-bold text-[#0A1930] shrink-0">iii)</div>
                        <p className="m-0 text-sm text-justify">Identified procedural gaps in documentation governance and version control; and</p>
                    </li>
                </ul>
                <p className="mt-8">
                    These risks can be effectively mitigated through structured governance controls, centralised template management, targeted staff training, and ongoing regulatory monitoring, as further outlined in the Recommendations section of this Report.
                </p>
            </div>
        </div>
    );
};
