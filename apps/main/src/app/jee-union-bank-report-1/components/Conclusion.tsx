'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

export const Conclusion = () => {
    return (
        <div id="conclusion" className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl p-16 mb-12 print:mb-0 print:shadow-none print:break-after-page min-h-[297mm] relative text-[#0A1930] shrink-0 flex flex-col justify-center">
            <div className="text-center">
                <CheckCircle className="w-12 h-12 text-[#C8B273] mx-auto mb-4" />
                <h2 className="text-3xl font-serif font-bold text-[#0A1930] mb-8 border-b border-[#C8B273]/30 pb-4 inline-block px-8">7. CONCLUSION</h2>

                <div className="space-y-6">
                    <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-justify">
                        Based on the depth of analysis undertaken, we are satisfied that the revised documentation suite represents a <strong>coherent, enforceable, and regulatory-aligned framework</strong> appropriate for the Bank&apos;s operational and strategic objectives.
                    </p>
                    <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-justify">
                        The revised suite enhances enforceability, reduces litigation and regulatory exposure, clarifies risk allocation, aligns with the Bank&apos;s credit governance architecture; and modernises the Bank&apos;s legal instruments in line with contemporary banking practice.
                    </p>
                    <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-justify">
                        We believe that no material documentation gaps remain. However, regulatory shifts; particularly those relating to FX, consumer protection and sustainability should be monitored to ensure continued compliance.
                    </p>
                </div>

                <div className="mt-20">
                    <img src="/clients/jackson etti and edu logo (1).png" alt="Jackson Etti & Edu" className="h-16 mx-auto grayscale opacity-50" />
                    <p className="mt-4 text-sm font-serif font-bold text-gray-400 tracking-widest uppercase">Jackson, Etti & Edu</p>
                </div>
            </div>
        </div>
    );
};
