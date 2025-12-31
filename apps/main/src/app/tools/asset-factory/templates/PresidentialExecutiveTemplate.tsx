'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';
import { Mail, Phone, Globe, MapPin, Award } from 'lucide-react';

export const PresidentialExecutiveTemplate = ({ client, content, containerRef, visualAsset, activePalette, dimensions }: TemplateProps) => {
    // Determine colors based on active palette or client defaults
    const primaryColor = activePalette?.primary || client.primaryColor || '#064802';
    const accentColor = activePalette?.secondary || client.secondaryColor || '#D4AF37';
    // const textColor = activePalette?.text || client.textColor || '#FFFFFF';

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden flex flex-col select-none"
            style={{
                background: `radial-gradient(circle at 50% 30%, ${primaryColor} 0%, #001a00 100%)`,
                boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)'
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

                .presidential-texture {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
                }

                .text-gold-gradient {
                    background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0px 2px 4px rgba(0,0,0,0.3);
                }

                .border-gold-gradient {
                    border-image: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C) 1;
                }
            `}</style>

            {/* Background Texture */}
            <div className="absolute inset-0 presidential-texture pointer-events-none mix-blend-overlay" />

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

            {/* MAIN FRAME - The centerpiece of the executive look */}
            <div className="absolute inset-6 pointer-events-none z-20">
                {/* Double Border System */}
                <div className="absolute inset-0 border border-[#D4AF37]/30" />
                <div className="absolute inset-1 border-[2px] border-[#D4AF37]/60" />

                {/* Corner Flourishes - Top Left */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#D4AF37]" />
                <div className="absolute top-2 left-2 w-2 h-2 bg-[#D4AF37]" />

                {/* Corner Flourishes - Top Right */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#D4AF37]" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37]" />

                {/* Corner Flourishes - Bottom Left */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#D4AF37]" />
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#D4AF37]" />

                {/* Corner Flourishes - Bottom Right */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#D4AF37]" />
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#D4AF37]" />
            </div>

            {/* CONTENT LAYER */}
            <div className="relative z-10 flex-1 flex flex-col items-center pt-20 px-16 pb-12">

                {/* 1. Header & Logo Plate */}
                {(content.footerControls?.showLogo ?? true) && (
                    <div className="mb-12 relative group">
                        {/* The "Plate" behind the logo */}
                        <div className="absolute inset-0 bg-black/40 blur-xl rounded-full transform scale-110" />
                        <div className="relative bg-gradient-to-b from-[#ffffff]/10 to-[#ffffff]/5 backdrop-blur-md border border-[#D4AF37]/30 px-10 py-4 rounded-lg shadow-2xl">
                            {/* Shimmer effect on plate */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <img
                                src={client.logo || '/nicarb-logo.png'}
                                alt={client.name}
                                className="h-20 w-auto object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                )}

                {/* 2. The Greeting - Typography Mastery */}
                <div className="text-center mb-10 w-full relative">
                    {/* Decorative Divider Top */}
                    <div className="flex items-center justify-center gap-4 mb-6 opacity-60">
                        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                        <Award className="w-4 h-4 text-[#D4AF37]" />
                        <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                    </div>

                    <h2
                        className="text-white font-medium tracking-wide mb-2 drop-shadow-2xl"
                        style={{
                            fontFamily: content.fontFamilies?.title || content.fontFamily || "'Cinzel', serif",
                            fontSize: `${3.75 * (content.textScales?.title || 1)}rem`
                        }}
                    >
                        {content.title.split(' ')[0]}
                    </h2>

                    <h1
                        className="leading-[0.9] font-[700] uppercase tracking-wider text-gold-gradient mb-4"
                        style={{
                            fontFamily: content.fontFamilies?.title || content.fontFamily || "'Cinzel', serif",
                            fontSize: `${5 * (content.textScales?.title || 1)}rem`
                        }}
                    >
                        {content.title.split(' ').slice(1).join(' ')}
                    </h1>

                    <p
                        className="text-[#D4AF37] tracking-[0.4em] uppercase font-bold"
                        style={{
                            fontFamily: content.fontFamilies?.subtitle || content.fontFamily || "'Cinzel', serif",
                            fontSize: `${0.875 * (content.textScales?.subtitle || 1)}rem`
                        }}
                    >
                        A New Chapter Begins • {content.year}
                    </p>
                </div>

                {/* 3. The Message Body */}
                <div className="relative max-w-2xl text-center mb-8">
                    {/* Quote marks background */}
                    <div className="absolute -top-6 -left-4 text-8xl text-white/5 font-serif">"</div>
                    <div className="absolute -bottom-16 -right-4 text-8xl text-white/5 font-serif transform rotate-180">"</div>

                    <p
                        className="text-white/90 leading-relaxed font-light italic drop-shadow-md"
                        style={{
                            fontFamily: content.fontFamilies?.message || content.fontFamily || "'Playfair Display', serif",
                            fontSize: `${1.5 * (content.textScales?.message || 1)}rem`,
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {content.message}
                    </p>
                </div>

                {/* Spacer to push footer down */}
                <div className="flex-1" />

                {/* 4. The Integrated Footer (Replacing the white bar) */}
                <div className="w-full border-t border-[#D4AF37]/30 pt-6 mt-4">
                    <div className="grid grid-cols-3 items-end gap-4 text-[#D4AF37]">

                        {/* Address - Left Aligned */}
                        <div className="text-left space-y-2 col-span-1">
                            {client.address && (content.footerControls?.showAddress ?? true) && (
                                <div className="flex items-start gap-2 opacity-80 hover:opacity-100 transition-opacity">
                                    <MapPin className="w-3 h-3 mt-0.5" />
                                    <p className="text-[9px] uppercase tracking-widest leading-relaxed font-medium" style={{ fontFamily: "'Cinzel', serif" }}>
                                        {client.address}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Center - Visual Asset or Year Badge */}
                        <div className="flex flex-col items-center justify-center col-span-1 -mt-10">
                            {visualAsset.path ? (
                                <img src={visualAsset.path} alt="Decoration" className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                            ) : (
                                <div className="text-4xl font-bold opacity-20" style={{ fontFamily: "'Cinzel', serif" }}>{content.year}</div>
                            )}
                        </div>

                        {/* Contact - Right Aligned */}
                        <div className="text-right space-y-2 col-span-1 flex flex-col items-end">
                            {(content.footerControls?.showSignature ?? true) && (
                                <div className="mb-2">
                                    <p className="text-[#D4AF37] font-bold italic uppercase tracking-widest" style={{ fontSize: `${12 * (content.textScales?.signature || 1)}px`, fontFamily: "'Playfair Display', serif" }}>
                                        {client.signature || client.name}
                                    </p>
                                </div>
                            )}
                            {client.website && (content.footerControls?.showWebsite ?? true) && (
                                <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                                    <p className="text-[9px] uppercase tracking-widest font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                                        {client.website}
                                    </p>
                                    <Globe className="w-3 h-3" />
                                </div>
                            )}
                            {client.phone && (content.footerControls?.showPhone ?? true) && (
                                <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                                    <p className="text-[9px] uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
                                        {client.phone}
                                    </p>
                                    <Phone className="w-3 h-3" />
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};
