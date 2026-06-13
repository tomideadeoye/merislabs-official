'use client';

import React from 'react';
import { Footer1 } from './Footer1';

export interface PageWrapper1Props {
    children: React.ReactNode;
    pageNumber: string | number;
    isCover?: boolean;
    isBackCover?: boolean;
    breakBefore?: boolean;
    projectName?: string;
    date?: string;
    logoSrc?: string;
    firmName?: string;
    brandColor?: string;
    backgroundColor?: string;
    textColor?: string;
}

export function PageWrapper1({
    children,
    pageNumber,
    isCover = false,
    isBackCover = false,
    breakBefore = false,
    projectName,
    date,
    logoSrc,
    firmName,
    brandColor,
    backgroundColor = '#FFFFFF',
    textColor = '#211B1B'
}: PageWrapper1Props) {
    const pageId = pageNumber === 'cover' ? 'cover' : pageNumber === 'toc' ? 'toc' : `page-${pageNumber}`;
    
    return (
        <div
            id={pageId}
            className={`relative page-wrapper shadow-2xl my-8 print:shadow-none print:my-0 ${breakBefore ? 'break-before-print' : ''}`}
            style={{
                width: '210mm',
                height: '297mm',
                maxHeight: '297mm',
                backgroundColor: isCover || isBackCover ? 'transparent' : backgroundColor,
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden',
                color: isCover || isBackCover ? '#FFFFFF' : textColor,
            }}
        >
            <div className="flex-grow flex flex-col overflow-hidden">
                {children}
            </div>

            {!isCover && !isBackCover && (
                <div className="absolute bottom-0 left-0 right-0 z-50">
                    <Footer1 
                        pageNumber={pageNumber} 
                        projectName={projectName}
                        date={date}
                        logoSrc={logoSrc}
                        firmName={firmName}
                    />
                </div>
            )}
        </div>
    );
}

export default PageWrapper1;