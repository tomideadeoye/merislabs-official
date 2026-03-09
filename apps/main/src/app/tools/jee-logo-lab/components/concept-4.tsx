'use client';

import { motion } from 'framer-motion';
import { ConceptProps } from './shared';

export const Concept4Canvas = ({ primaryColor, accentColor, bgColor, theme = 'dark' }: ConceptProps) => {
    const isDark = theme === 'dark';
    const textColor = isDark ? 'white' : '#1a1a1a';
    const secondaryColor = isDark ? 'white' : '#000000';
    const gridColor = isDark ? 'white' : '#000000';

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-12 overflow-hidden transition-colors duration-1000" style={{ backgroundColor: bgColor }}>
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${gridColor} 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
            <div className="relative z-10 flex items-center justify-center scale-[1.2]">
                <svg viewBox="0 0 500 300" className="w-[450px] h-auto">
                    <defs>
                        <linearGradient id={`markGrad-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={accentColor} />
                            <stop offset="100%" stopColor={primaryColor} />
                        </linearGradient>
                        <mask id={`slashMask-${theme}`}>
                            <rect x="0" y="0" width="500" height="300" fill="white" />
                            <g transform="translate(190, 110) rotate(-25)">
                                <rect x="0" y="0" width="6" height="80" fill="black" />
                                <rect x="18" y="-15" width="6" height="80" fill="black" />
                            </g>
                        </mask>
                    </defs>
                    <motion.path
                        d="M180,60 C240,60 260,115 200,150 C260,185 240,240 180,240"
                        fill="none" stroke={`url(#markGrad-${theme})`} strokeWidth="40" strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }} mask={`url(#slashMask-${theme})`}
                    />
                    <g transform="translate(340, 150)">
                        <circle r="95" fill="none" stroke={secondaryColor} strokeWidth="1" className="opacity-10" />
                        <motion.circle
                            r="80" fill="none" stroke={accentColor} strokeWidth="12" strokeDasharray="15 30"
                            animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.circle
                            r="100" fill="none" stroke={accentColor} strokeWidth="2" strokeDasharray="40 160"
                            animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.text
                            y="6"
                            textAnchor="middle"
                            fill={textColor}
                            className="text-[10px] font-black tracking-[0.3em] font-mono opacity-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ delay: 1.5 }}
                        >
                            1996 • 2026
                        </motion.text>
                    </g>
                </svg>
            </div>
            <motion.div className="mt-16 text-center z-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                <h2 className="font-serif text-[30px] tracking-[0.1em] mb-3 font-semibold" style={{ color: textColor }}>Jackson, Etti & Edu</h2>
                <div className="flex items-center justify-center gap-6 text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-mono">
                    <span className="text-zinc-400">Legal Excellence</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-zinc-400">Since 1996</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-zinc-400">30 Year Legacy</span>
                </div>
            </motion.div>
        </div>
    );
};
