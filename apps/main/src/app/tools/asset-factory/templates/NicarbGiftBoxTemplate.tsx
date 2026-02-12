'use client';

import { TemplateProps } from '../types';
import { useState } from 'react';

// Gift Box Panel Types
type BoxPanel = 'top' | 'front' | 'back' | 'left' | 'right' | 'bottom' | 'inner';

// NICArb Brand Constants
const NICARB_BRAND = {
    name: 'NICArb',
    fullName: 'Nigerian Institute of Chartered Arbitrators',
    tagline: "1st Arbitration (and ADR) Institute in Sub-Saharan Africa",
    motto: "Dispute Resolution Excellence",
    founded: '1979',
    years: '47',
    logo: '/nicarb-logo.png',
    qrCode: '/nicarb/nicarb-qr-code.png',
    colors: {
        primary: '#064802',      // Deep Forest Green
        secondary: '#D4AF37',    // Gold
        accent: '#a9ce46',       // Lime Green
        red: '#B01E23',          // Anniversary Red
        white: '#FFFFFF',
        offWhite: '#F8F8F6',
        lightGray: '#F5F5F5',
        patternGray: '#E8E8E8',
        darkText: '#1A1A1A',
        mutedText: '#666666',
    },
    contact: {
        address: '10 Adedeji Adekola Close, Lekki Phase 1, Lagos',
        website: 'nicarb.org',
        phone: '+234 908 718 7414',
        email: 'info@nicarb.org',
    },
    social: {
        twitter: '@nicarb_',
        instagram: '@nicarb_',
        linkedin: '/nigerian-institute-of-chartered-arbitrators',
        facebook: '/nicarb',
        youtube: '@nicarborg',
    },
    quote: "Arbitration is not merely about resolving disputes—it is about restoring relationships, preserving commerce, and building a more just society through dialogue and expertise.",
};

// Panel Dimensions
const PANEL_DIMENSIONS = {
    top: { width: 12, height: 10, label: 'Top (Lid)' },
    front: { width: 12, height: 4, label: 'Front Panel' },
    back: { width: 12, height: 4, label: 'Back (QR Code)' },
    left: { width: 10, height: 4, label: 'Left Side' },
    right: { width: 10, height: 4, label: 'Right Side' },
    bottom: { width: 12, height: 10, label: 'Bottom' },
    inner: { width: 12, height: 10, label: 'Inner (Quote)' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SVG LINE ART ICONS (Legal/ADR themed)
// ═══════════════════════════════════════════════════════════════════════════════

const ScalesIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M24 6v36M12 12l12-2 12 2M8 12l4 14c0 2 2 4 4 4s4-2 4-4l4-14M28 12l4 14c0 2 2 4 4 4s4-2 4-4l4-14" />
    </svg>
);

const HandshakeIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M4 20h8l8 8 8-8 8 4 8-4M12 20v-8M36 20v-8M20 28l4 8M28 20l-4 4" />
    </svg>
);

const GlobeIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="24" cy="24" r="18" />
        <ellipse cx="24" cy="24" rx="8" ry="18" />
        <path d="M6 24h36M8 14h32M8 34h32" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL COMPONENTS (EMERALD JAZZ INSPIRED)
// ═══════════════════════════════════════════════════════════════════════════════

