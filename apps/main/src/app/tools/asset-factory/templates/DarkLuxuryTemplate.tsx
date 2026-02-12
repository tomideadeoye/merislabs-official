'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';

// Gold ribbon SVG component
const GoldRibbon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="none">
        <path
            d="M10 50 Q 30 20, 50 50 T 90 50"
            stroke="url(#goldGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
        />
        <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#F4E6AA" />
                <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
        </defs>
    </svg>
);

export const DarkLuxuryTemplate = ({ client, content, containerRef, visualAsset, activePalette, dimensions }: TemplateProps) => {
    // Use palette colors when provided
    const primaryColor = activePalette?.primary || '#0a0a0a';
    const secondaryColor = activePalette?.secondary || '#D4AF37';
    const backgroundColor = activePalette?.background || '#0d0d0d';

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden shadow-2xl"
            style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${backgroundColor} 50%, ${primaryColor} 100%)`
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&display=swap');
            `}</style>

            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            {/* Radial gradient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]" />

            {/* Exquisite Year Typography - Left Side Anchor */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center select-none">
                <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37] opacity-30" />

                {/* Roman Numeral Accent */}
                <div
                    className="py-6 text-[10px] tracking-[0.8em] opacity-30 font-bold uppercase [writing-mode:vertical-rl] transform rotate-180"
                    style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}
                >
                    {content.year === '2026' ? 'MMXXVI' : 'MMXXV'}
                </div>

                {/* Horizontal Arabic Numerals - 2026 */}
                <div
                    className="font-bold tracking-[0.15em] py-2"
                    style={{
                        fontSize: `${30 * (content.textScales?.year || 1)}px`,
                        fontFamily: content.fontFamilies?.year || content.fontFamily || "'Cinzel', serif",
                        background: 'linear-gradient(180deg, #D4AF37 0%, #F4E6AA 50%, #D4AF37 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.4))'
                    }}
                >
                    {content.year}
                </div>

                <div className="w-[1px] h-32 bg-gradient-to-t from-transparent via-[#D4AF37] to-[#D4AF37] opacity-30" />
            </div>

            {/* Visual Asset in Circular Frame - Right Side */}
            {visualAsset.path && (
                <div className="absolute right-12 top-1/4 w-56 h-56">
                    {/* Gold ring border */}
                    <div className="absolute inset-0 rounded-full border-2 border-amber-500/50" />
                    <div className="absolute inset-2 rounded-full overflow-hidden">
                        <img
                            src={visualAsset.path}
                            alt={visualAsset.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Outer glow */}
                    <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl -z-10" />
                </div>
            )}

            {/* Floating ribbon accents */}
            <GoldRibbon className="absolute top-20 right-8 w-20 h-20 rotate-12 opacity-60" />
            <GoldRibbon className="absolute bottom-32 right-4 w-16 h-16 -rotate-45 opacity-40" />

            {/* Main Text - Center Bottom */}
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/4 text-left">
                <h2
                    className="font-light text-white mb-2"
                    style={{ fontSize: `${48 * (content.textScales?.title || 1)}px`, fontFamily: content.fontFamilies?.title || content.fontFamily || "'Cormorant Garamond', serif" }}
                >
                    {content.title.split(' ')[0]}
                </h2>
                <h2
                    className="font-semibold italic"
                    style={{
                        fontSize: `${60 * (content.textScales?.title || 1)}px`,
                        fontFamily: content.fontFamilies?.title || content.fontFamily || "'Cormorant Garamond', serif",
                        color: '#D4AF37'
                    }}
                >
                    {content.title.split(' ').slice(1).join(' ')}
                </h2>
                <div
                    className="text-xs tracking-[0.5em] opacity-50 mt-4 flex items-center gap-4"
                    style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}
                >
                    <div className="h-[1px] w-8 bg-[#D4AF37] opacity-30" />
                    {content.year}
                    <div className="h-[1px] w-8 bg-[#D4AF37] opacity-30" />
                </div>
            </div>

            {/* Message */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center max-w-md">
                <p className="text-gray-400 font-light" style={{ fontSize: `${14 * (content.textScales?.message || 1)}px`, fontFamily: content.fontFamilies?.message || content.fontFamily || "'Cormorant Garamond', serif", whiteSpace: 'pre-wrap' }}>
                    {content.message}
                </p>
            </div>

            {/* Brand Footer */}
            {(content.footerControls?.showLogo ?? true) && client.logo && (
                <div className="absolute bottom-4 left-6">
                    <img src={client.logo} alt={client.name} className="h-8 w-auto opacity-70" />
                </div>
            )}

            {(content.footerControls?.showSignature ?? true) && (
                <div className="absolute bottom-4 right-10">
                    <p className="text-[#D4AF37] font-bold italic uppercase tracking-widest opacity-80" style={{ fontSize: `${10 * (content.textScales?.signature || 1)}px`, fontFamily: "'Cinzel', serif" }}>
                        {client.signature || client.name}
                    </p>
                </div>
            )}
        </div>
    );
};
