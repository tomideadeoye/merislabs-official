'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] aspect-square rounded-full border-[2px] border-[#E80000]" />
    </div>
);

export const RiskConsiderations = () => {
    return (
        <div id="risk-considerations" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BackgroundPattern />

            <div className="flex items-center gap-4 mb-8 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">05</span>
                <h2 className="text-3xl font-serif font-black text-[#211B1B] uppercase">Strategic RISKS & MITIGATIONS</h2>
            </div>

            <div className="relative z-10 flex flex-col gap-6">
                <p className="text-lg leading-relaxed text-[#211B1B]/80 text-justify">
                    While the revised documentation suite substantially strengthens the Bank's legal and regulatory position, certain residual implementation and operational risks remain. These risks are not structural deficiencies in the documentation itself, but rather relate to deployment, governance, and evolving regulatory dynamics.
                </p>

                <div className="space-y-6">
                    <p className="font-black text-[#E80000] text-xs uppercase tracking-wider mb-4">Critical Residual Vectors</p>
                    <ul className="space-y-4 list-none pl-0">
                        {[
                            "Operational misalignment in the implementation of the revised templates across business units and branches;",
                            "Inconsistent deployment or legacy template usage, which may undermine standardisation efforts; and",
                            "Identified procedural gaps in documentation governance and version control."
                        ].map((risk, i) => (
                            <li key={i} className="flex gap-6 p-6 bg-[#211B1B]/5 border-l-4 border-[#E80000] rounded-r-xl group hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="font-black text-[#E80000] shrink-0 text-lg uppercase tracking-widest">{['i', 'ii', 'iii'][i]}</div>
                                <p className="m-0 text-base text-[#211B1B]/80 font-medium text-justify leading-relaxed">{risk}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6 p-8 border border-[#211B1B]/10 rounded-2xl bg-[#F9F7ED]/50 backdrop-blur-sm">
                    <p className="text-lg text-[#211B1B]/70 italic text-justify leading-relaxed">
                        These risks can be effectively mitigated through structured governance controls, centralised template management, targeted staff training, and ongoing regulatory monitoring, as further outlined in the Recommendations section of this Report.
                    </p>
                </div>
            </div>
        </div>
    );
};
