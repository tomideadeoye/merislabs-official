'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

export default function NICARBFlyersPage() {
    const christmasRef = useRef<HTMLDivElement>(null);
    const newYearRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState<string | null>(null);

    const downloadAsImage = async (elementRef: React.RefObject<HTMLDivElement>, filename: string) => {
        if (!elementRef.current) return;
        setDownloading(filename);
        
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(elementRef.current, {
                scale: 2,
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
        <div className="min-h-screen bg-gradient-to-br from-[#064802]/5 via-white to-[#a9ce46]/10">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#064802] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                        NICARB Season's Greetings 2024/2025
                    </h1>
                    <p className="text-lg text-gray-600">
                        Download and share on social media
                    </p>
                </div>

                {/* Flyers Grid */}
                <div className="grid md:grid-cols-2 gap-12">
                    
                    {/* Christmas Flyer */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-[#064802] mb-4 flex items-center gap-2">
                            <span className="text-3xl">🎄</span>
                            Christmas Flyer
                        </h2>
                        
                        <div 
                            ref={christmasRef}
                            className="relative w-full aspect-square bg-gradient-to-br from-[#064802] via-[#075302] to-[#043301] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#a9ce46]/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
                            
                            {/* Gold accent line top */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#F0E68C] to-[#D4AF37]" />
                            
                            {/* Snowflake decorations */}
                            <div className="absolute top-8 left-8 text-white/20 text-4xl">❄</div>
                            <div className="absolute top-16 right-12 text-white/15 text-3xl">❄</div>
                            <div className="absolute bottom-20 left-16 text-white/10 text-5xl">❄</div>
                            <div className="absolute bottom-32 right-8 text-white/20 text-3xl">❄</div>
                            
                            {/* Holly decoration corners */}
                            <div className="absolute top-4 left-4 text-3xl opacity-60">🎄</div>
                            <div className="absolute top-4 right-4 text-3xl opacity-60">🔔</div>
                            
                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                                {/* Logo */}
                                <div className="mb-6">
                                    <Image
                                        src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp"
                                        alt="NICARB"
                                        width={180}
                                        height={80}
                                        className="brightness-0 invert drop-shadow-lg"
                                    />
                                </div>
                                
                                {/* Gold divider */}
                                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6" />
                                
                                {/* Main text */}
                                <h2 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                                    Merry Christmas
                                </h2>
                                <p className="text-[#a9ce46] text-xl mb-6 tracking-wider">
                                    & Joyous Holiday Season
                                </p>
                                
                                {/* Message */}
                                <p className="text-white/80 text-lg max-w-md leading-relaxed mb-8">
                                    Wishing you peace, joy, and prosperity this Christmas season. May your holidays be filled with love and happiness.
                                </p>
                                
                                {/* Gold ornament divider */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-0.5 bg-[#D4AF37]" />
                                    <span className="text-[#D4AF37] text-2xl">✦</span>
                                    <div className="w-12 h-0.5 bg-[#D4AF37]" />
                                </div>
                                
                                {/* Footer */}
                                <div className="text-white/60 text-sm">
                                    <p className="font-semibold text-[#a9ce46] mb-1">Nigerian Institute of Chartered Arbitrators</p>
                                    <p>10 Adedeji Adekola Close, Lekki Phase 1, Lagos</p>
                                    <p>+234 908 718 7414 | www.nicarb.org</p>
                                </div>
                            </div>
                            
                            {/* Bottom gold line */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                        </div>
                        
                        <button
                            onClick={() => downloadAsImage(christmasRef, 'NICARB_Christmas_2024')}
                            disabled={downloading === 'NICARB_Christmas_2024'}
                            className="mt-4 px-6 py-3 bg-[#064802] text-white rounded-lg font-medium hover:bg-[#075302] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {downloading === 'NICARB_Christmas_2024' ? (
                                <>Downloading...</>
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
                        <h2 className="text-2xl font-bold text-[#064802] mb-4 flex items-center gap-2">
                            <span className="text-3xl">🎆</span>
                            New Year Flyer
                        </h2>
                        
                        <div 
                            ref={newYearRef}
                            className="relative w-full aspect-square bg-gradient-to-br from-[#064802] via-[#075302] to-[#043301] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-3xl transform -translate-x-1/3 -translate-y-1/3" />
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#a9ce46]/15 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
                            
                            {/* Gold accent line top */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#F0E68C] to-[#D4AF37]" />
                            
                            {/* Sparkle decorations */}
                            <div className="absolute top-8 left-8 text-[#D4AF37]/40 text-4xl">✨</div>
                            <div className="absolute top-20 right-12 text-[#D4AF37]/30 text-3xl">✦</div>
                            <div className="absolute bottom-24 left-12 text-[#D4AF37]/25 text-5xl">✧</div>
                            <div className="absolute bottom-40 right-16 text-[#D4AF37]/35 text-3xl">✨</div>
                            <div className="absolute top-1/3 left-1/4 text-white/10 text-2xl">★</div>
                            <div className="absolute top-1/2 right-1/4 text-white/15 text-xl">★</div>
                            
                            {/* Celebration icons */}
                            <div className="absolute top-4 left-4 text-3xl opacity-60">🎉</div>
                            <div className="absolute top-4 right-4 text-3xl opacity-60">🥂</div>
                            
                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                                {/* Logo */}
                                <div className="mb-6">
                                    <Image
                                        src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp"
                                        alt="NICARB"
                                        width={180}
                                        height={80}
                                        className="brightness-0 invert drop-shadow-lg"
                                    />
                                </div>
                                
                                {/* Gold divider */}
                                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6" />
                                
                                {/* Main text */}
                                <h2 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                                    Happy New Year
                                </h2>
                                <p className="text-[#D4AF37] text-6xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                                    2025
                                </p>
                                
                                {/* Message */}
                                <p className="text-white/80 text-lg max-w-md leading-relaxed mb-8">
                                    Wishing you a year of prosperity, success, and peaceful resolutions. Here's to new beginnings and achievements!
                                </p>
                                
                                {/* Gold ornament divider */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-0.5 bg-[#D4AF37]" />
                                    <span className="text-[#D4AF37] text-2xl">✦</span>
                                    <div className="w-12 h-0.5 bg-[#D4AF37]" />
                                </div>
                                
                                {/* Footer */}
                                <div className="text-white/60 text-sm">
                                    <p className="font-semibold text-[#a9ce46] mb-1">Nigerian Institute of Chartered Arbitrators</p>
                                    <p>10 Adedeji Adekola Close, Lekki Phase 1, Lagos</p>
                                    <p>+234 908 718 7414 | www.nicarb.org</p>
                                </div>
                            </div>
                            
                            {/* Bottom gold line */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                        </div>
                        
                        <button
                            onClick={() => downloadAsImage(newYearRef, 'NICARB_NewYear_2025')}
                            disabled={downloading === 'NICARB_NewYear_2025'}
                            className="mt-4 px-6 py-3 bg-[#064802] text-white rounded-lg font-medium hover:bg-[#075302] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {downloading === 'NICARB_NewYear_2025' ? (
                                <>Downloading...</>
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
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-[#064802] mb-4">📱 How to Use</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#a9ce46] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                            <div>
                                <h3 className="font-semibold text-[#064802]">Download</h3>
                                <p className="text-gray-600 text-sm">Click the download button below each flyer</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#a9ce46] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                            <div>
                                <h3 className="font-semibold text-[#064802]">Share</h3>
                                <p className="text-gray-600 text-sm">Post on Instagram, LinkedIn, Twitter, or WhatsApp Status</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#a9ce46] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                            <div>
                                <h3 className="font-semibold text-[#064802]">Tag Us</h3>
                                <p className="text-gray-600 text-sm">Use #NICARB and tag @niaborc on social media</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500 text-sm">
                    <p>Created for NICARB • December 2024</p>
                </div>
            </div>
        </div>
    );
}