// TOP PANEL (LID) - Emerald Jazz Inspired Design
const TopPanel = () => (
    <div className="w-full h-full bg-white relative overflow-hidden flex flex-col">
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600&display=swap');

            @keyframes gold-flow-box {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }

            .gold-shimmer-box {
                background: linear-gradient(90deg, #D4AF37, #F4E6AA, #D4AF37, #996515, #D4AF37);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: gold-flow-box 6s linear infinite;
            }

            .silk-texture-box {
                opacity: 0.25;
                background-image: url('https://www.transparenttextures.com/patterns/silk.png');
                mix-blend-mode: multiply;
            }
        `}</style>

        {/* Silk Texture Overlay */}
        <div className="absolute inset-0 silk-texture-box pointer-events-none" />

        {/* Ghost Year Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
            <span
                className="font-black"
                style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '320px',
                    color: NICARB_BRAND.colors.primary,
                    letterSpacing: '-0.05em',
                }}
            >
                {NICARB_BRAND.years}
            </span>
        </div>

        {/* THE VERTICAL STATUS LINE */}
        <div className="absolute left-10 top-0 bottom-0 py-10 flex flex-col items-center justify-between z-10">
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37] opacity-50" />

            <div className="flex flex-col items-center gap-1 leading-none tracking-tighter">
                {NICARB_BRAND.years.split('').map((char, i) => (
                    <span
                        key={i}
                        className="font-black gold-shimmer-box"
                        style={{
                            fontSize: '36px',
                            fontFamily: "'Cinzel', serif",
                            animationDelay: `${i * 0.1}s`
                        }}
                    >
                        {char}
                    </span>
                ))}
            </div>

            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: NICARB_BRAND.colors.secondary }} />

            <div className="w-[1px] h-24 bg-gradient-to-t from-transparent via-[#D4AF37] to-[#D4AF37] opacity-50" />
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-20 z-10">

            {/* "From NICArb" Header */}
            <div className="mb-6 flex items-center gap-5">
                <div className="h-[1.5px] w-20 opacity-60 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <span
                    className="tracking-[0.25em] font-black uppercase gold-shimmer-box"
                    style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '14px',
                    }}
                >
                    Nigerian Institute Of
                </span>
                <div className="h-[1.5px] w-20 opacity-60 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            {/* Main Title */}
            <h1
                className="font-medium leading-none mb-2"
                style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '4.5rem',
                    color: NICARB_BRAND.colors.primary
                }}
            >
                Chartered
            </h1>
            <h2
                className="font-bold italic gold-shimmer-box"
                style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '5.5rem',
                }}
            >
                Arbitrators
            </h2>

            {/* Tagline */}
            <div className="max-w-md text-center mt-8">
                <p
                    className="font-semibold leading-relaxed tracking-wide italic"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '20px',
                        color: NICARB_BRAND.colors.primary,
                    }}
                >
                    "{NICARB_BRAND.tagline}"
                </p>
            </div>

            {/* Anniversary Mark */}
            <div className="mt-10 flex items-baseline gap-3">
                <span
                    className="font-black tracking-tighter"
                    style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '48px',
                        color: NICARB_BRAND.colors.primary
                    }}
                >
                    {NICARB_BRAND.years}
                </span>
                <div className="flex flex-col items-start">
                    <span
                        className="text-sm font-bold uppercase tracking-widest"
                        style={{ color: NICARB_BRAND.colors.red }}
                    >
                        Years
                    </span>
                    <span className="text-[10px] text-gray-400 tracking-wider">
                        1979–2026
                    </span>
                </div>
            </div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-[radial-gradient(circle_at_0%_0%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_100%_0%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle_at_0%_100%,rgba(6,72,2,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_100%_100%,rgba(6,72,2,0.05)_0%,transparent_70%)] pointer-events-none" />
    </div>
);

// FRONT PANEL - Logo + Name + SOLID Cityscape
const FrontPanel = () => (
    <div
        className="w-full h-full relative overflow-hidden flex flex-col"
        style={{
            background: `linear-gradient(to bottom, #FFFFFF 0%, #F8F9F8 100%)`
        }}
    >
        {/* Top Content */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 px-12 pt-8">
            <div className="flex items-center gap-4 mb-3">
                <img src={NICARB_BRAND.logo} alt="" className="w-12 h-12 object-contain" />
                <div className="h-8 w-[1px] bg-gray-300" />
                <div className="flex flex-col items-start">
                    <span className="font-bold text-lg leading-none" style={{ color: NICARB_BRAND.colors.primary }}>NICArb</span>
                    <span className="text-[10px] tracking-widest uppercase text-gray-500">Est. 1979</span>
                </div>
            </div>

            <h2 className="font-serif italic text-2xl text-gray-800">
                {NICARB_BRAND.motto}
            </h2>
        </div>

        {/* SOLID Cityscape Silhouette acting as footer anchor - Vector Path */}
        <div className="w-full h-24 relative flex items-end justify-center px-4 opacity-15">
            <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="w-full h-full fill-current" style={{ color: NICARB_BRAND.colors.primary }}>
                <path d="M0,150 L0,120 L30,120 L30,60 L60,60 L60,100 L90,100 L90,40 L140,40 L140,110 L160,110 L160,150 M180,150 L180,80 L220,80 L220,50 L250,50 L250,150 M280,150 L280,90 L310,90 L310,120 L340,120 L340,150 M360,150 L360,30 L400,30 L400,10 L440,10 L440,150 M460,150 L460,80 L500,80 L500,150 M520,150 L520,60 L550,60 L550,40 L580,40 L580,150 M600,150 L600,100 L630,100 L630,150 M650,150 L650,70 L690,70 L690,150 M720,150 L720,110 L760,110 L760,150 M780,150 L780,50 L820,50 L820,150 M840,150 L840,90 L880,90 L880,150 M900,150 L900,120 L940,120 L940,150 L1000,150 L1000,150" />
            </svg>
        </div>

        {/* Bottom Accent Bar */}
        <div className="h-2 w-full" style={{ backgroundColor: NICARB_BRAND.colors.primary }} />
    </div>
);

// BACK PANEL - QR Code + Framed Layout
const BackPanel = () => (
    <div className="w-full h-full bg-white relative overflow-hidden flex items-center px-16 gap-12">
        {/* Left: QR Code Card */}
        <div className="flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-black/5 blur-sm translate-y-2 translate-x-1 rounded-xl" />
            <div className="relative bg-white p-4 rounded-xl border border-gray-100 shadow-xl flex flex-col items-center gap-2">
                <img
                    src={NICARB_BRAND.qrCode}
                    alt="Scan to visit nicarb.org"
                    className="w-24 h-24 object-contain"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Scan Me</span>
            </div>

            {/* Connecting Line */}
            <div className="absolute top-1/2 left-full w-8 h-[1px] bg-gray-200" />
        </div>

        {/* Center: Message */}
        <div className="flex flex-col flex-1 pl-4">
            <h3 className="font-serif text-2xl font-bold text-gray-800 leading-none mb-1">
                Discover More
            </h3>
            <p className="font-sans text-sm text-gray-500 mb-4">
                Scan to learn about our legacy and membership.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: NICARB_BRAND.colors.primary }}>
                <GlobeIcon />
                <span>nicarb.org</span>
            </div>
        </div>

        {/* Right: Social Handles */}
        <div className="flex flex-col gap-3 border-l border-gray-100 pl-8">
            <div className="flex items-center gap-2 text-gray-500">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-xs font-bold tracking-wide">{NICARB_BRAND.social.twitter}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span className="text-xs font-bold tracking-wide">{NICARB_BRAND.social.instagram}</span>
            </div>

        </div>
    </div>
);

