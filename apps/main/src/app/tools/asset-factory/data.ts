// Asset Factory Data Constants

import { ClientProfile, VisualAsset, AssetContent, HolidayType } from './types';

// --- Visual Assets Catalog ---
export const VISUAL_ASSETS: VisualAsset[] = [
    // New Year Assets
    {
        id: 'fireworks-gold',
        name: 'Gold Fireworks Burst',
        path: '/nicarb/christmas-signatures/gold_fireworks_burst.png',
        category: 'new-year'
    },
    {
        id: 'golden-tree',
        name: 'Golden Holiday Tree',
        path: '/nicarb/christmas-signatures/golden-holiday-tree.png',
        category: 'new-year'
    },
    {
        id: 'champagne-glasses',
        name: 'Champagne Toast',
        path: '/nicarb/christmas-signatures/champagne_glasses_gold.png',
        category: 'new-year'
    },
    {
        id: 'gold-baubles',
        name: 'Gold Baubles',
        path: '/nicarb/christmas-signatures/gold_baubles_scattered.png',
        category: 'new-year'
    },
    {
        id: 'teal-drapes',
        name: 'Teal & Gold Drapes',
        path: '/nicarb/christmas-signatures/teal_gold_drapes.png',
        category: 'new-year'
    },
    // Christmas Assets
    {
        id: 'christmas-tree',
        name: 'Christmas Tree',
        path: '/nicarb/christmas-signatures/pngmagic-tree.png',
        category: 'christmas'
    },
    {
        id: 'ai-tree-gold',
        name: 'AI Gold Tree',
        path: '/nicarb/christmas-signatures/ai-tree-gold.png',
        category: 'christmas'
    },
    {
        id: 'bells-gold',
        name: 'Golden Bells',
        path: '/nicarb/christmas-signatures/ai-bells-gold.png',
        category: 'christmas'
    },
    {
        id: 'vecteezy-bells',
        name: 'Ornate Bells',
        path: '/nicarb/christmas-signatures/vecteezy-bells.png',
        category: 'christmas'
    },
    {
        id: 'xmas-transparent-v1',
        name: 'Festive Decor V1',
        path: '/nicarb/christmas-signatures/nicarb_xmas_transparent_v1_1765777006645.png',
        category: 'christmas'
    },
    {
        id: 'xmas-transparent-v2',
        name: 'Festive Decor V2',
        path: '/nicarb/christmas-signatures/nicarb_xmas_transparent_v2_1765777025997.png',
        category: 'christmas'
    },
    {
        id: 'xmas-luxe',
        name: 'Luxe Holiday',
        path: '/nicarb/christmas-signatures/nicarb_xmas_luxe_1765777085007.png',
        category: 'christmas'
    },
    {
        id: 'ornament',
        name: 'Holiday Ornament',
        path: '/nicarb/christmas-signatures/photo-1636853242788-520691c7d527-removebg-preview.png',
        category: 'generic'
    },
    {
        id: 'ribbon-ornament',
        name: 'Ribbon Ornament',
        path: '/nicarb/christmas-signatures/Screenshot_2025-12-19_at_10.48.30-removebg-preview.png',
        category: 'generic'
    },
    {
        id: 'none',
        name: 'No Image',
        path: '',
        category: 'generic'
    }
];

// --- Client Profiles ---
export const CLIENTS: ClientProfile[] = [
    {
        id: 'nicarb',
        name: 'NICArb',
        type: 'corporate',
        logo: '/nicarb-logo.png',
        primaryColor: '#064802',
        secondaryColor: '#D4AF37',
        textColor: '#FFFFFF',
        fontFamily: 'Georgia, serif',
        address: '10 Adedeji Adekola Close, Lekki Phase 1, Lagos',
        website: 'nicarb.org',
        phone: '+234 908 718 7414',
        email: 'info@nicarb.org'
    },
    {
        id: 'merislabs',
        name: 'MerisLabs',
        type: 'corporate',
        logo: '/merislabs-logo.png',
        primaryColor: '#000000',
        secondaryColor: '#3B82F6',
        textColor: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
        website: 'merislabs.com'
    },
    {
        id: 'personal-mum',
        name: 'Mrs. B.J. Adeoye (BeeJayBee)',
        type: 'personal',
        signature: 'B.J. Adeoye (BeeJayBee)',
        primaryColor: '#1a1a1a',
        secondaryColor: '#D4AF37',
        textColor: '#FFFFFF',
        fontFamily: 'Playfair Display, serif',
        logo: '/nicarb/christmas-signatures/photo-1636853242788-520691c7d527-removebg-preview.png'
    },
    {
        id: 'personal-tomide',
        name: 'Tomide Adeoye',
        type: 'personal',
        signature: 'Tomide Adeoye',
        primaryColor: '#0f172a',
        secondaryColor: '#38bdf8',
        textColor: '#FFFFFF',
        fontFamily: 'Inter, sans-serif'
    }
];

