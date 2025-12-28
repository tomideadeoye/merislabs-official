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
        website: 'www.nicarb.org',
        phone: '+234 908 718 7414'
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
        name: 'Mum (Mrs Bose Adeoye)',
        type: 'personal',
        signature: 'Bose Adeoye',
        primaryColor: '#8b0000',
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
        holiday: 'christmas'
    },
    'new-year': {
        title: 'Happy New Year',
        subtitle: 'A New Chapter Begins',
        message: 'Wishing you a year filled with prosperity, success, and peaceful resolutions. Here\'s to new beginnings!',
        year: '2026',
        holiday: 'new-year'
    },
    'custom': {
        title: 'Warm Wishes',
        subtitle: 'From All of Us',
        message: 'Thank you for being part of our journey. We wish you the very best in the coming days.',
        year: '2026',
        holiday: 'custom'
    }
};
