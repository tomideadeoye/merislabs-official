'use client';

import React from 'react';

export const TableOfContents = () => {
    const items = [
        { id: 'summary', label: '1. EXECUTIVE SUMMARY', page: 3 },
        { id: 'scope', label: '2. SCOPE OF WORK', page: 4 },
        { id: 'findings', label: '3. KEY DOCUMENT REVIEW OUTCOMES', page: 5 },
        { id: 'analysis', label: '4. ANALYSIS', page: 7 },
        { id: 'risk-considerations', label: '5. CURRENT RISKS AND MITIGATIONS CONSIDERATIONS', page: 8 },
        { id: 'recommendations', label: '6. RECOMMENDATIONS', page: 9 },
        { id: 'conclusion', label: '7. CONCLUSION', page: 10 },
    ];

    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl p-16 mb-12 print:mb-0 print:shadow-none print:break-after-page min-h-[297mm] relative text-[#0A1930] shrink-0">
            <div className="toc-header mb-16 text-center">
                <h2 className="text-3xl font-serif font-bold text-[#0A1930] uppercase tracking-wider">Table of Contents</h2>
                <div className="w-16 h-1 bg-[#C8B273] mx-auto mt-4" />
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
                {items.map((item, index) => (
                    <a
                        key={index}
                        href={`#${item.id}`}
                        className="flex items-baseline gap-4 group cursor-pointer hover:opacity-70 transition-opacity no-underline"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <span className="font-serif font-bold text-lg text-[#0A1930] whitespace-nowrap min-w-[300px] border-b border-transparent group-hover:border-[#C8B273]">
                            {item.label}
                        </span>
                        <div className="flex-grow border-b border-dotted border-gray-300 relative bottom-[6px]" />
                        <span className="font-serif font-bold text-[#C8B273] text-xl min-w-[20px] text-right">
                            {item.page}
                        </span>
                    </a>
                ))}
            </div>

            {/* Subtle branding for the TOC page */}
            <div className="absolute bottom-16 left-16 right-16 flex justify-between items-center border-t border-gray-100 pt-8 opacity-40">
                <span className="text-[10px] uppercase tracking-widest">Legal Documentation Suite</span>
                <img src="/union-bank/logo.png" alt="Union Bank" className="h-4 grayscale" />
            </div>
        </div>
    );
};
