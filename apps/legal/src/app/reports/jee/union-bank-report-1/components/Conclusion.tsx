'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] aspect-square rounded-full border-[2px] border-[#E80000]" />
    </div>
);

export const Conclusion = () => {
    return (
        <div id="conclusion" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow min-h-full font-sans">
            <BackgroundPattern />

            <div className="relative z-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-8 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                    <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">07</span>
                    <h2 className="text-3xl font-serif font-black text-[#211B1B] uppercase">CONCLUSION</h2>
                </div>

                <div className="space-y-8 flex flex-col">
                    <p className="text-xl leading-relaxed text-[#211B1B]/80 text-justify">
                        Based on the depth of analysis undertaken, we are satisfied that the revised documentation suite represents a <strong className="text-[#E80000]">coherent, enforceable, and regulatory-aligned framework</strong> appropriate for the Bank's operational and strategic objectives.
                    </p>

                    <div className="p-10 bg-[#211B1B] text-white rounded-2xl shadow-xl space-y-6">
                        <p className="text-lg leading-relaxed text-justify opacity-90 m-0">
                            The revised suite enhances enforceability, reduces litigation and regulatory exposure, clarifies risk allocation, aligns with the Bank's credit governance architecture, and modernises the Bank's legal instruments in line with contemporary banking practice.
                        </p>
                    </div>

                    <p className="text-lg leading-relaxed text-[#211B1B]/80 text-justify italic border-l-4 border-[#E80000] pl-6 font-medium">
                        We believe that no material documentation gaps remain. However, regulatory shifts—particularly those relating to FX, consumer protection and sustainability—should be monitored to ensure continued compliance.
                    </p>
                </div>

                <div className="mt-auto pt-20 flex flex-col items-center gap-4 border-t border-[#211B1B]/5">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson Etti & Edu"
                        className="h-20 w-auto object-contain"
                    />
                    <div className="h-1 w-24 bg-[#E80000]"></div>
                </div>
            </div>
        </div>
    );
};
