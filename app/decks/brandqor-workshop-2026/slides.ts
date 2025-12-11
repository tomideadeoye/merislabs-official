// BrandQor "SHOW UP & SHINE 2026" Workshop Presentation
// Slide data definitions for all 26 slides

export interface BulletPoint {
    text: string;
    bold?: string;
    emphasis?: boolean;
    icon?: string;
}

export interface CaseStudy {
    name: string;
    result: string;
    metric?: string;
}

export interface ValueItem {
    item: string;
    value: string;
}

export interface TimelineStep {
    month: string;
    title: string;
    activities: string[];
}

export interface StoryCard {
    title: string;
    description: string;
    prompt: string;
    icon: string;
}

export interface Slide {
    type: 'title' | 'mirror' | 'splitMirror' | 'pain' | 'reveal' | 'grid' | 'iconRow' |
    'caseStudy' | 'caseRollup' | 'loop' | 'flipL' | 'flywheel' | 'beforeAfter' |
    'cards' | 'contentGrid' | 'urgency' | 'silhouette' | 'mission' | 'offerIntro' |
    'splitOffer' | 'valueStack' | 'timeline' | 'scarcity' | 'emotionalReturn' | 'cta';
    title: string;
    subtitle?: string;
    text?: string;
    leftText?: string;
    rightText?: string;
    bullets?: BulletPoint[];
    icons?: { icon: string; label: string }[];
    caseStudies?: CaseStudy[];
    storyCards?: StoryCard[];
    valueStack?: ValueItem[];
    timeline?: TimelineStep[];
    testimonials?: { text: string; name: string }[];
    highlight?: string;
    speakerNote?: string;
    image?: string;
    beforeImage?: string;
    afterImage?: string;
}

// Design tokens
export const COLORS = {
    darkCharcoal: '#0F1115',
    offWhite: '#F6F6F6',
    gold: '#D4A76A',
    teal: '#0FA3A3',
    white: '#FFFFFF',
    darkOverlay: 'rgba(15, 17, 21, 0.85)',
};

