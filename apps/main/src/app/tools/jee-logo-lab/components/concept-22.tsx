'use client';

import { motion } from 'framer-motion';
import { ConceptProps } from './shared';

export const Concept22Canvas = ({ primaryColor, accentColor, bgColor, theme = 'light' }: ConceptProps) => {
    const isDark = theme === 'dark';
    const textColor = isDark ? 'white' : '#1a1a1a';
    const strokeColor = isDark ? 'white' : '#1a1a1a';
    const gridColor = isDark ? '#000' : '#000';

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-12 overflow-hidden transition-colors duration-1000" style={{ backgroundColor: bgColor }}>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${gridColor} 0.5px, transparent 0.5px), linear-gradient(90deg, ${gridColor} 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${gridColor} 1px, transparent 0)`, backgroundSize: '60px 60px' }} />

            <div className="relative z-10 flex items-center justify-center scale-[1.2]">
                <svg viewBox="0 0 500 300" className="w-[450px] h-auto">
                    <defs>
                        <linearGradient id={`sealGrad-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={accentColor} />
                            <stop offset="100%" stopColor={primaryColor} />
                        </linearGradient>

                        <pattern id={`guilloche-${theme}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="8" fill="none" stroke={strokeColor} strokeWidth="0.1" opacity="0.2" />
                            <path d="M0 10 Q 5 0, 10 10 T 20 10" fill="none" stroke={strokeColor} strokeWidth="0.1" opacity="0.1" />
                        </pattern>
                    </defs>

                    <motion.path
                        d="M180,70 L240,70 L240,110 L200,110 L200,150 L240,150 L240,230 L160,230"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="35"
                        strokeLinejoin="miter"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                    />

                    <motion.path
                        d="M185,75 L235,75 L235,115 L195,115 L195,145 L235,145 L235,225 L165,225"
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                    />

                    <g transform="translate(340, 150)">
                        <circle r="110" fill="none" stroke={strokeColor} strokeWidth="0.5" className="opacity-20" />
                        <circle r="105" fill="none" stroke={strokeColor} strokeWidth="1" className="opacity-10" />

                        <circle r="90" fill={`url(#guilloche-${theme})`} stroke="none" />

                        <motion.g animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
                            {[...Array(12)].map((_, i) => (
                                <rect key={i} x="-1" y="-95" width="2" height="10" fill={strokeColor} transform={`rotate(${i * 30})`} opacity="0.3" />
                            ))}
                        </motion.g>

                        <motion.circle
                            r="85" fill="none" stroke={accentColor} strokeWidth="20"
                            strokeDasharray="4 8"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        />

                        <motion.text
                            y="4"
                            textAnchor="middle"
                            fill={textColor}
                            className="text-[12px] font-black tracking-[0.2em] font-mono"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.8, scale: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            SINCE 1996
                        </motion.text>
                    </g>
                </svg>
            </div>

            <motion.div className="mt-16 text-center z-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                <h1 className="font-serif text-[32px] tracking-[0.05em] mb-2 font-bold uppercase" style={{ color: textColor }}>Jackson, Etti & Edu</h1>
                <div className="h-[1px] w-full bg-zinc-400/20 mb-4 max-w-xs mx-auto" />
                <div className="flex items-center justify-center gap-8 text-[9px] tracking-[0.5em] uppercase text-zinc-500 font-mono font-medium">
                    <span>Legal Excellence</span>
                    <div className="w-[1px] h-3 bg-zinc-300 transform rotate-[30deg]" />
                    <span>30 Years</span>
                    <div className="w-[1px] h-3 bg-zinc-300 transform rotate-[30deg]" />
                    <span>Est. 1996</span>
                </div>
            </motion.div>
        </div>
    );
};
