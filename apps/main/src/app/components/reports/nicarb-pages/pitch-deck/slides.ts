export interface BulletPoint {
  text: string;
  bold?: string; // Text to make bold within the bullet
  emphasis?: boolean; // Entire bullet gets emphasis styling
}

export interface Slide {
  type: 'title' | 'content' | 'quote' | 'areas' | 'stats' | 'outcomes' | 'twoColumn' | 'roadmap' | 'thankyou' | 'comparison';
  title: string;
  subtitle?: string;
  presenter?: string;
  logos?: string[];
  bullets?: BulletPoint[];
  highlight?: string;
  quote?: string;
  quoteAuthor?: string;
  areas?: { icon: string; title: string; description: string }[];
  stats?: { value: string; label: string; subtext?: string }[];
  contactInfo?: { label: string; value: string }[];
  leftColumn?: { title: string; items: string[]; icon?: string };
  rightColumn?: { title: string; items: string[]; icon?: string };
  roadmapSteps?: { step: number; title: string; description: string }[];
  bottomImage?: string;
  sideImage?: string; // Image on right side of slide
  partnerLogos?: string[]; // Array of partner/international org logos
  backgroundImage?: string; // Background image for slide
  comparisonLeft?: { title: string; items: string[]; result: string };
  comparisonRight?: { title: string; items: string[]; result: string };
}

