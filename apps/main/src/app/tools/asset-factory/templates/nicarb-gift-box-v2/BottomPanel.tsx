'use client';

import { NICARB_BRAND } from './constants';
import { PatternBackground } from './PatternBackground';

interface PanelProps {
    rotation?: number;
}

// BOTTOM PANEL
export const BottomPanel = ({ rotation = 0 }: PanelProps) => (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 transition-all duration-500" style={{ backgroundColor: NICARB_BRAND.colors.white }}>
        <PatternBackground />
        <div className="w-12 h-[1px] mb-4 opacity-20" style={{ backgroundColor: NICARB_BRAND.colors.secondary }} />
        <p className="relative z-10 text-[10px] text-gray-400 tracking-[0.2em] uppercase text-center">
            © 2026 Nigerian Institute of Chartered Arbitrators
        </p>
    </div>
);
