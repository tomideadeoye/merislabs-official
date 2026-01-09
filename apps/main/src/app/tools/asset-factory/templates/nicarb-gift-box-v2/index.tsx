'use client';
// Refined Panel Rotation Logic

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize, Move, RotateCw, Download } from 'lucide-react';
import { TemplateProps } from '../../types';
import { TopPanel } from './TopPanel';
import { FrontPanel } from './FrontPanel';
import { BackPanel } from './BackPanel';
import { LeftPanel, RightPanel } from './SidePanels';
import { BottomPanel } from './BottomPanel';
import { InnerPanel } from './InnerPanel';
import { Box3DPreview } from './Box3DPreview';
import { useWindowSize } from 'react-use';
import { cn } from '@/lib/utils';
import { PANEL_DIMENSIONS, BoxPanel, NICARB_BRAND } from './constants';

// Main Template Component
export const NicarbGiftBoxV2Template = ({ containerRef }: TemplateProps) => {
    const [activePanel, setActivePanel] = useState<BoxPanel>('top');
    const [zoom, setZoom] = useState(0.6); // Start slightly zoomed out
    const [rotations, setRotations] = useState<Record<string, number>>({
        top: 0, inner: 0, front: 0, back: 0, left: 0, right: 0, bottom: 0, preview3d: 0
    });
    const viewportRef = useRef<HTMLDivElement>(null);
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    const currentRotation = rotations[activePanel] || 0;
    const isTopPanel = ['top', 'inner', 'bottom'].includes(activePanel);
    const isRotated = Math.round(currentRotation / 90) % 2 !== 0;
    const [isExportMode, setIsExportMode] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('export') === 'true') {
            setIsExportMode(true);
            const panelParam = searchParams.get('panel') as BoxPanel;
            if (panelParam && PANEL_DIMENSIONS[panelParam]) {
                setActivePanel(panelParam);
            }
        }
    }, []);

    // Derived dimensions: Landscape locked for top panels, aspect-swappable for sides
    const getTargetDimensions = () => {
        // ALWAYS treat top, inner, and bottom as landscape in the 2D UI
        // regardless of rotation state (which we use for 3D)

        if (activePanel === 'print_all') return { width: '100%', height: 'auto' };
        if (activePanel === 'preview3d') return { width: 800, height: 800 };

        const panel = PANEL_DIMENSIONS[activePanel as keyof typeof PANEL_DIMENSIONS];
        const baseW = panel.width * 80;
        const baseH = panel.height * 80;

        if (isTopPanel) {
            // FAIL-SAFE: Force "Laptop Box" (Landscape) Aspect Ratio
            // Width MUST be the larger dimension. Height MUST be the smaller.
            const maxDim = Math.max(baseW, baseH);
            const minDim = Math.min(baseW, baseH);
            return { width: maxDim, height: minDim };
        }

        // Side strips can stay flexible
        return {
            width: isRotated ? baseH : baseW,
            height: isRotated ? baseW : baseH
        };
    };

    const fitToScreen = () => {
        if (!viewportRef.current) return;
        if (activePanel === 'print_all') {
            setZoom(1);
            return;
        }
        const padding = 100;
        const availableWidth = viewportRef.current.clientWidth - padding;
        const availableHeight = viewportRef.current.clientHeight - padding;
        const target = getTargetDimensions();

        // Safety check for target dimensions
        if (typeof target.width === 'string' || typeof target.height === 'string') return;

        const scaleX = availableWidth / (target.width as number);
        const scaleY = availableHeight / (target.height as number);
        setZoom(Math.min(scaleX, scaleY, 0.95));
    };

    useEffect(() => {
        const timer = setTimeout(fitToScreen, 100);
        return () => clearTimeout(timer);
    }, [activePanel, currentRotation, windowWidth, windowHeight]);

    const renderPanel = () => {
        if (activePanel === 'print_all') {
            return (
                <div id="batch-print-container" className="flex flex-col items-center w-full bg-slate-50 min-h-screen pb-20 print:bg-white print:pb-0 print:block">
                    <div className="max-w-4xl w-full space-y-20 print:space-y-0 print:max-w-none print:w-full">
                        {[
                            { id: 'top', Comp: TopPanel, title: 'TOP LID (Outer)', dims: PANEL_DIMENSIONS.top },
                            { id: 'inner', Comp: InnerPanel, title: 'INNER LID (Quote)', dims: PANEL_DIMENSIONS.inner },
                            { id: 'front', Comp: FrontPanel, title: 'FRONT PANEL (Long)', dims: PANEL_DIMENSIONS.front },
                            { id: 'back', Comp: BackPanel, title: 'BACK PANEL (QR)', dims: PANEL_DIMENSIONS.back },
                            { id: 'left', Comp: LeftPanel, title: 'LEFT SIDE', dims: PANEL_DIMENSIONS.left },
                            { id: 'right', Comp: RightPanel, title: 'RIGHT SIDE', dims: PANEL_DIMENSIONS.right },
                            { id: 'bottom', Comp: BottomPanel, title: 'BOTTOM BASE', dims: PANEL_DIMENSIONS.bottom },
                        ].map((item) => (
                            <div key={item.id} className="flex flex-col items-center print:block print:w-full print:h-[100vh] print:mb-0 print:break-after-page print:page-break-after-always relative">
                                {/* Screen-Only Header */}
                                <div className="mb-4 text-center print:hidden">
                                    <h3 className="text-sm font-bold text-slate-400">{item.title}</h3>
                                    <p className="text-[10px] bg-slate-200 text-slate-500 rounded px-2 py-0.5 inline-block mt-1">
                                        {item.dims.width}" × {item.dims.height}"
                                    </p>
                                </div>

                                {/* The Component Wrapper */}
                                <div
                                    className="bg-white shadow-sm ring-1 ring-slate-200 print:shadow-none print:ring-0 overflow-hidden relative print:static"
                                    style={{
                                        // Screen: scaled for visibility
                                        // Print: 100% width/height of the page
                                        width: activePanel === 'print_all' ? (typeof window !== 'undefined' && window.matchMedia('print').matches ? '100%' : `${item.dims.width * 80}px`) : '100%',
                                        height: activePanel === 'print_all' ? (typeof window !== 'undefined' && window.matchMedia('print').matches ? '100%' : `${item.dims.height * 80}px`) : '100%',
                                        breakInside: 'avoid'
                                    }}
                                >
                                    {/* Direct render, no rotation props or complexity */}
                                    {/* @ts-ignore */}
                                    <item.Comp rotation={0} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        const props = { rotation: isTopPanel ? 0 : currentRotation };
        switch (activePanel) {
            case 'top': return <TopPanel {...props} />;
            case 'inner': return <InnerPanel {...props} />;
            case 'front': return <FrontPanel {...props} />;
            case 'back': return <BackPanel {...props} />;
            case 'left': return <LeftPanel {...props} />;
            case 'right': return <RightPanel {...props} />;
            case 'bottom': return <BottomPanel {...props} />;
            case 'preview3d': return <Box3DPreview />;
            default: return <TopPanel {...props} />;
        }
    };

    const TABS: { id: BoxPanel; label: string }[] = [
        { id: 'print_all', label: '🖨️  ALL PANELS (BATCH)' },
        { id: 'top', label: 'Top (Lid)' },
        { id: 'inner', label: 'Inner Panel' },
        { id: 'front', label: 'Front Panel' },
        { id: 'back', label: 'Back Panel' },
        { id: 'left', label: 'Left Side' },
        { id: 'right', label: 'Right Side' },
        { id: 'bottom', label: 'Bottom' },
        { id: 'preview3d', label: '3D PREVIEW' },
    ];

    if (isExportMode) {
        const target = getTargetDimensions();
        return (
            <div id="export-target" className="bg-white inline-block">
                <style>{`
                    body { background: white !important; overflow: hidden !important; margin: 0 !important; }
                    #export-target { width: ${target.width}px; height: ${target.height}px; }
                `}</style>
                {renderPanel()}
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex flex-col bg-slate-50 font-sans selection:bg-emerald-100">
            <style>{`
                .canvas-grid { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px); }
                .canvas-grid-fine { background-size: 8px 8px; background-image: linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px); }

                @media print {
                    @page {
                        margin: 0;
                        size: landscape;
                    }
                    /* Reset ALL visibility / layout logic to defaults */
                    html, body {
                        height: auto !important;
                        overflow: visible !important;
                        background: white !important;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #print-target, #print-target * {
                        visibility: visible;
                    }
                    #print-target {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        transform: none !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    /* Ensure headers/footers dont clip */
                    .print-page-break {
                        break-after: page;
                        page-break-after: always;
                    }
                    /* Force background graphics to print */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

            {/* TAB NAV */}
            <div className="flex items-center gap-1 p-2 bg-white border-b border-gray-200 overflow-x-auto no-scrollbar shadow-sm relative z-30 print:hidden">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActivePanel(tab.id)}
                        className={cn(
                            "px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap border border-transparent",
                            activePanel === tab.id
                                ? "bg-[#064802] text-white shadow-md border-[#043301]"
                                : "text-slate-500 hover:text-[#064802] hover:bg-emerald-50"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}

                {/* CONTROLS */}
                {activePanel !== 'preview3d' && (
                    <div className="flex items-center gap-3 ml-auto pr-4 border-l border-gray-100 pl-4">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-900 rounded-md text-[10px] font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
                        >
                            <Download size={14} />
                            PRINT PDF
                        </button>

                        {activePanel !== 'print_all' && (
                            <>
                                <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                                <button onClick={() => setRotations(p => ({ ...p, [activePanel]: (p[activePanel] || 0) + 90 }))} className="p-2 hover:bg-emerald-50 rounded-full text-slate-400 hover:text-[#064802] transition-colors"><RotateCw size={18} /></button>
                                <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
                                    <button onClick={() => setZoom(p => Math.max(0.1, p - 0.1))} className="p-1.5 hover:bg-white rounded-full transition-shadow shadow-none hover:shadow-sm"><ZoomOut size={14} /></button>
                                    <span className="text-[10px] font-mono px-2 text-slate-500 min-w-[45px] text-center">{Math.round(zoom * 100)}%</span>
                                    <button onClick={() => setZoom(p => Math.min(4, p + 0.1))} className="p-1.5 hover:bg-white rounded-full transition-shadow shadow-none hover:shadow-sm"><ZoomIn size={14} /></button>
                                </div>
                                <button onClick={fitToScreen} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:border-[#064802] hover:text-[#064802] transition-all">FIT VIEW</button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* VIEWPORT */}
            <div ref={viewportRef} className={cn(
                "flex-1 relative bg-slate-100/50 print:bg-white",
                activePanel === 'print_all' ? "overflow-y-auto" : "overflow-hidden"
            )}>
                {activePanel !== 'preview3d' && activePanel !== 'print_all' && (
                    <>
                        <div className="absolute inset-0 canvas-grid pointer-events-none print:hidden" />
                        <div className="absolute inset-0 canvas-grid-fine pointer-events-none print:hidden" />
                        <div className="absolute top-8 left-8 z-20 pointer-events-none space-y-1 print:hidden">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-slate-200 inline-flex items-center gap-3 text-[11px] font-black text-[#064802] uppercase tracking-tighter">
                                <Move size={14} className="opacity-40" />
                                <span>{activePanel} Canvas Active</span>
                            </div>
                            <div className="text-[10px] text-slate-400 pl-4 font-mono font-bold">
                                {PANEL_DIMENSIONS[activePanel as keyof typeof PANEL_DIMENSIONS].width}" × {PANEL_DIMENSIONS[activePanel as keyof typeof PANEL_DIMENSIONS].height}"
                            </div>
                        </div>
                    </>
                )}

                <div
                    id="print-target"
                    className={cn(
                        activePanel === 'print_all' ? "w-full min-h-screen py-20" : "absolute inset-0 flex items-center justify-center p-20",
                        "print:p-0 print:block print:inset-0 print:static"
                    )}
                >
                    <motion.div
                        drag={activePanel !== 'preview3d' && activePanel !== 'print_all'}
                        dragMomentum={false}
                        animate={{
                            scale: (activePanel === 'preview3d' || activePanel === 'print_all') ? 1 : zoom,
                            width: (activePanel === 'preview3d' || activePanel === 'print_all') ? '100%' : `${getTargetDimensions().width}px`,
                            height: (activePanel === 'preview3d' || activePanel === 'print_all') ? '100%' : `${getTargetDimensions().height}px`,
                        }}
                        className={cn(
                            "relative origin-center",
                            activePanel !== 'preview3d' && activePanel !== 'print_all' && "bg-white shadow-[0_30px_90px_rgba(0,0,0,0.12)] rounded-sm ring-1 ring-black/5 print:shadow-none print:ring-0"
                        )}
                    >
                        <div ref={activePanel === 'preview3d' || activePanel === 'print_all' ? null : containerRef} className="w-full h-full relative overflow-hidden">
                            <motion.div
                                className="w-full h-full"
                                animate={{
                                    // FORCE LOCK: Top/Inner/Bottom are ALWAYS 0 rotation (Landscape) in 2D
                                    // This prevents the 'Portrait Letter' effect if the user clicks rotate
                                    rotate: (isTopPanel || activePanel === 'print_all') ? 0 : (isRotated ? currentRotation : 0)
                                }}
                            >
                                {renderPanel()}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* STATUS FOOTER */}
            {(activePanel !== 'print_all' && activePanel !== 'preview3d') && (
                <div className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-6 z-40 print:hidden">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{activePanel}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span>{PANEL_DIMENSIONS[activePanel as keyof typeof PANEL_DIMENSIONS].width}" UNIT WIDTH</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[#064802]">Sovereign Draft V2.1</span>
                    </div>
                    <div className="flex gap-1.5">
                        {[NICARB_BRAND.colors.primary, NICARB_BRAND.colors.accent, NICARB_BRAND.colors.red].map(c => (
                            <div key={c} className="w-3 h-3 rounded-full border border-black/5 shadow-sm" style={{ backgroundColor: c }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NicarbGiftBoxV2Template;
