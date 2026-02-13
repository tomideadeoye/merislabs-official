'use client';

import React from 'react';

export const TableOfContents = () => {
    const items = [
        { id: 'summary', label: '1. EXECUTIVE SUMMARY', page: 3 },
        {
            id: 'scope',
            label: '2. SCOPE OF WORK',
            page: 4,
            subItems: [
                { id: 'nature-review', label: '2.1 Nature of the Review', page: 4 },
                { id: 'docs-reviewed', label: '2.2 Documents Reviewed', page: 4 },
                { id: 'scope-2.3', label: '2.3 Assumptions & Limitations', page: 5 },
                { id: 'scope-2.4', label: '2.4 Legal and Regulatory Framework Considered', page: 6 }
            ]
        },
        {
            id: 'findings',
            label: '3. KEY DOCUMENT REVIEW OUTCOMES',
            page: 7,
            subItems: [
                { id: 'findings-credit', label: '3.1 Global Credit Templates', page: 7 },
                { id: 'findings-secured', label: '3.2 Secured Lending Instruments', page: 7 },
                { id: 'findings-third-party', label: '3.3 Third-Party Support Documents', page: 8 },
                { id: 'findings-specialized', label: '3.4 Specialized Finance Documentation', page: 10 }
            ]
        },
        {
            id: 'analysis',
            label: '4. ANALYSIS',
            page: 11,
        },
        { id: 'risk-considerations', label: '5. CURRENT RISKS AND MITIGATIONS', page: 12 },
        {
            id: 'recommendations',
            label: '6. RECOMMENDATIONS',
            page: 13,
            subItems: [
                { id: 'recom-short', label: '6.1 Governance and Sustainability Measures', page: 13 },
                { id: 'recom-strategic', label: '6.2 Risk Mitigation and Compliance', page: 13 },
                { id: 'roadmap', label: '6.3 Implementation Timelines', page: 14 }
            ]
        },
        { id: 'conclusion', label: '7. CONCLUSION', page: 15 }
    ];

    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl p-16 mb-12 print:mb-0 print:shadow-none print:break-after-page relative text-[#0A1930] shrink-0 flex flex-col flex-grow overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

            <div className="toc-header mb-16 text-left relative z-10">
                <h2 className="text-3xl font-serif font-bold text-[#0A1930] uppercase tracking-wider">Table of Contents</h2>
                <div className="w-16 h-1 bg-[#009fe3] mt-4" />
            </div>

            <div className="space-y-4 max-w-3xl text-sm">
                {items.map((item, index) => (
                    <div key={index} className="space-y-3">
                        <a
                            href={`#${item.id}`}
                            className="flex items-baseline gap-4 group cursor-pointer hover:text-[#009fe3] transition-all no-underline"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <span className="font-serif font-bold text-base text-[#0A1930] group-hover:text-[#009fe3] whitespace-nowrap min-w-[340px] uppercase tracking-tight">
                                {item.label}
                            </span>
                            <div className="flex-grow border-b border-dotted border-gray-300 relative bottom-[6px]" />
                            <span className="font-serif font-bold text-[#009fe3] text-lg min-w-[20px] text-right">
                                {item.page}
                            </span>
                        </a>

                        {item.subItems && (
                            <div className="ml-8 space-y-2 pb-2">
                                {item.subItems.map((sub, sIdx) => (
                                    <a
                                        key={sIdx}
                                        href={`#${sub.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(sub.id)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="flex items-baseline gap-4 opacity-70 hover:opacity-100 hover:text-[#009fe3] transition-all no-underline group/sub"
                                    >
                                        <span className="font-sans text-xs text-[#0A1930] group-hover/sub:text-[#009fe3] whitespace-nowrap min-w-[300px]">
                                            {sub.label}
                                        </span>
                                        <div className="flex-grow border-b border-dotted border-gray-200 relative bottom-[4px]" />
                                        <span className="font-sans font-medium text-gray-500 text-xs min-w-[20px] text-right italic group-hover/sub:text-[#009fe3]">
                                            {sub.page}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Subtle branding for the TOC page */}
            <div className="absolute bottom-16 left-16 right-16 flex justify-between items-center border-t border-gray-100 pt-8 opacity-40 no-justify">
                <span className="text-[10px] uppercase tracking-widest no-justify">Legal Documentation Suite</span>
                <img src="/union-bank/logo.png" alt="Union Bank" className="h-4 grayscale" />
            </div>
        </div>
    );
};
