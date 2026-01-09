'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';
import { Mail, Phone, Globe, MapPin, ShieldCheck } from 'lucide-react';

export const EmeraldPrestigeTemplate = ({ client, content, containerRef, visualAsset, activePalette }: TemplateProps) => {
    // Use palette colors if provided, otherwise use lighter default emerald tones
    const primaryColor = activePalette?.primary || '#10b981';  // Much brighter emerald
    const secondaryColor = activePalette?.secondary || '#6ee7b7'; // Brighter mint
    const backgroundColor = activePalette?.background || '#065f46'; // Lifted background
    const accentColor = activePalette?.accent || '#D4AF37'; // Gold accent

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden shadow-2xl flex flex-col select-none"
            style={{
                background: `radial-gradient(circle at 40% 60%, ${primaryColor} 0%, ${backgroundColor} 100%)`, // Adjusted center
                boxShadow: 'inset 0 0 150px rgba(0,0,0,0.3)'
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

                @keyframes gold-flow {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                .emerald-gold-shimmer {
                    background: linear-gradient(90deg, #D4AF37, #F4E6AA, #D4AF37, #F4E6AA, #D4AF37);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gold-flow 8s linear infinite;
                }

                .emerald-silk-overlay {
                    opacity: 0.05;
                    background-image: url('https://www.transparenttextures.com/patterns/silk.png');
                }
            `}</style>

            {/* Silk Texture Layer */}
            <div className="absolute inset-0 emerald-silk-overlay pointer-events-none" />

            {/* Subtle light streak */}
            <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(225deg,rgba(212,175,55,0.05)_0%,transparent_40%)] pointer-events-none" />

            {/* THE VERTICAL STATUS LINE - Left Side */}
            <div className="absolute left-10 top-0 bottom-0 py-12 flex flex-col items-center justify-between z-10">
                <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-[#D4AF37] opacity-40" />

                <div className="flex flex-col items-center gap-6">
                    <div
                        className="text-[10px] tracking-[0.8em] font-bold uppercase [writing-mode:vertical-rl] transform rotate-180 text-white/40"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {content.year === '2026' ? 'MMXXVI' : 'MMXXV'}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                    <div
                        className="font-bold tracking-[0.1em] text-[#D4AF37]"
                        style={{ fontSize: `${24 * (content.textScales?.year || 1)}px`, fontFamily: "'Cinzel', serif" }}
                    >
                        {content.year}
                    </div>
                </div>

                <div className="w-[1px] h-32 bg-gradient-to-t from-transparent to-[#D4AF37] opacity-40" />
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-24">

                {/* Brand Header Stage */}
                <div className="mb-10 flex items-center gap-6">
                    <div className="h-[0.5px] w-24 opacity-30" style={{ backgroundColor: content.headerColor || '#D4AF37' }} />
                    <span
                        className="tracking-[0.5em] font-bold"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: `${18 * (content.textScales?.brandHeader || 1)}px`,
                            color: content.headerColor || '#D4AF37'
                        }}
                    >
                        From NICArb
                    </span>
                    <div className="h-[0.5px] w-24 opacity-30" style={{ backgroundColor: content.headerColor || '#D4AF37' }} />
                </div>

                {/* Holiday Greeting */}
                <div className="text-center relative">
                    {/* Ghost Year Background */}
                    <div className="absolute inset-0 -top-12 flex items-center justify-center pointer-events-none">
                        <span
                            className="font-bold text-white/[0.03] select-none"
                            style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: `${140 * (content.textScales?.year || 1)}px`
                            }}
                        >
                            {content.year}
                        </span>
                    </div>

                    <h2
                        className="font-light text-white leading-none mb-2"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: `${4.5 * (content.textScales?.title || 1)}rem`
                        }}
                    >
                        {content.title.split(' ')[0]}
                    </h2>
                    <h2
                        className="font-bold italic mb-8 emerald-gold-shimmer"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            fontSize: `${5 * (content.textScales?.title || 1)}rem`
                        }}
                    >
                        {content.title.split(' ').slice(1).join(' ')}
                    </h2>
                </div>

                {/* Main Message */}
                <div className="max-w-xl text-center">
                    <p
                        className="text-white font-medium leading-relaxed tracking-wide italic"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: `${22 * (content.textScales?.message || 1)}px`,
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}
                    >
                        {content.message}
                    </p>
                </div>

                {/* Visual Asset - Floating Ornaments */}
                {visualAsset.path && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-56 h-56 opacity-80">
                        <div className="relative w-full h-full p-4">
                            {/* Decorative ring */}
                            <div className="absolute inset-0 rounded-full border border-[#D4AF37]/10 scale-110" />
                            <img
                                src={visualAsset.path}
                                alt={visualAsset.name}
                                className="w-full h-full object-contain filter drop-shadow(0 0 20px rgba(212,175,55,0.2))"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* THE PRESTIGE FOOTER */}
            <div className="h-44 w-full relative flex flex-col justify-end pb-10 px-8">
                {/* Horizontal Gold Line with Glow */}
                <div className="absolute top-0 left-8 right-8 h-[0.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent">
                    <div className="absolute inset-0 blur-[1px] bg-[#D4AF37]/20" />
                </div>

                <div className="flex items-center gap-8 relative z-10">
                    {/* Logo Plate Area */}
                    {(content.footerControls?.showLogo ?? true) && (
                        <div className="flex flex-col items-center gap-3 flex-shrink-0">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-[#D4AF37]/10 rounded-xl blur-lg group-hover:bg-[#D4AF37]/20 transition-all" />
                                <div className="relative h-20 w-48 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] border border-[#D4AF37]/40 rounded-xl flex items-center justify-center p-2 overflow-hidden">
                                    <div className="absolute inset-1 border border-[#D4AF37]/10 rounded-lg pointer-events-none" />
                                    <img
                                        src={client.logo || '/nicarb-logo.png'}
                                        alt={client.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Details Grid - Compact distribution */}
                    <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3 pt-4 border-l border-white/10 pl-8">
                        {(content.footerControls?.showAddress ?? true) && (
                            <div className="flex items-start gap-3">
                                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] mt-1 shrink-0" />
                                <p className="text-[11px] text-white font-bold leading-tight" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${11 * (content.textScales?.footer || 1)}px`
                                }}>
                                    {client.address}
                                </p>
                            </div>
                        )}
                        {(content.footerControls?.showWebsite ?? true) && (
                            <div className="flex items-start gap-3">
                                <Globe className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                                <p className="text-[11px] text-white font-bold tracking-[0.2em] leading-tight" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${11 * (content.textScales?.footer || 1)}px`
                                }}>
                                    {client.website}
                                </p>
                            </div>
                        )}
                        {(content.footerControls?.showPhone ?? true) && (
                            <div className="flex items-start gap-3">
                                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                                <p className="text-[11px] text-white font-extrabold leading-tight" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${11 * (content.textScales?.footer || 1)}px`
                                }}>
                                    {client.phone}
                                </p>
                            </div>
                        )}
                        {(content.footerControls?.showEmail ?? true) && (
                            <div className="flex items-start gap-3">
                                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                                <p className="text-[11px] text-white font-extrabold leading-tight" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${11 * (content.textScales?.footer || 1)}px`
                                }}>
                                    {client.email}
                                </p>
                            </div>
                        )}
                        {(content.footerControls?.showSignature ?? true) && (
                            <div className="col-span-2 mt-1">
                                <p className="text-[#D4AF37] font-bold uppercase tracking-widest" style={{ fontSize: `${12 * (content.textScales?.signature || 1)}px`, fontFamily: content.fontFamilies?.footer || "'Cinzel', serif" }}>
                                    {client.signature || client.name}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Corner Ornamental Details */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_0%_0%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
        </div>
    );
};
