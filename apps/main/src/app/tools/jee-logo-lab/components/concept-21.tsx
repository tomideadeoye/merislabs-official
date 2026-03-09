'use client';

import { motion } from 'framer-motion';
import { ConceptProps } from './shared';

export const Concept21Canvas = ({ accentColor, primaryColor, bgColor, theme = 'light' }: ConceptProps) => {
    const isDark = theme === 'dark';
    const canvasBg = isDark ? (bgColor || '#0a0a0a') : (bgColor || '#fcfcfc');

    // Stark, purely technical contrast colors
    const ink = isDark ? '#ffffff' : '#1a1a1a';
    const subtleInk = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
    const guideInk = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
    const gridColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
    const redAccent = accentColor || '#b1151b';

    // MATHEMATICAL / FIBONACCI CENTER POINTS
    const C1_X = 428.5; const C1_Y = 180; const R1 = 55;
    const C2_X = 428.5; const C2_Y = 324; const R2 = 89;
    const C3_X = 716.5; const C3_Y = 269; const R3 = 144;

    // PATHS
    // 3 path starting at 210 degrees of top circle, ending at 150 degrees of bottom circle.
    // Start: x = 428.5 + 55*cos(210) = 380.87, y = 180 + 55*sin(210) = 152.5
    // Tangent: x = 428.5, y = 235
    // End: x = 428.5 + 89*cos(150) = 351.43, y = 324 + 89*sin(150) = 368.5
    const path3 = `M 380.87 152.5 A 55 55 0 1 1 428.5 235 A 89 89 0 1 1 351.43 368.5`;

    return (
        <div
            className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000"
            style={{ backgroundColor: canvasBg }}
        >
            {/* The Drafting Grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                }}
            />

            <svg viewBox="0 0 1200 520" className="relative z-10 w-[980px] max-w-[92%] h-auto overflow-visible">
                <defs>
                    <mask id="zeroRingMask">
                        <circle cx={C3_X} cy={C3_Y} r={R3} fill="white" />
                        <circle cx={C3_X} cy={C3_Y} r={R2} fill="black" />
                    </mask>
                </defs>

                {/* The Image Ring Gallery Inside the 0 */}
                <motion.g
                    mask="url(#zeroRingMask)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    transition={{
                        opacity: { duration: 3, delay: 2 },
                        rotate: { duration: 45, ease: "linear", repeat: Infinity }
                    }}
                    style={{ transformOrigin: `${C3_X}px ${C3_Y}px` }}
                >
                    {Array.from({ length: 15 }).map((_, i) => (
                        <image
                            key={i}
                            href={`/jee/gallery/${i + 1}.webp`}
                            x={C3_X - 34}
                            y={C3_Y - R3}
                            width="68"
                            height="85"
                            preserveAspectRatio="xMidYMin slice"
                            transform={`rotate(${i * 24} ${C3_X} ${C3_Y})`}
                            style={{ filter: isDark ? 'grayscale(50%) brightness(0.8) contrast(1.2)' : 'grayscale(20%) brightness(1.1) contrast(1.1)' }}
                        />
                    ))}
                </motion.g>

                {/* THE FINAL PATHS: Solid Form */}
                <motion.g
                    fill="none"
                    stroke={ink}
                    strokeWidth="16"
                    strokeLinecap="square"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
                >
                    <motion.path d={path3} />
                    <motion.circle cx={C3_X} cy={C3_Y} r={R3} transform={`rotate(-90 ${C3_X} ${C3_Y})`} />
                </motion.g>

                {/* Red Excision / Core Vein for dramatic technical precision */}
                <motion.g
                    fill="none"
                    stroke={redAccent}
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5, delay: 1.5, ease: "easeInOut" }}
                >
                    <motion.path d={path3} />
                    <motion.circle cx={C3_X} cy={C3_Y} r={R3} transform={`rotate(-90 ${C3_X} ${C3_Y})`} />
                </motion.g>

                {/* Embedded Conceptual Ring (Shows internal scaling structural support) */}
                <motion.circle
                    cx={C3_X} cy={C3_Y} r={R2}
                    fill="none" stroke={ink} strokeWidth="4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                />
            </svg>

            {/* Typography Footer */}
            <motion.div className="mt-16 text-center z-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                <h2 className="font-serif text-[30px] tracking-[0.1em] mb-3 font-semibold" style={{ color: ink }}>Jackson, Etti & Edu</h2>
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
