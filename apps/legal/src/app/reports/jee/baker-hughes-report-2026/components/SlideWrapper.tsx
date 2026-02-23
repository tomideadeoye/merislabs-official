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
            className="relative page-wrapper shrink-0 w-[297mm] h-[167mm] bg-[#0A0A0A] overflow-hidden"
            style={{
                display: 'flex',
                flexDirection: 'column',
                pageBreakAfter: 'always',
                pageBreakInside: 'avoid',
            }}
        >
            {/* Main Content */}
            <div className="flex-grow flex flex-col relative z-10 w-full h-full">
                {children}
            </div>

            {/* Subtle Tracking Number - Only if not hidden */}
            {!hideHeader && (
                <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-white/5 font-mono text-[10px] tracking-widest z-50 pointer-events-none">
                    <div className="uppercase">Infrastructure Secured by Meris Labs</div>
                    <div>[ SLIDE // {String(pageNumber).padStart(2, '0')} ]</div>
                </div>
            )}
        </div>
    );
};
