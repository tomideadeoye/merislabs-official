'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';

export const AppreciationCardTemplate = ({ client, content, containerRef, visualAsset, activePalette }: TemplateProps) => {
    // Colors
    const primaryColor = activePalette?.primary || '#0a0a0a';
    const secondaryColor = activePalette?.secondary || '#D4AF37';
    const backgroundColor = activePalette?.background || '#0d0d0d';
    const accentColor = activePalette?.accent || '#F4E6AA';

    // Text scales
    const titleScale = content.textScales?.title || 1.0;
    const bodyScale = content.textScales?.message || 1.0;
    const yearScale = content.textScales?.year || 1.0;
    const signatureScale = content.textScales?.signature || 1.0;

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden shadow-2xl flex flex-col items-center justify-center p-12 text-center"
            style={{
                background: `radial-gradient(circle at center, ${backgroundColor} 0%, ${primaryColor} 100%)`,
                borderColor: secondaryColor,
                fontFamily: content.fontFamily || undefined
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;600&display=swap');
            `}</style>

            {/* Ornamental Border */}
            <div className="absolute inset-8 border-[1px] border-secondary/20 rounded-sm pointer-events-none"
                style={{ borderColor: `${secondaryColor}33` }} />
            <div className="absolute inset-10 border-[0.5px] border-secondary/10 rounded-sm pointer-events-none"
                style={{ borderColor: `${secondaryColor}1a` }} />

            {/* Corner Accents */}
            <div className="absolute top-12 left-12 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: secondaryColor }} />
            <div className="absolute top-12 right-12 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: secondaryColor }} />
            <div className="absolute bottom-12 left-12 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: secondaryColor }} />
            <div className="absolute bottom-12 right-12 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: secondaryColor }} />

            {/* Subtle background asset */}
            {
                visualAsset.path && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <img src={visualAsset.path} alt="" className="w-full h-full object-cover scale-110" />
                    </div>
                )
            }

            {/* Small top accent */}
            <div className="mb-4 opacity-60">
                {(content.footerControls?.showLogo ?? true) && client.logo ? (
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10 mb-6">
                        <img src={client.logo} alt={client.name} className="h-8 w-auto object-contain" />
                    </div>
                ) : (
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent" style={{ backgroundColor: secondaryColor }} />
                )}
            </div>

            {/* Title - "Appreciation" */}
            <h1
                className="mb-8 tracking-[0.3em] font-normal uppercase"
                style={{
                    fontFamily: content.fontFamilies?.title || content.fontFamily || "'Cinzel', serif",
                    color: secondaryColor,
                    fontSize: `${1.5 * titleScale}rem`,
                    letterSpacing: '0.4em'
                }}
            >
                {content.title}
            </h1>

            {/* Message Body */}
            <div className="max-w-xl mx-auto space-y-6">
                <p
                    className="leading-relaxed font-light italic"
                    style={{
                        fontFamily: content.fontFamilies?.message || content.fontFamily || "'Cormorant Garamond', serif",
                        color: '#f3f4f6',
                        fontSize: `${1.25 * bodyScale}rem`,
                        fontSize: `${1.25 * bodyScale}rem`,
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {content.message}
                </p>
            </div>

            {/* Signature Area */}
            {(content.footerControls?.showSignature ?? true) && (
                <div className="mt-12">
                    <p
                        className="text-sm opacity-40 uppercase tracking-[0.2em] mb-2"
                        style={{ fontFamily: content.fontFamilies?.title || content.fontFamily || "'Cinzel', serif", color: accentColor }}
                    >
                        Warmly,
                    </p>
                    <p
                        className="font-medium"
                        style={{
                            fontSize: `${1.5 * signatureScale}rem`,
                            fontFamily: content.fontFamilies?.subtitle || content.fontFamily || "'Playfair Display', serif",
                            color: secondaryColor,
                            fontStyle: 'italic'
                        }}
                    >
                        {content.brandName || client.name}
                    </p>
                </div>
            )}

            {/* Year Watermark */}
            <div
                className="absolute bottom-14 opacity-10 font-bold tracking-[1em]"
                style={{
                    fontFamily: content.fontFamilies?.year || content.fontFamily || "'Cinzel', serif",
                    color: secondaryColor,
                    fontSize: `${0.8 * yearScale}rem`
                }}
            >
                {content.year}
            </div>

            {/* Subtle grain texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
        </div >
    );
};
