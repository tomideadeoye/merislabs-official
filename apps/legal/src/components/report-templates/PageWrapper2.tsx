'use client';

import React from 'react';
import { Footer2 } from './Footer2';

export interface PageWrapper2Props {
    children: React.ReactNode;
    pageNumber: string | number;
    isCover?: boolean;
    isBackCover?: boolean;
    breakBefore?: boolean;
    projectName?: string;
    brandColor?: string;
    firmName?: string;
    backgroundColor?: string;
}

export function PageWrapper2({
    children,
    pageNumber,
    isCover = false,
    isBackCover = false,
    breakBefore = false,
    projectName,
    brandColor = '#1a1a1a',
    firmName,
    backgroundColor = '#FFFFFF'
}: PageWrapper2Props) {
    const pageId = pageNumber === 'cover' ? 'cover' : pageNumber === 'toc' ? 'toc' : `page-${pageNumber}`;
    
    return (
        <div
            id={pageId}
            className={`relative page-wrapper shadow-sm my-12 print:shadow-none print:my-0 ${breakBefore ? 'break-before-print' : ''}`}
            style={{
                width: '210mm',
                height: '297mm',
                maxHeight: '297mm',
                backgroundColor: isCover || isBackCover ? 'transparent' : backgroundColor,
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <div className="flex-grow flex flex-col p-16 overflow-hidden">
                {children}
            </div>

            {!isCover && !isBackCover && (
                <Footer2 
                    pageNumber={pageNumber} 
                    projectName={projectName}
                    brandColor={brandColor}
                    firmName={firmName}
                />
            )}
        </div>
    );
}

export default PageWrapper2;