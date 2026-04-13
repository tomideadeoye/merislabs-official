'use client';

const BG = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
    <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
  </div>
);

export const Conclusion = () => (
  <div
    id="conclusion"
    className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans"
  >
    <BG />
    <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
      <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">14</span>
      <div>
        <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Conclusion</h2>
        <p className="text-xs text-[#211B1B]/40 uppercase tracking-widest mt-1">
          Commitment to Partnership &amp; Firm Growth
        </p>
      </div>
    </div>
    <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
      <p className="text-[#211B1B]/80 text-justify text-sm leading-relaxed">
        Project Fortify is more than a practice growth proposal. It is my business case for how I intend to contribute
        to the Firm's long-term growth through the development of a stronger disputes platform — one that delivers more
        predictable revenue, enhances the Firm's standing in priority sectors, deepens institutional client
        relationships and positions JEE more competitively within the Nigerian and cross-border disputes market. It
        reflects the kind of partner I aspire to be within the Firm: commercially minded, institutionally committed, and
        accountable for building a practice that is both high-performing and enduring.
      </p>

      <p className="text-[#211B1B]/80 text-justify text-sm leading-relaxed">
        Project Fortify is also a structured commercial plan for building a stronger disputes platform within Jackson,
        Etti &amp; Edu and, in doing so, contributing more deliberately to the Firm's long-term growth, market standing
        and institutional strength.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: 'Credible Market Opportunity',
            desc: 'Grounded in structural demand drivers — banking sector stress, credit recovery, energy restructuring, fintech growth, and cross-border enforcement demand.',
          },
          {
            label: 'Defined Business Architecture',
            desc: 'Three complementary platforms — Institutional Recovery, Commercial Disputes, and Arbitration & Cross-Border Enforcement.',
          },
          {
            label: 'Practical Implementation Framework',
            desc: 'Five workstreams with specific milestones, measurable KPIs, and a phased 24-month execution plan.',
          },
          {
            label: 'Disciplined Financial Model',
            desc: 'Bottom-up revenue construction showing a credible route to USD 500,000 annual attributable revenue with a 4–6x ROI on investment.',
          },
          {
            label: 'International Referral Architecture',
            desc: 'IR3 UK initiative and international co-counsel architecture providing a realistic pathway for higher-value cross-border work.',
          },
          {
            label: 'Institutional Commitment',
            desc: 'Deepening client relationships, strengthening internal collaboration, improving profitability discipline and building a more resilient practice platform.',
          },
        ].map(({ label, desc }) => (
          <div key={label} className="border border-[#211B1B]/8 rounded-lg p-3">
            <p className="font-black text-[#211B1B] text-[10px] mb-1">{label}</p>
            <p className="text-[#211B1B]/55 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
