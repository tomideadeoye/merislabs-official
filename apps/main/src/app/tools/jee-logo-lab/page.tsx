'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Download, ChevronRight } from 'lucide-react';
import { JEE_BRAND } from './components/shared';

// Import New Modular Components
import { Concept4Canvas } from './components/concept-4';
import { Concept21Canvas } from './components/concept-21';
import { Concept22Canvas } from './components/concept-22';
import { Concept23Canvas } from './components/concept-23';
import { Concept25Canvas } from './components/concept-25';


/**
 * JEE LOGO WORKBENCH - SOVEREIGN EDITION (Modular Refactor)
 */

export default function JEELogoLabPage() {
    const [activeConcept, setActiveConcept] = useState<number>(4);
    const [downloading, setDownloading] = useState<string | null>(null);
    const [zoom, setZoom] = useState(0.85);
    const [primaryColor, setPrimaryColor] = useState(JEE_BRAND.colors.primary);
    const [accentColor, setAccentColor] = useState(JEE_BRAND.colors.accent);
    const workbenchRef = useRef<HTMLDivElement>(null);

    const downloadAsImage = async (element: HTMLElement | null, filename: string, scale = 4) => {
        if (!element) return;
        setDownloading(filename);
        try {
            const html2canvas = (await import('html2canvas-pro')).default;
            const canvas = await html2canvas(element, { scale, useCORS: true, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setDownloading(null);
        }
    };

    const concepts = [
        { id: 4, name: 'Legal Portal' },
        { id: 21, name: 'Architectural Outline' },
        { id: 22, name: 'Judicial Seal' },
        { id: 23, name: 'Sovereign Ledger' },
        { id: 25, name: 'Triple Portal' },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-50 relative overflow-hidden">
            <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex flex-col">
                    <h1 className="text-lg font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        JEE @ 30
                    </h1>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-6 pr-6 border-r border-gray-100">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Primary</span>
                            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-6 rounded-md cursor-pointer border-none p-0 overflow-hidden" title="Primary Color" />
                        </div>
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Accent</span>
                            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-12 h-6 rounded-md cursor-pointer border-none p-0 overflow-hidden" title="Accent Color" />
                        </div>
                        <button onClick={() => { setPrimaryColor(JEE_BRAND.colors.primary); setAccentColor(JEE_BRAND.colors.accent); }} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-[9px] font-bold uppercase tracking-widest rounded text-gray-400 transition-colors">Reset</button>
                    </div>
                    <button onClick={() => downloadAsImage(workbenchRef.current, `JEE_30_Concept_${activeConcept}`, 4)} className="px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-gray-800 transition-all active:scale-95 shadow-lg">
                        <Download size={14} /> {downloading ? 'Processing...' : 'Production Export'}
                    </button>
                </div>
            </header>

            <main className="flex">
                <div className="flex-1 p-12 bg-gray-50/20">
                    <div className="flex justify-center items-end mb-8 w-full">
                        <div className="flex items-center gap-4 w-full max-w-4xl mx-auto">
                            <div className="flex flex-1 flex-wrap bg-gray-100/50 p-1 rounded-[1.5rem] border border-gray-200 shadow-sm justify-center">
                                {concepts.map((concept) => {
                                    return (
                                        <button key={concept.id} onClick={() => setActiveConcept(concept.id)} className={`flex-1 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeConcept === concept.id ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                                            {concept.name}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex items-center bg-white rounded-full p-1 border border-gray-200 shadow-sm shrink-0">
                                <button onClick={() => setZoom(p => Math.max(0.1, p - 0.1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ZoomOut size={16} /></button>
                                <span className="text-[11px] font-mono px-3 text-gray-500 min-w-[50px] text-center font-bold">{Math.round(zoom * 100)}%</span>
                                <button onClick={() => setZoom(p => Math.min(2, p + 0.1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ZoomIn size={16} /></button>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <motion.div ref={workbenchRef} animate={{ scale: zoom }} className="w-full flex rounded-[3rem] bg-[#0a0a0a] border border-gray-200 shadow-2xl overflow-hidden relative" style={{ aspectRatio: '21/9' }}>
                            {/* Light Mode Split */}
                            <div className="flex-1 relative border-r border-zinc-200">
                                {activeConcept === 4 && <Concept4Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#ffffff" theme="light" />}
                                {activeConcept === 21 && <Concept21Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#ffffff" theme="light" />}
                                {activeConcept === 22 && <Concept22Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#ffffff" theme="light" />}
                                {activeConcept === 23 && <Concept23Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#ffffff" theme="light" />}
                                {activeConcept === 25 && <Concept25Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#ffffff" theme="light" />}

                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/5 backdrop-blur-sm rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-black/40">
                                    Light Concept
                                </div>
                            </div>

                            {/* Dark Mode Split */}
                            <div className="flex-1 relative">
                                {activeConcept === 4 && <Concept4Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#0a0a0a" theme="dark" />}
                                {activeConcept === 21 && <Concept21Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#0a0a0a" theme="dark" />}
                                {activeConcept === 22 && <Concept22Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#0a0a0a" theme="dark" />}
                                {activeConcept === 23 && <Concept23Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#0a0a0a" theme="dark" />}
                                {activeConcept === 25 && <Concept25Canvas primaryColor={primaryColor} accentColor={accentColor} bgColor="#0a0a0a" theme="dark" />}

                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/5 backdrop-blur-sm rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                                    Dark Concept
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
