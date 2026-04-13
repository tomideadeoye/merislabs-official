'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

const drivers = [
    { title: 'Banking Sector Stress & NPLs', desc: 'CBN recapitalisation directive accelerating balance sheet clean-up. AMCON-linked portfolios and new NPL disposals generating fresh enforcement and recovery mandates. Single largest near-term demand driver for Platform 1.' },
    { title: 'Currency Volatility & Cross-Border Disputes', desc: 'Since the Naira\'s managed float in June 2023, a significant pipeline of FX-linked commercial disputes — LC disputes, contractual performance failures, investment treaty grievances — directly serving Platform 3.' },
    { title: 'Corporate Governance & Shareholder Activism', desc: 'CAMA 2020 implementation elevating derivative actions, minority shareholder relief and corporate governance disputes arising naturally from the Firm\'s transactional environment.' },
    { title: 'Fintech & Payments Sector Growth', desc: 'Nigeria\'s digital payments market generating inter-operator disputes, regulatory enforcement actions and contractual claims — aligned with the Firm\'s existing OPay relationship and Platform 2 focus.' },
    { title: 'Energy Sector Restructuring', desc: 'PIA 2021 transition generating disputes between operators, host communities and regulators across upstream, midstream and downstream segments — technically complex, premium-fee mandates.' },
];

const competitors = [
    { firm: 'Aluko & Oyebode', strength: 'Strong disputes team; deep Tier-1 bank panel relationships; larger team', advantage: 'JEE\'s IP-litigation anchored client base offers cross-sell into disputes; stronger international arbitration positioning via INSOL/LIDW network' },
    { firm: 'Banwo & Ighodalo', strength: 'Strong in banking and regulatory disputes and corporate transactions', advantage: 'JEE\'s INSOL Future Leader recognition and BRIPAN ecosystem differentiate in cross-border insolvency; stronger international referral architecture' },
    { firm: 'Aelex', strength: 'Premier arbitration brand; strong ICSID/ICC presence; energy disputes depth', advantage: 'JEE\'s productised recovery solutions and portfolio management capability target a segment Aelex does not focus on' },
    { firm: 'Olaniwun Ajayi', strength: 'Oil & gas and M&A disputes; strong transactional-to-disputes pipeline', advantage: 'JEE\'s brand protection and IP anchor creates client loyalty across sectors not served by OA' },
    { firm: 'Templars', strength: 'Energy sector relationships; international co-counsel network', advantage: 'JEE\'s INSOL and BRIPAN profile represent a credibility lever Templars does not hold in insolvency' },
    { firm: 'Udo Udoma & Belo-Osagie', strength: 'Banking, financial institutions and commercial litigation; strong sector presence', advantage: 'JEE\'s fintech disputes capability and technology client base represents a differentiated segment' },
    { firm: 'SPA Ajibade & Co', strength: 'Appellate advocacy and public law disputes; SAN-led team', advantage: 'JEE\'s technology litigation and fintech client base represent a sector SPA does not lead in' },
    { firm: 'ALP', strength: 'Commercial litigation with regulatory and enforcement focus', advantage: 'JEE\'s cross-practice integration and IP anchor provide broader client capture' },
];