// --- Initial Content by Holiday ---
export const INITIAL_CONTENT: Record<HolidayType, AssetContent> = {
    'christmas': {
        title: 'Merry Christmas',
        subtitle: '& Happy Holidays',
        message: 'Wishing you peace, joy, and prosperity this Christmas season. May the holidays bring you warmth and happiness.',
        year: '2025',
        holiday: 'christmas',
        customImage: '/images/mum.jpeg',
        brandName: 'Mrs Bose Adeoye',
        textScales: { title: 1, subtitle: 1, message: 1, year: 1, signature: 1, footer: 1, brandHeader: 1 },
        footerControls: {
            showAddress: true,
            showPhone: true,
            showWebsite: true,
            showEmail: true,
            showSignature: true,
            showLogo: true
        }
    },
    'new-year': {
        title: 'A Happy and Prosperous New Year',
        subtitle: 'A New Chapter Begins',
        message: 'Wishing you a year filled with prosperity, growth and excellence.',
        year: '2026',
        holiday: 'new-year',
        customImage: '/images/mum.jpeg',
        brandName: 'Mrs Bose Adeoye',
        textScales: { title: 1, subtitle: 1, message: 1, year: 1, signature: 1, footer: 1, brandHeader: 1 },
        footerControls: {
            showAddress: true,
            showPhone: true,
            showWebsite: true,
            showEmail: true,
            showSignature: true,
            showLogo: true
        }
    },
    'custom': {
        title: 'Appreciation',
        subtitle: 'As the year closes',
        message: 'As the year is closing, I found it necessary to appreciate your unflinching support, cooperation, encouragement, generosity. May the God of Heaven bless you richly and do you good at all times in Jesus Name. Counting on Our God who shall grant us more grace of togetherness and fulfilment in the incoming year. Thank you so much.',
        year: '2026',
        holiday: 'custom',
        customImage: '/images/mum.jpeg',
        brandName: 'Mrs. Bose J Adeoye',
        textScales: { title: 1, subtitle: 1, message: 1, year: 1, signature: 1 },
        footerControls: {
            showAddress: true,
            showPhone: true,
            showWebsite: true,
            showEmail: true,
            showSignature: true,
            showLogo: true
        }
    }
};

