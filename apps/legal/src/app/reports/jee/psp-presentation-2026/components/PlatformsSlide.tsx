import { JEE_WEBSITE_URL } from '../../constants';

const platforms = [
    {
        n: '01',
        title: 'Institutional Debt Recovery, Insolvency & Enforcement',
        opportunity: 'Rising NPLs, CBN credit tightening, growing insolvency demand, limited specialist practitioners.',
        focus: 'Tier 1 banks, commercial lenders, asset managers, corporates with receivables exposure.',
        offerings: 'Loan recovery litigation, receivership & insolvency mandates, enforcement of security interests, creditor advisory.',
        color: '#E80000',
    },
    {
        n: '02',
        title: 'Commercial, Transactional & Shareholder Disputes',
        opportunity: 'Complex commercial arrangements, JV growth, rising shareholder disputes, pipeline from Firm\'s transactional work.',
        focus: 'Corporate clients across Energy, FMCG, Financial Services & Technology, JV participants, shareholders.',
        offerings: 'Contractual & commercial disputes, shareholder conflicts, corporate governance disputes, JV & investment disputes.',
        color: '#211B1B',
    },
    {
        n: '03',
        title: 'Domestic & International Arbitration & Cross-Border Enforcement',
        opportunity: 'Cross-border investment growth, increased arbitration adoption, FX volatility, rising foreign award enforcement.',
        focus: 'Multinational corporations, foreign investors, international counterparties, cross-border transactions.',
        offerings: 'Domestic & international arbitration, enforcement of arbitral awards & foreign judgments, cross-border dispute strategy.',
        color: '#E80000',
    },
];

const PlatformsSlide = () => (
    <div id="platform-1" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
        <div className="absolute top-10 left-12 right-12 z-50 flex items-center space-x-4 border-b border-[#211B1B]/10 pb-5">
            <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                <img src="/clients/jackson etti and edu logo (1).png" alt="JEE" className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </a>
            <div className="h-3 w-px bg-[#211B1B]/20" />
            <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Three Core Business Platforms</span>
        </div>

        <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 flex flex-col gap-3">
            <div className="flex items-center space-x-3 mb-1">
                <div className="h-[1px] w-8 bg-red-600" />
                <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">03 · Proposed Business</span>
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
                {platforms.map(({ n, title, opportunity, focus, offerings, color }) => (
                    <div key={n} className="border border-[#211B1B]/8 rounded-lg overflow-hidden flex flex-col hover:border-red-600/20 transition-colors">
                        <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: color }}>
                            <span className="text-white/40 font-mono text-xs font-bold">{n}</span>
                            <p className="text-white font-black text-[10px] uppercase tracking-wide leading-tight">{title}</p>
                        </div>
                        <div className="flex-1 p-4 flex flex-col gap-3">
                            {[
                                { label: 'Market Opportunity', value: opportunity },
                                { label: 'Commercial Focus', value: focus },
                                { label: 'Core Offerings', value: offerings },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#211B1B]/30 mb-1">{label}</p>
                                    <p className="text-[10px] text-[#211B1B]/60 leading-relaxed">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#211B1B]/3 border border-[#211B1B]/8 rounded-lg px-5 py-3">
                <p className="text-[9px] text-[#211B1B]/50 text-center tracking-wide">
                    Each platform operates as a distinct revenue stream while collectively forming an integrated disputes ecosystem — capturing mandates across the full lifecycle of commercial activity.
                </p>
            </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(220,38,38,0.03)_0%,transparent_60%)] z-0" />
    </div>
);

export default PlatformsSlide;
