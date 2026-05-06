'use client';

import React from 'react';

interface FooterProps {
    pageNumber: string;
}

export const BanwoESGFooter: React.FC<FooterProps> = ({ pageNumber }) => {
    return (
        <div className="w-full px-12 py-8 flex justify-between items-end">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-[2px] bg-[#05386f]" />
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#05386f] uppercase">
                        Banwo & Ighodalo
                    </span>
                </div>
                <div className="text-[8px] font-medium text-[#211B1B]/40 uppercase tracking-widest pl-10">
                    Sustainable Finance Insight Report
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-[#05386f]">{pageNumber}</span>
                <div className="w-4 h-[1px] bg-[#05386f]/20" />
            </div>
        </div>
    );
};
