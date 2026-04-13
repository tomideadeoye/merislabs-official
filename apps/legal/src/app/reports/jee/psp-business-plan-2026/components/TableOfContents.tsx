'use client';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

export const TableOfContents = () => {
    const items = [
        { label: '1. Executive Summary', page: 3 },
        { label: '2. Personal Case, Commercial Impact & Contributions', page: 4 },
        { label: '3. The Business – CLDR Practice / Project Fortify', page: 6 },
        { label: '4. Market & Competitive Landscape Analysis', page: 8 },
        { label: '5. Strategic Objectives', page: 11 },
        { label: '6. Implementation Plan', page: 12 },
        { label: '7. International Referral Architecture', page: 14 },
        { label: '8. Team Development & Practice Capacity Plan', page: 15 },
        { label: '9. Financial Requirements', page: 17 },
        { label: '10. Bottom-Up Revenue Model & Financial Projections', page: 20 },
        { label: '11. Profitability, Leverage & Fee Collection', page: 22 },
        { label: '12. Success Factors, KPIs & Risk Register', page: 23 },
        { label: '13. Phased Implementation Timeline', page: 25 },
        { label: '14. Conclusion – Commitment to Partnership & Firm Growth', page: 26 },
    ];

    return (
        <div className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] shrink-0 flex flex-col flex-grow overflow-hidden font-sans">
            <BackgroundPattern />
            <div className="mb-10 relative z-10">
                <h2 className="text-4xl font-serif font-black text-[#211B1B] uppercase tracking-tighter">Table of Contents</h2>
                <div className="w-24 h-1 bg-[#E80000] mt-3" />
            </div>
            <div className="space-y-4 relative z-10">
                {items.map((item, i) => (
                    <div key={i} className="flex items-baseline">
                        <span className="font-serif font-black text-sm text-[#211B1B] uppercase pr-4">{item.label}</span>
                        <div className="flex-1 border-b-2 border-dotted border-[#211B1B]/10 relative bottom-[5px]" />
                        <span className="font-serif font-black text-[#E80000] text-lg w-10 text-right ml-4">{item.page}</span>
                    </div>
                ))}
            </div>
            <div className="mt-auto pt-6 border-t border-[#211B1B]/10 relative z-10">
                <p className="text-[9px] text-[#211B1B]/30 uppercase tracking-widest font-bold">Strictly Confidential · Partnership Selection Programme · April 2026</p>
            </div>
        </div>
    );
};
