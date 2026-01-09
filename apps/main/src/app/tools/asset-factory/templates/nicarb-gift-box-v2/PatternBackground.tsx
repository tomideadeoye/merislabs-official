'use client';

import { NICARB_BRAND } from './constants';

// Scales Icon SVG - For the repeating pattern
const ScalesPattern = () => (
    <svg viewBox="0 0 50 50" fill="none" className="w-full h-full">
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.15">
            {/* Central pillar */}
            <line x1="25" y1="8" x2="25" y2="42" />
            {/* Top bar */}
            <line x1="10" y1="12" x2="40" y2="12" />
            {/* Left scale */}
            <path d="M10 12 L6 26 C6 30 10 32 14 32 C18 32 22 30 22 26 L18 12" fill="none" />
            {/* Right scale */}
            <path d="M32 12 L28 26 C28 30 32 32 36 32 C40 32 44 30 44 26 L40 12" fill="none" />
            {/* Base */}
            <path d="M18 42 L32 42 L29 45 L21 45 Z" fill="none" />
        </g>
    </svg>
);

// Generate the repeating pattern background
export const PatternBackground = ({ color = NICARB_BRAND.colors.primary }) => {
    const rows = 12;
    const cols = 16;
    
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
                className="absolute inset-0"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    transform: 'rotate(-15deg) scale(1.5)',
                    transformOrigin: 'center center',
                    color: color,
                }}
            >
                {Array.from({ length: rows * cols }).map((_, i) => (
                    <div key={i} className="w-12 h-12 flex items-center justify-center">
                        <ScalesPattern />
                    </div>
                ))}
            </div>
        </div>
    );
};
