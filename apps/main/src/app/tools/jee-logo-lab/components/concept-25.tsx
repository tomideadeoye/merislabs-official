'use client';

import { motion } from 'framer-motion';
import { ConceptProps } from './shared';

export const Concept25Canvas = ({ primaryColor, accentColor, bgColor, theme = 'dark' }: ConceptProps) => {
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
                        <linearGradient id={`markGrad25-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={accentColor} />
                            <stop offset="100%" stopColor={primaryColor} />
                        </linearGradient>

                        <mask id={`tripleSlashMask-${theme}`}>
                            <rect x="0" y="0" width="500" height="300" fill="white" />
                            <g transform="translate(195, 105) rotate(-28)">
                                <rect x="-10" y="0" width="8" height="100" fill="black" />
                                <rect x="12" y="-15" width="8" height="100" fill="black" />
                                <rect x="34" y="-30" width="8" height="100" fill="black" />
                            </g>
                        </mask>

                        <linearGradient id={`gloss-${theme}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={isDark ? "white" : "black"} stopOpacity="0.2" />
                            <stop offset="50%" stopColor={isDark ? "white" : "black"} stopOpacity="0" />
                            <stop offset="100%" stopColor={isDark ? "white" : "black"} stopOpacity="0.1" />
                        </linearGradient>

                        <mask id={`zeroRingMask25-${theme}`}>
                            <circle r="93" fill="white" />
                            <circle r="55" fill="black" />
                        </mask>
                    </defs>

                    <g mask={`url(#tripleSlashMask-${theme})`}>
                        <motion.path
                            d="M180,60 C240,60 260,115 200,150 C260,185 240,240 180,240"
                            fill="none"
                            stroke={`url(#markGrad25-${theme})`}
                            strokeWidth="42"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                        <path
                            d="M180,60 C240,60 260,115 200,150 C260,185 240,240 180,240"
                            fill="none"
                            stroke={`url(#gloss-${theme})`}
                            strokeWidth="42"
                            strokeLinecap="round"
                            opacity="0.5"
                        />
                    </g>

                    <g transform="translate(340, 150)">
                        <circle r="95" fill="none" stroke={secondaryColor} strokeWidth="1" className="opacity-10" />

                        {/* Image Gallery Ring */}
                        <motion.g
                            mask={`url(#zeroRingMask25-${theme})`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, rotate: 360 }}
                            transition={{
                                opacity: { duration: 3, delay: 2 },
                                rotate: { duration: 45, ease: "linear", repeat: Infinity }
                            }}
                        >
                            {Array.from({ length: 15 }).map((_, i) => (
                                <image
                                    key={i}
                                    href={`/jee/gallery/${i + 1}.webp`}
                                    x={-22}
                                    y={-93}
                                    width="44"
                                    height="40"
                                    preserveAspectRatio="xMidYMin slice"
                                    transform={`rotate(${i * 24})`}
                                    style={{ filter: isDark ? 'grayscale(50%) brightness(0.8) contrast(1.2)' : 'grayscale(20%) brightness(1.1) contrast(1.1)' }}
                                />
                            ))}
                        </motion.g>
                        <motion.circle
                            r="82" fill="none" stroke={accentColor} strokeWidth="14"
                            strokeDasharray="18 32"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.circle
                            r="102" fill="none" stroke={accentColor} strokeWidth="1.5"
                            strokeDasharray="2 198"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />

                        <motion.text
                            y="6"
                            textAnchor="middle"
                            fill={textColor}
                            className="text-[11px] font-black tracking-[0.4em] font-mono opacity-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ delay: 1.5 }}
                        >
                            SINCE 1996
                        </motion.text>
                    </g>
                </svg>
            </div>

            <motion.div className="mt-16 text-center z-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                <h2 className="font-serif text-[32px] tracking-[0.12em] mb-4 font-bold italic" style={{ color: textColor }}>Jackson, Etti & Edu</h2>
                <div className="flex items-center justify-center gap-6">
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
                    <div className="flex items-center gap-4 text-[9px] tracking-[0.5em] uppercase text-zinc-400 font-mono font-black">
                        <span>Legal</span>
                        <span className="text-red-600">•</span>
                        <span>Sovereign</span>
                        <span className="text-red-600">•</span>
                        <span>30 Years</span>
                    </div>
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
                </div>
            </motion.div>
        </div>
    );
};
