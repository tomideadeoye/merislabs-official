'use client';

import { createContext, useContext } from 'react';

// ──────────────────────────────────────────────
// Brand Config — design tokens for a deck
// ──────────────────────────────────────────────

export interface BrandConfig {
  primary: string
  accent: string
  highlight?: string
  text?: string
  textLight?: string
  background?: string
  cardBackground?: string
  fontHeading?: string
  fontBody?: string
  logos?: {
    header?: string
    footer?: string
  }
}

export const defaultBrand: BrandConfig = {
  primary: '#064802',
  accent: '#a9ce46',
  highlight: '#075302',
  text: '#333333',
  textLight: '#666666',
  background: '#ffffff',
  cardBackground: '#f8faf8',
  fontHeading: 'Georgia, serif',
  fontBody: 'Inter, sans-serif',
};

export const BrandContext = createContext<BrandConfig>(defaultBrand);

export function useBrand() {
  return useContext(BrandContext);
}

// ──────────────────────────────────────────────
// Slide data interfaces — each registered type
// gets its own typed contract. Custom slides
// extend DeckSlide directly.
// ──────────────────────────────────────────────

export interface DeckSlide {
  type: string
  title: string
  subtitle?: string
  highlight?: string
  speakerNote?: string
  backgroundImage?: string
  [key: string]: unknown
}

// ── Title ──
export interface TitleSlideData extends DeckSlide {
  type: 'title'
  logos?: string[]
  presenter?: string
}

// ── Content (bullets, optional side image) ──
export interface ContentSlideData extends DeckSlide {
  type: 'content'
  bullets?: BulletPoint[]
  sideImage?: string
  partnerLogos?: string[]
  footer?: string
}

// ── Two Column ──
export interface TwoColumnSlideData extends DeckSlide {
  type: 'twoColumn'
  leftColumn: ColumnData
  rightColumn: ColumnData
}

// ── Quote ──
export interface QuoteSlideData extends DeckSlide {
  type: 'quote'
  quote: string
  quoteAuthor?: string
  bullets?: BulletPoint[]
}

// ── Stats ──
export interface StatsSlideData extends DeckSlide {
  type: 'stats'
  stats: StatItem[]
  sideImage?: string
  bullets?: BulletPoint[]
}

// ── Outcomes ──
export interface OutcomesSlideData extends DeckSlide {
  type: 'outcomes'
  bullets: BulletPoint[]
}

// ── Roadmap/Timeline ──
export interface RoadmapSlideData extends DeckSlide {
  type: 'roadmap'
  roadmapSteps: RoadmapStep[]
}

// ── Comparison ──
export interface ComparisonSlideData extends DeckSlide {
  type: 'comparison'
  comparisonLeft: ComparisonColumn
  comparisonRight: ComparisonColumn
}

// ── Areas Grid ──
export interface AreasSlideData extends DeckSlide {
  type: 'areas'
  areas: AreaItem[]
}

// ── Thank You ──
export interface ThankYouSlideData extends DeckSlide {
  type: 'thankyou'
  contactBlocks?: ContactBlock[]
  cta?: string
}

// ── Sub-types ──

export interface BulletPoint {
  text: string
  bold?: string
  emphasis?: boolean
  icon?: string
}

export interface ColumnData {
  title: string
  icon?: string
  items: string[]
}

export interface StatItem {
  value: string
  label: string
  subtext?: string
}

export interface RoadmapStep {
  step: number
  title: string
  description: string
}

export interface ComparisonColumn {
  title: string
  items: string[]
  result: string
}

export interface AreaItem {
  icon: string
  title: string
  description: string
}

export interface ContactBlock {
  heading: string
  lines: string[]
}

// ── Union of all registered slide data types ──
export type RegisteredSlideData =
  | TitleSlideData
  | ContentSlideData
  | TwoColumnSlideData
  | QuoteSlideData
  | StatsSlideData
  | OutcomesSlideData
  | RoadmapSlideData
  | ComparisonSlideData
  | AreasSlideData
  | ThankYouSlideData;

// ── Aspect ratio options ──
export type AspectRatio = '16:9' | '4:3' | 'a4';