// LEFT PANEL - Minimal with subtle pattern
const LeftPanel = () => (
    <div className="w-full h-full bg-white relative overflow-hidden">
        {/* Diagonal stripe pattern */}
        <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
                backgroundImage: `repeating-linear-gradient(
                    45deg,
                    ${NICARB_BRAND.colors.primary} 0px,
                    ${NICARB_BRAND.colors.primary} 2px,
                    transparent 2px,
                    transparent 40px
                )`,
            }}
        />

        {/* Centered small logo mark */}
        <div className="absolute inset-0 flex items-center justify-center">
            <img
                src={NICARB_BRAND.logo}
                alt=""
                className="w-16 h-16 object-contain opacity-10"
                style={{ filter: 'grayscale(100%)' }}
            />
        </div>

        {/* Accent line */}
        <div
            className="absolute left-0 top-1/4 bottom-1/4 w-1"
            style={{ backgroundColor: NICARB_BRAND.colors.secondary }}
        />
    </div>
);

// RIGHT PANEL - Minimal with pattern
const RightPanel = () => (
    <div className="w-full h-full bg-white relative overflow-hidden">
        {/* Diagonal stripe pattern - opposite direction */}
        <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
                backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    ${NICARB_BRAND.colors.primary} 0px,
                    ${NICARB_BRAND.colors.primary} 2px,
                    transparent 2px,
                    transparent 40px
                )`,
            }}
        />

        {/* Accent line */}
        <div
            className="absolute right-0 top-1/4 bottom-1/4 w-1"
            style={{ backgroundColor: NICARB_BRAND.colors.accent }}
        />
    </div>
);

// BOTTOM PANEL - Minimal
const BottomPanel = () => (
    <div className="w-full h-full bg-[#F5F5F5] flex items-center justify-center relative">
        <p className="text-xs text-gray-400 font-sans tracking-widest uppercase">
            © 2026 Nigerian Institute of Chartered Arbitrators
        </p>
    </div>
);

// INNER PANEL (Lid underside) - Quote + accent bar
const InnerPanel = () => (
    <div className="w-full h-full bg-white relative overflow-hidden">
        {/* Subtle diagonal stripes */}
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `repeating-linear-gradient(
                    45deg,
                    ${NICARB_BRAND.colors.primary} 0px,
                    ${NICARB_BRAND.colors.primary} 3px,
                    transparent 3px,
                    transparent 60px
                )`,
            }}
        />

        {/* Quote content - centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-20">

            {/* Quote marks (optional decorative) */}
            <span
                className="font-serif text-6xl leading-none mb-4 opacity-10"
                style={{ color: NICARB_BRAND.colors.primary }}
            >
                "
            </span>

            {/* The quote */}
            <p
                className="font-serif italic text-lg text-center leading-relaxed max-w-2xl"
                style={{ color: NICARB_BRAND.colors.darkText }}
            >
                {NICARB_BRAND.quote}
            </p>

            {/* Horizontal accent bar */}
            <div
                className="w-32 h-1 mt-8"
                style={{ backgroundColor: NICARB_BRAND.colors.primary }}
            />

            {/* Attribution (optional) */}
            <p className="text-xs text-gray-400 mt-4 tracking-widest uppercase">
                NICArb • Est. 1979
            </p>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN TEMPLATE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const NicarbGiftBoxTemplate = ({ client, content, containerRef, visualAsset, activePalette }: TemplateProps) => {
    const [activePanel, setActivePanel] = useState<BoxPanel>('top');

    // Render the active panel
    const renderPanel = () => {
        switch (activePanel) {
            case 'top': return <TopPanel />;
            case 'front': return <FrontPanel />;
            case 'back': return <BackPanel />;
            case 'left': return <LeftPanel />;
            case 'right': return <RightPanel />;
            case 'bottom': return <BottomPanel />;
            case 'inner': return <InnerPanel />;
            default: return <TopPanel />;
        }
    };

    const panels: BoxPanel[] = ['top', 'front', 'back', 'left', 'right', 'bottom', 'inner'];

    return (
        <div className="relative w-full h-full flex flex-col bg-gray-100">
            {/* Panel Selector Tabs */}
            <div className="flex items-center gap-1 p-3 bg-white border-b border-gray-200 overflow-x-auto shadow-sm">
                {panels.map((panel) => (
                    <button
                        key={panel}
                        onClick={() => setActivePanel(panel)}
                        className={`
                            px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap
                            ${activePanel === panel
                                ? 'bg-[#064802] text-white shadow-lg'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }
                        `}
                    >
                        {PANEL_DIMENSIONS[panel].label}
                    </button>
                ))}
            </div>

            {/* Panel Preview Area */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-100 to-gray-200">
                <div
                    ref={containerRef}
                    className="shadow-2xl rounded-sm overflow-hidden bg-white"
                    style={{
                        width: `${PANEL_DIMENSIONS[activePanel].width * 50}px`,
                        height: `${PANEL_DIMENSIONS[activePanel].height * 50}px`,
                        maxWidth: '90%',
                        maxHeight: '90%',
                    }}
                >
                    {renderPanel()}
                </div>
            </div>

            {/* Info Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-800">
                        {PANEL_DIMENSIONS[activePanel].label}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span>
                        {PANEL_DIMENSIONS[activePanel].width}" × {PANEL_DIMENSIONS[activePanel].height}" @ 300 DPI
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2" style={{ borderColor: NICARB_BRAND.colors.primary, backgroundColor: 'white' }} />
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: NICARB_BRAND.colors.primary }} />
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: NICARB_BRAND.colors.secondary }} />
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: NICARB_BRAND.colors.accent }} />
                </div>
            </div>
        </div>
    );
};
