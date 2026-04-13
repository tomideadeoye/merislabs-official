'use client';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

interface WorkstreamProps {
    number: number;
    id: string;
    title: string;
    objective: string;
    leadMeasures: string;
    activities: string[];
    outcomes: string[];
}

const WorkstreamCard = ({ ws }: { ws: WorkstreamProps }) => (
    <div id={ws.id} className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
        <div className="bg-[#211B1B] px-5 py-3 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#E80000] flex items-center justify-center shrink-0">
                <span className="text-white font-black text-[10px]">{ws.number}</span>
            </div>
            <p className="font-black text-white text-xs uppercase tracking-wide">{ws.title}</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-[#211B1B]/8">
            <div className="p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">Objective</p>
                <p className="text-[#211B1B]/70 text-[10px] leading-relaxed">{ws.objective}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/30 mt-3 mb-1">Lead Measures</p>
                <p className="text-[#211B1B]/60 text-[10px] leading-relaxed">{ws.leadMeasures}</p>
            </div>
            <div className="p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Key Activities</p>
                <div className="space-y-1.5">
                    {ws.activities.map((a, i) => (
                        <div key={i} className="flex gap-2 items-start">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E80000] shrink-0"></div>
                            <p className="text-[#211B1B]/60 text-[10px] leading-relaxed">{a}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Outcomes</p>
                <div className="space-y-1.5">
                    {ws.outcomes.map((o, i) => (
                        <div key={i} className="flex gap-2 items-start">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#211B1B]/30 shrink-0"></div>
                            <p className="text-[#211B1B]/60 text-[10px] leading-relaxed">{o}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const allWorkstreams: WorkstreamProps[] = [
    {
        number: 1, id: 'ws1',
        title: 'Development of Structured Dispute Offerings',
        objective: 'Articulate capabilities through productised services.',
        leadMeasures: 'Develop and promote at least 4 offerings annually.',
        activities: [
            'Litigation Portfolio Audit',
            'Structured Debt Recovery Advisory',
            'Garnishee & Enforcement Toolkit',
            'Shareholder & Governance Dispute Advisory',
            'Nigeria Arbitration & Enforcement Support Notes',
            'Cross-Border Recovery Support',
        ],
        outcomes: [
            'Clear articulation of disputes capabilities.',
            'Improved ability to convert conversations into mandates.',
            'Easier market presentation to institutional clients.',
        ],
    },
    {
        number: 2, id: 'ws2',
        title: 'Strategic Thought Leadership & Knowledge Platform',
        objective: 'Establish JEE as an authority in debt recovery, insolvency, credit enforcement, and arbitration.',
        leadMeasures: 'Publish 4+ insights annually; host 1 client-facing session per year.',
        activities: [
            'Launch Strategic Debt Recovery & Insolvency Series.',
            'Launch Arbitration & Cross-Border Series.',
            'Leverage outputs for client meetings, conferences and media.',
            'Target Mondaq, NBA journals and international platforms.',
        ],
        outcomes: [
            'Enhanced reputation and visibility in priority sectors.',
            'Thought leadership as a lead-generation tool.',
        ],
    },
    {
        number: 3, id: 'ws3',
        title: 'Ecosystem Engagement & Market Positioning',
        objective: 'Build credible presence and referral networks in priority disputes ecosystems.',
        leadMeasures: '7+ sector-facing engagements per year; pursue CIArb Fellowship, INSOL Fellowship, NICArb Fellow and panel appointments.',
        activities: [
            'Active roles in INSOL, BRIPAN, NICArb, ICMC, NBA-SBL, LIDW.',
            'Join LCCI, NBBC, NBLF, NICCI and bilateral chambers.',
            'Seek appointments to LCA, NICArb, NCIA and ICC Nigeria panels.',
        ],
        outcomes: [
            'Strengthened referral pipelines; specialist recognition.',
            'Improved access to cross-border opportunities.',
        ],
    },
    {
        number: 4, id: 'ws4',
        title: 'Strategic Relationship Development & Institutional Client Engagement',
        objective: 'Build a disciplined pipeline of institutional relationships.',
        leadMeasures: 'Maintain 15+ strategic relationships; conduct 1 institutional meeting monthly.',
        activities: [
            'Target GCs, Heads of Recovery, Heads of Risk and senior management in banks, priority-sector corporates, investors and international counsel.',
            'Use capability notes and track via pipeline tool.',
        ],
        outcomes: [
            'Development of a structured mandate pipeline.',
            'Increased opportunities for enforcement, commercial disputes and arbitration instructions.',
        ],
    },
    {
        number: 5, id: 'ws5',
        title: 'Internal Referral Capture & Cross-Practice Collaboration',
        objective: 'Capture and retain disputes arising from transactional and sector work.',
        leadMeasures: 'Generate at least 4 cross-practice referrals annually.',
        activities: [
            'Regular engagement with Corporate/M&A, Energy & Projects, Regulatory and Real Estate teams.',
            'Offer early-stage dispute risk assessments.',
            'Conduct internal training on dispute triggers.',
        ],
        outcomes: [
            'Higher internal retention; earlier involvement in stressed matters.',
            'CLDR embedded as natural internal partner.',
        ],
    },
];

// Page 7 — Workstreams 1–3
export const ImplementationPlan = () => (
    <div id="implementation" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BackgroundPattern />

        <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">06</span>
            <div>
                <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Implementation Plan</h2>
                <p className="text-xs text-[#211B1B]/40 uppercase tracking-widest mt-1">Five Strategic Workstreams – 24-Month Cycle</p>
            </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3">
            <p className="text-xs text-[#211B1B]/70 text-justify leading-relaxed mb-1">
                Project Fortify will be implemented through five revenue-directed workstreams, each with defined objectives, lead measures, and execution activities aimed at converting client relationships, sector engagement, and market visibility into dispute mandates across Banking &amp; Financial Institutions, FMCG, and Energy &amp; Infrastructure.
            </p>
            {allWorkstreams.slice(0, 3).map((ws) => (
                <WorkstreamCard key={ws.id} ws={ws} />
            ))}
        </div>
    </div>
);

// Page 8 — Workstreams 4–5
export const ImplementationPlanContinued = () => (
    <div className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BackgroundPattern />

        <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="w-1 h-10 bg-[#E80000]"></div>
            <div>
                <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 6 – Continued</p>
                <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">Implementation Plan</h2>
            </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3">
            {allWorkstreams.slice(3).map((ws) => (
                <WorkstreamCard key={ws.id} ws={ws} />
            ))}

            <div className="bg-[#211B1B]/5 border border-[#211B1B]/10 rounded-lg p-5 mt-2">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Collective Impact</p>
                <p className="text-xs text-[#211B1B]/70 text-justify leading-relaxed">
                    Together, these five workstreams create a robust origination engine combining service innovation, market visibility, professional networking, relationship management, and internal collaboration — converting CLDR into a proactive, revenue-generating business platform.
                </p>
            </div>
        </div>
    </div>
);
