'use client';

import React from 'react';
import { BanwoESGFooter } from './Footer';

interface PageWrapperProps {
    children: React.ReactNode;
    pageNumber: string;
    isCover?: boolean;
    isBackCover?: boolean;
}

export const FootnoteRef: React.FC<{ number: number }> = ({ number }) => (
    <a href={`#fn${number}`} className="inline-block px-0.5 text-[7px] font-bold text-[#D4AF37] no-underline hover:text-[#05386f] transition-colors -translate-y-1">
        [{number}]
    </a>
);

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    pageNumber,
    isCover = false,
    isBackCover = false
}) => {
    return (
        <div
            className={`relative page-wrapper shadow-2xl my-8 print:shadow-none print:my-0 ${isCover || isBackCover ? 'page-break-avoid' : ''}`}
            style={{
                width: '210mm',
                height: '297mm',
                maxHeight: '297mm',
                backgroundColor: isCover || isBackCover ? 'transparent' : '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                color: isCover || isBackCover ? '#FFFFFF' : '#211B1B',
            }}
        >
            <div className="flex-grow flex flex-col overflow-hidden">
                {children}
            </div>

            {!isCover && !isBackCover && (
                <div className="absolute bottom-0 left-0 right-0 z-50 bg-[#FFFFFF]">
                    <BanwoESGFooter pageNumber={pageNumber} />
                </div>
            )}
        </div>
    );
};
