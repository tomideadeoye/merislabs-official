'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';

export const LifestyleTemplate = ({ client, content, containerRef, visualAsset }: TemplateProps) => {
    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-square overflow-hidden bg-white shadow-2xl"
        >
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;700&display=swap');
        `}</style>

            {/* Background with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white via-white to-slate-50" />

            {/* Visual Asset - Now using selectedVisualAsset */}
            {visualAsset.path && (
                <div className="absolute left-0 bottom-0 top-0 w-3/5 overflow-hidden pointer-events-none">
                    <img
                        src={visualAsset.path}
                        className={cn(
                            "h-[110%] w-auto object-contain transform",
                            visualAsset.category === 'new-year'
                                ? "object-center translate-x-10 translate-y-20 opacity-90 mix-blend-multiply"
                                : "object-left -translate-x-10 translate-y-10"
                        )}
                        alt={visualAsset.name}
                    />
                </div>
            )}

            {/* Content Container (Right Aligned) */}
            <div className="relative z-10 h-full flex flex-col items-end justify-center pt-12 pb-32 px-16 text-right w-full">

                {/* The Script Title */}
                <h2
                    className="text-7xl md:text-8xl mb-8 leading-[0.8]"
                    style={{
                        fontFamily: "'Great Vibes', cursive",
                        color: client.primaryColor
                    }}
                >
                    {content.title}
                </h2>

                {/* The Subtitle */}
                <p
                    className="text-sm uppercase tracking-[0.3em] font-bold mb-10"
                    style={{ color: client.secondaryColor }}
                >
                    {content.subtitle}
                </p>

                {/* The Main Message */}
                <p className="text-xl text-slate-700 max-w-[400px] leading-relaxed mb-6 font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {content.message}
                </p>

                {/* Big Year Watermark */}
                <div className="text-9xl font-black text-slate-100/80 -mr-10 select-none scale-150 origin-right opacity-50" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {content.year}
                </div>
            </div>

            {/* Structured Footer for Brand Moment */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/40 backdrop-blur-sm border-t border-slate-100 flex items-center justify-between px-10">
                {/* Left: Brand Identity */}
                <div className="flex items-center gap-4">
                    {client.type === 'corporate' && client.logo ? (
                        <img
                            src={client.logo}
                            alt={client.name}
                            className="h-12 w-auto object-contain"
                        />
                    ) : (
                        <p className="text-xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: client.fontFamily }}>
                            {client.signature || client.name}
                        </p>
                    )}
                </div>

                {/* Right: Contact Details */}
                {client.type === 'corporate' && (
                    <div className="text-right">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-1">{client.website || 'WWW.NICARB.ORG'}</p>
                        <p className="text-[9px] text-slate-500 font-medium tracking-wide">PROSPERITY • PURPOSE • {content.year}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
