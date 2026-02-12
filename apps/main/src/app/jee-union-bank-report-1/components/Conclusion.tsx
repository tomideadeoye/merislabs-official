'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

export const Conclusion = () => {
    return (
        <div id="conclusion" className="max-w-[210mm] w-full mx-auto bg-white p-16 relative text-[#0A1930] flex flex-col justify-center items-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

            <div className="text-center relative z-10">
                <h2 className="text-3xl font-serif font-bold text-[#0A1930] mb-8 border-b border-[#009fe3]/30 pb-4 inline-block px-8">7. CONCLUSION</h2>

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
                </div>
            </div>
        </div>
    );
};
