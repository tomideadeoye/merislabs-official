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
}

export interface AssetContent {
    title: string;
    subtitle: string;
    message: string;
    year: string;
    holiday: HolidayType;
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
}
