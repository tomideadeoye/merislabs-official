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
            className="relative page-wrapper shrink-0 w-[297mm] h-[167mm] bg-white overflow-hidden shadow-2xl"
            style={{
                display: 'flex',
                flexDirection: 'column',
                pageBreakAfter: 'always',
                pageBreakInside: 'avoid',
            }}
        >
            {/* Background Texture Layers */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Subtle Grid */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                {/* Soft Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)]" />
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col relative z-10 w-full h-full">
                {children}
            </div>

            {/* Premium Progress Bar (Footer) - Only if not hidden */}
            {!hideHeader && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100 z-50">
                    <div
                        className="h-full bg-red-600 shadow-[0_0_10px_rgba(232,0,0,0.5)] transition-all duration-1000 ease-out"
                        style={{ width: `${(pageNumber / 25) * 100}%` }} // Adjusted to an estimated total or dynamic
                    />
                </div>
            )}

            {/* Subtle Tracking Number */}
            {!hideHeader && (
                <div className="absolute bottom-6 left-12 right-12 flex justify-between items-center text-gray-400 font-mono text-[9px] tracking-[0.3em] z-50 uppercase">
                    <div className="flex items-center space-x-3">
                        <span className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
                        <span>Sovereign Infrastructure // Meris Labs</span>
                    </div>
                    <div
                        onClick={() => goToSlideById('toc')}
                        className="cursor-pointer hover:text-red-600 transition-colors flex items-center space-x-2 group"
                        title="Return to Table of Contents"
                    >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">DIR //</span>
                        <span className="text-gray-900 font-black tracking-normal bg-gray-100 px-2 py-0.5 rounded-sm">
                            {String(pageNumber).padStart(2, '0')}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
