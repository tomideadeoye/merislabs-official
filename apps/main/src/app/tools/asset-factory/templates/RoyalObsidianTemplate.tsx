'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';
import { Mail, Phone, Globe, MapPin, Award } from 'lucide-react';

export const RoyalObsidianTemplate = ({ client, content, containerRef, visualAsset }: TemplateProps) => {
    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-square overflow-hidden shadow-2xl flex flex-col select-none"
            style={{
                background: 'radial-gradient(circle at 70% 30%, #1a1a1a 0%, #050505 100%)',
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                .gold-shimmer {
                    background: linear-gradient(90deg, #D4AF37, #F4E6AA, #D4AF37, #F4E6AA, #D4AF37);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 10s linear infinite;
                }

                .gold-line-shimmer {
                    background: linear-gradient(90deg, transparent, #D4AF37, #F4E6AA, #D4AF37, transparent);
                    background-size: 200% auto;
                    animation: shimmer 6s linear infinite;
                }
            `}</style>

            {/* Obsidian Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/granite.png')] pointer-events-none" />

            {/* The "Gilded Frame" - Thin inner border */}
            <div className="absolute inset-4 border-[0.5px] border-[#D4AF37]/10 pointer-events-none" />

            {/* LEFT ANCHOR: The "Sovereign Year" */}
            <div className="absolute left-10 top-0 bottom-0 flex flex-col items-center justify-between py-12 z-20">
                <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-[#D4AF37]" />

                <div className="flex flex-col items-center gap-8">
                    {/* Year Label Removed for cleaner look */}

                    {/* Numeric Year */}
                    <div className="flex flex-col items-center leading-none">
                        <span
                            className="text-4xl font-bold tracking-tighter gold-shimmer"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {content.year.slice(0, 2)}
                        </span>
                        <span
                            className="text-4xl font-bold tracking-tighter gold-shimmer opacity-60"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {content.year.slice(2)}
                        </span>
                    </div>
                </div>

                <div className="w-[1px] h-32 bg-gradient-to-t from-transparent via-[#D4AF37]/40 to-[#D4AF37]" />
            </div>

            {/* MAIN STAGE */}
            <div className="relative flex-1 flex flex-col items-center px-24 pt-20">

                {/* Visual Asset - Offset Right */}
                {visualAsset.path && (
                    <div className="absolute right-12 top-20 w-64 h-64 opacity-90 group">
                        {/* Layered glows */}
                        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/5 blur-3xl animate-pulse" />
                        <div className="absolute inset-4 rounded-full border border-[#D4AF37]/20 p-4 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm overflow-hidden transform group-hover:scale-105 transition-transform duration-700">
                            <img
                                src={visualAsset.path}
                                alt={visualAsset.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        {/* Decorative compass lines */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[0.5px] h-8 bg-[#D4AF37]/40" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[0.5px] h-8 bg-[#D4AF37]/40" />
                        <div className="absolute top-1/2 -left-4 -translate-y-1/2 h-[0.5px] w-8 bg-[#D4AF37]/40" />
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 h-[0.5px] w-8 bg-[#D4AF37]/40" />
                    </div>
                )}

                {/* Content Block - Offset Left to balance */}
                <div className="w-full mt-16 flex flex-col items-start pr-32">
                    {/* Prefix Accent */}
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="w-4 h-4 text-[#D4AF37] opacity-60" />
                        <span className="text-[10px] tracking-[0.5em] text-[#D4AF37] opacity-50 font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                            From NICArb
                        </span>
                    </div>

                    <h2
                        className="text-7xl font-light text-white leading-none mb-1 tracking-tight"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {content.title.split(' ')[0]}
                    </h2>
                    <h2
                        className="text-8xl font-bold italic mb-8 gold-shimmer"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            textShadow: '0 0 40px rgba(212,175,55,0.1)'
                        }}
                    >
                        {content.title.split(' ').slice(1).join(' ')}
                    </h2>

                    {/* Separator Line */}
                    <div className="w-48 h-[1px] gold-line-shimmer opacity-40 mb-10" />

                    <p
                        className="text-xl text-gray-400 font-light max-w-md leading-relaxed"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {content.message}
                    </p>
                </div>
            </div>

            {/* THE SOVEREIGN FOOTER - "The Institutional Seal" */}
            <div className="relative h-44 w-full bg-gradient-to-t from-black to-transparent flex items-end pb-10 px-12 overflow-hidden">

                {/* Background Pattern Section for Footer */}
                <div className="absolute inset-0 opacity-[0.02] [mask-image:linear-gradient(to_top,black,transparent)] bg-[url('https://www.transparenttextures.com/patterns/geometric-leaves.png')]" />

                {/* Logo Badge - Floating on the baseline */}
                <div className="flex-shrink-0 z-10">
                    <div className="relative p-3 bg-white/95 backdrop-blur shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm border-t border-l border-white overflow-hidden">
                        {/* Subtle inner gold rim */}
                        <div className="absolute inset-0 border border-[#D4AF37]/10" />
                        <img
                            src={client.logo || '/nicarb-logo.png'}
                            alt={client.name}
                            className="h-12 w-auto object-contain relative z-10"
                        />
                    </div>
                </div>

                {/* Structured Contact Data */}
                <div className="flex-1 ml-12 mb-1 z-10">
                    <div className="grid grid-cols-2 gap-x-16 gap-y-4 max-w-2xl">
                        {/* Address Block */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] tracking-[0.3em] font-bold text-[#D4AF37] uppercase opacity-60" style={{ fontFamily: "'Cinzel', serif" }}>Address</span>
                            <p className="text-[10px] text-gray-400 font-medium leading-tight line-clamp-2 uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                                {client.address || 'Nigerian Institute of Chartered Arbitrators'}
                            </p>
                        </div>

                        {/* Connection Block */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] tracking-[0.3em] font-bold text-[#D4AF37] uppercase opacity-60" style={{ fontFamily: "'Cinzel', serif" }}>Connect</span>
                            <div className="flex items-center gap-6">
                                <p className="text-[11px] text-gray-300 font-bold tracking-[0.1em]" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {client.website || 'WWW.NICARB.ORG'}
                                </p>
                            </div>
                        </div>

                        {/* Contact Block */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] tracking-[0.3em] font-bold text-[#D4AF37] uppercase opacity-60" style={{ fontFamily: "'Cinzel', serif" }}>Inquiries</span>
                            <p className="text-[11px] text-gray-300 font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                                {client.phone || '+234 908 718 7414'}
                            </p>
                        </div>

                        {/* Secondary Connect */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] tracking-[0.3em] font-bold text-[#D4AF37] uppercase opacity-60" style={{ fontFamily: "'Cinzel', serif" }}>Official</span>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
                                {client.id === 'nicarb' ? 'INFO@NICARB.ORG' : client.id}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Signature Signature removed for standard professional look */}
            </div>

            {/* Corner Ornamental Flourish */}
            <div className="absolute top-8 right-8 w-32 h-32 border-t border-r border-[#D4AF37]/20 pointer-events-none" />
            <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-[#D4AF37]/40 pointer-events-none" />
        </div>
    );
};
