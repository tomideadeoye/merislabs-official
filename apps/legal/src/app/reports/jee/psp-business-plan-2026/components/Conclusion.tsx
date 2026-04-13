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
        Project Fortify is more than a practice growth proposal. It is a structured commercial plan for building a
        stronger disputes platform within Jackson, Etti &amp; Edu and, in doing so, contributing more deliberately to
        the Firm's long-term growth, market standing and institutional strength. The commercial case has been set out
        across this paper: a credible market opportunity grounded in structural demand drivers; a defined business
        architecture built around three complementary platforms; a practical implementation framework with specific
        milestones and measurable KPIs; a disciplined financial model showing credible bottom-up revenue construction;
        and a realistic route to stronger international referral access through the IR3 UK initiative and international
        co-counsel architecture.
      </p>
      <p className="text-[#211B1B]/80 text-justify text-sm leading-relaxed">
        At its core, Project Fortify reflects my conviction that the Commercial Litigation &amp; Dispute Resolution
        practice can and should become a more structured, visible and consistently revenue-generating part of the Firm's
        business. It is intended to build on the strengths already present within JEE — its client relationships, sector
        reach, cross-practice opportunities, disputes capability and growing specialist visibility — and to convert
        those strengths into a more deliberate and scalable platform for mandate origination, retention and growth.
      </p>
      <p className="text-[#211B1B]/80 text-justify text-sm leading-relaxed">
        What gives this proposal particular significance is that it is not only about expanding work. It is also about
        building an institutionally stronger practice. The plan is designed to deepen client relationships, strengthen
        internal collaboration, improve the Firm's ability to retain disputes work arising from its existing mandates,
        and create a platform that is more resilient, more credible and less dependent on chance or reactive instruction
        flows.
      </p>
      <p className="text-[#211B1B]/80 text-justify text-sm leading-relaxed">
        Partnership, in my view, is not only about technical excellence or individual mandate performance. It is about
        accepting responsibility for building a stronger business, developing people, strengthening systems, deepening
        client relationships and contributing to the long-term strategic direction of the institution. I have seen this
        practice from the inside. I know where its strengths lie — the depth of institutional client relationships, the
        cross-practice integration that no pure disputes firm can replicate, and the international positioning that is
        already beginning to generate the referral pipeline that Project Fortify will formalise. I also know where the
        gaps are, the profitability discipline that needs to improve, the collections architecture that needs structure,
        and the arbitration brand that needs to be built with focus and urgency. Project Fortify addresses each of these
        directly.
      </p>
    </div>
  </div>
);

export const ConclusionPart2 = () => (
  <div
    id="conclusion-part2"
    className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans"
  >
    <BG />
    <div className="flex items-center gap-3 mb-5 relative z-10">
      <div className="w-1 h-10 bg-[#E80000]"></div>
      <div>
        <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 14 – Continued</p>
        <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">Conclusion</h2>
      </div>
    </div>
    <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
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

      <div className="bg-[#211B1B]/5 border-l-4 border-[#E80000] p-5 rounded-r-xl">
        <p className="text-[#211B1B]/80 text-justify leading-relaxed">
          I am therefore presenting this proposal not as an abstract growth ambition, but as a practical and
          commercially grounded plan for how I intend to contribute to the Firm's future. Through deliberate
          positioning, disciplined execution and sustained institutional commitment, I believe Project Fortify can help
          establish the CLDR practice as a more competitive, self-sustaining and strategically valuable platform within
          Jackson, Etti &amp; Edu.
        </p>
      </div>

      <div className="mt-4 pt-5 border-t border-[#211B1B]/10 flex items-end justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#211B1B]/30 mb-1">Submitted by</p>
          <p className="font-serif font-black text-base text-[#211B1B]">Taiwo Ogbara</p>
          <p className="text-xs text-[#211B1B]/50">Senior Associate, CLDR · Jackson, Etti &amp; Edu</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#211B1B]/30 mb-1">Date</p>
          <p className="font-serif font-black text-base text-[#211B1B]">March 2026</p>
          <p className="text-xs text-[#211B1B]/50">Partnership Selection Programme</p>
        </div>
      </div>
    </div>
  </div>
);
