'use client';

const BG = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
    <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
  </div>
);

export const PhasedTimeline = () => (
  <div
    id="phased-timeline-1"
    className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans"
  >
    <BG />
    <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
      <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">13</span>
      <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Phased Implementation Timeline</h2>
    </div>
    <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
      <p className="text-[#211B1B]/70 text-justify mb-2">
        Project Fortify is designed to deliver its commercial impact progressively, through three phases that reflect
        the commercial reality that a sustainable disputes platform must be built: first by establishing foundations,
        then by converting opportunities, and finally by consolidating the platform into a stronger and more repeatable
        source of work.
      </p>
      <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#E80000' }}>
          <p className="text-white font-black text-xs uppercase tracking-wide">PHASE 1 – FOUNDATION</p>
          <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest">
            MONTHS 1-6 · APRIL – SEPTEMBER 2026
          </p>
        </div>
        <div className="px-4 py-2 bg-[#211B1B]/3 border-b border-[#211B1B]/8">
          <p className="text-[9px] text-[#211B1B]/60 italic">
            Objective: Build the infrastructure. Establish products, launch thought leadership, commence institutional
            engagement, formalise co-counsel relationships. Objective by end of Phase 1: Project Fortify moves from
            concept to visible platform.
          </p>
        </div>
        <div className="divide-y divide-[#211B1B]/5">
          {[
            {
              when: 'April–May 2026',
              ws: 'WS1 — Structured Offerings',
              what: 'Draft and finalise all 4 capacity statements for productised offerings',
              outcome: 'Print versions ready for institutional meetings',
            },
            {
              when: 'April–May 2026',
              ws: 'WS2 — Thought Leadership',
              what: 'Commission first Strategic Debt Recovery & Insolvency/Arbitration Series article; brief marketing on dissemination strategy',
              outcome: 'Mondaq/Relevant Blog submission by end of May 2026',
            },
            {
              when: 'May 2026',
              ws: 'WS3 — Ecosystem',
              what: 'Confirm LIDW May 2026 attendance; prepare JEE CLDR capability note for international distribution',
              outcome: 'Capability note circulated to minimum 15 international contacts at LIDW',
            },
            {
              when: 'May–June 2026',
              ws: 'WS4 — Relationships',
              what: 'Identify and prioritise 15 target institutional relationships: schedule first 3 introductory/capability meetings',
              outcome: '3 institutional meetings held by end of June 2026',
            },
            {
              when: 'June 2026',
              ws: 'WS5 — Internal Referral',
              what: 'Hold first cross-practice roundtable with Corporate/M&A and Finance teams',
              outcome: 'At least 1 internal referrals or live follow-up matters identified',
            },
            {
              when: 'June–July 2026',
              ws: 'WS3 — Ecosystem',
              what: 'Formalise referral MOU with at least 1 UK disputes firm',
              outcome: 'Signed MOU or referral letter of intent by July 2026',
            },
            {
              when: 'July 2026',
              ws: 'WS2 — Thought Leadership',
              what: "Host first client-facing roundtable: 'Managing Commercial Disputes in a High-Rate Environment'",
              outcome: 'Minimum 20 institutional attendees; post-event follow-up to all attendees',
            },
            {
              when: 'August 2026',
              ws: 'WS4 — Relationships',
              what: 'Submit first NPL portfolio audit proposal to at least 3 banks',
              outcome: 'Follow-up meetings held with target institutions',
            },
            {
              when: 'September 2026',
              ws: 'Phase 1 Review',
              what: 'Assess against Phase 1 targets: ≥3 institutional meetings; 1 mandate instruction; 2 TL pieces published; 1 MOU signed',
              outcome: 'If below targets, rebalance WS4 and WS1 activity before Phase 2',
            },
          ].map(({ when, ws, what, outcome }, i) => (
            <div key={i} className="grid grid-cols-12 text-[9px]">
              <div className="col-span-2 px-3 py-2 font-black text-[#211B1B]/30 shrink-0">{when}</div>
              <div className="col-span-2 px-3 py-2 font-bold text-[#E80000]">{ws}</div>
              <div className="col-span-5 px-3 py-2 text-[#211B1B]/65 leading-relaxed">{what}</div>
              <div className="col-span-3 px-3 py-2 text-[#211B1B]/45 leading-relaxed italic">{outcome}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const PhasedTimelinePart2 = () => (
  <div
    id="phased-timeline-2"
    className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans"
  >
    <BG />
    <div className="flex items-center gap-3 mb-5 relative z-10">
      <div className="w-1 h-10 bg-[#E80000]"></div>
      <div>
        <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 13 – Continued</p>
        <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">Phased Implementation Timeline</h2>
      </div>
    </div>
    <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
      <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#211B1B' }}>
          <p className="text-white font-black text-xs uppercase tracking-wide">PHASE 2 – ACCELERATION</p>
          <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest">
            MONTHS 7-18 · OCTOBER 2026 – SEPTEMBER 2027
          </p>
        </div>
        <div className="px-4 py-2 bg-[#211B1B]/3 border-b border-[#211B1B]/8">
          <p className="text-[9px] text-[#211B1B]/60 italic">
            Objective: Convert pipeline to mandates. Deepen institutional relationships. Build arbitration profile.
            Achieve Year 1 revenue milestone (USD 230,000+).
          </p>
        </div>
        <div className="divide-y divide-[#211B1B]/5">
          {[
            {
              when: 'Q4 2026',
              ws: 'Platform 1',
              what: 'Secure 2nd institutional recovery mandate; commence NPL portfolio audit for first bank client; issue retainer proposal to at least 2 bank clients',
              outcome: '₦20M+ in fees billed or in instruction',
            },
            {
              when: 'Q4 2026',
              ws: 'Platform 3',
              what: 'Attend London Arbitration Week / INSOL Global event; convert at least 1 international contact to referral pipeline conversation; apply for LCA / NICArb panel appointment',
              outcome: 'Panel application submitted; 1 referral conversation active',
            },
            {
              when: 'Q1 2027',
              ws: 'All Platforms',
              what: 'Mid-programme revenue review: USD 100,000+ billed or in advanced mandate stage',
              outcome: 'If tracking below, accelerate Platform 1 institutional outreach',
            },
            {
              when: 'Q1 2027',
              ws: 'WS2 — Thought Leadership',
              what: 'Publish Arbitration Series Issue 1; submit speaker abstract to BRIPAN Annual Conference 2027',
              outcome: '1 speaking slot secured for 2027 BRIPAN or equivalent event',
            },
            {
              when: 'Q2 2027',
              ws: 'Platform 2',
              what: 'Convert at least 1 cross-practice referral from Corporate/M&A or Finance team to formal CLDR instruction',
              outcome: '1 internally-referred mandate instructed',
            },
            {
              when: 'Q2 2027',
              ws: 'WS3 — Ecosystem',
              what: 'Secure at least 1 speaking slot at NBA-SBL or INSOL/BRIPAN event; publish speaking summary through Firm channels',
              outcome: 'Published thought leadership piece amplified through event',
            },
            {
              when: 'Q3 2027',
              ws: 'Platform 3',
              what: 'Receive first referral instruction from international co-counsel partner or be in advanced conversation',
              outcome: 'FX-denominated mandate instruction or term sheet in progress',
            },
            {
              when: 'Q3 2027',
              ws: 'Phase 2 Review',
              what: 'USD 200,000+ in revenue achieved or committed; 10+ active institutional relationships; 1 arbitral panel appointment secured',
              outcome: 'If below targets, escalate resource allocation for Platform 1 before Phase 3',
            },
          ].map(({ when, ws, what, outcome }, i) => (
            <div key={i} className="grid grid-cols-12 text-[9px]">
              <div className="col-span-2 px-3 py-2 font-black text-[#211B1B]/30 shrink-0">{when}</div>
              <div className="col-span-2 px-3 py-2 font-bold text-[#E80000]">{ws}</div>
              <div className="col-span-5 px-3 py-2 text-[#211B1B]/65 leading-relaxed">{what}</div>
              <div className="col-span-3 px-3 py-2 text-[#211B1B]/45 leading-relaxed italic">{outcome}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const PhasedTimelinePart3 = () => (
  <div
    id="phased-timeline-3"
    className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans"
  >
    <BG />
    <div className="flex items-center gap-3 mb-5 relative z-10">
      <div className="w-1 h-10 bg-[#E80000]"></div>
      <div>
        <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 13 – Continued</p>
        <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">Phased Implementation Timeline</h2>
      </div>
    </div>
    <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
      <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#E80000' }}>
          <p className="text-white font-black text-xs uppercase tracking-wide">PHASE 3 – CONSOLIDATION</p>
          <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest">
            MONTHS 19-24 · OCTOBER 2027 – MARCH 2028
          </p>
        </div>
        <div className="px-4 py-2 bg-[#211B1B]/3 border-b border-[#211B1B]/8">
          <p className="text-[9px] text-[#211B1B]/60 italic">
            Objective: Achieve USD 500,000 annual run rate. Institutionalise the platform. Demonstrate scalability
            beyond the candidate.
          </p>
        </div>
        <div className="divide-y divide-[#211B1B]/5">
          {[
            {
              when: 'Q4 2027',
              ws: 'All Platforms',
              what: 'Origination push: 3 simultaneous active mandates across at least 2 platforms; first success-fee recovery generated (Platform 1)',
              outcome: 'USD 350,000+ cumulative revenue achieved',
            },
            {
              when: 'Q1 2028',
              ws: 'Institutional Relationships',
              what: 'Annual review meetings with all 5+ active bank relationships; present annual CLDR capability update; seek expanded mandates',
              outcome: 'At least 1 expanded mandate instruction from existing institutional client',
            },
            {
              when: 'Q1 2028',
              ws: 'Platform 3',
              what: 'First international arbitration instruction received or advanced co-counsel mandate in progress',
              outcome: 'USD 30,000+ fee instruction confirmed or in final negotiation',
            },
            {
              when: 'Q2 2028',
              ws: 'All Platforms',
              what: 'Final PSP review: USD 500,000 annual attributable revenue achieved; CLDR functioning as self-sustaining origination platform',
              outcome: 'Platform operating on a recurring pipeline rather than one-off mandates',
            },
          ].map(({ when, ws, what, outcome }, i) => (
            <div key={i} className="grid grid-cols-12 text-[9px]">
              <div className="col-span-2 px-3 py-2 font-black text-[#211B1B]/30 shrink-0">{when}</div>
              <div className="col-span-2 px-3 py-2 font-bold text-[#E80000]">{ws}</div>
              <div className="col-span-5 px-3 py-2 text-[#211B1B]/65 leading-relaxed">{what}</div>
              <div className="col-span-3 px-3 py-2 text-[#211B1B]/45 leading-relaxed italic">{outcome}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
