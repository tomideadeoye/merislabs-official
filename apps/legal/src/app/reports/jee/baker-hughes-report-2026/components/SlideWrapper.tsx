import React from 'react';

interface SlideWrapperProps {
    children: React.ReactNode;
    pageNumber: number;
    hideHeader?: boolean;
}

export const SlideWrapper: React.FC<SlideWrapperProps> = ({
    children,
    pageNumber,
    hideHeader = false
}) => {
    return (
        <div
            className="relative page-wrapper shrink-0 w-[297mm] h-[167mm] bg-white overflow-hidden shadow-sm"
            style={{
                display: 'flex',
                flexDirection: 'column',
                pageBreakAfter: 'always',
                pageBreakInside: 'avoid',
                border: '1px solid #eee'
            }}
        >
            {!hideHeader && (
                <div className="absolute top-0 left-0 right-0 h-4 bg-red-600 z-50"></div>
            )}

            {/* Main Content */}
            <div className="flex-grow flex flex-col relative z-10 w-full h-full">
                {children}
            </div>

            {/* Page Number */}
            {!hideHeader && (
                <div className="absolute bottom-4 right-6 text-gray-400 font-bold text-lg rotate-90 transform origin-bottom-right z-50">
                    {pageNumber}
                </div>
            )}
        </div>
    );
};
