'use client';

import { motion } from 'framer-motion';
import { ConceptProps } from './shared';

export const Concept23Canvas = ({ primaryColor, accentColor, bgColor, theme = 'light' }: ConceptProps) => {
    const isDark = theme === 'dark';
    const adaptivePrimary = isDark ? 'white' : primaryColor;
    const textColor = isDark ? 'white' : '#1a1a1a';
    const strokeColor = isDark ? 'white' : '#1a1a1a';
    const gridColor = isDark ? 'white' : '#1a1a1a';
    const darkBg = bgColor || '#0a0a0a';
    const lightBg = bgColor || '#fcfcfc';

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-12 overflow-hidden transition-colors duration-1000" style={{ backgroundColor: isDark ? darkBg : lightBg }}>
            {/* Microprint / Security Background inspired by High-Value Paper */}
            <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(${accentColor}22 0.5px, transparent 0.5px)`,
                backgroundSize: '12px 12px',
                opacity: 0.3
            }} />

            <div className="absolute inset-x-0 top-0 h-[2px] opacity-10" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
            <div className="absolute inset-x-0 bottom-0 h-[2px] opacity-10" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

            <div className="relative z-10 flex items-center justify-center scale-[1.3]">
                <svg viewBox="0 0 500 300" className="w-[450px] h-auto">
                    <defs>
                        <filter id={`subtleGlow-${theme}`}>
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Currency rosette pattern */}
                        <pattern id={`ledgerPattern-${theme}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={accentColor} strokeWidth="0.1" opacity="0.2" />
                        </pattern>

                        <mask id={`threeMask-${theme}`}>
                            <rect x="0" y="0" width="500" height="300" fill="white" />
                        </mask>
                    </defs>

                    {/* Banknote '3' - Parallel Engraved Lines */}
                    <g mask={`url(#threeMask-${theme})`}>
                        {[...Array(12)].map((_, i) => (
                            <motion.path
                                key={i}
                                d="M180,60 C240,60 260,115 200,150 C260,185 240,240 180,240"
                                fill="none"
                                stroke={adaptivePrimary}
                                strokeWidth="2"
                                transform={`translate(${i * 3 - 18}, 0)`}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.3 }}
                                transition={{ duration: 2, delay: i * 0.05 }}
                            />
                        ))}
                    </g>

                    {/* Main Structure for '3' */}
                    <motion.path
                        d="M180,60 C240,60 260,115 200,150 C260,185 240,240 180,240"
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="12"
                        strokeLinecap="square"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* The Sovereign Rosette (0) */}
                    <g transform="translate(350, 150)">
                        {/* Base rosette layers */}
                        {[...Array(36)].map((_, i) => (
                            <motion.ellipse
                                key={i}
                                cx="0" cy="0" rx="90" ry="20"
                                fill="none"
                                stroke={adaptivePrimary}
                                strokeWidth="0.15"
                                transform={`rotate(${i * 10})`}
                                animate={{ rotate: 360 + (i * 10) }}
                                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                                opacity="0.4"
                            />
                        ))}

                        {/* Solid Inner Portal Ring */}
                        <motion.circle
                            r="65" fill="none" stroke={adaptivePrimary} strokeWidth="1"
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
                        />

                        {/* The Active Red Pulse Ring */}
                        <motion.circle
                            r="75" fill="none" stroke={accentColor} strokeWidth="2"
                            strokeDasharray="2 18"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Mathematical Dot Markers */}
                        {[...Array(60)].map((_, i) => (
                            <circle key={i} cx="0" cy="-90" r="0.5" fill={strokeColor} transform={`rotate(${i * 6})`} opacity={i % 5 === 0 ? 0.8 : 0.2} />
                        ))}

                        <motion.text
                            y="4"
                            textAnchor="middle"
                            fill={adaptivePrimary}
                            className="text-[10px] font-bold tracking-[0.4em] font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 2 }}
                        >
                            JEE • 30
                        </motion.text>
                    </g>
                </svg>
            </div>

            {/* Premium Typography Section */}
            <motion.div className="mt-20 text-center z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="h-[0.5px] w-12 bg-zinc-300" />
                    <h1 className="font-serif text-[28px] tracking-[0.15em] font-light italic" style={{ color: textColor }}>Jackson, Etti & Edu</h1>
                    <div className="h-[0.5px] w-12 bg-zinc-300" />
                </div>
                <p className="text-[10px] tracking-[0.6em] uppercase text-zinc-400 font-mono">
                    Thirty Years of Legal Sovereignty
                </p>
            </motion.div>
        </div>
    );
};
