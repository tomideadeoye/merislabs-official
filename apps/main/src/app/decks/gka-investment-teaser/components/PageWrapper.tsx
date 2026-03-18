import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
    pageNumber: string;
    isCover?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    pageNumber,
    isCover = false
}) => {
    return (
        <div
            className={`relative page-wrapper ${isCover ? 'page-break-avoid' : ''}`}
            style={{
                width: '210mm',
                height: '297mm',
                maxHeight: '297mm',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Content area */}
            <div className="flex-grow flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
};
