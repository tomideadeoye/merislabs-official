'use client';

import React from 'react';
import { JEEFooter } from './Footer';

export interface PageWrapperProps {
    children: React.ReactNode;
    pageNumber: string;
    isCover?: boolean;
    isBackCover?: boolean;
    breakBefore?: boolean;
}

export const FootnoteRef = ({ number }: { number: number }) => (
    <a href={`#fn${number}`} className="inline-block px-0.5 text-[7px] font-bold text-[#800020] no-underline hover:text-[#1a1a1a] transition-colors -translate-y-1">
        [{number}]
    </a>
);

export function PageWrapper({
    children,
    pageNumber,
    isCover = false,
    isBackCover = false,
    breakBefore = false
}: PageWrapperProps) {
    const pageId = pageNumber === 'cover' ? 'cover' : pageNumber === 'toc' ? 'toc' : `page-${pageNumber}`;
    
    return (
        <div
            id={pageId}
            className={`relative page-wrapper shadow-2xl my-8 print:shadow-none print:my-0 ${breakBefore ? 'break-before-print' : ''}`}
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
                <div className="absolute bottom-0 left-0 right-0 z-50">
                    <JEEFooter pageNumber={pageNumber} />
                </div>
            )}
        </div>
    );
}
