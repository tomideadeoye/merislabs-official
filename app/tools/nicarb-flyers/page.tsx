'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

// CSS for the animated snowflakes and sparkles
const styles = `
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
        50% { transform: translateY(-10px) rotate(5deg); opacity: 0.8; }
    }
    @keyframes sparkle {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 0.9; }
    }
    @keyframes slowPulse {
        0%, 100% { opacity: 0.15; }
        50% { opacity: 0.3; }
    }
    .animate-float { animation: float 4s ease-in-out infinite; }
    .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
    .animate-slow-pulse { animation: slowPulse 3s ease-in-out infinite; }
`;

// Snowflake SVG component for consistent rendering
const Snowflake = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L12 24M0 12L24 12M4 4L20 20M20 4L4 20M12 0L10 3L12 6L14 3L12 0M12 18L10 21L12 24L14 21L12 18M0 12L3 10L6 12L3 14L0 12M18 12L21 10L24 12L21 14L18 12M4 4L6 6.5L4 9L1.5 6.5L4 4M20 4L22.5 6.5L20 9L17.5 6.5L20 4M4 20L6.5 17.5L9 20L6.5 22.5L4 20M20 20L17.5 17.5L20 15L22.5 17.5L20 20" strokeWidth="0.5" stroke="currentColor" />
    </svg>
);

// Star/Sparkle SVG component
const Sparkle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
);

// Diamond accent
const Diamond = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L22 12L12 22L2 12L12 2Z" />
    </svg>
);

