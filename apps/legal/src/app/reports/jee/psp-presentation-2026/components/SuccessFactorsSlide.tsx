import { JEE_WEBSITE_URL } from '../../constants';

const kpis = [
    { category: 'Financial', color: '#E80000', items: ['USD 500,000 annual attributable revenue by end of PSP cycle', 'Consistent year-on-year growth in CLDR-originated fee income'] },
    { category: 'Client Development', color: '#211B1B', items: ['≥5 active financial institution relationships', '≥10 active dispute relationships across target segments'] },
    { category: 'Mandate Generation', color: '#E80000', items: ['1–2 institutional enforcement/recovery mandates p.a.', '1–2 commercial dispute mandates p.a.', '1–2 arbitration/cross-border mandates p.a.'] },
    { category: 'Market Positioning', color: '#211B1B', items: ['Active ecosystem participation across INSOL, NICArb, BRIPAN, LIDW', 'Structured thought leadership series launched and sustained'] },
    { category: 'Practice Development', color: '#E80000', items: ['Productised dispute offerings developed and promoted', '≥2 cross-practice referrals annually', 'CLDR established as recognised internal disputes platform'] },
];

const SuccessFactorsSlide = () => (
    <div id="success-factors" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
        <div className="absolute top-10 left-12 right-12 z-50 flex items-center space-x-4 border-b border-[#211B1B]/10 pb-5">
            <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                <img src="/clients/jackson etti and edu logo (1).png" alt="JEE" className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </a>
            <div className="h-3 w-px bg-[#211B1B]/20" />
            <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Success Factors & KPIs</span>
        </div>

        <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 flex flex-col gap-3">
            <div className="flex items-center space-x-3 mb-1">
                <div className="h-[1px] w-8 bg-red-600" />
                <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">06 · Measuring Project Fortify Performance</span>
            </div>

            <div className="grid grid-cols-5 gap-3 flex-1">
                {kpis.map(({ category, color, items }) => (
                    <div key={category} className="border border-[#211B1B]/8 rounded-lg overflow-hidden flex flex-col hover:border-red-600/20 transition-colors">
                        <div className="px-3 py-2.5" style={{ backgroundColor: color }}>
                            <p className="text-white font-black text-[9px] uppercase tracking-wide">{category}</p>
                        </div>
                        <div className="flex-1 p-3 flex flex-col gap-2">
                            {items.map((item, i) => (
                                <div key={i} className="flex gap-2 items-start">
                                    <div className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color + '80' }}></div>
                                    <p className="text-[9px] text-[#211B1B]/60 leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#211B1B] rounded-lg px-5 py-3">
                <p className="text-[9px] text-white/50 text-center tracking-wide">
                    Achievement of these metrics validates a scalable disputes business model — originating its own work, delivering predictable revenues, and cementing JEE&apos;s market leadership.
                </p>
            </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
    </div>
);

export default SuccessFactorsSlide;
