import React from 'react';
import { JeeUnionBankFooter } from './Footer';

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
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Content area - leaving space at the bottom for footer */}
            <div className="flex-grow flex flex-col" style={{ paddingBottom: isCover || isBackCover ? '0' : '80px' }}>
                {children}
            </div>

            {/* Footer with page number and logos - not shown on cover or back cover */}
            {!isCover && !isBackCover && (
                <div className="absolute bottom-0 left-0 right-0">
                    <JeeUnionBankFooter pageNumber={pageNumber} />
                </div>
            )}
        </div>
    );
};
