import React from 'react';

interface FooterProps {
    pageNumber: string;
}

export const JEEFooter: React.FC<FooterProps> = ({ pageNumber }) => {
    return (
        <footer className="w-full py-4 px-16 bg-[#1a1a1a] text-xs text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="Jackson Etti & Edu"
                    className="h-5 w-auto brightness-0 invert"
                />
            </div>
            <div className="flex items-center gap-6 font-light uppercase tracking-widest text-[9px]">
                <span>Project Fortify</span>
                <span className="text-white/20">|</span>
                <span>April 2026</span>
                <span className="text-white/20">|</span>
                <span className="font-bold">Page {pageNumber}</span>
            </div>
        </footer>
    );
};
