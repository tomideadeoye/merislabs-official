// NICArb Gift Box V2 - Shared Constants

export const NICARB_BRAND = {
    name: 'NICArb',
    fullName: 'Nigerian Institute of Chartered Arbitrators',
    tagline: "1st Arbitration and ADR Institute in Sub-Saharan Africa",
    motto: "Leadership and Integrity",
    founded: '1979',
    years: '47',
    logo: '/nicarb-logo.png',
    qrCode: '/nicarb/nicarb-qr-code.png',
    skylineImage: '/nicarb/lagos-skyline.jpg',
    conferenceMapImage: '/nicarb/Generated_Image_November_26__2025_-_8_29AM-removebg-preview.png',
    colors: {
        primary: '#032204',      // Midnight Emerald (Rich Black-Green)
        secondary: '#C8B273',    // Brushed Brass / Champagne Gold
        accent: '#93B535',       // Muted Lime Green
        red: '#B01E23',          // Anniversary Red
        white: '#FFFFFF',
        offWhite: '#FDFCF9',
        cream: '#F8F6F0',
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
    quote: "Arbitration is the pathway to fair justice and amicable resolution.",
};

// VERIFIED Industry Standard: 400×300×100mm (XL Corporate Gift Box)
// All dimensions in INCHES (for print at 300 DPI)
// Geometrically validated - these panels WILL fit together
export const PANEL_DIMENSIONS = {
    // LID PANELS (outer, sits on top of base - slightly larger)
    // Landscape orientation (Wider than tall)
    top: { width: 16.14, height: 12.2, label: 'Top (Lid)' },
    inner: { width: 16.14, height: 12.2, label: 'Inner Lid (Quote)' },

    // BASE PANELS (tray that holds contents)
    // Front/Back are the LONG sides (Width)
    front: { width: 15.75, height: 3.94, label: 'Front Panel' },
    back: { width: 15.75, height: 3.94, label: 'Back (QR Code)' },

    // Left/Right are the SHORT sides (Depth)
    left: { width: 11.81, height: 3.94, label: 'Left Side' },
    right: { width: 11.81, height: 3.94, label: 'Right Side' },

    bottom: { width: 15.75, height: 11.81, label: 'Bottom' },
    preview3d: { width: 10, height: 10, label: '3D View' }, // Placeholder for UI
};

// Physical box dimensions (mm) for manufacturer reference
export const BOX_DIMENSIONS = {
    length: 300,        // mm (front-to-back / depth)
    width: 400,         // mm (left-to-right / width)
    baseHeight: 100,    // mm (tray wall height)
    lidHeight: 40,      // mm (lid wall height)
    lidOverlap: 5,      // mm (how much lid overlaps base on each side)
    standard: 'Industry XL Corporate Gift Box (400×300×100mm)',
};

export type BoxPanel = 'top' | 'front' | 'back' | 'left' | 'right' | 'bottom' | 'inner' | 'preview3d' | 'print_all';
