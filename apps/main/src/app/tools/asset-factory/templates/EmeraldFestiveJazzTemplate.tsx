'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';
import { Mail, Phone, Globe, MapPin, Sparkles } from 'lucide-react';

export const EmeraldFestiveJazzTemplate = ({ client, content, containerRef, visualAsset, activePalette }: TemplateProps) => {
    const primaryColor = activePalette?.primary || '#064802';  // Dark Emerald
    const secondaryColor = activePalette?.secondary || '#059669'; // Jades
    const accentColor = content.headerColor || activePalette?.accent || '#D4AF37'; // Gold or Custom

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden shadow-2xl flex flex-col select-none bg-white"
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600&display=swap');

                @keyframes gold-flow-jazz {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                .gold-shimmer-jazz {
                    background: linear-gradient(90deg, #D4AF37, #F4E6AA, #D4AF37, #996515, #D4AF37);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gold-flow-jazz 6s linear infinite;
                }

                @keyframes firework {
                  0% { transform: translate(0, 0) scale(0); opacity: 1; }
                  50% { opacity: 1; }
                  100% { transform: translate(var(--x), var(--y)) scale(1); opacity: 0; }
                }

                .firework-particle {
                  position: absolute;
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background: var(--color);
                  animation: firework 2s ease-out infinite;
                }

                .silk-texture {
                    opacity: 0.3;
                    background-image: url('https://www.transparenttextures.com/patterns/silk.png');
                    mix-blend-mode: multiply;
                }
            `}</style>

            {/* Festive Layers */}
            <div className="absolute inset-0 silk-texture pointer-events-none" />

            {/* Animated Fireworks (CSS generated) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        {[...Array(12)].map((_, j) => (
                            <div
                                key={j}
                                className="firework-particle"
                                style={{
                                    '--x': `${Math.cos(j * 30 * Math.PI / 180) * 80}px`,
                                    '--y': `${Math.sin(j * 30 * Math.PI / 180) * 80}px`,
                                    '--color': i % 2 === 0 ? accentColor : secondaryColor,
                                    animationDelay: `${i * 0.5}s`,
                                } as any}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* THE VERTICAL STATUS LINE - NEW JAZZ VERSION */}
            <div className="absolute left-10 top-0 bottom-0 py-12 flex flex-col items-center justify-between z-10">
                <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37] opacity-40" />

                <div className="flex flex-col items-center gap-6">

                    {/* Vertical Year - Gold & Jazz */}
                    <div className="flex flex-col items-center leading-none tracking-tighter">
                        {content.year.split('').map((char, i) => (
                            <span
                                key={i}
                                className={cn("font-black", !content.headerColor && "gold-shimmer-jazz")}
                                style={{
                                    fontSize: `${32 * (content.textScales?.year || 1)}px`,
                                    fontFamily: "'Cinzel', serif",
                                    color: content.headerColor,
                                    animationDelay: `${i * 0.1}s`
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </div>

                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor }} />
                </div>

                <div className="w-[1px] h-32 bg-gradient-to-t from-transparent via-[#D4AF37] to-[#D4AF37] opacity-40" />
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-24">

                {/* Brand Header Stage */}
                {/* Brand Header Stage - Tightened & Bold */}
                <div className="mb-8 flex items-center gap-6 relative z-10">
                    <div className="h-[1.5px] w-24 opacity-60" style={{ background: content.headerColor ? `linear-gradient(to right, transparent, ${content.headerColor})` : 'linear-gradient(to right, transparent, #D4AF37)' }} />
                    <span
                        className={cn("tracking-[0.2em] font-black uppercase", !content.headerColor && "gold-shimmer-jazz")}
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: `${16 * (content.textScales?.brandHeader || 1)}px`,
                            color: content.headerColor,
                            fontWeight: 900
                        }}
                    >
                        From NICArb
                    </span>
                    <div className="h-[1.5px] w-24 opacity-60" style={{ background: content.headerColor ? `linear-gradient(to left, transparent, ${content.headerColor})` : 'linear-gradient(to left, transparent, #D4AF37)' }} />
                </div>

                {/* Holiday Greeting */}
                <div className="text-center relative py-6">
                    {/* Ghost Year Background */}
                    <div className="absolute inset-0 -top-12 flex items-center justify-center pointer-events-none opacity-[0.05]">
                        <span
                            className="font-black text-[#064802]"
                            style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: `${180 * (content.textScales?.year || 1)}px`
                            }}
                        >
                            {content.year}
                        </span>
                    </div>

                    <h2
                        className="font-medium leading-none mb-2 drop-shadow-sm"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: `${5 * (content.textScales?.title || 1)}rem`,
                            color: primaryColor
                        }}
                    >
                        {content.title.split(' ')[0]}
                    </h2>
                    <h2
                        className="font-bold italic mb-8 gold-shimmer-jazz drop-shadow-xl"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: `${6 * (content.textScales?.title || 1)}rem`
                        }}
                    >
                        {content.title.split(' ').slice(1).join(' ')}
                    </h2>
                </div>

                <div className="max-w-xl text-center relative mt-12">
                    <p
                        className="font-bold leading-relaxed tracking-wide italic"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: `${24 * (content.textScales?.message || 1)}px`,
                            color: primaryColor,
                            textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        {content.message}
                    </p>
                </div>

                {/* Visual Asset - Floating Ornaments */}
                {visualAsset.path && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-64 h-64">
                        <div className="relative w-full h-full p-4 group">
                            <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20 scale-110 animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-4 rounded-full border border-[#D4AF37]/40 scale-105 animate-[spin_15s_linear_infinite_reverse]" />
                            <img
                                src={visualAsset.path}
                                alt={visualAsset.name}
                                className="w-full h-full object-contain filter drop-shadow(0 20px 40px rgba(212,175,55,0.3)) transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* THE PRESTIGE FOOTER - Restored */}
            <div className="h-44 w-full relative flex flex-col justify-end pb-10 px-8" style={{ backgroundColor: primaryColor }}>
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
                                <MapPin className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: accentColor }} />
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
                                <Globe className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
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
                                <Phone className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
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
                                <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
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

                {/* Subtle Baseline Glint */}
                <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-t from-[#D4AF37]/10 to-transparent" />
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_0%_0%,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_0%,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />
        </div >
    );
};
