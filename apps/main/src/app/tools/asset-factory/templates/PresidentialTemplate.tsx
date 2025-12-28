'use client';

import { Sparkles } from 'lucide-react';
import { TemplateProps } from '../types';

// Diamond SVG component
const Diamond = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L22 12L12 22L2 12L12 2Z" />
    </svg>
);

export const PresidentialTemplate = ({ client, content, containerRef, visualAsset }: TemplateProps) => {
    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-square overflow-hidden bg-white shadow-2xl"
            style={{ backgroundColor: client.primaryColor }}
        >
            {/* Texture & Overlays */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />

            {/* Borders */}
            <div className="absolute inset-4 border-2 border-white/20 pointer-events-none" />
            <div className="absolute inset-6 border border-white/10 pointer-events-none" />

            {/* Decorative Accents */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <Diamond className="absolute top-10 left-10 w-4 h-4 opacity-30 text-white animate-pulse" />
            <Diamond className="absolute top-10 right-10 w-4 h-4 opacity-30 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center text-white">

                {/* Brand Logo/Signature */}
                <div className="mb-8">
                    {client.type === 'corporate' && client.logo ? (
                        <div className="bg-white/95 p-4 rounded-xl shadow-lg border border-white/20">
                            <img src={client.logo} alt={client.name} className="h-12 w-auto object-contain" />
                        </div>
                    ) : (
                        <h3 className="text-4xl italic font-serif" style={{ color: client.secondaryColor }}>{client.signature}</h3>
                    )}
                </div>

                {/* Ornament Placeholder */}
                <div className="mb-6">
                    <Sparkles className="w-12 h-12 mb-4" style={{ color: client.secondaryColor }} />
                </div>

                {/* Text Items */}
                <h2 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight" style={{ fontFamily: client.fontFamily }}>
                    {content.title}
                </h2>
                <p className="text-xl md:text-2xl uppercase tracking-[0.3em] font-light mb-8" style={{ color: client.secondaryColor }}>
                    {content.subtitle}
                </p>

                <div className="w-16 h-0.5 bg-white/20 mb-8" />

                <p className="text-lg md:text-xl max-w-sm leading-relaxed mb-6 font-light italic">
                    "{content.message}"
                </p>

                <div className="text-4xl font-bold tracking-widest opacity-80" style={{ fontFamily: client.fontFamily }}>
                    {content.year}
                </div>

                {/* Footer */}
                {client.type === 'corporate' && client.address && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 py-4 px-6 border-t-4" style={{ borderColor: client.secondaryColor }}>
                        <div className="flex items-center justify-between text-black">
                            <div className="text-left text-black">
                                <p className="font-bold text-[10px] uppercase text-black">{client.name}</p>
                                <p className="text-[8px] text-gray-500">{client.address}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-semibold" style={{ color: client.primaryColor }}>{client.website}</p>
                                <p className="text-[8px] text-gray-400">{client.phone}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
