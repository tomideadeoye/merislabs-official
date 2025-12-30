'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';
import { Mail, Phone, Globe, MapPin, ShieldCheck } from 'lucide-react';

export const EmeraldPrestigeTemplate = ({ client, content, containerRef, visualAsset }: TemplateProps) => {
    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-square overflow-hidden shadow-2xl flex flex-col select-none"
            style={{
                background: 'radial-gradient(circle at 30% 70%, #064802 0%, #032501 100%)',
                boxShadow: 'inset 0 0 120px rgba(0,0,0,0.6)'
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
                        className="text-2xl font-bold tracking-[0.1em] text-[#D4AF37]"
                        style={{ fontFamily: "'Cinzel', serif" }}
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
                    <div className="h-[0.5px] w-24 bg-[#D4AF37]/30" />
                    <span
                        className="text-[11px] tracking-[0.5em] text-[#D4AF37] font-bold"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        From NICArb
                    </span>
                    <div className="h-[0.5px] w-24 bg-[#D4AF37]/30" />
                </div>

                {/* Holiday Greeting */}
                <div className="text-center relative">
                    {/* Ghost Year Background */}
                    <div className="absolute inset-0 -top-12 flex items-center justify-center pointer-events-none">
                        <span className="text-[140px] font-bold text-white/[0.03] select-none" style={{ fontFamily: "'Cinzel', serif" }}>
                            {content.year}
                        </span>
                    </div>

                    <h2
                        className="text-7xl font-light text-white leading-none mb-2"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {content.title.split(' ')[0]}
                    </h2>
                    <h2
                        className="text-8xl font-bold italic mb-8 emerald-gold-shimmer"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                    >
                        {content.title.split(' ').slice(1).join(' ')}
                    </h2>
                </div>

                {/* Main Message */}
                <div className="max-w-xl text-center">
                    <p
                        className="text-lg text-white/70 font-light leading-relaxed tracking-wide italic"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        "{content.message}"
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
                    <div className="flex flex-col items-center gap-3 flex-shrink-0">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-[#D4AF37]/10 rounded-xl blur-lg group-hover:bg-[#D4AF37]/20 transition-all" />
                            <div className="relative h-20 w-48 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] border border-[#D4AF37]/40 rounded-xl flex items-center justify-center p-2 overflow-hidden">
                                {/* Inner gold frame line */}
                                <div className="absolute inset-1 border border-[#D4AF37]/10 rounded-lg pointer-events-none" />
                                <img
                                    src={client.logo || '/nicarb-logo.png'}
                                    alt={client.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                        <span className="text-[6.5px] tracking-[0.1em] text-[#D4AF37] opacity-60 font-bold uppercase text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                            1ST ARBITRATION (AND ADR) INSTITUTE IN SUB-SAHARAN AFRICA
                        </span>
                    </div>

                    {/* Contact Details Grid - Compact distribution */}
                    <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3 pt-4 border-l border-white/10 pl-8">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-3 h-3 text-[#D4AF37] mt-1 opacity-60" />
                            <p className="text-[9px] text-white/50 font-medium leading-tight uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                                {client.address || '10, Adedeji Adekola Close, Off Freedom Way, Lekki Phase 1, Lagos.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Globe className="w-3 h-3 text-[#D4AF37] opacity-60" />
                            <p className="text-[10px] text-white/80 font-bold tracking-[0.2em]" style={{ fontFamily: "'Cinzel', serif" }}>
                                {client.website || 'WWW.NICARB.ORG'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-3 h-3 text-[#D4AF37] opacity-60" />
                            <p className="text-[10px] text-white/80 font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                                {client.phone || '+234 908 718 7414, +234 916 984 9140'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-3 h-3 text-[#D4AF37] opacity-60" />
                            <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                                INFO@NICARB.ORG
                            </p>
                        </div>
                    </div>

                    {/* Signature removed for client professional standard */}
                </div>
            </div>

            {/* Corner Ornamental Details */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_0%_0%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
        </div>
    );
};