export const MarketAnalysis = () => (
    <div id="market-analysis" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">04</span>
            <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Market &amp; Competitive Landscape</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">Key Market Drivers</p>
                <div className="grid grid-cols-1 gap-2">
                    {drivers.map(({ title, desc }, i) => (
                        <div key={i} className="flex gap-3 items-start border border-[#211B1B]/8 rounded-lg p-3">
                            <div className="w-5 h-5 rounded-full bg-[#E80000]/10 border border-[#E80000]/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[8px] font-black text-[#E80000]">{i + 1}</span>
                            </div>
                            <div>
                                <p className="font-black text-[#211B1B] text-[10px]">{title}</p>
                                <p className="text-[#211B1B]/55 mt-0.5 text-justify">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export const CompetitiveLandscape = () => (
    <div id="competitive-landscape" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="w-1 h-10 bg-[#E80000]"></div>
            <div>
                <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 4 – Continued</p>
                <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">Competitive Landscape – Tier 1 Firms</h2>
            </div>
        </div>
        <div className="relative z-10 flex flex-col gap-4 text-xs">
            <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                    <div className="col-span-3 px-4 py-2.5">Firm</div>
                    <div className="col-span-4 px-4 py-2.5">Principal Strength</div>
                    <div className="col-span-5 px-4 py-2.5">JEE Competitive Advantage</div>
                </div>
                {competitors.map(({ firm, strength, advantage }, i) => (
                    <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                        <div className="col-span-3 px-4 py-3 font-black text-[#211B1B] text-[10px]">{firm}</div>
                        <div className="col-span-4 px-4 py-3 text-[#211B1B]/55 text-[9px] leading-relaxed">{strength}</div>
                        <div className="col-span-5 px-4 py-3 text-[#211B1B]/70 text-[9px] leading-relaxed">{advantage}</div>
                    </div>
                ))}
            </div>

            <div className="bg-[#E80000]/5 border border-[#E80000]/15 rounded-lg p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">JEE&apos;s Distinctive Position</p>
                <p className="text-[#211B1B]/70 text-justify leading-relaxed">
                    JEE benefits from structural advantages Project Fortify is designed to leverage: longstanding strength in Brand Protection and IP litigation creating cross-sell access; full-service sector teams providing multiple entry points for disputes work; a differentiated opportunity in fintech and payments-related disputes; and the IR3 UK initiative providing an institutional framework for converting international relationships into mandates.
                </p>
            </div>

            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Tier 2 – Specialist & Mid-Tier Competitors by Platform</p>
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                        <div className="col-span-3 px-4 py-2">Platform</div>
                        <div className="col-span-4 px-4 py-2">Key Competitors</div>
                        <div className="col-span-5 px-4 py-2">Competitive Dynamic</div>
                    </div>
                    {[
                        { platform: 'Platform 1 — Debt Recovery, Insolvency & Enforcement', competitors: 'Pinheiro LP, Insolvency Forte, Stren & Bran, Temilolu Adamolekun & Co, Perchstone & Graeys, Resolution Law Firm, Kunle Ogunba & Associates, Alliance Law Firm, Tayo Oyetibo LP, Fred-Young & Evans', dynamic: 'Most crowded tier. JEE differentiates through productised recovery solutions, INSOL credentialing and full-lifecycle capability from insolvency through enforcement.' },
                        { platform: 'Platform 2 — Commercial & Shareholder Disputes', competitors: 'Punuka Attorneys & Solicitors, ACAS-Law, Babalakin & Co, G. Elias & Co, Detail Solicitors', dynamic: 'Relationship-driven. JEE\'s full-service structure and existing corporate client base provide natural entry points.' },
                        { platform: 'Platform 3 — Arbitration & Cross-Border Enforcement', competitors: 'Punuka Attorneys & Solicitors, ACAS-Law, DLA Piper Africa/Nigeria (Olajide Oyewole), Kola Awodein & Co, Detail Disputes, Chris Ogunbanjo & Co', dynamic: 'Brand and credibility sensitive. JEE builds its lane through ecosystem participation, international referral architecture, arbitral panel appointments and strong Nigerian enforcement capability.' },
                    ].map(({ platform, competitors, dynamic }, i) => (
                        <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="col-span-3 px-4 py-3 font-black text-[#211B1B]">{platform}</div>
                            <div className="col-span-4 px-4 py-3 text-[#211B1B]/55 leading-relaxed">{competitors}</div>
                            <div className="col-span-5 px-4 py-3 text-[#211B1B]/65 leading-relaxed">{dynamic}</div>
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-[#211B1B]/70 text-justify leading-relaxed">
                The target of USD 500,000 in annual attributable incremental revenue requires a measured increase in market capture rather than an unrealistic leap in competitive position. The proposal does not depend on market disruption — it depends on focused execution, stronger visibility, better internal capture, and more deliberate client and referral conversion within a market where JEE already has a credible foundation.
            </p>
        </div>
    </div>
);
