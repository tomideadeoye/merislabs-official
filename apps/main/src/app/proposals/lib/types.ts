export interface BrandConfig {
  primary: string
  accent: string
  highlight: string
  text: string
  textLight: string
  background: string
  cardBg: string
}

export interface StatItem {
  value: string
  label: string
  sub?: string
}

export interface OfferingItem {
  icon: string
  title: string
  desc: string
}

export interface TierItem {
  name: string
  items: [string, string][]
}

export interface ProcessStep {
  step: string
  title: string
  desc: string
}

export interface ContactBlock {
  heading: string
  lines: string[]
}

export interface CaseStudyItem {
  initial: string
  title: string
  subtitle: string
  link: string
  gradient: string
  tags: string[]
  metrics: { value: string; label: string }[]
}

export type PageType =
  | { type: 'cover'; title: string; subtitle: string; logo: string }
  | { type: 'stats'; title: string; subtitle: string; highlight: string; stats: StatItem[] }
  | { type: 'offerings'; title: string; subtitle: string; items: OfferingItem[] }
  | { type: 'pricing'; title: string; subtitle: string; note: string; tiers: TierItem[] }
  | { type: 'process'; title: string; subtitle: string; steps: ProcessStep[] }
  | { type: 'contact'; title: string; subtitle: string; cta: string; logo: string; blocks: ContactBlock[] }
  | { type: 'case_studies'; title: string; subtitle: string; items: CaseStudyItem[] }

export interface ProposalConfig {
  slug: string
  title: string
  template: string
  brand: BrandConfig
  pages: PageType[]
}
