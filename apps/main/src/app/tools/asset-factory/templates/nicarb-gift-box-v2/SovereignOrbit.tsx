import React from 'react';
import { cn } from "@/lib/utils";

interface SovereignOrbitProps {
    className?: string;
}

export const SovereignOrbit = ({ className }: SovereignOrbitProps) => {
    return (
        <div className={cn("absolute w-64 h-64 pointer-events-none z-10", className)}>
            <div className="absolute inset-0 border-2 border-[#a9ce46]/60 rounded-full"></div>
            <div className="absolute inset-4 border border-[#064802]/40 rounded-full"></div>

            {/* Orbital Dots - Identical to Map Pattern */}
            <div className="absolute -top-1 left-1/2 w-3 h-3 bg-[#a9ce46] rounded-full shadow-[0_0_10px_rgba(169,206,70,0.6)]"></div>
            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-[#064802] rounded-full shadow-[0_0_8px_rgba(6,72,2,0.5)]"></div>
            <div className="absolute bottom-[10%] left-[10%] w-2.5 h-2.5 bg-[#a9ce46] rounded-full shadow-[0_0_10px_rgba(169,206,70,0.6)]"></div>
            <div className="absolute top-[20%] -left-1 w-2 h-2 bg-[#064802] rounded-full shadow-[0_0_8px_rgba(6,72,2,0.5)]"></div>
        </div>
    );
};
