'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NICARB_BRAND, PANEL_DIMENSIONS } from './constants';
import { TopPanel } from './TopPanel';
import { FrontPanel } from './FrontPanel';
import { BackPanel } from './BackPanel';
import { LeftPanel, RightPanel } from './SidePanels';
import { BottomPanel } from './BottomPanel';

export const Box3DPreview = () => {
    const [rotate, setRotate] = useState({ x: -20, y: 45 });
    const [isLidOpen, setIsLidOpen] = useState(false);

    // Get dimensions in pixels for the 3D model (scaled down for preview)
    const scale = 15; // px per inch
    const w = PANEL_DIMENSIONS.front.width * scale; // Long side (Front/Back)
    const h = PANEL_DIMENSIONS.front.height * scale;
    const d = PANEL_DIMENSIONS.left.width * scale; // Short side (Left/Right)

    const lw = PANEL_DIMENSIONS.top.width * scale;
    const lh = 40 * (scale / 25.4); // 40mm lid height converted to pixels
    const ld = PANEL_DIMENSIONS.top.height * scale;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 overflow-hidden select-none">
            <div className="absolute top-8 left-8 z-50 flex flex-col gap-2">
                <button
                    onClick={() => setIsLidOpen(!isLidOpen)}
                    className="px-6 py-2 bg-[#032204] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-[#064802] transition-all"
                >
                    {isLidOpen ? 'Close Lid' : 'Open Lid'}
                </button>
                <p className="text-[10px] text-gray-400 font-mono">Drag container to rotate (Coming soon)</p>
            </div>

            <div
                className="relative preserve-3d transition-transform duration-700 ease-out"
                style={{
                    perspective: '1200px',
                    transformStyle: 'preserve-3d',
                }}
            >
                <div
                    className="relative transition-transform duration-500"
                    style={{
                        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* --- BASE TRAY --- */}
                    <div style={{ transformStyle: 'preserve-3d' }}>
                        {/* Bottom */}
                        <div className="absolute border border-gray-200" style={{
                            width: w, height: d,
                            transform: `rotateX(90deg) translateZ(${-h / 2}px)`,
                            backgroundColor: '#fff'
                        }}>
                            <div className="scale-[0.2] origin-top-left" style={{ width: w * 5, height: d * 5 }}>
                                <BottomPanel />
                            </div>
                        </div>

                        {/* Front */}
                        <div className="absolute border border-gray-200" style={{
                            width: w, height: h,
                            transform: `translateZ(${d / 2}px)`,
                            backgroundColor: '#fff'
                        }}>
                            <div className="scale-[0.2] origin-top-left" style={{ width: w * 5, height: h * 5 }}>
                                <FrontPanel />
                            </div>
                        </div>

                        {/* Back */}
                        <div className="absolute border border-gray-200" style={{
                            width: w, height: h,
                            transform: `rotateY(180deg) translateZ(${d / 2}px)`,
                            backgroundColor: '#fff'
                        }}>
                            <div className="scale-[0.2] origin-top-left" style={{ width: w * 5, height: h * 5 }}>
                                <BackPanel />
                            </div>
                        </div>

                        {/* Left */}
                        <div className="absolute border border-gray-200" style={{
                            width: d, height: h,
                            transform: `rotateY(-90deg) translateZ(${w / 2}px)`,
                            backgroundColor: '#fff'
                        }}>
                            <div className="scale-[0.2] origin-top-left" style={{ width: d * 5, height: h * 5 }}>
                                <LeftPanel />
                            </div>
                        </div>

                        {/* Right */}
                        <div className="absolute border border-gray-200" style={{
                            width: d, height: h,
                            transform: `rotateY(90deg) translateZ(${w / 2}px)`,
                            backgroundColor: '#fff'
                        }}>
                            <div className="scale-[0.2] origin-top-left" style={{ width: d * 5, height: h * 5 }}>
                                <RightPanel />
                            </div>
                        </div>
                    </div>

                    {/* --- LID ASSEMBLY --- */}
                    <motion.div
                        initial={false}
                        animate={{
                            y: isLidOpen ? -120 : 0,
                            rotateX: isLidOpen ? -110 : 0,
                        }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        style={{
                            transformStyle: 'preserve-3d',
                            position: 'absolute',
                            top: -h / 2, // Sits on top of the base
                            left: (w - lw) / 2,
                            transformOrigin: `center ${-ld / 2}px`, // Hinge at the back edge
                            zIndex: 100,
                        }}
                    >
                        {/* Lid Top */}
                        <div className="absolute border border-gray-300 shadow-2xl" style={{
                            width: lw, height: ld,
                            transform: `rotateX(90deg) translateZ(${lh / 2}px)`,
                            backgroundColor: '#fff',
                        }}>
                            <div className="scale-[0.15] origin-top-left" style={{ width: lw / 0.15, height: ld / 0.15 }}>
                                <TopPanel />
                            </div>
                        </div>

                        {/* Lid Front Wall */}
                        <div className="absolute border border-gray-300" style={{
                            width: lw, height: lh,
                            transform: `translateZ(${ld / 2}px)`,
                            backgroundColor: NICARB_BRAND.colors.primary,
                        }} />

                        {/* Lid Back Wall */}
                        <div className="absolute border border-gray-300" style={{
                            width: lw, height: lh,
                            transform: `rotateY(180deg) translateZ(${ld / 2}px)`,
                            backgroundColor: NICARB_BRAND.colors.primary,
                        }} />

                        {/* Lid Left Wall */}
                        <div className="absolute border border-gray-300" style={{
                            width: ld, height: lh,
                            transform: `rotateY(-90deg) translateZ(${lw / 2}px)`,
                            backgroundColor: NICARB_BRAND.colors.primary,
                        }} />

                        {/* Lid Right Wall */}
                        <div className="absolute border border-gray-300" style={{
                            width: ld, height: lh,
                            transform: `rotateY(90deg) translateZ(${lw / 2}px)`,
                            backgroundColor: NICARB_BRAND.colors.primary,
                        }} />
                    </motion.div>
                </div>
            </div>

            {/* Rotation Controls */}
            <div className="absolute bottom-12 flex gap-4">
                <input
                    type="range" min="-180" max="180" value={rotate.y}
                    onChange={(e) => setRotate(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-32 accent-[#064802]"
                />
                <input
                    type="range" min="-90" max="90" value={rotate.x}
                    onChange={(e) => setRotate(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-32 accent-[#064802]"
                />
            </div>
        </div>
    );
};
