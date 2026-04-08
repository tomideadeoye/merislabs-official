import React from 'react';
import { PspFooter } from './Footer';

interface PageWrapperProps {
    children: React.ReactNode;
    pageNumber: string;
    isCover?: boolean;
    isBackCover?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    pageNumber,
    isCover = false,
    isBackCover = false
}) => {
    return (
        <div
            className={`relative page-wrapper ${isCover || isBackCover ? 'page-break-avoid' : ''}`}
            style={{
                width: '210mm',
                height: '297mm',
                maxHeight: '297mm',
                backgroundColor: 'var(--jee-cream)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxSizing: 'border-box',
                margin: 0,
                padding: 0,
            }}
        >
            <div className="flex-grow flex flex-col overflow-hidden">
                {children}
            </div>

            {!isCover && !isBackCover && (
                <div className="absolute bottom-0 left-0 right-0 z-50" style={{ backgroundColor: 'var(--jee-cream)' }}>
                    <PspFooter pageNumber={pageNumber} />
                </div>
            )}
        </div>
    );
};