export const slides: Slide[] = [
    // Slide 1 — Title Slide
    {
        type: 'title',
        title: 'SHOW UP & SHINE 2026',
        subtitle: 'Turn your 2025 work into 10x opportunities',
        speakerNote: 'Welcome everyone. Today we talk about visibility.',
    },

    // Slide 2 — Imagine You… (Mirror Hook)
    {
        type: 'mirror',
        title: "Imagine you're brilliant at what you do…",
        speakerNote: "Pause 2s — ask audience: 'Who feels seen today?'",
    },

    // Slide 3 — Deeper Mirror (Seen vs Unseen)
    {
        type: 'splitMirror',
        title: '',
        leftText: 'You work hard.\nYou deliver results.\nYou support everyone else\'s dream.',
        rightText: 'But when people talk about experts…\nyour name never comes up.',
        speakerNote: 'Let this sink in. The split is real for most.',
    },

    // Slide 4 — The Pain
    {
        type: 'pain',
        title: 'You earn enough to survive — not evolve.',
        subtitle: 'Talent without visibility is invisible value.',
        speakerNote: 'Connect with the frustration. This is the core problem.',
    },

    // Slide 5 — This Was Me Too (Your Reveal)
    {
        type: 'reveal',
        title: 'This was me.',
        subtitle: 'I used to be brilliant and unseen.',
        text: 'A change started when I began showing my work.',
        speakerNote: 'Share personal vulnerability. This builds trust.',
    },

    // Slide 6 — People Don't Follow Businesses
    {
        type: 'grid',
        title: 'People follow PEOPLE.',
        caseStudies: [
            { name: 'Rihanna', result: 'Built Fenty into a billion-dollar brand' },
            { name: 'KieKie', result: 'Comedy → Brand deals → Media empire' },
            { name: 'Layi Wasabi', result: 'Skits → Acting → Major productions' },
            { name: 'Shania Daly', result: 'Finance tips → Wealth influencer' },
            { name: 'Mark Essien', result: 'Hotels.ng founder → Tech thought leader' },
            { name: 'Eniola Mafe', result: 'Development → Global stages' },
        ],
        speakerNote: 'These are real examples. Personal brands opened doors.',
    },

    // Slide 7 — What Showing Up Unlocks
    {
        type: 'iconRow',
        title: 'When you show up, things happen:',
        icons: [
            { icon: '🤝', label: 'Collaborations' },
            { icon: '💰', label: 'Better Pay' },
            { icon: '👥', label: 'Clients' },
            { icon: '🔗', label: 'Partnerships' },
            { icon: '✉️', label: 'Invitations' },
            { icon: '🌐', label: 'Community' },
        ],
        speakerNote: 'Visibility unlocks opportunities you can\'t even predict.',
    },

    // Slide 8 — Case Study: The 9–5 Woman
    {
        type: 'caseStudy',
        title: 'Case Study: She Quit → Tripled Her Income',
        subtitle: '6 months of documenting, consistent posts, clear narrative.',
        timeline: [
            { month: 'Month 1-2', title: 'Started Posting', activities: ['Shared work insights', 'Built initial following'] },
            { month: 'Month 3-4', title: 'Momentum', activities: ['First brand mentions', 'Engagement grew'] },
            { month: 'Month 5-6', title: 'Breakthrough', activities: ['Quit 9-5', '3x salary in new role'] },
        ],
        highlight: '×3 salary increase • New role aligned with purpose',
        speakerNote: 'Real transformation. 6 months of consistent effort.',
    },

    // Slide 9 — Case Study: Daniel
    {
        type: 'caseStudy',
        title: 'Daniel: 3,000 → 20,000+ followers',
        subtitle: 'Consistency turned curiosity into demand. ₦300k+ collaborations.',
        timeline: [
            { month: 'Month 1', title: 'Foundation', activities: ['Optimized profile', 'Content strategy'] },
            { month: 'Month 2-4', title: 'Growth', activities: ['Daily posting', 'Engagement tactics'] },
            { month: 'Month 5-6', title: 'Monetization', activities: ['Brand deals', '₦300k+ earned'] },
        ],
        speakerNote: 'From 3k to 20k+ followers. Consistency compounds.',
    },

    // Slide 10 — Case Study Roll-Up (Fast Proof)
    {
        type: 'caseRollup',
        title: 'More examples — same pattern:',
        caseStudies: [
            { name: 'Adaeze', result: '0 → 15k followers', metric: '6 months' },
            { name: 'Kunle', result: '₦500k deal', metric: 'First brand partnership' },
            { name: 'Folake', result: 'Podcast launch', metric: '10k downloads in 3 months' },
            { name: 'Emeka', result: 'Speaking gig', metric: 'International conference' },
            { name: 'Bisi', result: 'Job offer', metric: 'Dream company reached out' },
            { name: 'Tunde', result: 'Book deal', metric: 'Publisher approached him' },
        ],
        speakerNote: 'Quick proof. Pattern is clear: show up = opportunities.',
    },

    // Slide 11 — The Worker Bee Loop (Problem Visual)
    {
        type: 'loop',
        title: 'The Worker-Bee Loop',
        subtitle: 'Work → No visibility → Low pay → Switch → Repeat',
        bullets: [
            { text: 'Work hard', icon: '💼' },
            { text: 'No visibility', icon: '👻' },
            { text: 'Low pay', icon: '📉' },
            { text: 'Switch jobs', icon: '🔄' },
            { text: 'Repeat', icon: '♻️' },
        ],
        speakerNote: 'This is the trap. Most professionals are stuck here.',
    },

    // Slide 12 — Flip L-Shaped Graph (Centerpiece)
    {
        type: 'flipL',
        title: 'Visibility compounds — the Flip L-curve',
        subtitle: 'The inflection point where effort meets exponential growth',
        speakerNote: 'KEY SLIDE. Explain the quiet years vs breakout moment.',
    },

    // Slide 13 — Influence Flywheel (Framework)
    {
        type: 'flywheel',
        title: 'The Visibility Engine',
        bullets: [
            { text: 'Positioning', icon: '🎯' },
            { text: 'Storytelling', icon: '📖' },
            { text: 'Consistency', icon: '📅' },
            { text: 'Distribution', icon: '📣' },
            { text: 'Engagement', icon: '💬' },
        ],
        highlight: 'Opportunities',
        speakerNote: 'This is the system. Each element feeds the next.',
    },

    // Slide 14 — Identity Shift (Before / After)
    {
        type: 'beforeAfter',
        title: 'The Identity Shift',
        leftText: 'Before:\n• Worker\n• Invisible\n• Replaceable',
        rightText: 'After:\n• Key Person of Influence\n• Valued\n• In Demand',
        speakerNote: 'This is the transformation we\'re offering.',
    },

    // Slide 15 — The 5 Storytelling Posts (Clear Breakdown)
    {
        type: 'cards',
        title: 'The 5 Posts That Build Influence',
        storyCards: [
            {
                title: 'Origin Story',
                description: 'Where you started; why you care.',
                prompt: '"When I started, I couldn\'t afford X — here\'s what changed."',
                icon: '🌱'
            },
            {
                title: 'Expertise Story',
                description: 'A process, a framework you own.',
                prompt: '"Here\'s my 3-step system for Y that gets Z results."',
                icon: '🧠'
            },
            {
                title: 'Transformation Story',
                description: 'One person or project you changed.',
                prompt: '"Meet [client]. Before working with me, they struggled with..."',
                icon: '✨'
            },
            {
                title: 'Level-Up Moment',
                description: 'A risk you took and what changed.',
                prompt: '"Last year I took a leap — I [action]. Here\'s what happened..."',
                icon: '🚀'
            },
            {
                title: '2026 Mission',
                description: 'Who you serve and the opportunities you want.',
                prompt: '"In 2026, I\'m focused on helping [audience] achieve [goal]."',
                icon: '🎯'
            },
        ],
        speakerNote: 'Give them the exact framework. Actionable content.',
    },

    // Slide 16 — Content That Converts (Examples)
    {
        type: 'contentGrid',
        title: 'Content That Converts',
        bullets: [
            { text: 'Document', icon: '📝' },
            { text: 'Teach', icon: '🎓' },
            { text: 'Break down', icon: '🔍' },
            { text: 'Show results', icon: '📊' },
            { text: 'Social proof', icon: '⭐' },
            { text: 'Call to action', icon: '👆' },
        ],
        speakerNote: 'Six content types that drive engagement and conversion.',
    },

    // Slide 17 — "Every Day You Don't Show Up…" (Urgency)
    {
        type: 'urgency',
        title: 'Every day you don\'t show up…',
        subtitle: 'is a day removed from your possible future.',
        speakerNote: 'Create urgency. Time is passing either way.',
    },

    // Slide 18 — Future Self Vision (12-Month Outcome)
    {
        type: 'silhouette',
        title: 'If you commit for 12 months, you could be:',
        icons: [
            { icon: '🎤', label: 'Speaker' },
            { icon: '💎', label: 'Higher fees' },
            { icon: '🏷️', label: 'Brand deals' },
            { icon: '🏢', label: 'Bigger clients' },
            { icon: '👥', label: 'Community' },
            { icon: '👔', label: 'Team' },
        ],
        speakerNote: 'Paint the vision. What\'s possible in 12 months.',
    },

    // Slide 19 — The BrandQor Mission (Authority)
    {
        type: 'mission',
        title: 'We help people show their work.',
        subtitle: 'Clearly. Consistently. Powerfully.',
        text: '2026 goal: Help 5,000 creators become visible.',
        speakerNote: 'Establish authority and mission. This is what we do.',
    },

    // Slide 20 — Offer Intro (Lead-in to Split Screen)
    {
        type: 'offerIntro',
        title: 'We built a system for people like you.',
        subtitle: 'Choose your path.',
        speakerNote: 'Transition to the offer. Two paths available.',
    },

    // Slide 21 — Split Screen Offers (Founders vs 9–5s)
    {
        type: 'splitOffer',
        title: 'Two Paths to Visibility',
        leftText: 'Influence Engine — Founders',
        rightText: 'BrandQor Exclusive — 9–5s',
        bullets: [
            { text: 'Founders: Monthly video shoot • Batch content • Thought leadership articles • Distribution system • Team execution • 10x visibility potential' },
            { text: '9-5s: Bi-weekly 1:1 • Content roadmap • Accountability • Growth metrics • Systems that fit 5–7 hrs/week' },
        ],
        speakerNote: 'Two distinct offerings. Let them self-select.',
    },

    // Slide 22 — Hormozi-Style Value Stack (Pricing & Bonuses)
    {
        type: 'valueStack',
        title: 'Value Stack',
        valueStack: [
            { item: 'Positioning workshop', value: '₦200,000' },
            { item: 'Content engine (3 months)', value: '₦400,000' },
            { item: 'Distribution + engagement system', value: '₦150,000' },
            { item: 'Templates + Community access', value: '₦100,000' },
        ],
        highlight: 'Total value: ₦850,000+',
        subtitle: 'Today: ₦240,000',
        speakerNote: 'Show the value. Make the price feel like a steal.',
    },

    // Slide 23 — 90-Day Roadmap (Timeline)
    {
        type: 'timeline',
        title: '90-Day Roadmap',
        timeline: [
            {
                month: 'Month 1',
                title: 'Positioning',
                activities: ['Define your niche', 'Craft your story', 'Optimize profiles']
            },
            {
                month: 'Month 2',
                title: 'Systems',
                activities: ['Content calendar', 'Batching workflow', 'Engagement routine']
            },
            {
                month: 'Month 3',
                title: 'Visibility & Growth',
                activities: ['Launch content', 'Track metrics', 'Iterate & scale']
            },
        ],
        speakerNote: 'Clear roadmap. They know what to expect.',
    },

    // Slide 24 — Scarcity / Social Proof
    {
        type: 'scarcity',
        title: 'Limited Spots Available',
        subtitle: 'Cohort closes December 20, 2025',
        testimonials: [
            { text: 'BrandQor helped me find my voice. Now I get DMs asking for collaborations.', name: 'Adaeze O.' },
            { text: 'I went from invisible to invited to speak at 3 conferences.', name: 'Kunle A.' },
            { text: 'The system works. I just had to show up.', name: 'Folake D.' },
        ],
        speakerNote: 'Create urgency with scarcity. Social proof builds trust.',
    },

    // Slide 25 — Final Emotional Return (Tie Back)
    {
        type: 'emotionalReturn',
        title: 'Remember the invisible professional who became sought-after?',
        subtitle: 'That was me. It can be you.',
        speakerNote: 'Bring it home. Personal connection.',
    },

    // Slide 26 — Final CTA + Contact
    {
        type: 'cta',
        title: 'Show your work.',
        subtitle: 'Let the world catch up.',
        text: 'Apply now • Book your brand call',
        speakerNote: 'Clear CTA. Make it easy to take action.',
    },
];