export const PRESET_PALETTES: import('./types').ColorPalette[] = [
    {
        id: 'midnight-gold',
        name: 'Midnight Gold',
        primary: '#0f172a',    // Dark Slate
        secondary: '#D4AF37',  // Gold
        accent: '#F4E6AA',     // Pale Gold
        background: '#020617', // Very Dark Slate
        text: '#ffffff'
    },
    {
        id: 'royal-amethyst',
        name: 'Royal Amethyst',
        primary: '#4c1d95',    // Deep Purple
        secondary: '#e879f9',  // Pink/Purple Accent
        accent: '#fdf4ff',     // Very Pale Purple
        background: '#2e1065', // Dark Purple
        text: '#ffffff'
    },
    {
        id: 'emerald-luxury',
        name: 'Emerald Luxury',
        primary: '#064e3b',    // Deep Emerald
        secondary: '#34d399',  // Bright Teal
        accent: '#ecfdf5',     // Mint White
        background: '#022c22', // Dark Green
        text: '#ffffff'
    },
    {
        id: 'sage-serene',
        name: 'Sage Serene',
        primary: '#4d7c6f',    // Sage Green
        secondary: '#a8d5ba',  // Light Mint
        accent: '#e8f5e9',     // Pale Mint
        background: '#2d5a4a', // Medium Sage
        text: '#ffffff'
    },
    {
        id: 'forest-mist',
        name: 'Forest Mist',
        primary: '#3d6b59',    // Muted Forest Green
        secondary: '#7eb09b',  // Soft Green
        accent: '#dceee5',     // Seafoam White
        background: '#2a4d3e', // Forest Shadow
        text: '#ffffff'
    },
    {
        id: 'mint-luxe',
        name: 'Mint Luxe',
        primary: '#10b981',    // Emerald 500 (bright)
        secondary: '#d4af37',  // Gold
        accent: '#f0fdf4',     // Green 50
        background: '#047857', // Emerald 700
        text: '#ffffff'
    },
    {
        id: 'ocean-depths',
        name: 'Ocean Depths',
        primary: '#0c4a6e',    // Deep Sky
        secondary: '#38bdf8',  // Light Blue
        accent: '#f0f9ff',     // Pale Blue
        background: '#082f49', // Dark Blue
        text: '#ffffff'
    },
    {
        id: 'teal-elegance',
        name: 'Teal Elegance',
        primary: '#0d9488',    // Teal 600
        secondary: '#5eead4',  // Teal 300
        accent: '#f0fdfa',     // Teal 50
        background: '#134e4a', // Teal 900
        text: '#ffffff'
    },
    {
        id: 'ruby-prestige',
        name: 'Ruby Prestige',
        primary: '#881337',    // Deep Rose
        secondary: '#fb7185',  // Rose
        accent: '#fff1f2',     // Rose White
        background: '#4c0519', // Dark Rose
        text: '#ffffff'
    },
    {
        id: 'crimson-gold',
        name: 'Crimson & Gold',
        primary: '#7f1d1d',    // Red 900
        secondary: '#fbbf24',  // Amber 400
        accent: '#fef3c7',     // Amber 100
        background: '#450a0a', // Red 950
        text: '#ffffff'
    },
    {
        id: 'slate-silver',
        name: 'Slate & Silver',
        primary: '#334155',    // Slate 700
        secondary: '#e2e8f0',  // Slate 200
        accent: '#f8fafc',     // Slate 50
        background: '#0f172a', // Slate 900
        text: '#ffffff'
    },
    {
        id: 'warm-charcoal',
        name: 'Warm Charcoal',
        primary: '#44403c',    // Stone 700
        secondary: '#d6d3d1',  // Stone 300
        accent: '#fafaf9',     // Stone 50
        background: '#1c1917', // Stone 900
        text: '#ffffff'
    },
    {
        id: 'champagne-noir',
        name: 'Champagne Noir',
        primary: '#1f1f1f',    // Near Black
        secondary: '#c9a962',  // Champagne Gold
        accent: '#f5f0e6',     // Warm Cream
        background: '#0a0a0a', // True Black
        text: '#ffffff'
    },
    {
        id: 'ivory-bronze',
        name: 'Ivory & Bronze',
        primary: '#78350f',    // Amber 900
        secondary: '#fcd34d',  // Amber 300
        accent: '#fffbeb',     // Amber 50
        background: '#451a03', // Amber 950
        text: '#ffffff'
    },
    {
        id: 'nordic-green',
        name: 'Nordic Green',
        primary: '#166534',    // Green 800
        secondary: '#86efac',  // Green 300
        accent: '#f0fdf4',     // Green 50
        background: '#14532d', // Green 900
        text: '#ffffff'
    },
    {
        id: 'olive-patina',
        name: 'Olive Patina',
        primary: '#4a5d4c',    // Muted Olive
        secondary: '#a3b899',  // Sage Accent
        accent: '#f4f7f4',     // Soft White
        background: '#2d3a2f', // Dark Olive
        text: '#ffffff'
    },
    {
        id: 'jade-imperial',
        name: 'Jade Imperial',
        primary: '#15803d',    // Green 700
        secondary: '#fbbf24',  // Gold
        accent: '#fef9c3',     // Yellow 100
        background: '#166534', // Green 800
        text: '#ffffff'
    },
    // NICArb Brand Palettes (from Conference Brochure)
    {
        id: 'nicarb-teal-lime',
        name: 'NICArb Teal & Lime',
        primary: '#2dc27a',    // Bright Teal (from brochure)
        secondary: '#a9ce46',  // Lime Accent
        accent: '#f0f7ee',     // Mint background
        background: '#064802', // Deep Forest
        text: '#ffffff'
    },
    {
        id: 'nicarb-lime-fresh',
        name: 'NICArb Lime Fresh',
        primary: '#559203',    // Lime Green (from brochure)
        secondary: '#7cb342',  // Light Lime
        accent: '#d9edd3',     // Pale Mint
        background: '#2d5a4a', // Medium Forest
        text: '#ffffff'
    },
    {
        id: 'nicarb-soft-sage',
        name: 'NICArb Soft Sage',
        primary: '#7cb342',    // Light Lime
        secondary: '#d9edd3',  // Pale Mint
        accent: '#f0f7ee',     // Mint Background
        background: '#559203', // Lime Green
        text: '#ffffff'
    },
    {
        id: 'nicarb-lime-gold',
        name: 'NICArb Lime & Gold',
        primary: '#559203',    // Lime Green
        secondary: '#D4AF37',  // Gold
        accent: '#f0f7ee',     // Mint Background
        background: '#2dc27a', // Bright Teal
        text: '#ffffff'
    },
    {
        id: 'nicarb-forest-teal',
        name: 'NICArb Forest Teal',
        primary: '#064802',    // Deep Forest
        secondary: '#2dc27a',  // Bright Teal
        accent: '#c5e1a5',     // Sage Mint
        background: '#032501', // Dark Forest
        text: '#ffffff'
    }
];

export const FONT_OPTIONS = [
    { name: 'Cinzel (Royal)', value: "'Cinzel', serif" },
    { name: 'Playfair (Elegant)', value: "'Playfair Display', serif" },
    { name: 'Cormorant (Classic)', value: "'Cormorant Garamond', serif" },
    { name: 'Inter (Modern)', value: "'Inter', sans-serif" },
    { name: 'Georgia (Corporate)', value: 'Georgia, serif' },
    { name: 'Outfit (Clean)', value: "'Outfit', sans-serif" },
];
