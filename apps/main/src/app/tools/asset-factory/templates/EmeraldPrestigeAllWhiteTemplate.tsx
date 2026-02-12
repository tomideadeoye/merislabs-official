'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';
import { Mail, Phone, Globe, MapPin, ShieldCheck } from 'lucide-react';

export const EmeraldPrestigeAllWhiteTemplate = ({ client, content, containerRef, visualAsset, activePalette }: TemplateProps) => {
    // White background theme - Reversed logic
    // The background is white/cream
    // The accents are the emerald and gold colors
    const primaryColor = activePalette?.primary || '#064802';  // Dark Emerald for text
    const secondaryColor = activePalette?.secondary || '#059669'; // Muted Jade for accents
    const backgroundColor = '#ffffff'; // Stiff White
    const accentColor = activePalette?.accent || '#b45309'; // Darker Gold/Bronze for contrast on white

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden shadow-2xl flex flex-col select-none bg-white"
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600&display=swap');

                @keyframes gold-flow-dark {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                .emerald-gold-shimmer-dark {
                    background: linear-gradient(90deg, #D4AF37, #996515, #D4AF37, #996515, #D4AF37);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gold-flow-dark 8s linear infinite;
                }

                .emerald-silk-overlay-light {
                    opacity: 0.4;
                    background-image: url('https://www.transparenttextures.com/patterns/silk.png');
                    mix-blend-mode: multiply;
                }
            `}</style>

            {/* Silk Texture Layer - Darker blend for white bg */}
            <div className="absolute inset-0 emerald-silk-overlay-light pointer-events-none" />

            {/* Subtle light streak - Inverse */}
            <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(225deg,rgba(0,100,0,0.03)_0%,transparent_40%)] pointer-events-none" />

            {/* THE VERTICAL STATUS LINE - Left Side */}
            <div className="absolute left-10 top-0 bottom-0 py-12 flex flex-col items-center justify-between z-10">
                <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-current opacity-20" style={{ color: primaryColor }} />

                <div className="flex flex-col items-center gap-6">
                    <div
                        className="text-[10px] tracking-[0.8em] font-bold uppercase [writing-mode:vertical-rl] transform rotate-180 opacity-60"
                        style={{ fontFamily: "'Cinzel', serif", color: primaryColor }}
                    >
                        {content.year === '2026' ? 'MMXXVI' : 'MMXXV'}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                    <div
                        className="font-bold tracking-[0.1em]"
                        style={{ fontSize: `${24 * (content.textScales?.year || 1)}px`, fontFamily: "'Cinzel', serif", color: primaryColor }}
                    >
                        {content.year}
                    </div>
                </div>

                <div className="w-[1px] h-32 bg-gradient-to-t from-transparent to-current opacity-20" style={{ color: primaryColor }} />
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-24">

                {/* Brand Header Stage */}
                <div className="mb-8 flex items-center gap-6">
                    <div className="h-[1px] w-24 opacity-20" style={{ backgroundColor: content.headerColor || primaryColor }} />
                    <span
                        className="tracking-[0.5em] font-bold"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: content.headerColor || primaryColor,
                            fontSize: `${18 * (content.textScales?.brandHeader || 1)}px`
                        }}
                    >
                        From NICArb
                    </span>
                    <div className="h-[1px] w-24 opacity-20" style={{ backgroundColor: content.headerColor || primaryColor }} />
                </div>

                {/* Holiday Greeting */}
                <div className="text-center relative py-6">
                    {/* Ghost Year Background - Inverted */}
                    <div className="absolute inset-0 -top-8 flex items-center justify-center pointer-events-none">
                        <span
                            className="font-bold text-[#064802]/[0.03] select-none"
                            style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: `${140 * (content.textScales?.year || 1)}px`
                            }}
                        >
                            {content.year}
                        </span>
                    </div>

                    <h2
                        className="font-medium leading-none mb-2"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: `${4.5 * (content.textScales?.title || 1)}rem`,
                            color: primaryColor
                        }}
                    >
                        {content.title.split(' ')[0]}
                    </h2>
                    <h2
                        className="font-bold italic mb-8 emerald-gold-shimmer-dark drop-shadow-sm"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: `${5 * (content.textScales?.title || 1)}rem`
                        }}
                    >
                        {content.title.split(' ').slice(1).join(' ')}
                    </h2>
                </div>

                {/* Main Message */}
                <div className="max-w-xl text-center">
                    <p
                        className="font-semibold leading-relaxed tracking-wide italic"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: `${22 * (content.textScales?.message || 1)}px`,
                            color: primaryColor
                        }}
                    >
                        {content.message}
                    </p>
                </div>

                {/* Visual Asset - Floating Ornaments */}
                {visualAsset.path && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-56 h-56 opacity-90">
                        <div className="relative w-full h-full p-4">
                            {/* Decorative ring - Darker */}
                            <div className="absolute inset-0 rounded-full border border-[#064802]/10 scale-110" />
                            <img
                                src={visualAsset.path}
                                alt={visualAsset.name}
                                className="w-full h-full object-contain filter drop-shadow(0 10px 20px rgba(6,72,2,0.15))"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* THE PRESTIGE FOOTER - White/Emerald Inversion */}
            <div className="h-48 w-full relative flex flex-col justify-end pb-12 px-8" style={{ backgroundColor: primaryColor }}>
                {/* Horizontal Divider Line */}
                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent">
                    {/* No glow for white version, just clean line */}
                </div>

                <div className="flex items-center gap-8 relative z-10 pt-6">
                    {/* Logo Plate Area */}
                    {(content.footerControls?.showLogo ?? true) && (
                        <div className="flex flex-col items-center gap-3 flex-shrink-0">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-white/10 rounded-xl blur-md group-hover:bg-white/20 transition-all" />
                                <div className="relative h-20 w-48 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/10 rounded-xl flex items-center justify-center p-2 overflow-hidden">
                                    <div className="absolute inset-1 border border-black/5 rounded-lg pointer-events-none" />
                                    <img
                                        src={client.logo || '/nicarb-logo.png'}
                                        alt={client.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Details Grid - High Contrast */}
                    <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4 border-l border-white/10 pl-8">
                        {(content.footerControls?.showAddress ?? true) && (
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                                <p className="text-[11px] font-bold leading-tight" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${11 * (content.textScales?.footer || 1)}px`,
                                    color: '#ffffff'
                                }}>
                                    {client.address}
                                </p>
                            </div>
                        )}
                        {(content.footerControls?.showWebsite ?? true) && (
                            <div className="flex items-start gap-3">
                                <Globe className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                                <p className="text-[11px] font-bold tracking-[0.2em] leading-tight" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${11 * (content.textScales?.footer || 1)}px`,
                                    color: '#ffffff'
                                }}>
                                    {client.website}
                                </p>
                            </div>
                        )}
                        {(content.footerControls?.showPhone ?? true) && (
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                                <p className="text-[11px] font-extrabold leading-tight" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${11 * (content.textScales?.footer || 1)}px`,
                                    color: '#ffffff'
                                }}>
                                    {client.phone}
                                </p>
                            </div>
                        )}
                        {(content.footerControls?.showEmail ?? true) && (
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                                <p className="text-[11px] font-extrabold leading-tight" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${11 * (content.textScales?.footer || 1)}px`,
                                    color: '#ffffff'
                                }}>
                                    {client.email}
                                </p>
                            </div>
                        )}
                        {(content.footerControls?.showSignature ?? true) && (
                            <div className="col-span-2 mt-2">
                                <p className="font-bold uppercase tracking-widest" style={{
                                    fontSize: `${12 * (content.textScales?.signature || 1)}px`,
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    color: accentColor
                                }}>
                                    {client.signature || client.name}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Corner Ornamental Details - Subtle Gold on White */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_0%_0%,rgba(6,72,2,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(6,72,2,0.05)_0%,transparent_70%)] pointer-events-none" />
        </div >
    );
};
