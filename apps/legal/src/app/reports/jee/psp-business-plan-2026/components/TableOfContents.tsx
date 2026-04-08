'use client';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] aspect-square rounded-full border-[2px] border-[#E80000]" />
    </div>
);

export const TableOfContents = () => {
    const items = [
        { id: 'executive-summary', label: '1. Executive Summary', page: 3 },
        { id: 'personal-case', label: '2. Personal Case, Commercial Impact & Contributions', page: 4 },
        {
            id: 'proposed-business', label: '3. Proposed Business – CLDR Practice – Project Fortify', page: 5,
            subItems: [
                { id: 'platform-1', label: '3.1 Institutional Debt Recovery, Insolvency & Enforcement', page: 5 },
                { id: 'platform-2', label: '3.2 Commercial, Transactional & Shareholder Disputes', page: 6 },
                { id: 'platform-3', label: '3.3 Domestic & International Arbitration & Cross-Border Enforcement', page: 7 },
            ]
        },
        {
            id: 'implementation', label: '4. Implementation Plan', page: 8,
            subItems: [
                { id: 'ws1', label: 'Workstream 1: Structured Dispute Offerings', page: 8 },
                { id: 'ws2', label: 'Workstream 2: Thought Leadership & Knowledge Platform', page: 9 },
                { id: 'ws3', label: 'Workstream 3: Ecosystem Engagement & Market Positioning', page: 9 },
                { id: 'ws4', label: 'Workstream 4: Relationship Development & Client Engagement', page: 10 },
                { id: 'ws5', label: 'Workstream 5: Internal Referral Capture & Cross-Practice', page: 10 },
            ]
        },
        { id: 'financial', label: '5. Financial Requirements', page: 11 },
        { id: 'success-factors', label: '6. Success Factors & Key Performance Indicators', page: 12 },
        { id: 'conclusion', label: '7. Conclusion – Commitment to Firm Growth', page: 13 },
    ];

    return (
        <div className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] shrink-0 flex flex-col flex-grow overflow-hidden font-sans">
            <BackgroundPattern />

            <div className="mb-12 text-left relative z-10">
                <h2 className="text-4xl font-serif font-black text-[#211B1B] uppercase tracking-tighter">Table of Contents</h2>
                <div className="w-24 h-1 bg-[#E80000] mt-4" />
            </div>

            <div className="space-y-6 max-w-4xl relative z-10">
                {items.map((item, index) => (
                    <div key={index} className="space-y-3">
                        <a
                            href={`#${item.id}`}
                            className="flex items-baseline group cursor-pointer hover:text-[#E80000] transition-all no-underline w-full"
                            onClick={(e) => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                        >
                            <span className="font-serif font-black text-base text-[#211B1B] group-hover:text-[#E80000] uppercase pr-4">
                                {item.label}
                            </span>
                            <div className="flex-1 border-b-2 border-dotted border-[#211B1B]/10 relative bottom-[6px]" />
                            <span className="font-serif font-black text-[#E80000] text-xl w-10 text-right ml-4">
                                {item.page}
                            </span>
                        </a>

                        {item.subItems && (
                            <div className="space-y-3 pb-2">
                                {item.subItems.map((sub, sIdx) => (
                                    <a
                                        key={sIdx}
                                        href={`#${sub.id}`}
                                        onClick={(e) => { e.preventDefault(); document.getElementById(sub.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                                        className="flex items-baseline opacity-80 hover:opacity-100 hover:text-[#E80000] transition-all no-underline group/sub w-full"
                                    >
                                        <div className="pl-10 flex items-baseline flex-1">
                                            <span className="font-sans text-sm font-bold text-[#211B1B] group-hover/sub:text-[#E80000] pr-4">
                                                {sub.label}
                                            </span>
                                            <div className="flex-1 border-b border-dotted border-[#211B1B]/10 relative bottom-[4px]" />
                                        </div>
                                        <span className="font-sans font-black text-[#211B1B]/40 text-sm w-10 text-right ml-4 group-hover/sub:text-[#E80000]">
                                            {sub.page}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
