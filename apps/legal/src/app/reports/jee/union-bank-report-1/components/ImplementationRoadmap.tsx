'use client';

import React from 'react';

const SectionHeader = ({ number, title }: { number: string, title: string }) => (
    <div className="relative mb-8 pb-4 border-b-2 border-[#E80000]/20">
        <div className="flex items-baseline gap-4">
            <span className="text-[#E80000] font-serif font-black text-4xl opacity-20">{number}</span>
            <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">{title}</h2>
        </div>
        <div className="absolute bottom-[-2px] left-0 w-24 h-[2px] bg-[#E80000]" />
    </div>
);

export const ImplementationRoadmap = () => {
    const phases = [
        {
            number: '01',
            timeline: 'Within 30 Days',
            title: 'Standardisation & Adoption',
            summary: 'Migration to the standardised documentation suite.'
        },
        {
            number: '02',
            timeline: 'Within 3 Months',
            title: 'Institutional Training',
            summary: 'Rollout of structured training programmes.'
        },
        {
            number: '03',
            timeline: 'Within 12 Months',
            title: 'Compliance Audit',
            summary: 'First internal documentation compliance audit.'
        }
    ];

    return (
        <div id="roadmap" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow font-sans">
            {/* 6.2 Risk Mitigation and Compliance */}
            <div className="relative mb-10 pb-4 border-b-2 border-[#E80000]/20">
                <div className="flex items-baseline gap-4">
                    <span className="text-[#E80000] font-serif font-black text-4xl opacity-20">6.2</span>
                    <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase tracking-tight">Risk Mitigation and Compliance</h2>
                </div>
                <div className="absolute bottom-[-2px] left-0 w-24 h-[2px] bg-[#E80000]" />
            </div>

            <section id="recom-strategic" className="p-6 border-2 border-[#E80000]/10 rounded-2xl mb-10 scroll-mt-20">
                <ul className="space-y-5 list-none pl-0">
                    {[
                        { bold: "Mandatory training sessions", text: "for Credit, Legal, Risk, and Operations teams on the revised templates and their practical deployment." },
                        { bold: "Unified Legal Documentation Policy", text: "applicable across all branches and business units." },
                        { bold: "Periodic internal compliance audits", text: "to verify consistent application of the approved documentation suite." }
                    ].map((item, i) => (
                        <li key={i} className="flex gap-4 items-start group">
                            <div className="w-2 h-2 rounded-full bg-[#211B1B] mt-2 shrink-0 group-hover:bg-[#E80000] transition-colors" />
                            <span className="text-[14px] text-[#211B1B]/80 text-justify">Execute <strong>{item.bold}</strong> {item.text}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* 6.3 Implementation Timelines */}
            <SectionHeader number="6.3" title="Implementation Timelines" />

            <div className="relative max-w-5xl mx-auto w-full pt-6 mb-12">
                {/* Visual Connector Line - precisely centered behind nodes (pt-6 + h-14/2 = 24px + 28px = 52px) */}
                <div className="absolute top-[52px] left-[15%] right-[15%] h-[1px] bg-[#211B1B]/10" />

                <div className="relative flex justify-between items-start gap-4">
                    {phases.map((phase, idx) => (
                        <div key={idx} className="flex flex-col items-center relative group" style={{ width: '28%' }}>
                            {/* Milestone Node */}
                            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#211B1B] group-hover:border-[#E80000] flex items-center justify-center z-10 mb-6 shadow-sm transition-all duration-500 transform group-hover:scale-110">
                                <span className="text-base font-serif font-black text-[#211B1B] group-hover:text-[#E80000] transition-colors">
                                    {phase.number}
                                </span>
                            </div>

                            {/* Node Content */}
                            <div className="text-center px-4">
                                <span className="block text-[#E80000] font-black text-[10px] uppercase tracking-wider mb-2 text-center">
                                    {phase.timeline}
                                </span>
                                <h4 className="text-[13px] font-serif font-black text-[#211B1B] mb-3 leading-tight uppercase h-10 flex items-center justify-center">
                                    {phase.title}
                                </h4>
                                <div className="w-8 h-[2px] bg-[#E80000]/30 mx-auto mb-4 group-hover:w-12 transition-all duration-500" />
                                <p className="text-[12px] leading-relaxed text-[#211B1B]/60 font-medium text-center">
                                    {phase.summary}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
