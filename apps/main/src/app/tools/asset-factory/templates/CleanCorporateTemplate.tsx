'use client';

import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { TemplateProps } from '../types';

// Sparkle star SVG
const SparkStar = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
    </svg>
);

// Firework burst SVG
const FireworkBurst = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="20" cy="20" r="8" />
        <line x1="20" y1="4" x2="20" y2="12" />
        <line x1="20" y1="28" x2="20" y2="36" />
        <line x1="4" y1="20" x2="12" y2="20" />
        <line x1="28" y1="20" x2="36" y2="20" />
        <line x1="8.7" y1="8.7" x2="14.3" y2="14.3" />
        <line x1="25.7" y1="25.7" x2="31.3" y2="31.3" />
        <line x1="8.7" y1="31.3" x2="14.3" y2="25.7" />
        <line x1="25.7" y1="14.3" x2="31.3" y2="8.7" />
    </svg>
);

export const CleanCorporateTemplate = ({ client, content, containerRef, visualAsset, activePalette }: TemplateProps) => {
    // Theme configuration from activePalette or default
    const theme = activePalette ? {
        bg: activePalette.background,
        accent: activePalette.secondary,
        text: activePalette.text,
        bgGradient: `linear-gradient(180deg, ${activePalette.background} 0%, ${activePalette.primary} 100%)`
    } : {
        bg: '#1a1f3c',
        accent: '#D4AF37', // Gold default
        text: '#ffffff',
        bgGradient: 'linear-gradient(180deg, #1a1f3c 0%, #0f1225 100%)'
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-square overflow-hidden shadow-2xl"
            style={{ background: theme.bgGradient }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;500;700&display=swap');
            `}</style>
            
            {/* Logo Badge - Top Left */}
            {client.type === 'corporate' && client.logo ? (
                <div className="absolute top-6 left-6 z-20">
                    <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center p-3"
                        style={{ backgroundColor: theme.accent }}
                    >
                        <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
                    </div>
                </div>
            ) : (
                <div className="absolute top-6 left-6 z-20">
                    <div 
                        className="px-6 py-4 rounded-2xl"
                        style={{ backgroundColor: theme.accent }}
                    >
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">LOGO</p>
                        <p className="text-[8px] text-slate-700">YOUR LOGO HERE</p>
                    </div>
                </div>
            )}

            {/* Social Links - Top Right */}
            <div className="absolute top-6 right-6 flex items-center gap-3 text-white/60 z-20">
                <span className="text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>Follow us:</span>
                <Facebook className="w-4 h-4" />
                <Instagram className="w-4 h-4" />
                <Twitter className="w-4 h-4" />
                <Linkedin className="w-4 h-4" />
            </div>

            {/* Decorative sparkles */}
            <SparkStar className="absolute top-24 left-32 w-3 h-3 animate-pulse" style={{ color: theme.accent }} />
            <SparkStar className="absolute top-40 right-24 w-2 h-2 animate-pulse" style={{ color: theme.accent, animationDelay: '0.3s' }} />
            <SparkStar className="absolute top-1/3 left-20 w-4 h-4 animate-pulse" style={{ color: theme.accent, animationDelay: '0.5s' }} />
            <FireworkBurst className="absolute top-1/4 right-1/4 w-10 h-10 opacity-40" style={{ color: theme.accent }} />
            <FireworkBurst className="absolute bottom-1/3 left-1/4 w-8 h-8 opacity-30" style={{ color: theme.accent }} />

            {/* Main Typography - Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-12">
                {/* Decorative line art "happy New Year" */}
                <div className="text-center mb-8">
                    <h2 
                        className="text-5xl leading-tight"
                        style={{ 
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: 'italic',
                            color: theme.accent
                        }}
                    >
                        happy
                    </h2>
                    <h2 
                        className="text-7xl -mt-4"
                        style={{ 
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: 'italic',
                            background: `linear-gradient(180deg, ${theme.accent} 0%, #FFF 50%, ${theme.accent} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        New Year
                    </h2>
                </div>

                {/* Quote marks and message */}
                <div className="text-center max-w-sm">
                    <span className="text-3xl" style={{ fontFamily: 'serif', color: theme.accent }}>"</span>
                    <p 
                        className="text-sm text-white/70 leading-relaxed mt-2"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: theme.text }}
                    >
                        {content.message}
                    </p>
                </div>
            </div>

            {/* Visual Asset - subtle background */}
            {visualAsset.path && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <img
                        src={visualAsset.path}
                        alt={visualAsset.name}
                        className="w-3/4 h-3/4 object-contain"
                    />
                </div>
            )}

            {/* Address Bar */}
            <div 
                className="absolute bottom-16 left-6 right-6 py-3 px-6 rounded-full text-center"
                style={{ backgroundColor: theme.accent }}
            >
                <p 
                    className="text-xs text-slate-900"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                    {content.brandName || client.name}{client.address ? `, ${client.address}` : ''}
                </p>
            </div>

            {/* Footer with contact */}
            <div 
                className="absolute bottom-4 left-6 right-6 py-2 rounded-full text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
                <p 
                    className="text-[10px] text-white/70"
                    style={{ fontFamily: "'Montserrat', sans-serif", color: theme.text }}
                >
                    {client.website || 'www.example.com'} | {client.phone || '+1 234 567 890'}
                </p>
            </div>
        </div>
    );
};