export default function NICARBFlyersPage() {
    const christmasRef = useRef<HTMLDivElement>(null);
    const newYearRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState<string | null>(null);

    const downloadAsImage = async (elementRef: React.RefObject<HTMLDivElement | null>, filename: string) => {
        if (!elementRef.current) return;
        setDownloading(filename);

        try {
            const html2canvas = (await import('html2canvas-pro')).default;
            const canvas = await html2canvas(elementRef.current, {
                scale: 3, // Higher scale for better quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
            });

            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try right-click > Save as Image');
        } finally {
            setDownloading(null);
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <Image
                            src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp"
                            alt="NICARB"
                            width={200}
                            height={80}
                            className="mx-auto mb-6"
                        />
                        <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            Season's Greetings 2025/2026
                        </h1>
                        <p className="text-lg text-gray-600">
                            Download and share on social media
                        </p>
                    </div>

                    {/* Flyers Grid */}
                    <div className="grid md:grid-cols-2 gap-12 mb-12">

                        {/* Christmas Flyer */}
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-[#064802] mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                                <span className="w-8 h-8 bg-[#C41E3A] rounded-full flex items-center justify-center">
                                    <Sparkle className="w-4 h-4 text-[#D4AF37]" />
                                </span>
                                Christmas Flyer
                            </h2>

                            <div
                                ref={christmasRef}
                                className="relative w-full aspect-square overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #064802 0%, #075302 40%, #043301 100%)',
                                    borderRadius: '0px' // Square for social media
                                }}
                            >
                                {/* Subtle texture overlay */}
                                <div className="absolute inset-0 opacity-5" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }} />

                                {/* Glow effects */}
                                <div className="absolute top-0 right-0 w-80 h-80 bg-[#a9ce46]/15 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] transform -translate-x-1/3 translate-y-1/3" />

                                {/* Elegant gold frame border */}
                                <div className="absolute inset-4 border-2 border-[#D4AF37]/30 pointer-events-none" />
                                <div className="absolute inset-6 border border-[#D4AF37]/15 pointer-events-none" />

                                {/* Top gold accent bar */}
                                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B]" />

                                {/* Corner decorations */}
                                <Diamond className="absolute top-8 left-8 w-4 h-4 text-[#D4AF37]/40 animate-slow-pulse" />
                                <Diamond className="absolute top-8 right-8 w-4 h-4 text-[#D4AF37]/40 animate-slow-pulse" style={{ animationDelay: '0.5s' }} />
                                <Diamond className="absolute bottom-8 left-8 w-4 h-4 text-[#D4AF37]/40 animate-slow-pulse" style={{ animationDelay: '1s' }} />
                                <Diamond className="absolute bottom-8 right-8 w-4 h-4 text-[#D4AF37]/40 animate-slow-pulse" style={{ animationDelay: '1.5s' }} />

                                {/* Snowflake decorations */}
                                <Snowflake className="absolute top-16 left-12 w-8 h-8 text-white/20 animate-float" />
                                <Snowflake className="absolute top-24 right-16 w-6 h-6 text-white/15 animate-float" style={{ animationDelay: '1s' }} />
                                <Snowflake className="absolute bottom-28 left-20 w-10 h-10 text-white/10 animate-float" style={{ animationDelay: '2s' }} />
                                <Snowflake className="absolute bottom-36 right-12 w-7 h-7 text-white/15 animate-float" style={{ animationDelay: '0.5s' }} />
                                <Snowflake className="absolute top-1/2 left-8 w-5 h-5 text-white/10 animate-float" style={{ animationDelay: '1.5s' }} />

                                {/* Christmas ornament decoration */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png"
                                    alt=""
                                    className="absolute top-4 right-4 w-64 h-auto opacity-90 pointer-events-none"
                                />

                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 text-center">
                                    <div className="mb-5 bg-white py-3 px-6 rounded-xl shadow-lg border border-[#D4AF37]/50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png"
                                            alt="NICARB"
                                            width={140}
                                            height={60}
                                            style={{ maxWidth: '140px', height: 'auto' }}
                                        />
                                    </div>

                                    {/* Gold ornate divider */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
                                        <Diamond className="w-3 h-3 text-[#D4AF37]" />
                                        <div className="w-16 h-px bg-gradient-to-r from-[#D4AF37] via-[#D4AF37] to-transparent" />
                                    </div>

                                    {/* Main text */}
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-1 drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                                        Merry Christmas
                                    </h2>
                                    <p className="text-[#D4AF37] text-lg md:text-xl mb-5 tracking-widest uppercase font-light">
                                        & Happy Holidays
                                    </p>

                                    {/* Message */}
                                    <p className="text-white/85 text-base md:text-lg max-w-sm leading-relaxed mb-6 font-light" style={{ fontFamily: 'Georgia, serif' }}>
                                        Wishing you peace, joy, and prosperity this Christmas season. May the holidays bring you warmth and happiness.
                                    </p>

                                    {/* Decorative gold element */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-px bg-[#D4AF37]/60" />
                                        <Sparkle className="w-4 h-4 text-[#D4AF37] animate-sparkle" />
                                        <div className="w-8 h-px bg-[#D4AF37]/60" />
                                    </div>

                                    {/* Footer Bar - Conference Style */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-white px-5 py-3 border-t-4 border-[#D4AF37]">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[#064802] text-left">
                                                <p className="font-bold text-xs text-left">Nigerian Institute of Chartered Arbitrators</p>
                                                <p className="text-[10px] text-gray-600 text-left">10 Adedeji Adekola Close, Off Freedom Way, Lekki Phase 1, Lagos</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-600">+234 908 718 7414 · +234 916 984 9140</p>
                                                <p className="text-[10px] text-[#064802] font-semibold">www.nicarb.org</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => downloadAsImage(christmasRef, 'NICARB_Christmas_2024')}
                                disabled={downloading === 'NICARB_Christmas_2024'}
                                className="mt-4 px-6 py-3 bg-[#064802] text-white rounded-lg font-medium hover:bg-[#075302] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                            >
                                {downloading === 'NICARB_Christmas_2024' ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Downloading...
                                    </span>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Christmas Flyer
                                    </>
                                )}
                            </button>
                        </div>

                        {/* New Year Flyer */}
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-[#064802] mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                                <span className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                    <Sparkle className="w-4 h-4 text-white" />
                                </span>
                                New Year Flyer
                            </h2>

                            <div
                                ref={newYearRef}
                                className="relative w-full aspect-square overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #064802 0%, #075302 40%, #043301 100%)',
                                    borderRadius: '0px'
                                }}
                            >
                                {/* Subtle texture overlay */}
                                <div className="absolute inset-0 opacity-5" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }} />

                                {/* Glow effects - more gold for New Year */}
                                <div className="absolute top-0 left-0 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-[100px] transform -translate-x-1/3 -translate-y-1/3" />
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-[80px] transform translate-x-1/3 translate-y-1/3" />
                                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#a9ce46]/10 rounded-full blur-[120px] transform -translate-x-1/2 -translate-y-1/2" />

                                {/* Elegant gold frame border */}
                                <div className="absolute inset-4 border-2 border-[#D4AF37]/30 pointer-events-none" />
                                <div className="absolute inset-6 border border-[#D4AF37]/15 pointer-events-none" />

                                {/* Top gold accent bar */}
                                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B]" />

                                {/* Corner decorations with sparkles */}
                                <Sparkle className="absolute top-8 left-8 w-5 h-5 text-[#D4AF37]/50 animate-sparkle" />
                                <Sparkle className="absolute top-8 right-8 w-5 h-5 text-[#D4AF37]/50 animate-sparkle" style={{ animationDelay: '0.3s' }} />
                                <Sparkle className="absolute bottom-8 left-8 w-5 h-5 text-[#D4AF37]/50 animate-sparkle" style={{ animationDelay: '0.6s' }} />
                                <Sparkle className="absolute bottom-8 right-8 w-5 h-5 text-[#D4AF37]/50 animate-sparkle" style={{ animationDelay: '0.9s' }} />

                                {/* Scattered sparkles */}
                                <Sparkle className="absolute top-20 left-16 w-3 h-3 text-[#D4AF37]/30 animate-sparkle" style={{ animationDelay: '0.2s' }} />
                                <Sparkle className="absolute top-32 right-20 w-4 h-4 text-[#D4AF37]/25 animate-sparkle" style={{ animationDelay: '0.7s' }} />
                                <Sparkle className="absolute bottom-32 left-24 w-3 h-3 text-[#D4AF37]/35 animate-sparkle" style={{ animationDelay: '1.1s' }} />
                                <Sparkle className="absolute bottom-24 right-16 w-4 h-4 text-white/20 animate-sparkle" style={{ animationDelay: '0.4s' }} />
                                <Sparkle className="absolute top-1/2 left-12 w-2 h-2 text-[#D4AF37]/40 animate-sparkle" style={{ animationDelay: '0.8s' }} />
                                <Sparkle className="absolute top-1/3 right-10 w-3 h-3 text-white/15 animate-sparkle" style={{ animationDelay: '1.3s' }} />

                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 text-center">
                                    {/* Logo */}
                                    <div className="mb-4 bg-white py-3 px-6 rounded-xl shadow-lg border border-[#D4AF37]/50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png"
                                            alt="NICARB"
                                            width={140}
                                            height={60}
                                            style={{ maxWidth: '140px', height: 'auto' }}
                                        />
                                    </div>

                                    {/* Ornate divider */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
                                        <Diamond className="w-3 h-3 text-[#D4AF37]" />
                                        <div className="w-16 h-px bg-gradient-to-r from-[#D4AF37] via-[#D4AF37] to-transparent" />
                                    </div>

                                    {/* Main text */}
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                                        Happy New Year
                                    </h2>

                                    {/* Year with golden glow effect */}
                                    <div className="relative mb-4">
                                        <p className="text-6xl md:text-7xl font-bold drop-shadow-2xl"
                                            style={{
                                                fontFamily: 'Georgia, serif',
                                                background: 'linear-gradient(180deg, #F0E68C 0%, #D4AF37 50%, #B8860B 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.5))'
                                            }}>
                                            2026
                                        </p>
                                    </div>

                                    {/* Message */}
                                    <p className="text-white/85 text-base md:text-lg max-w-sm leading-relaxed mb-5 font-light" style={{ fontFamily: 'Georgia, serif' }}>
                                        Wishing you a year filled with prosperity, success, and peaceful resolutions. Here's to new beginnings!
                                    </p>

                                    {/* Decorative gold element */}
                                    <div className="flex items-center gap-2 mb-5">
                                        <div className="w-8 h-px bg-[#D4AF37]/60" />
                                        <Sparkle className="w-4 h-4 text-[#D4AF37] animate-sparkle" />
                                        <div className="w-8 h-px bg-[#D4AF37]/60" />
                                    </div>

                                    {/* Footer Bar - Conference Style */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-white px-5 py-3 border-t-4 border-[#D4AF37]">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[#064802] text-left">
                                                <p className="font-bold text-xs text-left">Nigerian Institute of Chartered Arbitrators</p>
                                                <p className="text-[10px] text-gray-600 text-left">10 Adedeji Adekola Close, Off Freedom Way, Lekki Phase 1, Lagos</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-600">+234 908 718 7414 · +234 916 984 9140</p>
                                                <p className="text-[10px] text-[#064802] font-semibold">www.nicarb.org</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => downloadAsImage(newYearRef, 'NICARB_NewYear_2026')}
                                disabled={downloading === 'NICARB_NewYear_2026'}
                                className="mt-4 px-6 py-3 bg-[#064802] text-white rounded-lg font-medium hover:bg-[#075302] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                            >
                                {downloading === 'NICARB_NewYear_2026' ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Downloading...
                                    </span>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download New Year Flyer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#064802]/10">
                        <h2 className="text-2xl font-bold text-[#064802] mb-6 flex items-center gap-3" style={{ fontFamily: 'Georgia, serif' }}>
                            <span className="w-10 h-10 bg-gradient-to-br from-[#064802] to-[#075302] rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            How to Use
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="flex items-start gap-4 p-4 bg-[#064802]/5 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#a9ce46] to-[#8ab33a] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">1</div>
                                <div>
                                    <h3 className="font-semibold text-[#064802] text-lg mb-1">Download</h3>
                                    <p className="text-gray-600 text-sm">Click the download button below each flyer to save as PNG</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-[#064802]/5 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#a9ce46] to-[#8ab33a] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">2</div>
                                <div>
                                    <h3 className="font-semibold text-[#064802] text-lg mb-1">Share</h3>
                                    <p className="text-gray-600 text-sm">Post on Instagram, LinkedIn, Twitter, Facebook, or WhatsApp Status</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-[#064802]/5 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#a9ce46] to-[#8ab33a] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">3</div>
                                <div>
                                    <h3 className="font-semibold text-[#064802] text-lg mb-1">Tag Us</h3>
                                    <p className="text-gray-600 text-sm">Use <strong>#NICARB</strong> and tag our social media handles</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alternative Designs Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#064802]/10">
                        <h2 className="text-2xl font-bold text-[#064802] mb-2 flex items-center gap-3" style={{ fontFamily: 'Georgia, serif' }}>
                            <span className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </span>
                            Alternative Designs
                        </h2>
                        <p className="text-gray-600 mb-8">Different style options based on 2025/2026 corporate design trends</p>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Minimalist 1: Left Accent Stripe */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-gray-200 border-2 border-gray-400"></span>
                                    Minimalist — Left Accent
                                </h3>
                                <div
                                    className="relative w-full aspect-square overflow-hidden shadow-xl"
                                    style={{ background: '#ffffff' }}
                                >
                                    {/* Subtle accent line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#064802] via-[#a9ce46] to-[#D4AF37]" />

                                    {/* Christmas ornament decoration */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png"
                                        alt=""
                                        className="absolute top-4 right-2 w-80 h-auto opacity-80 pointer-events-none"
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col items-start justify-center p-12 pl-16">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" className="mb-8" style={{ maxWidth: '120px', height: 'auto' }} />

                                        <h2 className="text-4xl text-[#064802] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: '400' }}>Merry</h2>
                                        <h2 className="text-4xl text-[#064802] mb-4" style={{ fontFamily: 'Georgia, serif', fontWeight: '400' }}>Christmas</h2>

                                        <div className="w-16 h-0.5 bg-[#D4AF37] my-4" />

                                        <p className="text-gray-500 text-lg" style={{ fontFamily: 'Georgia, serif' }}>&amp; Happy New Year 2026</p>

                                        {/* Footer Bar - Conference Style */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-white px-5 py-3 border-t-2 border-[#D4AF37]">
                                            <div className="flex items-center justify-between">
                                                <div className="text-[#064802]">
                                                    <p className="font-bold text-[9px]">Nigerian Institute of Chartered Arbitrators</p>
                                                    <p className="text-[7px] text-gray-600">10 Adedeji Adekola Close, Off Freedom Way, Lekki Phase 1, Lagos</p>
                                                </div>
                                                <div className="text-right flex-shrink-0 whitespace-nowrap">
                                                    <p className="text-[7px] text-gray-600 whitespace-nowrap">+234 908 718 7414 · +234 916 984 9140</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist 2: Centered with Frame */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#064802]"></span>
                                    Minimalist — Centered Frame
                                </h3>
                                <div
                                    className="relative w-full aspect-square overflow-hidden shadow-xl"
                                    style={{ background: '#fafafa' }}
                                >
                                    {/* Thin border frame */}
                                    <div className="absolute inset-6 border border-[#064802]/20" />

                                    {/* Christmas ornament decoration */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png"
                                        alt=""
                                        className="absolute top-4 right-2 w-80 h-auto opacity-80 pointer-events-none"
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" className="mb-6" style={{ maxWidth: '130px', height: 'auto' }} />

                                        <div className="flex items-center gap-4 my-4">
                                            <div className="w-12 h-px bg-[#D4AF37]" />
                                            <div className="w-2 h-2 bg-[#D4AF37] rotate-45" />
                                            <div className="w-12 h-px bg-[#D4AF37]" />
                                        </div>

                                        <h2 className="text-3xl text-[#064802] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Season&apos;s Greetings</h2>
                                        <p className="text-[#a9ce46] text-lg" style={{ fontFamily: 'Georgia, serif' }}>2025 / 2026</p>

                                        <p className="text-gray-400 text-sm mt-6 max-w-xs">Wishing you peace, joy & prosperity</p>

                                        {/* Footer Bar - Conference Style */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-white px-5 py-3 border-t-2 border-[#D4AF37]">
                                            <div className="flex items-center justify-between">
                                                <div className="text-[#064802]">
                                                    <p className="font-bold text-[10px]">Nigerian Institute of Chartered Arbitrators</p>
                                                    <p className="text-[8px] text-gray-600">10 Adedeji Adekola Close, Off Freedom Way, Lekki Phase 1, Lagos</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] text-gray-600">+234 908 718 7414 · +234 916 984 9140</p>
                                                    <p className="text-[8px] text-[#064802] font-semibold">www.nicarb.org</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist 3: Bottom Accent Bar */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#a9ce46]"></span>
                                    Minimalist — Bottom Bar
                                </h3>
                                <div
                                    className="relative w-full aspect-square overflow-hidden shadow-xl"
                                    style={{ background: '#ffffff' }}
                                >
                                    {/* Footer Bar - Conference Style */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-white px-5 py-3 border-t-4 border-[#D4AF37]">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[#064802]">
                                                <p className="font-bold text-[10px]">Nigerian Institute of Chartered Arbitrators</p>
                                                <p className="text-[8px] text-gray-600">10 Adedeji Adekola Close, Off Freedom Way, Lekki Phase 1, Lagos</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] text-gray-600">+234 908 718 7414 · +234 916 984 9140</p>
                                                <p className="text-[8px] text-[#064802] font-semibold">www.nicarb.org</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Christmas ornament decoration */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png"
                                        alt=""
                                        className="absolute top-4 right-2 w-80 h-auto opacity-80 pointer-events-none"
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" className="mb-10" style={{ maxWidth: '150px', height: 'auto' }} />

                                        <h2 className="text-4xl text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Merry Christmas</h2>

                                        <p className="text-gray-500 text-xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>&amp;</p>

                                        <h3 className="text-2xl text-[#064802]" style={{ fontFamily: 'Georgia, serif' }}>Happy New Year</h3>
                                        <p className="text-[#D4AF37] text-4xl font-bold mt-2">2026</p>
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist 4: Split Design */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#D4AF37]"></span>
                                    Minimalist — Split Layout
                                </h3>
                                <div
                                    className="relative w-full aspect-square overflow-hidden shadow-xl flex"
                                >
                                    {/* Left side - Green */}
                                    <div className="w-1/3 bg-[#064802] flex items-center justify-center">
                                        <div className="text-white text-center">
                                            <p className="text-6xl font-bold">25</p>
                                            <p className="text-sm tracking-widest mt-1">2026</p>
                                        </div>
                                    </div>

                                    {/* Christmas ornament decoration */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png"
                                        alt=""
                                        className="absolute top-2 right-2 w-64 h-auto opacity-80 pointer-events-none"
                                    />

                                    {/* Right side - White */}
                                    <div className="w-2/3 bg-white flex flex-col items-start justify-center p-8">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" className="mb-6" style={{ maxWidth: '100px', height: 'auto' }} />

                                        <div className="w-10 h-0.5 bg-[#D4AF37] mb-4" />

                                        <h2 className="text-2xl text-[#064802] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Merry Christmas</h2>
                                        <p className="text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>&amp; Happy New Year</p>

                                        {/* Footer Bar - Conference Style */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-2 border-t-2 border-[#D4AF37]">
                                            <div className="flex items-center justify-between">
                                                <div className="text-[#064802]">
                                                    <p className="font-bold text-[8px]">NICArb</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[7px] text-gray-600">+234 908 718 7414 · www.nicarb.org</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Design 5: The Presidential (Luxury Gold) - Refined */}
                            <div className="group">
                                {/* Embed Fonts */}
                                <style>{`
                                        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                                    `}</style>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#022c01] border border-gray-400"></span>
                                    The Presidential (Luxury Gold)
                                </h3>
                                <div
                                    className="relative w-full aspect-square overflow-hidden shadow-xl"
                                    style={{ background: '#022c01' }}
                                >
                                    {/* Gold Border Frame */}
                                    <div className="absolute inset-4 border-2 border-[#D4AF37] opacity-60" />
                                    <div className="absolute inset-6 border border-[#D4AF37] opacity-30" />

                                    {/* Ornament */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png"
                                        alt=""
                                        className="absolute top-2 right-2 w-44 h-auto opacity-40 pointer-events-none mix-blend-overlay"
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
                                        {/* Logo - Anchored & Larger */}
                                        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/95 px-8 py-4 rounded-b-xl shadow-2xl border-t-0 border border-[#D4AF37]/40">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" style={{ maxWidth: '130px', height: 'auto' }} />
                                        </div>

                                        <div className="mt-24 flex flex-col items-center">
                                            <h2 className="text-5xl text-[#D4AF37] mb-2 leading-none transform -rotate-2" style={{ fontFamily: 'Great Vibes, cursive' }}>Season&apos;s</h2>
                                            <h2 className="text-5xl text-[#F0E68C] mb-6 tracking-[0.2em] leading-tight font-bold" style={{ fontFamily: 'Cinzel, serif' }}>GREETINGS</h2>
                                        </div>

                                        {/* Refined Divider */}
                                        <div className="flex items-center gap-4 mb-8 opacity-90">
                                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
                                            <div className="w-2 h-2 rotate-45 border border-[#D4AF37] bg-[#022c01]" />
                                            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
                                        </div>

                                        {/* Integrated Year */}
                                        <p className="text-[#F0E68C] text-lg font-medium tracking-[0.4em] drop-shadow-md" style={{ fontFamily: 'Playfair Display, serif' }}>2026</p>

                                        {/* Assertive Gold Footer */}
                                        <div className="absolute bottom-10 w-full text-center">
                                            <div className="w-1/3 h-px bg-[#D4AF37]/30 mx-auto mb-4"></div>
                                            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.25em] uppercase">
                                                Nigerian Institute of Chartered Arbitrators
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Design 6: Glass & Light - Elevated */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-gradient-to-br from-green-200 to-white border border-gray-400"></span>
                                    Glass & Light
                                </h3>
                                <div
                                    className="relative w-full aspect-square overflow-hidden shadow-xl"
                                    style={{
                                        background: 'radial-gradient(circle at top right, #064802, #0a1f0a)',
                                    }}
                                >
                                    {/* Abstract Background Blobs */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#a9ce46]/20 rounded-full blur-[100px]" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-[100px]" />

                                    {/* Glass Card - Refined Opacity */}
                                    <div className="absolute inset-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 text-center ring-1 ring-white/5">

                                        {/* Ornament - Balanced */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png"
                                            alt=""
                                            className="absolute -top-12 -right-12 w-48 h-auto opacity-30 pointer-events-none rotate-12 mix-blend-plus-lighter"
                                        />
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png"
                                            alt=""
                                            className="absolute -bottom-10 -left-10 w-32 h-auto opacity-20 pointer-events-none -rotate-12 mix-blend-overlay"
                                        />

                                        {/* Logo - Scaled Up */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" className="mb-8 bg-white/95 px-6 py-4 rounded-xl shadow-xl" style={{ maxWidth: '150px', height: 'auto' }} />

                                        <div className="relative z-10">
                                            <h2 className="text-6xl text-white mb-2 drop-shadow-lg" style={{ fontFamily: 'Great Vibes, cursive' }}>Merry Christmas</h2>
                                            <p className="text-[#d8eeb3] text-lg mb-8 tracking-wider font-light" style={{ fontFamily: 'Cinzel, serif' }}>& HAPPY NEW YEAR</p>
                                        </div>

                                        {/* Refined Year Badge */}
                                        <div className="relative group/year">
                                            <div className="absolute inset-0 bg-[#D4AF37]/20 blur-lg rounded-full opacity-50"></div>
                                            <div className="relative px-10 py-2 rounded-full text-base font-bold tracking-[0.3em] shadow-lg border border-[#D4AF37]/50 text-[#D4AF37] bg-black/40 backdrop-blur-md" style={{ fontFamily: 'Playfair Display, serif' }}>
                                                2026
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Design 7: The Coat of Arms */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-white border-2 border-[#064802]"></span>
                                    The Coat of Arms
                                </h3>
                                <div
                                    className="relative w-full aspect-square overflow-hidden shadow-xl bg-white"
                                >
                                    {/* Watermark Logo */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp" alt="" className="w-3/4 h-auto grayscale" />
                                    </div>

                                    {/* Sidebar/Header Green Stripe */}
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-[#064802]" />
                                    <div className="absolute top-2 left-0 right-0 h-1 bg-[#D4AF37]" />

                                    {/* Ornament */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png"
                                        alt=""
                                        className="absolute top-6 right-0 w-56 h-auto opacity-100 pointer-events-none"
                                    />

                                    <div className="relative z-10 h-full flex flex-col p-10 pt-16">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" className="mb-10 block" style={{ maxWidth: '160px', height: 'auto' }} />

                                        <div className="mt-auto">
                                            <h2 className="text-5xl text-[#064802] mb-2 font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                                                Merry <br />
                                                <span className="text-[#D4AF37]">Christmas</span>
                                            </h2>
                                            <p className="text-gray-600 text-lg mt-4 max-w-xs">
                                                Wishing you a prosperous New Year <strong>2026</strong>.
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-end text-[10px] text-gray-500">
                                            <div>
                                                Nigerian Institute of<br />Chartered Arbitrators
                                            </div>
                                            <div className="font-bold text-[#064802]">
                                                www.nicarb.org
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Design 8: Red & Gold Grandeur */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#8b0000] border border-gray-400"></span>
                                    Red & Gold Grandeur
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl flex bg-white">
                                    {/* Left Accent - Red */}
                                    <div className="w-1/3 bg-[#8b0000] relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/nicarb/christmas-signatures/pngmagic-tree.png" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-auto object-cover" alt="" />
                                    </div>
                                    <div className="w-2/3 p-8 flex flex-col justify-center text-left relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" className="w-24 mb-6" />
                                        <h2 className="text-3xl font-serif text-[#064802] leading-tight mb-2">Merry <br /><span className="text-[#D4AF37]">Christmas</span></h2>
                                        <p className="text-xs text-gray-500 mb-6">Wishing you joy and success in 2026.</p>
                                        <div className="mt-auto border-t border-gray-200 pt-4 text-[10px] text-gray-400">
                                            Nigerian Institute of Chartered Arbitrators
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Design 9: The Golden Spiral */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#064802] border border-gray-400"></span>
                                    The Golden Spiral
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-[#0a2f0a]">
                                    {/* Abstract Swirls */}
                                    <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/40 via-transparent to-transparent"></div>

                                    {/* Centered Tree */}
                                    <div className="absolute inset-0 flex items-center justify-center translate-y-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/nicarb/christmas-signatures/ai-tree-gold.png" className="w-3/4 h-auto drop-shadow-2xl brightness-110" alt="" />
                                    </div>

                                    <div className="absolute top-8 left-0 right-0 text-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/nicarb/NICARB-LOGO-White.png" alt="NICARB" className="h-12 mx-auto opacity-90" />
                                    </div>

                                    <div className="absolute bottom-10 left-0 right-0 text-center">
                                        <h2 className="text-5xl font-serif text-[#D4AF37] tracking-widest drop-shadow-lg">2026</h2>
                                        <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase mt-1">Season's Greetings</p>
                                    </div>
                                </div>
                            </div>

                            {/* Design 10: Ring In The New */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-white border border-gray-400"></span>
                                    Ring In The New
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-gradient-to-b from-gray-50 to-white border-8 border-white ring-1 ring-gray-200">
                                    {/* Hanging Bells */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/nicarb/christmas-signatures/vecteezy-bells.png" className="absolute -top-4 left-1/2 -translate-x-1/2 w-2/3 h-auto drop-shadow-xl z-10" alt="" />

                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 flex flex-col items-center justify-end p-8 pb-10 text-center">
                                        <h2 className="text-3xl text-[#064802] font-serif mb-2">Peace & Joy</h2>
                                        <p className="text-gray-500 text-sm mb-4">May your holidays be filled with harmony.</p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#D4AF37]">
                                            <span>NICArb</span>
                                            <span>•</span>
                                            <span>2026</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Design 11: The New Cutout */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#064802] border border-gray-400"></span>
                                    The New Cutout
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-[#064802]">
                                    {/* Big Faded Background */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_12.27.59-removebg-preview.png" className="absolute -right-20 -bottom-20 w-full h-auto opacity-10 blur-sm rotate-12" alt="" />

                                    {/* Main Content */}
                                    <div className="relative z-10 h-full flex flex-row items-center p-8">
                                        <div className="w-1/2">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_12.27.59-removebg-preview.png" className="w-full h-auto drop-shadow-2xl" alt="" />
                                        </div>
                                        <div className="w-1/2 text-right text-white">
                                            <h2 className="text-2xl font-bold mb-1">Happy Holidays</h2>
                                            <div className="w-full h-1 bg-[#D4AF37] my-3 ml-auto rounded-full"></div>
                                            <p className="text-xs text-white/80">Wishing you a prosperous year ahead.</p>
                                            <p className="text-3xl font-bold text-[#D4AF37] mt-4">2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Design 12: Golden Holiday */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#D4AF37] border border-gray-400"></span>
                                    Golden Holiday
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-black">
                                    {/* Tree on Right */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/nicarb/christmas-signatures/golden-holiday-tree.png" className="absolute right-0 bottom-0 h-[90%] w-auto object-contain" alt="" />

                                    <div className="absolute top-8 left-8">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/nicarb/NICARB-LOGO-White.png" alt="" className="w-16 opacity-80" />
                                    </div>

                                    <div className="absolute bottom-12 left-8 text-white max-w-[50%]">
                                        <h2 className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0E68C]">GOLDEN<br />WISHES</h2>
                                        <p className="text-[#D4AF37] mt-2 text-sm">For the New Year</p>
                                    </div>
                                </div>
                            </div>

                            {/* Design 13: Luxury Bells (Dark) */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-black border border-gray-400"></span>
                                    Luxury Bells (Dark)
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 to-black">
                                    {/* Center Glow */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20"></div>

                                    {/* Bells */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/nicarb/christmas-signatures/ai-bells-gold.png" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-3/4 h-auto drop-shadow-2xl z-10" alt="" />

                                    <div className="absolute top-0 w-full p-6 text-center z-20">
                                        <p className="text-[#D4AF37] tracking-[0.5em] text-xs uppercase">Season's Greetings</p>
                                    </div>

                                    <div className="absolute bottom-8 w-full text-center z-20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/nicarb/NICARB-LOGO-White.png" alt="" className="h-8 mx-auto opacity-70" />
                                    </div>
                                </div>
                            </div>

                            {/* Design 14: Ornate Corner */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-white border border-gray-400"></span>
                                    Ornate Corner
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-white border-2 border-[#064802]">
                                    {/* Corners */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png" className="absolute -top-4 -left-4 w-32 h-auto rotate-180" alt="" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png" className="absolute -bottom-4 -right-4 w-32 h-auto" alt="" />

                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                                        <h2 className="text-4xl font-serif text-[#064802] mb-1">2026</h2>
                                        <div className="w-16 h-1 bg-[#D4AF37] mb-4"></div>
                                        <p className="text-gray-600 italic">"Wishing you peace, prosperity, and happiness."</p>
                                        <p className="text-[10px] font-bold text-[#064802] mt-6 uppercase tracking-widest">The Nigerian Institute<br />of Chartered Arbitrators</p>
                                    </div>
                                </div>
                            </div>

                            {/* Design 15: The Celebration */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#D4AF37] border border-gray-400"></span>
                                    The Celebration
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-[#D4AF37]">
                                    <div className="absolute inset-2 bg-white flex flex-col items-center justify-between p-6 pt-12">
                                        {/* Bells Top */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/nicarb/christmas-signatures/vecteezy-bells.png" className="w-32 h-auto -mt-8" alt="" />

                                        <div className="text-center">
                                            <h2 className="text-3xl font-serif text-[#064802]">Season's<br />Greetings</h2>
                                            <p className="text-[#D4AF37] font-bold mt-2">2026</p>
                                        </div>

                                        {/* Tree Bottom */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/nicarb/christmas-signatures/ai-tree-gold.png" className="w-32 h-auto -mb-8 opacity-50 grayscale" alt="" />
                                    </div>
                                </div>
                            </div>

                            {/* Design 16: Art Deco 2026 */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#064802] border border-gray-400"></span>
                                    Art Deco 2026
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-[#0e2a14] border-4 border-[#D4AF37]">
                                    <div className="absolute inset-4 border border-[#D4AF37] flex items-center justify-center">
                                        <div className="text-center">
                                            <h2 className="text-6xl font-thin text-[#D4AF37]" style={{ fontFamily: 'Georgia' }}>20</h2>
                                            <h2 className="text-6xl font-bold text-white" style={{ fontFamily: 'Georgia' }}>26</h2>
                                        </div>
                                    </div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/nicarb/christmas-signatures/ai-bells-gold.png" className="absolute top-2 right-2 w-24 h-auto opacity-80" alt="" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/nicarb/christmas-signatures/ai-bells-gold.png" className="absolute bottom-2 left-2 w-24 h-auto opacity-80 rotate-180" alt="" />
                                </div>
                            </div>


                            {/* Design 17: Typographic */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-white border border-gray-400"></span>
                                    Typographic Modern
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-white flex flex-col p-8">
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h2 className="text-[5rem] leading-none font-black text-gray-100 absolute top-4 left-4 -z-10">DEC</h2>
                                        <h2 className="text-5xl font-bold text-[#064802] mb-1">MERRY</h2>
                                        <h2 className="text-5xl font-bold text-[#D4AF37] mb-6">XMAS</h2>
                                        <div className="w-20 h-2 bg-[#064802]"></div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm text-gray-500 max-w-[150px]">Warmest thoughts and best wishes for a wonderful holiday.</p>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/nicarb/christmas-signatures/golden-holiday-tree.png" className="w-24 h-auto -mr-4 -mb-4 opacity-80" alt="" />
                                    </div>
                                </div>
                            </div>


                            {/* Design 18: The Regal Classic */}
                            <div className="group">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#032001] border border-gray-400"></span>
                                    The Regal Classic
                                </h3>
                                <div className="relative w-full aspect-square overflow-hidden shadow-xl bg-gradient-to-t from-[#032001] to-[#064802]">
                                    {/* Gold Frame Border */}
                                    <div className="absolute inset-3 border border-[#D4AF37]/40"></div>
                                    <div className="absolute inset-4 border border-[#D4AF37]/20"></div>

                                    {/* Main Asset - Centered and Large */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/nicarb/christmas-signatures/photo-1636853242788-520691c7d527-removebg-preview.png"
                                            className="w-[75%] h-auto object-contain drop-shadow-2xl z-10"
                                            alt="Decoration"
                                        />
                                    </div>

                                    {/* Glass Overlay for Text */}
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-[#032001]/80 backdrop-blur-sm border-t border-[#D4AF37]/50 p-6 text-center z-20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" className="h-8 mx-auto mb-3 brightness-0 invert opacity-80" />

                                        <h2 className="text-3xl text-white font-serif tracking-wide">Season's Greetings</h2>
                                        <div className="flex items-center justify-center gap-3 my-2 opacity-60">
                                            <div className="h-px w-8 bg-[#D4AF37]"></div>
                                            <span className="text-[#D4AF37] font-serif italic">2026</span>
                                            <div className="h-px w-8 bg-[#D4AF37]"></div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-6">💡 Let us know which design you prefer and we can make it downloadable!</p>
                    </div>

                    {/* Email Signatures Section */}
                    <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-[#064802]/10">
                        <h2 className="text-2xl font-bold text-[#064802] mb-6 flex items-center gap-3" style={{ fontFamily: 'Georgia, serif' }}>
                            <span className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            Christmas Email Signature
                        </h2>
                        <p className="text-gray-600 mb-6">Copy the signature below and paste into your email settings (Gmail/Outlook).</p>

                        {/* Image-based Signature */}
                        <div className="border-2 border-dashed border-[#064802]/30 rounded-xl p-6 hover:border-[#D4AF37] transition-colors cursor-pointer bg-white max-w-lg mx-auto"
                            onClick={(e) => {
                                const target = e.currentTarget.querySelector('.signature-content');
                                if (target) {
                                    const range = document.createRange();
                                    range.selectNodeContents(target);
                                    const selection = window.getSelection();
                                    selection?.removeAllRanges();
                                    selection?.addRange(range);
                                    try {
                                        document.execCommand('copy');
                                        alert('Signature copied! Paste it in your email settings.');
                                    } catch {
                                        alert('Selected! Press Cmd+C to copy.');
                                    }
                                }
                            }}>
                            <div className="signature-content" style={{ fontFamily: 'Arial, sans-serif', background: '#ffffff' }}>
                                <table cellPadding={0} cellSpacing={0} style={{ fontFamily: 'Arial, sans-serif', maxWidth: '450px', background: '#ffffff' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ textAlign: 'center', padding: '10px' }}>
                                                {/* Christmas Image */}
                                                <img
                                                    src="/nicarb/christmas-signatures/nicarb_final_2026_white_1765805295269.jpeg"
                                                    alt="NICARB Season's Greetings"
                                                    style={{ maxWidth: '400px', width: '100%', height: 'auto', display: 'block', margin: '0 auto 15px' }}
                                                />

                                                {/* Contact Details */}
                                                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#555', lineHeight: '1.8', textAlign: 'center' }}>
                                                    <div style={{ fontWeight: 'bold', color: '#2d5a2d', marginBottom: '5px' }}>1ST ARBITRATION (AND ADR) INSTITUTE IN SUB-SAHARAN AFRICA</div>
                                                    <div style={{ marginBottom: '3px' }}>10, Adedeji Adekola Close, Off Freedom Way, Lekki Phase 1, Lagos.</div>
                                                    <div style={{ marginBottom: '5px' }}>
                                                        Tel: <a href="tel:+2349087187414" style={{ color: '#2d5a2d', textDecoration: 'none' }}>+234 908 718 7414</a>,{' '}
                                                        <a href="tel:+2349169849140" style={{ color: '#2d5a2d', textDecoration: 'none' }}>+234 916 984 9140</a>
                                                    </div>
                                                    <div>
                                                        <a href="http://nicarb.org/" style={{ color: '#2d5a2d', textDecoration: 'none', marginRight: '8px' }}>Website</a>
                                                        <a href="https://www.instagram.com/nicarborg/" style={{ color: '#2d5a2d', textDecoration: 'none', marginRight: '8px' }}>Instagram</a>
                                                        <a href="https://www.linkedin.com/company/nicarborg/" style={{ color: '#2d5a2d', textDecoration: 'none', marginRight: '8px' }}>LinkedIn</a>
                                                        <a href="https://www.facebook.com/NICArbOrgNg/" style={{ color: '#2d5a2d', textDecoration: 'none', marginRight: '8px' }}>Facebook</a>
                                                        <a href="https://twitter.com/NICArbOrg" style={{ color: '#2d5a2d', textDecoration: 'none' }}>Twitter</a>
                                                    </div>

                                                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#2d5a2d', marginBottom: '8px' }}>NICArb ARBITRATION CLAUSE FOR THE APPOINTMENT OF A SOLE ARBITRATOR</div>
                                                        <div style={{ fontSize: '9px', color: '#666', lineHeight: '1.6', textAlign: 'justify' }}>
                                                            "The parties shall use their best efforts to negotiate in good faith and settle amicably any question or dispute, including any claim, construction, meaning or effect of this Agreement or concerning the rights and liabilities of the parties thereto or any other matter connected to this Agreement.<br /><br />
                                                            If the parties are unable to resolve such question or dispute within 30 days (or such further period as the parties shall agree in writing), the question or dispute shall be settled finally by arbitration in accordance with the Arbitration and Mediation Act 2023, Laws of the Federation (or any amendment thereto) and the Arbitration Rules connected thereto. The arbitral tribunal shall be constituted by a sole arbitrator to be appointed jointly by the parties in writing; if the parties are unable to agree on the choice of the sole arbitrator within seven days after the service of a notice of arbitration by one party to the other, on the application of either party, the sole arbitrator shall be appointed by the Nigerian Institute of Chartered Arbitrators. The place of the arbitration shall be ……………., Nigeria; and the laws of the Federal Republic of Nigeria shall govern the arbitration. The language of the arbitration shall be the English Language."
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-center">👆 Click to copy signature</p>
                        </div>

                        {/* Instructions */}
                        <div className="mt-6 bg-[#064802]/5 rounded-xl p-4 max-w-lg mx-auto">
                            <h4 className="font-semibold text-[#064802] mb-2">📋 How to Add to Your Email</h4>
                            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                <li>Click on the signature above to copy</li>
                                <li>Open Gmail/Outlook Settings → Signature</li>
                                <li>Paste (Cmd+V or Ctrl+V)</li>
                                <li>Save your settings</li>
                            </ol>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-12 text-gray-500 text-sm">
                        <p>Created for <strong>Nigerian Institute of Chartered Arbitrators</strong> • December 2024</p>
                        <p className="mt-1 text-xs text-gray-400">Powered by MerisLabs</p>
                    </div>
                </div>
            </div >
        </>
    );
}