export const slides: Slide[] = [
  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 1: Title — Authoritative, aligned with AGF's vision
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'title',
    title: 'Operationalising the National ADR Policy',
    subtitle: 'Ending the Outsourcing of Nigeria\'s Sovereign Disputes',
    presenter: 'Mrs. Shola Oshodi-John — Registrar & CEO, NICArb',
    logos: ['/nicarb/NICARB-LOGO-GREEN-BOLD.webp'],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide: Monetary Claims (2024) — explicit aggregated claims and largest dispute
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'stats',
    title: 'Monetary Claims (2024)',
    stats: [
      { value: '₦7,515,263,459.01', label: 'Total Aggregated Claims (Naira)' },
      { value: '£1,350,000.00', label: 'Total Aggregated Claims (Pounds)' },
      { value: '$414,512,024.19', label: 'Total Aggregated Claims (USD)' },
    ],
    bullets: [
      { text: 'Largest single dispute recorded — N5,260,477,225.78; £1,350,000.00; $414,512,024.19', bold: 'Largest single dispute recorded' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 2: Background — "Sovereign Risk" framing, the HOOK
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'content',
    title: 'Nigeria\'s Sovereign Risk is Increasing',
    highlight: 'The Federal Government faces a surge in high-value claims—and a structural gap in managing them.',
    bullets: [
      { text: 'Surge in high-value arbitration claims against the FGN', bold: 'Surge in high-value' },
      { text: 'Increasing complexity of PPP, energy, and cross-border contracts', bold: 'PPP, energy, and cross-border' },
      { text: 'Current reliance on reactive, ad-hoc dispute management is costly', bold: 'reactive, ad-hoc' },
      { text: 'No centralized data on government dispute exposure—decisions made blind', bold: 'No centralized data' },
      { text: 'Opportunity to lead Africa in dispute resolution sovereignty', bold: 'lead Africa', emphasis: true },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 3: The Challenge — STRONG pain language (FX Hook)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'twoColumn',
    title: 'The Challenge: Capital Flight & Lost Control',
    highlight: 'Nigeria is hemorrhaging foreign exchange to resolve disputes that could be settled locally.',
    leftColumn: {
      title: 'The Financial Bleed',
      icon: '💸',
      items: [
        'Millions in USD fees paid to Western arbitrators & counsel',
        'Heavy FX exposure on every international proceeding',
        'Legal fees that could fund domestic capacity-building',
      ],
    },
    rightColumn: {
      title: 'The Sovereignty Gap',
      icon: '⚠️',
      items: [
        'Foreign tribunals lack Nigerian socio-political context',
        'No institutional memory—lessons lost between cases',
        'MDAs lack dispute-prevention infrastructure',
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 4: Why NICArb — MOVED UP, right after the problem (Trust Factor)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'stats',
    title: 'Why NICArb is the Only Viable Partner',
    stats: [
      { value: '$105M', label: 'Disputes Resolved', subtext: 'Value in 2023 alone' },
      { value: '₦3.7B', label: 'Kept in Nigeria', subtext: 'Domestic settlements' },
      { value: '45yrs', label: 'Institutional Legacy', subtext: 'Founded 1979' },
    ],
    bullets: [
      { text: 'Presence across key commercial hubs: Lagos, Abuja, Kano, Port Harcourt, Enugu', bold: 'Lagos, Abuja, Kano, Port Harcourt, Enugu' },
      { text: 'Over 7,000 professionals including Supreme Court Justices, SANs, and Captains of Industry', bold: '7,000 professionals' },
      { text: 'The longest-standing arbitration body in West Africa', bold: 'longest-standing', emphasis: true },
    ],
    sideImage: '/nicarb/committee-images/nicarb event.jpeg', // NICArb conference showing scale
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 5: Cost of Inaction — NEW "comparison" slide
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'comparison',
    title: 'The Cost of Inaction',
    comparisonLeft: {
      title: 'Status Quo',
      items: [
        'Continued FX hemorrhage',
        'Decisions without data',
        'Foreign tribunals set precedents',
        'Brain drain of arbitration talent',
      ],
      result: '❌ Nigeria loses money, control, and credibility',
    },
    comparisonRight: {
      title: 'With NICArb Partnership',
      items: [
        'Disputes resolved in Naira',
        'National Dispute Database',
        'Nigerian experts set standards',
        'Pipeline of homegrown arbitrators',
      ],
      result: '✅ Sovereign autonomy + economic savings',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 6: The Strategic Goal (Purpose) — aligns with AGF
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'quote',
    title: 'The Strategic Goal',
    quote: 'To domesticate the resolution of Nigeria\'s high-value disputes and insulate the Ministry of Justice from capacity gaps.',
    quoteAuthor: 'Core Objective',
    bullets: [
      { text: 'Establish a dedicated Arbitration & ADR Department within MoJ', bold: 'dedicated Arbitration & ADR Department' },
      { text: 'Support the AGF\'s vision for a National ADR Policy to end outsourcing of sovereign disputes', bold: 'National ADR Policy', emphasis: true },
      { text: 'Create a National Dispute Database to track government liability exposure', bold: 'National Dispute Database' },
      { text: 'Build sustainable in-house capacity over 3 years', bold: '3 years' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 7: Key Areas of Collaboration (Overview) — Icon Grid
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'areas',
    title: 'Six Pillars of Collaboration',
    areas: [
      { icon: '📜', title: 'Policy & Reform', description: 'Think tanks & legislative modernisation' },
      { icon: '🎓', title: 'Capacity Building', description: 'Judges, MDAs, certifications' },
      { icon: '🏛️', title: 'Institutional', description: '45 years of expertise transferred' },
      { icon: '🛡️', title: 'Dispute Prevention', description: 'Model clauses & early evaluation' },
      { icon: '📢', title: 'Public Engagement', description: 'Annual Summit & awareness' },
      { icon: '🌍', title: 'International Hub', description: 'AfCFTA-aligned frameworks' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 8: Policy Development & Legislative Reform
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'content',
    title: 'Policy Development & Legislative Reform',
    highlight: 'Aligning Nigeria with global arbitration standards—and the AGF\'s strategic vision.',
    bullets: [
      { text: 'Joint NICArb–FGN Think Tank for strategic dispute-prevention advisory', bold: 'Think Tank' },
      { text: 'Review and reform of arbitration/ADR legislation for global competitiveness', bold: 'reform' },
      { text: '3-year structured capacity transfer plan for Ministry of Justice staff', bold: '3-year' },
      { text: 'Technical committees to support MoJ, BPP, and National Assembly', bold: 'Technical committees' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 9: Capacity Building & Training — Two Column
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'twoColumn',
    title: 'Capacity Building & Training',
    highlight: 'Building a world-class pipeline of Nigerian dispute resolution professionals.',
    leftColumn: {
      title: 'Judicial Track',
      icon: '⚖️',
      items: [
        'Nationwide training for judges & magistrates',
        'Arbitration-friendly jurisprudence seminars',
        'Enforcement of arbitral awards protocols',
      ],
    },
    rightColumn: {
      title: 'Sector-Specific Track',
      icon: '🏭',
      items: [
        'Power, Oil & Gas, Transport, ICT MDAs',
        'Certification pathways for local arbitrators',
        'Continuous professional development',
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 10: Institutional Strengthening — leveraging 45-year legacy
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'content',
    title: 'Institutional Strengthening',
    highlight: 'Leveraging 45 years of institutional memory to build Africa\'s premier arbitration infrastructure.',
    bullets: [
      { text: 'Establishment or upgrade of government-backed arbitration centres', bold: 'arbitration centres' },
      { text: 'Modern case-management systems with digital tracking', bold: 'case-management systems' },
      { text: 'Development of ADR protocols for MDAs and regulatory bodies', bold: 'ADR protocols' },
      { text: 'Enhancing Nigeria\'s global ranking as a preferred arbitration seat', bold: 'global ranking' },
      { text: 'The 1979 Legacy: West Africa\'s longest-standing arbitration body guiding reforms', bold: '1979 Legacy', emphasis: true },
    ],
    partnerLogos: [
      '/nicarb/supporting organisations/LOGO UNCITRAL 09-82218_logo_E_blue.png',
      '/nicarb/supporting organisations/cietac.png',
      '/nicarb/supporting organisations/IMI-Full-logo-with-name1.jpeg',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 11: Dispute Prevention & Contracting
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'content',
    title: 'Dispute Prevention & Contracting',
    highlight: 'Prevention is cheaper than resolution. Better clauses = fewer disputes.',
    bullets: [
      { text: 'Model arbitration clauses tailored for government contracts', bold: 'Model arbitration clauses' },
      { text: 'Standardized ADR frameworks deployed across all MDAs', bold: 'Standardized ADR frameworks' },
      { text: 'Advisory on early neutral evaluation & structured settlements', bold: 'early neutral evaluation' },
      { text: 'Internal dispute-prevention units established in key MDAs', bold: 'dispute-prevention units' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 12: Public Engagement & Advocacy
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'content',
    title: 'Public Engagement & Advocacy',
    bullets: [
      { text: 'National ADR awareness campaigns targeting businesses and state governments', bold: 'awareness campaigns' },
      { text: 'Annual FGN–NICArb ADR Summit to showcase reforms and attract investment', bold: 'Annual FGN–NICArb ADR Summit' },
      { text: 'Publication of white papers, policy briefs, and national ADR guidelines', bold: 'white papers' },
      { text: 'Strengthening ADR culture nationwide—courts as last resort, not first', bold: 'last resort', emphasis: true },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 13: Expected Outcomes — Grid with checkmarks
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'outcomes',
    title: 'Expected Outcomes',
    bullets: [
      { text: 'Shortened dispute timelines', bold: 'Shortened' },
      { text: 'Reduced court congestion', bold: 'Reduced' },
      { text: 'FX savings kept in Nigeria', bold: 'FX savings' },
      { text: 'More skilled Nigerian arbitrators', bold: 'skilled' },
      { text: 'Better-drafted government contracts', bold: 'Better-drafted' },
      { text: 'Enhanced investor confidence', bold: 'Enhanced' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 14: Value Proposition Summary — reinforces the $105M proof
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'content',
    title: 'NICArb\'s Unique Value',
    highlight: 'The only institution with the scale, expertise, and mandate to deliver sovereign dispute resolution.',
    bullets: [
      { text: 'Elite Membership: Supreme Court Justices, SANs, Captains of Industry', bold: 'Elite Membership' },
      { text: 'Proven Track Record: $105M + ₦3.7B in disputes resolved (2023)', bold: '$105M + ₦3.7B', emphasis: true },
      { text: 'National Footprint: Presence in every major commercial hub', bold: 'National Footprint' },
      { text: 'Strong domestic and international partnerships', bold: 'partnerships' },
      { text: 'Commitment to African-led, African-resolved disputes', bold: 'African-led, African-resolved' },
    ],
    sideImage: '/nicarb/governing.png', // Governing council photo showing elite membership
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 15: Next Steps (Roadmap) — DIRECTIVE, not passive
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'roadmap',
    title: 'Immediate Next Steps',
    highlight: 'We are ready to move from concept to implementation.',
    roadmapSteps: [
      { step: 1, title: 'TWG', description: 'Joint Technical Working Group' },
      { step: 2, title: 'MOU', description: 'Sign framework agreement' },
      { step: 3, title: 'Pilot', description: 'Capacity Transfer begins' },
      { step: 4, title: 'Scale', description: 'Expand to all MDAs' },
      { step: 5, title: 'Launch', description: 'ADR Department operational' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Slide 16: Thank You / Call to Action — DIRECTIVE close
  // ══════════════════════════════════════════════════════════════════════════════
  {
    type: 'thankyou',
    title: 'Thank You',
    subtitle: '',
    contactInfo: [
      { label: 'CORPORATE HEAD OFFICE', value: '10 Adedeji Adekola Street, off Freedom Way, Lekki Phase 1, Lagos' },
      { label: 'Phone', value: '090 8718 7401-14' },
      { label: 'Email', value: 'info@nicarb.org' },
      { label: 'ABUJA OFFICE', value: 'Soulmate House: Plot 188, Durumi District, Off Oladipo Diya Road, FCT Abuja, Nigeria' },
      { label: 'Phone', value: '090 8787 403, 090 8718 7412' },
      { label: 'Website', value: 'www.nicarb.org' },
    ],
  },
];
