'use client';

import React from 'react';

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
        <div className="w-full mt-12 not-prose">
            <div className="relative max-w-4xl mx-auto px-4 pb-8">
                {/* Thin horizontal rule */}
                <div className="absolute top-[20px] left-[5%] right-[5%] h-[1px] bg-slate-200" />

                <div className="relative flex justify-center gap-x-4 items-start">
                    {phases.map((phase, idx) => (
                        <div key={idx} className="flex flex-col items-center relative" style={{ width: '30%', minWidth: '180px' }}>
                            {/* Milestone Node - Minimalist anchor */}
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-[#009fe3] flex items-center justify-center z-10 mb-6">
                                <span className="text-[10px] font-bold text-[#0A1930]">
                                    {phase.number}
                                </span>
                            </div>

                            {/* Node Content */}
                            <div className="text-center px-4 max-w-[240px]">
                                <span className="block text-[#009fe3] font-bold text-[11px] uppercase tracking-[0.2em] mb-2 text-center no-justify">
                                    {phase.timeline}
                                </span>
                                <h4 className="text-[13px] font-serif font-black text-[#0A1930] mb-3 leading-tight uppercase tracking-tight text-center no-justify">
                                    {phase.title}
                                </h4>
                                <div className="w-6 h-[2px] bg-[#009fe3]/20 mx-auto mb-4" />
                                <p className="text-[13px] leading-relaxed text-slate-600 font-medium text-center no-justify">
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
