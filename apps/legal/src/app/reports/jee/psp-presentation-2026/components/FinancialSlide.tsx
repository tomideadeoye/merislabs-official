import { JEE_WEBSITE_URL } from '../../constants';

const items = [
    { item: 'Professional Memberships & Panel Registrations', detail: 'INSOL, CIArb, NICArb, BRIPAN, CIBN, arbitral panels', cost: '₦20M–₦25M' },
    { item: 'Commercial Chambers & Industry Associations', detail: 'NACCIMA, LCCI, bilateral chambers, BNLF', cost: '₦10M–₦12.5M' },
    { item: 'Conferences & Events', detail: 'INSOL, BRIPAN, LIDW, London Arbitration Week, ICC/CIArb forums', cost: '₦20M–₦25M' },
    { item: 'Thought Leadership Publications', detail: 'Articles, series, client alerts', cost: '₦5M–₦7.5M' },
    { item: 'Client-Facing Engagements', detail: 'Roundtables, seminars, client events', cost: '₦10M–₦15M' },
    { item: 'Team Capability Development', detail: 'Training, certifications', cost: '₦5M–₦7.5M' },
];

const FinancialSlide = () => (
    <div id="financial" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
        <div className="absolute top-10 left-12 right-12 z-50 flex items-center space-x-4 border-b border-[#211B1B]/10 pb-5">
            <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                <img src="/clients/jackson etti and edu logo (1).png" alt="JEE" className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </a>
            <div className="h-3 w-px bg-[#211B1B]/20" />
            <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Financial Requirements</span>
        </div>

        <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-8">
            {/* Left: table */}
            <div className="col-span-8 flex flex-col gap-3">
                <div className="flex items-center space-x-3 mb-1">
                    <div className="h-[1px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">05 · Investment Framework</span>
                </div>

                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden flex-1">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                        <div className="col-span-7 px-4 py-2.5">Investment Item</div>
                        <div className="col-span-5 px-4 py-2.5 text-right">Estimated Cost (NGN)</div>
                    </div>
                    {items.map(({ item, detail, cost }, i) => (
                        <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="col-span-7 px-4 py-2.5">
                                <p className="text-[10px] font-bold text-[#211B1B]">{item}</p>
                                <p className="text-[8px] text-[#211B1B]/35 mt-0.5">{detail}</p>
                            </div>
                            <div className="col-span-5 px-4 py-2.5 flex items-center justify-end">
                                <span className="text-[10px] font-black text-red-600">{cost}</span>
                            </div>
                        </div>
                    ))}
                    <div className="grid grid-cols-12 bg-[#211B1B] border-t-2 border-red-600">
                        <div className="col-span-7 px-4 py-3 text-white font-black text-[10px] uppercase tracking-widest">Total</div>
                        <div className="col-span-5 px-4 py-3 text-right text-red-500 font-black text-sm">₦70M – ₦92.5M</div>
                    </div>
                </div>
            </div>

            {/* Right: ROI */}
            <div className="col-span-4 flex flex-col justify-center gap-4">
                <div className="bg-[#211B1B] rounded-lg p-5 flex flex-col gap-3">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-500">Revenue Target</p>
                    <p className="text-white font-black text-2xl leading-tight">USD<br />500,000</p>
                    <p className="text-white/30 text-[8px] uppercase tracking-widest">Annual · End of PSP cycle</p>
                </div>
                <div className="border border-[#211B1B]/10 rounded-lg p-5 flex flex-col gap-2">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#211B1B]/40">ROI Rationale</p>
                    <p className="text-[10px] text-[#211B1B]/60 leading-relaxed">A single institutional enforcement mandate or arbitration instruction routinely exceeds the total annual investment — making this a high-leverage, low-risk commercial proposition.</p>
                </div>
                <div className="border border-red-600/15 bg-red-600/5 rounded-lg p-4">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-600 mb-1">Budget Sources</p>
                    <div className="space-y-1">
                        {['CPD / Professional Development', 'Marketing / BD', 'Firm Events / Marketing', 'CPD / Training'].map(s => (
                            <div key={s} className="flex gap-2 items-center">
                                <div className="w-1 h-1 rounded-full bg-red-600/40 shrink-0"></div>
                                <p className="text-[9px] text-[#211B1B]/50">{s}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
    </div>
);

export default FinancialSlide;
