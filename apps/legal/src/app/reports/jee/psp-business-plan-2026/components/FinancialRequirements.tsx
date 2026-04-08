'use client';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

const items = [
    {
        item: 'Professional Memberships, Credentials & Panel Registrations',
        detail: 'INSOL, CIArb, NICArb, BRIPAN, CIBN, arbitral panels',
        purpose: 'Strengthen ecosystem credibility',
        cost: '₦20M – ₦25M',
        source: 'CPD / Professional Development',
    },
    {
        item: 'Commercial Chambers & Industry Associations',
        detail: 'NACCIMA, LCCI, bilateral chambers, BNLF',
        purpose: 'Access institutional decision-makers',
        cost: '₦10M – ₦12.5M',
        source: 'Marketing / BD',
    },
    {
        item: 'Conferences & Events',
        detail: 'INSOL, BRIPAN, LIDW, London Arbitration Week, ICC/CIArb forums',
        purpose: 'Visibility & international referrals',
        cost: '₦20M – ₦25M',
        source: 'Professional Development / BD',
    },
    {
        item: 'Thought Leadership Publications & Dissemination',
        detail: 'Articles, series, client alerts',
        purpose: 'Authority positioning',
        cost: '₦5M – ₦7.5M',
        source: 'Marketing / BD',
    },
    {
        item: 'Client-Facing Engagements',
        detail: 'Roundtables, seminars, client events',
        purpose: 'Origination & retention',
        cost: '₦10M – ₦15M',
        source: 'Firm Events / Marketing',
    },
    {
        item: 'Team Capability Development',
        detail: 'Training, certifications',
        purpose: 'Internal capacity building',
        cost: '₦5M – ₦7.5M',
        source: 'CPD / Training',
    },
];

export const FinancialRequirements = () => {
    return (
        <div id="financial" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BackgroundPattern />

            <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">05</span>
                <div>
                    <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Financial Requirements</h2>
                    <p className="text-xs text-[#211B1B]/40 uppercase tracking-widest mt-1">24-Month Investment Framework</p>
                </div>
            </div>

            <div className="relative z-10 flex flex-col gap-5">
                <p className="text-xs text-[#211B1B]/70 text-justify leading-relaxed">
                    Execution requires modest, targeted investment. Significant mandates routinely exceed these costs in fee value. The projected financial requirements are outlined below.
                </p>

                {/* Table */}
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[9px] font-black uppercase tracking-widest">
                        <div className="col-span-4 px-4 py-3">Investment Item</div>
                        <div className="col-span-3 px-4 py-3">Purpose</div>
                        <div className="col-span-2 px-4 py-3 text-right">Est. Cost (NGN)</div>
                        <div className="col-span-3 px-4 py-3">Budget Source</div>
                    </div>
                    {items.map(({ item, detail, purpose, cost, source }, i) => (
                        <div key={i} className={`grid grid-cols-12 text-[10px] border-t border-[#211B1B]/8 ${i % 2 === 0 ? 'bg-[#211B1B]/2' : 'bg-transparent'}`}>
                            <div className="col-span-4 px-4 py-3">
                                <p className="font-bold text-[#211B1B]">{item}</p>
                                <p className="text-[#211B1B]/40 text-[9px] mt-0.5">{detail}</p>
                            </div>
                            <div className="col-span-3 px-4 py-3 text-[#211B1B]/60 flex items-center">{purpose}</div>
                            <div className="col-span-2 px-4 py-3 text-right font-black text-[#E80000] flex items-center justify-end">{cost}</div>
                            <div className="col-span-3 px-4 py-3 text-[#211B1B]/50 flex items-center">{source}</div>
                        </div>
                    ))}
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[10px] font-black border-t-2 border-[#E80000]">
                        <div className="col-span-4 px-4 py-3 uppercase tracking-widest">Total</div>
                        <div className="col-span-3 px-4 py-3"></div>
                        <div className="col-span-2 px-4 py-3 text-right text-[#E80000]">₦70M – ₦92.5M</div>
                        <div className="col-span-3 px-4 py-3"></div>
                    </div>
                </div>

                {/* ROI Note */}
                <div className="bg-[#E80000]/5 border border-[#E80000]/15 rounded-lg p-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">Return on Investment</p>
                    <p className="text-[#211B1B]/70 text-xs text-justify leading-relaxed">
                        The total investment of ₦70M–₦92.5M over 24 months is designed to generate <strong>USD 500,000 in annual attributable revenue</strong> by the end of the PSP cycle. A single institutional enforcement mandate or arbitration instruction routinely exceeds the total annual investment, making this a high-leverage, low-risk commercial proposition.
                    </p>
                </div>
            </div>
        </div>
    );
};
