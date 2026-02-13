'use client';

import React from 'react';
const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] aspect-square rounded-full border-[2px] border-[#E80000]" />
    </div>
);

export const Recommendations = () => {
    return (
        <div className="flex flex-col flex-grow font-sans">
            <div id="recommendations" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow font-sans">
                <BackgroundPattern />

                <div className="flex items-center gap-4 mb-8 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                    <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">06</span>
                    <h2 className="text-3xl font-serif font-black text-[#211B1B] uppercase">RECOMMENDATIONS</h2>
                </div>

                <div className="relative z-10 flex flex-col gap-10">
                    <p className="text-lg leading-relaxed text-[#211B1B]/80 text-justify">
                        To ensure the long-term effectiveness, integrity, and sustainability of the revised documentation suite, we recommend the implementation of a structured governance and compliance framework. While the documentation has been substantively strengthened, its continued robustness will depend on disciplined adoption, regulatory responsiveness, and institutional oversight. The recommendations below are designed to embed the revised standards across the Bank's operations and mitigate future legal and regulatory risks.
                    </p>

                    <div className="space-y-12">
                        <section className="bg-[#211B1B]/5 p-8 rounded-2xl border border-[#211B1B]/10">
                            <h3 id="recom-short" className="text-xl font-black mb-6 text-[#211B1B] flex items-center gap-4 uppercase scroll-mt-20">
                                <span className="w-10 h-1 bg-[#E80000]"></span>
                                6.1. Governance and Sustainability
                            </h3>
                            <ul className="space-y-6 list-none pl-0">
                                {[
                                    { bold: "Annual documentation review cycle", text: "to reassess templates against regulatory updates, judicial developments, and market practice." },
                                    { bold: "Structured regulatory monitoring mechanism", text: "to track CBN circulars, legislative amendments, and material court decisions affecting credit and security documentation." },
                                    { bold: "Centralised, live document management system", text: "with strict version control protocols to prevent unauthorised modifications and ensure consistent usage of approved templates." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start group">
                                        <div className="w-2 h-2 rounded-full bg-[#E80000] mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                                        <span className="text-[15px] text-[#211B1B]/80 text-justify">Implement an <strong>{item.bold}</strong> {item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
