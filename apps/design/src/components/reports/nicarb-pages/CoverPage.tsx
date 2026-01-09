import React from 'react';
import { Page } from './Page';
import { Globe, Mail, Linkedin, Twitter, Facebook, Instagram, MapPin, Settings, Search } from 'lucide-react';

export const CoverPage = () => {
    return (
        <Page className="bg-[#E8F5E9] text-[#064802] overflow-hidden relative flex flex-col justify-between h-full font-sans">

            {/* Dynamic Green Floating Orbs - Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Large orb - top left */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#a9ce46]/30 via-[#064802]/20 to-transparent rounded-full blur-3xl"></div>
                {/* Medium orb - middle right */}
                <div className="absolute top-1/3 -right-24 w-72 h-72 bg-gradient-to-bl from-[#064802]/25 via-[#a9ce46]/15 to-transparent rounded-full blur-2xl"></div>
                {/* Small orb - bottom left */}
                <div className="absolute bottom-32 left-16 w-48 h-48 bg-gradient-to-tr from-[#a9ce46]/40 to-transparent rounded-full blur-xl"></div>
                {/* Accent orb - center */}
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-[#064802]/10 to-[#a9ce46]/10 rounded-full blur-2xl"></div>
            </div>

            {/* Subtle Event Image Background - Fading from Top */}
            {/* <div className="absolute top-0 left-0 right-0 h-[60%] z-0 pointer-events-none overflow-hidden">
            <img
                src="/nicarb/committee-images/nicarb event.jpeg"
                alt="NICArb Event"
                className="w-full h-full object-cover opacity-[0.30]"
                style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)'
                }}
            />
        </div> */}

            {/* Geometric Corner Accents */}
            {/* Top Left Corner */}
            <div className="absolute top-0 left-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48">
                    <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-[#064802] to-[#a9ce46]"></div>
                    <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-[#064802] to-[#a9ce46]"></div>
                    <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#a9ce46]/50"></div>
                </div>
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute bottom-0 right-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48">
                    <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-[#064802] to-[#a9ce46]"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-[#064802] to-[#a9ce46]"></div>
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#a9ce46]/50"></div>
                </div>
            </div>

            {/* Diagonal Accent Lines */}
            <div className="absolute top-1/4 right-1/4 w-64 h-0.5 bg-gradient-to-r from-transparent via-[#a9ce46]/60 to-transparent rotate-45 z-5"></div>
            <div className="absolute bottom-1/3 left-1/4 w-48 h-0.5 bg-gradient-to-r from-transparent via-[#064802]/40 to-transparent -rotate-45 z-5"></div>

            {/* Gold Accent Border with Enhanced Green Glow */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#064802] via-[#a9ce46] to-[#064802] z-50 shadow-[0_0_20px_rgba(169,206,70,0.5)]"></div>

            {/* 46th Year Logo - Top Right Corner with Green Glow */}
            <div className="absolute top-4 right-8 z-50">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#a9ce46]/20 blur-xl rounded-full"></div>
                    <img src="/nicarb/attendee-images/46th%20year%20logog.png" alt="46th Year Anniversary" className="relative w-[60px] h-auto object-contain" />
                </div>
            </div>

            {/* Top Section: Header */}
            <div className="relative z-10 pt-16 px-12 flex justify-center items-center w-full">

                {/* Center: Main Logo */}
                <div className="w-64 h-auto relative flex justify-center">
                    <img src="/nicarb/client-logo/NICARB LOGO Green Text.png" alt="NICArb Logo" className="w-full max-w-xs object-contain drop-shadow-sm" />
                </div>
            </div>

            {/* Center Section: Hero Typography with Shield */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-16 -mt-8 max-w-[90%] mx-auto w-full gap-8">

                {/* Left: Text Content */}
                <div className="flex-1 flex flex-col items-start justify-center pl-16">

                    {/* Green Accent Bar - Above Context */}
                    <div className="w-24 h-1 bg-gradient-to-r from-[#064802] to-[#a9ce46] mb-4 shadow-[0_0_10px_rgba(169,206,70,0.4)]"></div>

                    {/* Context Line with Green Glow Background */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#a9ce46]/20 via-[#064802]/10 to-transparent blur-md rounded-full"></div>
                        <p className="relative font-sans font-semibold text-base text-[#064802] uppercase tracking-[0.2em] px-4 py-2 border-l-4 border-[#a9ce46]">
                            2025 International Arbitration and ADR Conference
                        </p>
                    </div>

                    {/* Main Title - Tightened & Elegant */}
                    <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-[#064802] leading-[1.1] max-w-2xl drop-shadow-sm mb-3">
                        Strengthening Institutional <br />
                        <span className="italic font-medium text-5xl md:text-6xl lg:text-7xl relative">
                            <span className="relative z-10">Arbitration & ADR</span>
                            {/* Green underline accent */}
                            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#a9ce46]/40 via-[#064802]/30 to-transparent -z-10"></div>
                        </span> <br />
                        in Africa:
                    </h1>

                    {/* Tagline */}
                    <h3 className="font-serif italic text-2xl md:text-3xl text-gray-600">
                        Charting a New Path
                    </h3>

                    {/* Green Accent Bar - Below Tagline */}
                    <div className="w-32 h-1 bg-gradient-to-r from-[#a9ce46] to-[#064802] mt-6 shadow-[0_0_10px_rgba(169,206,70,0.4)]"></div>

                </div>

                {/* Right: PRO ADR Shield with Enhanced Effects */}
                <div className="flex-shrink-0 flex items-center justify-center">
                    <div className="relative w-80 h-80">
                        {/* Animated Green Rings */}
                        <div className="absolute inset-0 border-2 border-[#a9ce46]/30 rounded-full animate-pulse"></div>
                        <div className="absolute inset-4 border border-[#064802]/20 rounded-full"></div>

                        {/* Enhanced glow effect with green */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#a9ce46]/20 via-[#064802]/10 to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-[#064802]/15 to-transparent rounded-full blur-2xl"></div>

                        {/* Decorative Green Dots around shield */}
                        <div className="absolute -top-2 left-1/2 w-3 h-3 bg-[#a9ce46] rounded-full shadow-[0_0_10px_rgba(169,206,70,0.6)]"></div>
                        <div className="absolute top-1/2 -right-2 w-2 h-2 bg-[#064802] rounded-full shadow-[0_0_8px_rgba(6,72,2,0.5)]"></div>
                        <div className="absolute -bottom-2 left-1/4 w-2.5 h-2.5 bg-[#a9ce46] rounded-full shadow-[0_0_10px_rgba(169,206,70,0.6)]"></div>
                        <div className="absolute top-1/4 -left-2 w-2 h-2 bg-[#064802] rounded-full shadow-[0_0_8px_rgba(6,72,2,0.5)]"></div>

                        {/* Shield Image */}
                        <img
                            src="/nicarb/Generated_Image_November_26__2025_-_8_29AM-removebg-preview.png"
                            alt="PRO ADR Shield"
                            className="relative w-full h-full object-contain opacity-90 drop-shadow-2xl z-10"
                        />
                    </div>
                </div>

            </div>

            {/* Bottom Section: Footer Anchor */}
            <div className="relative z-10 w-full mt-auto">
                {/* Gold Accent Line with Enhanced Green Glow */}
                <div className="relative h-1.5 w-full bg-gradient-to-r from-[#064802] via-[#a9ce46] to-[#064802] shadow-[0_0_15px_rgba(169,206,70,0.5)]">
                    {/* Decorative Green Dots on Line */}
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-2 h-2 bg-[#a9ce46] rounded-full shadow-[0_0_8px_rgba(169,206,70,0.8)]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(169,206,70,0.6)]"></div>
                    <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-2 h-2 bg-[#064802] rounded-full shadow-[0_0_8px_rgba(169,206,70,0.8)]"></div>
                </div>

                <div className="bg-[#064802] text-white py-10 px-14 flex flex-row items-center justify-between relative overflow-hidden">

                    {/* Subtle Green Pattern Overlay */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-32 h-32 border-2 border-[#a9ce46] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 border-2 border-[#a9ce46] rounded-full translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    {/* Left: Venue Details */}
                    <div className="flex flex-col items-start gap-1.5 relative z-10">
                        <div className="flex items-center gap-2.5 text-[#a9ce46]">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#a9ce46]/30 blur-md rounded-full"></div>
                                <MapPin className="relative w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg uppercase tracking-widest">Civic Centre</span>
                        </div>
                        <div className="flex flex-col pl-8">
                            <span className="text-xs text-white/90 uppercase tracking-wider font-medium">Victoria Island</span>
                            <span className="text-[10px] text-white/60 uppercase tracking-widest">Lagos, Nigeria</span>
                        </div>
                    </div>

                    {/* Center: Date Display */}
                    <div className="flex flex-col items-center justify-center px-10 border-x border-white/10 mx-4 relative z-10">
                        {/* Green glow behind date */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a9ce46]/10 to-transparent blur-xl"></div>
                        <span className="relative font-serif text-4xl text-white font-medium tracking-wide leading-none">
                            27<span className="text-[#a9ce46] mx-1">&</span>28
                        </span>
                        <span className="relative text-[#a9ce46] text-xs font-bold uppercase tracking-[0.4em] mt-2">
                            November
                        </span>
                    </div>

                    {/* Right: Digital Presence */}
                    <div className="flex flex-col items-end gap-2 relative z-10">
                        <div className="flex items-center gap-2 text-white">
                            <span className="font-medium tracking-widest text-sm border-b border-[#a9ce46]/50 pb-0.5">www.nicarb.org</span>
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#a9ce46]/30 blur-md rounded-full"></div>
                                <Globe className="relative w-4 h-4 text-[#a9ce46]" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-white/50 tracking-widest uppercase">Follow Us</span>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-2 text-white/80">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-[#a9ce46]/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Linkedin className="relative w-3.5 h-3.5" />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-[#a9ce46]/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Twitter className="relative w-3.5 h-3.5" />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-[#a9ce46]/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Instagram className="relative w-3.5 h-3.5" />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-[#a9ce46]/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Facebook className="relative w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-[#a9ce46] ml-1">@nicarborg</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Central Watermark - Africa Map Pattern with Enhanced Green */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/30 to-white/60 z-10"></div>
                <img
                    src="/nicarb/Generated Image November 24, 2025 - 1_24PM.png"
                    alt="Africa Pattern"
                    className="w-[130%] h-[130%] object-cover opacity-15 mix-blend-overlay"
                    style={{
                        filter: 'hue-rotate(100deg) saturate(2.5) brightness(1.15) contrast(1.25)',
                        maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
                    }}
                />
            </div>
        </Page>
    );
};
