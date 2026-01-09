// Asset Factory Type Definitions

export type HolidayType = 'christmas' | 'new-year' | 'custom';
export type ClientType = 'corporate' | 'personal';

export interface ClientProfile {
    id: string;
    name: string;
    type: ClientType;
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    fontFamily: string;
    signature?: string;
    address?: string;
    website?: string;
    phone?: string;
    email?: string;
    title?: string;
}

export interface AssetContent {
    title: string;
    subtitle: string;
    message: string;
    year: string;
    holiday: HolidayType;
    customImage?: string;
    brandName?: string;
    headerColor?: string;
    textScales?: TextScales;
    fontFamily?: string; // Legacy global font
    fontFamilies?: TextFonts;
    footerControls?: FooterControls;
}

export interface FooterControls {
    showAddress: boolean;
    showPhone: boolean;
    showWebsite: boolean;
    showEmail: boolean;
    showSignature: boolean;
    showLogo: boolean;
}

export interface TextFonts {
    title?: string;
    subtitle?: string;
    message?: string;
    year?: string;
    footer?: string;
}

export interface TextScales {
    title: number;      // 0.5 to 2.0, default 1.0
    subtitle: number;
    message: number;
    year: number;
    signature: number;
    footer: number;
    brandHeader: number; // "From NICArb" text
}

export interface VisualAsset {
    id: string;
    name: string;
    path: string;
    category: 'christmas' | 'new-year' | 'generic';
    thumbnail?: string;
}

export interface TemplateProps {
    client: ClientProfile;
    content: AssetContent;
    containerRef: React.RefObject<HTMLDivElement | null>;
    visualAsset: VisualAsset;
    activePalette?: ColorPalette;
    dimensions?: { width: number; height: number };
}

export interface ColorPalette {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}
