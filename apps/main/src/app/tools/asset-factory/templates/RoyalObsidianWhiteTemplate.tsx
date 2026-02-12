'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';
import { Mail, Phone, Globe, MapPin, Award } from 'lucide-react';

export const RoyalObsidianWhiteTemplate = ({ client, content, containerRef, visualAsset, activePalette }: TemplateProps) => {
    // White background theme - Reversed logic from dark version
    // The background is white/cream, accents are the colors
    const primaryColor = activePalette?.primary || '#1a1a1a';  // Dark text on white
    const secondaryColor = activePalette?.secondary || '#D4AF37'; // Gold accents
    const accentColor = activePalette?.accent || '#D4AF37';

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden shadow-2xl flex flex-col select-none bg-white"
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

                @keyframes shimmer-dark {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                .gold-shimmer-on-white {
                    background: linear-gradient(90deg, #8B7355, #D4AF37, #8B7355, #D4AF37, #8B7355);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer-dark 10s linear infinite;
                }

                .gold-line-shimmer-dark {
                    background: linear-gradient(90deg, transparent, #8B7355, #D4AF37, #8B7355, transparent);
                    background-size: 200% auto;
                    animation: shimmer-dark 6s linear infinite;
                }
            `}</style>

            {/* Subtle Texture - Very light on white */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/granite.png')] pointer-events-none" />

            {/* The "Gilded Frame" - Thin inner border */}
            <div className="absolute inset-4 border-[0.5px] pointer-events-none" style={{ borderColor: `${primaryColor}10` }} />

            {/* LEFT ANCHOR: The "Sovereign Year" */}
            <div className="absolute left-10 top-0 bottom-0 flex flex-col items-center justify-between py-12 z-20">
                <div className="w-[1px] h-32 bg-gradient-to-b from-transparent to-current opacity-40" style={{ color: accentColor }} />

                <div className="flex flex-col items-center gap-8">
                    {/* Numeric Year */}
                    <div className="flex flex-col items-center leading-none">
                        <span
                            className="font-bold tracking-tighter gold-shimmer-on-white"
                            style={{ fontSize: `${36 * (content.textScales?.year || 1)}px`, fontFamily: "'Cinzel', serif" }}
                        >
                            {content.year.slice(0, 2)}
                        </span>
                        <span
                            className="font-bold tracking-tighter gold-shimmer-on-white opacity-60"
                            style={{ fontSize: `${36 * (content.textScales?.year || 1)}px`, fontFamily: "'Cinzel', serif" }}
                        >
                            {content.year.slice(2)}
                        </span>
                    </div>
                </div>

                <div className="w-[1px] h-32 bg-gradient-to-t from-transparent to-current opacity-40" style={{ color: accentColor }} />
            </div>

            {/* MAIN STAGE */}
            <div className="relative flex-1 flex flex-col items-center px-24 pt-20">

                {/* Visual Asset - Offset Right */}
                {visualAsset.path && (
                    <div className="absolute right-12 top-20 w-64 h-64 opacity-90 group">
                        {/* Layered glows - subtle on white */}
                        <div className="absolute inset-0 rounded-full opacity-20 blur-3xl animate-pulse" style={{ backgroundColor: accentColor }} />
                        <div className="absolute inset-4 rounded-full border p-4 bg-gradient-to-br from-white/80 to-transparent backdrop-blur-sm overflow-hidden transform group-hover:scale-105 transition-transform duration-700" style={{ borderColor: `${accentColor}30` }}>
                            <img
                                src={visualAsset.path}
                                alt={visualAsset.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        {/* Decorative compass lines */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[0.5px] h-8 opacity-40" style={{ backgroundColor: accentColor }} />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[0.5px] h-8 opacity-40" style={{ backgroundColor: accentColor }} />
                        <div className="absolute top-1/2 -left-4 -translate-y-1/2 h-[0.5px] w-8 opacity-40" style={{ backgroundColor: accentColor }} />
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 h-[0.5px] w-8 opacity-40" style={{ backgroundColor: accentColor }} />
                    </div>
                )}

                {/* Content Block - Offset Left to balance */}
                <div className="w-full mt-16 flex flex-col items-start pr-32">
                    {/* Prefix Accent */}
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="w-4 h-4 opacity-70" style={{ color: content.headerColor || accentColor }} />
                        <span className="tracking-[0.5em] font-bold" style={{
                            fontFamily: "'Cinzel', serif",
                            color: content.headerColor || accentColor,
                            opacity: content.headerColor ? 1 : 0.6,
                            fontSize: `${18 * (content.textScales?.brandHeader || 1)}px`
                        }}>
                            From NICArb
                        </span>
                    </div>

                    <h2
                        className="font-light leading-none mb-1 tracking-tight"
                        style={{ fontSize: `${72 * (content.textScales?.title || 1)}px`, fontFamily: "'Cormorant Garamond', serif", color: primaryColor }}
                    >
                        {content.title.split(' ')[0]}
                    </h2>
                    <h2
                        className="font-bold italic mb-8 gold-shimmer-on-white"
                        style={{
                            fontSize: `${96 * (content.textScales?.title || 1)}px`,
                            fontFamily: "'Cormorant Garamond', serif",
                            textShadow: '0 0 40px rgba(139,115,85,0.1)'
                        }}
                    >
                        {content.title.split(' ').slice(1).join(' ')}
                    </h2>

                    {/* Separator Line */}
                    <div className="w-48 h-[1px] gold-line-shimmer-dark opacity-60 mb-10" />

                    <p
                        className="font-light max-w-md leading-relaxed"
                        style={{ fontSize: `${20 * (content.textScales?.message || 1)}px`, fontFamily: "'Cormorant Garamond', serif", color: `${primaryColor}99` }}
                    >
                        {content.message}
                    </p>
                </div>
            </div>

            {/* THE SOVEREIGN FOOTER - Colored background with white text */}
            <div className="relative h-44 w-full flex items-end pb-10 px-12 overflow-hidden" style={{ backgroundColor: primaryColor }}>

                {/* Background Pattern Section for Footer */}
                <div className="absolute inset-0 opacity-[0.03] [mask-image:linear-gradient(to_top,black,transparent)] bg-[url('https://www.transparenttextures.com/patterns/geometric-leaves.png')]" />

                {/* Logo Badge - Floating on the baseline */}
                {(content.footerControls?.showLogo ?? true) && (
                    <div className="flex-shrink-0 z-10">
                        <div className="relative p-3 bg-white/95 backdrop-blur shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-sm border-t border-l border-white overflow-hidden">
                            {/* Subtle inner gold rim */}
                            <div className="absolute inset-0 border" style={{ borderColor: `${accentColor}20` }} />
                            <img
                                src={client.logo || '/nicarb-logo.png'}
                                alt={client.name}
                                className="h-12 w-auto object-contain relative z-10"
                            />
                        </div>
                    </div>
                )}

                {/* Structured Contact Data */}
                <div className="flex-1 ml-12 mb-1 z-10">
                    <div className="grid grid-cols-2 gap-x-16 gap-y-4 max-w-2xl">
                        {/* Address Block */}
                        {(content.footerControls?.showAddress ?? true) && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] tracking-[0.3em] font-bold uppercase opacity-70" style={{ fontFamily: "'Cinzel', serif", color: accentColor }}>Address</span>
                                <p className="text-[10px] font-medium leading-tight line-clamp-2" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${10 * (content.textScales?.footer || 1)}px`,
                                    color: '#ffffff'
                                }}>
                                    {client.address || 'Nigerian Institute of Chartered Arbitrators'}
                                </p>
                            </div>
                        )}

                        {/* Connection Block */}
                        {(content.footerControls?.showWebsite ?? true) && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] tracking-[0.3em] font-bold uppercase opacity-70" style={{ fontFamily: "'Cinzel', serif", color: accentColor }}>Connect</span>
                                <div className="flex items-center gap-6">
                                    <p className="font-bold tracking-[0.1em]" style={{
                                        fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                        fontSize: `${11 * (content.textScales?.footer || 1)}px`,
                                        color: '#ffffff'
                                    }}>
                                        {client.website || 'nicarb.org'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Contact Block */}
                        {(content.footerControls?.showPhone ?? true) && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] tracking-[0.3em] font-bold uppercase opacity-70" style={{ fontFamily: "'Cinzel', serif", color: accentColor }}>Inquiries</span>
                                <p className="font-bold" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${11 * (content.textScales?.footer || 1)}px`,
                                    color: '#ffffff'
                                }}>
                                    {client.phone || '+234 908 718 7414'}
                                </p>
                            </div>
                        )}

                        {/* Secondary Connect */}
                        {(content.footerControls?.showEmail ?? true) && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] tracking-[0.3em] font-bold uppercase opacity-70" style={{ fontFamily: "'Cinzel', serif", color: accentColor }}>Official</span>
                                <p className="font-bold tracking-widest" style={{
                                    fontFamily: content.fontFamilies?.footer || "'Cinzel', serif",
                                    fontSize: `${10 * (content.textScales?.footer || 1)}px`,
                                    color: '#ffffff'
                                }}>
                                    {client.email || (client.id === 'nicarb' ? 'INFO@NICARB.ORG' : '')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Signature area if enabled */}
                {(content.footerControls?.showSignature ?? true) && (
                    <div className="absolute bottom-10 right-12 z-10 text-right">
                        <p className="font-bold italic" style={{
                            fontSize: `${24 * (content.textScales?.signature || 1)}px`,
                            fontFamily: content.fontFamilies?.footer || "'Cormorant Garamond', serif",
                            color: accentColor
                        }}>
                            {client.signature || client.name}
                        </p>
                    </div>
                )}
            </div>

            {/* Corner Ornamental Flourish - Subtle on white */}
            <div className="absolute top-8 right-8 w-32 h-32 border-t border-r pointer-events-none" style={{ borderColor: `${primaryColor}10` }} />
            <div className="absolute top-10 right-10 w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: `${primaryColor}20` }} />
        </div>
    );
};
