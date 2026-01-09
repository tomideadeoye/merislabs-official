'use client';

import { NICARB_BRAND } from './constants';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SovereignOrbit } from './SovereignOrbit';

// BACK PANEL - Contact & Information Hub
export const BackPanel = () => (
    <div className="w-full h-full bg-white relative overflow-hidden flex items-center justify-between px-16">
        <style>{`
            .silk-overlay-back {
                opacity: 0.3;
                background-image: radial-gradient(circle at center, #00000000 0%, #00000005 100%);
                mix-blend-mode: multiply;
            }
        `}</style>

        {/* Subtle Texture */}
        <div className="absolute inset-0 silk-overlay-back pointer-events-none z-0" />

        {/* Background Beams */}
        <div className="absolute inset-0 pointer-events-none z-0 print:hidden">
            <BackgroundBeams className="opacity-100 scale-[1.6] -translate-x-1/4 -translate-y-1/4 rotate-[15deg]" />
            <BackgroundBeams className="opacity-70 scale-[1.4] translate-x-1/3 translate-y-1/3 -rotate-[12deg]" />
        </div>

        {/* Structural Accents */}
        <div className="absolute top-0 right-16 w-[1px] h-full bg-gradient-to-b from-[#a9ce46]/50 via-gray-200 to-transparent" />
        <div className="absolute bottom-0 left-32 w-[1px] h-16 bg-gradient-to-t from-[#a9ce46] to-transparent" />

        {/* Sovereign Orbit Accent (Bottom Left) */}
        <SovereignOrbit className="-bottom-16 -left-16 opacity-80 z-0" />

        {/* LEFT: QR Code Section */}
        <div className="relative z-10 flex flex-col items-center group">
            <div className="bg-white p-3 rounded-sm shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-100 transition-transform group-hover:-translate-y-1">
                <img src={NICARB_BRAND.qrCode} alt="QR Code" className="w-20 h-20 object-contain" />
            </div>
        </div>

        {/* RIGHT: Detailed Contact Information */}
        <div className="relative z-10 text-right space-y-5 max-w-lg">

            {/* Social Icons & Handle - Outline Style */}
            <div className="flex items-center justify-end gap-3">
                <div className="flex gap-3">
                    {/* LinkedIn Icon (Outline) */}
                    <svg className="w-4 h-4 text-[#6b9b2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>

                    {/* Twitter/X Icon (Outline) */}
                    <svg className="w-4 h-4 text-[#6b9b2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.4-6.4M20 4l-6.4 6.4" />
                    </svg>

                    {/* Instagram Icon (Outline) */}
                    <svg className="w-4 h-4 text-[#6b9b2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="18" cy="6" r="1" fill="currentColor" />
                    </svg>
                </div>

                {/* Single @nicarb_ handle */}
                <span className="text-[10px] font-bold text-[#032204] tracking-wider">@nicarb</span>
            </div>

            {/* Institutional Green Divider */}
            {/* Institutional Green Divider */}
            <div className="flex justify-end">
                <div className="w-48 h-[2px] relative my-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a9ce46] to-transparent opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#064802] via-[#a9ce46] to-[#064802] rounded-full shadow-[0_0_8px_rgba(169,206,70,0.3)]"></div>
                    <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-1 h-1 bg-[#a9ce46] rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                    <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-1 h-1 bg-[#064802] rounded-full"></div>
                </div>
            </div>

            <div className="space-y-1 flex flex-col items-end">
                <div className="flex items-center gap-2">
                    <p className="text-[9px] font-semibold text-gray-700 tracking-wide leading-snug">
                        {NICARB_BRAND.contact.address}
                    </p>
                    <svg className="w-3 h-3 text-[#6b9b2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-[9px] font-black text-[#6b9b2d] tracking-wide">
                        {NICARB_BRAND.contact.phone}
                    </p>
                    <svg className="w-3 h-3 text-[#6b9b2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </div>
            </div>

            {/* Online Presence */}
            <div className="space-y-1 pt-1 border-t border-[#6b9b2d]/30">
                <p className="text-[10px] text-gray-500 tracking-wider flex items-center justify-end gap-1.5">
                    {NICARB_BRAND.contact.website} <span className="text-gray-300">|</span> {NICARB_BRAND.contact.email}
                    <svg className="w-3 h-3 text-[#6b9b2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                </p>
            </div>
        </div>
    </div>
);
