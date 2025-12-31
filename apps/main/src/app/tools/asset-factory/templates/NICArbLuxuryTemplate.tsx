'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

// Gold ribbon SVG component
const GoldRibbon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="none">
        <path
            d="M10 50 Q 30 20, 50 50 T 90 50"
            stroke="url(#goldGradientNICArb)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
        />
        <defs>
            <linearGradient id="goldGradientNICArb" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#F4E6AA" />
                <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
        </defs>
    </svg>
);

export const NICArbLuxuryTemplate = ({ client, content, containerRef, visualAsset, activePalette, dimensions }: TemplateProps) => {
    // Use palette colors when provided
    const primaryColor = activePalette?.primary || '#050505';
    const secondaryColor = activePalette?.secondary || '#D4AF37';
    const backgroundColor = activePalette?.background || '#0a0a0a';

    const hasFooterContent = client.address || client.website || client.phone || client.signature;

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden shadow-2xl flex flex-col"
            style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${backgroundColor} 50%, ${primaryColor} 100%)`
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
            `}</style>

            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            {/* Radial gradient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)]" />

            {/* Exquisite Year Typography - Left Side Anchor */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center select-none z-10">
                <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37] opacity-20" />

                {/* Horizontal Arabic Numerals - 2026 */}
                <div
                    className="font-bold tracking-[0.2em] py-2"
                    style={{
                        fontSize: `${24 * (content.textScales?.year || 1)}px`,
                        fontFamily: "'Cinzel', serif",
                        background: 'linear-gradient(180deg, #D4AF37 0%, #F4E6AA 50%, #D4AF37 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {content.year}
                </div>

                <div className="w-[1px] h-24 bg-gradient-to-t from-transparent via-[#D4AF37] to-[#D4AF37] opacity-20" />
            </div>

            {/* Main Content Stage */}
            <div className="relative flex-1 p-16 flex flex-col items-center justify-center text-center">

                {/* Visual Asset in Circular Frame - Top Right Area */}
                {visualAsset.path && (
                    <div className="absolute right-12 top-16 w-48 h-48">
                        {/* Gold ring border with shimmer */}
                        <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-pulse" />
                        <div className="absolute inset-2 rounded-full border border-amber-500/50 p-2 overflow-hidden bg-black/40 backdrop-blur-sm">
                            <img
                                src={visualAsset.path}
                                alt={visualAsset.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        {/* Outer glow */}
                        <div className="absolute -inset-4 rounded-full bg-amber-500/5 blur-xl -z-10" />
                    </div>
                )}

                {/* Floating ribbon accents */}
                <GoldRibbon className="absolute top-10 left-1/4 w-16 h-16 rotate-45 opacity-30" />
                <GoldRibbon className="absolute bottom-20 right-10 w-20 h-20 -rotate-12 opacity-20" />

                {/* Greeting Section */}
                <div className="mt-8 flex flex-col items-center">
                    <h2
                        className="font-light text-white mb-2 tracking-tight"
                        style={{
                            fontSize: `${60 * (content.textScales?.title || 1)}px`,
                            fontFamily: "'Cormorant Garamond', serif"
                        }}
                    >
                        {content.title.split(' ')[0]}
                    </h2>
                    <h2
                        className="font-semibold italic mb-6"
                        style={{
                            fontSize: `${72 * (content.textScales?.title || 1)}px`,
                            fontFamily: "'Cormorant Garamond', serif",
                            color: '#D4AF37',
                            textShadow: '0 0 30px rgba(212,175,55,0.2)'
                        }}
                    >
                        {content.title.split(' ').slice(1).join(' ')}
                    </h2>

                    {/* Centered Year Subtitle */}
                    <div
                        className="text-[10px] tracking-[0.8em] opacity-40 flex items-center gap-6"
                        style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}
                    >
                        <div className="h-[0.5px] w-12 bg-[#D4AF37] opacity-30" />
                        {content.year}
                        <div className="h-[0.5px] w-12 bg-[#D4AF37] opacity-30" />
                    </div>
                </div>

                {/* Message */}
                <div className="mt-12 max-w-lg">
                    <p className="text-gray-300 font-light leading-relaxed italic" style={{ fontSize: `${18 * (content.textScales?.message || 1)}px`, fontFamily: "'Cormorant Garamond', serif" }}>
                        "{content.message}"
                    </p>
                </div>
            </div>

            {/* Exquisite Professional Footer - Dynamic */}
            <div className="relative h-32 w-full bg-black/60 backdrop-blur-md border-t border-[#D4AF37]/20 flex items-center px-12">
                {/* Logo Badge */}
                {(content.footerControls?.showLogo ?? true) && (
                    <div className="flex-shrink-0 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] via-[#F4E6AA] to-[#D4AF37] rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white p-2 rounded-md shadow-lg border border-[#D4AF37]/30">
                            <img
                                src={client.logo || '/nicarb-logo.png'}
                                alt={client.name}
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                    </div>
                )}

                {/* Contact Information Vertical Divider */}
                <div className="w-[1px] h-12 bg-[#D4AF37]/20 mx-10" />

                {/* Info Grid */}
                <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-2">
                    {/* Address - Only show if available and allowed */}
                    {client.address && (content.footerControls?.showAddress ?? true) && (
                        <div className="flex items-start gap-3">
                            <MapPin className="w-3 h-3 text-[#D4AF37] mt-1 shrink-0" />
                            <p className="text-[10px] text-gray-400 font-medium leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                                {client.address}
                            </p>
                        </div>
                    )}

                    {/* Website - Only show if available and allowed */}
                    {client.website && (content.footerControls?.showWebsite ?? true) && (
                        <div className="flex items-center gap-3">
                            <Globe className="w-3 h-3 text-[#D4AF37] shrink-0" />
                            <p className="text-[10px] text-gray-400 font-bold tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
                                {client.website}
                            </p>
                        </div>
                    )}

                    {/* Phone - Only show if available and allowed */}
                    {client.phone && (content.footerControls?.showPhone ?? true) && (
                        <div className="flex items-center gap-3">
                            <Phone className="w-3 h-3 text-[#D4AF37] shrink-0" />
                            <p className="text-[10px] text-gray-400 font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                                {client.phone}
                            </p>
                        </div>
                    )}

                    {/* Signature/Name - Default fallback, respect allowed */}
                    {(content.footerControls?.showSignature ?? true) && (
                        <div className="flex items-center gap-3">
                            <p className="text-gray-400 font-bold uppercase tracking-tighter" style={{ fontSize: `${10 * (content.textScales?.signature || 1)}px`, fontFamily: "'Cinzel', serif" }}>
                                {client.signature || client.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Decorative Right Corner Ornaments */}
                <div className="absolute bottom-4 right-6 opacity-30">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
                        <div className="w-1 h-1 bg-[#D4AF37] rounded-full opacity-60" />
                        <div className="w-1 h-1 bg-[#D4AF37] rounded-full opacity-30" />
                    </div>
                </div>
            </div>
        </div>
    );
};
