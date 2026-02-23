import React from 'react';
import { useDeckNavigation } from './NavigationContext';

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
    const { goToSlideById } = useDeckNavigation();
    return (
        <div
            className="relative page-wrapper shrink-0 w-[297mm] h-[167mm] bg-white overflow-hidden"
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
                <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-gray-900/10 font-mono text-[10px] tracking-widest z-50">
                    <div className="uppercase pointer-events-none">Infrastructure Secured by Meris Labs</div>
                    <div
                        onClick={() => goToSlideById('toc')}
                        className="cursor-pointer hover:text-red-500/50 transition-colors"
                        title="Return to Table of Contents"
                    >
                        [ SLIDE // {String(pageNumber).padStart(2, '0')} ]
                    </div>
                </div>
            )}
        </div>
    );
};
