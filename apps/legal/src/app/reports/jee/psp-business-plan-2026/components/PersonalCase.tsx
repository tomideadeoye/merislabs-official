'use client';

const BG = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
    <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
  </div>
);

// Page 4 — Leadership + Commercial Impact intro (no table)
export const PersonalCase = () => (
  <div
    id="personal-case"
    className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans"
  >
    <BG />
    <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
      <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">02</span>
      <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">
        Personal Case, Commercial Impact &amp; Contributions
      </h2>
    </div>
    <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Leadership &amp; Role</p>
        <p className="text-[#211B1B]/80 text-justify">
          Since joining Jackson, Etti &amp; Edu in February 2024, I have assumed increasing leadership responsibility
          within the Commercial Litigation &amp; Dispute Resolution practice. Working closely with departmental
          leadership, I currently play a central role in the strategic direction of the practice, the coordination of
          mandate execution, client relationship development and the broader effort to position the team as a stronger
          and more commercially deliberate disputes platform within the Firm.
        </p>
        <p className="text-[#211B1B]/70 text-justify mt-2">
          My work has increasingly required me to operate not only as a disputes lawyer responsible for technical
          delivery, but also as a practice builder focused on how the team originates work, deepens client
          relationships, improves commercial outcomes and aligns more intentionally with the Firm's sector priorities.
          In practical terms, this has involved leading on major disputes, managing client-facing engagements,
          supporting internal business development efforts, strengthening collaboration across practice groups and
          contributing to the long-term development of the CLDR practice as a structured business platform.
        </p>
        <p className="text-[#211B1B]/70 text-justify mt-2">
          I also lead the Firm's IR3 UK initiative, a structured international referrals strategy focused on deepening
          relationships with selected UK and international law firms and converting those relationships into Nigerian
          mandates and sustained engagements. That role reflects a broader institutional responsibility in relation to
          UK-facing visibility, referrals and cross-border opportunity development.
        </p>
      </div>

      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">
          Commercial Impact &amp; Revenue Contributions
        </p>
        <p className="text-[#211B1B]/70 text-justify">
          A central feature of my practice has been the ability to translate technical disputes capability into
          measurable commercial outcomes for both clients and the Firm. Over the course of my career, I have built a
          proven record in dispute positioning, advocacy, enforcement strategy and commercial resolution. That record
          includes leading a complex arbitration that resulted in a US$9.7 million award and successful enforcement
          prior to joining JEE, as well as securing over ₦5 billion in recoveries for Tier 1 financial institutions.
          These experiences have provided a strong practical foundation for the development of creditor-side mandates,
          enforcement work and complex commercial disputes within the Firm.
        </p>
        <p className="text-[#211B1B]/70 text-justify mt-2">
          Since joining JEE, I have contributed directly to the practice's commercial performance in a number of
          significant ways, summarised in the table below:
        </p>
      </div>
    </div>
  </div>
);

// Page 5 — Revenue Table only
export const PersonalCaseTable = () => (
  <div className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
    <BG />
    <div className="flex items-center gap-3 mb-5 relative z-10">
      <div className="w-1 h-10 bg-[#E80000]"></div>
      <div>
        <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 2 – Continued</p>
        <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">
          Commercial Impact &amp; Revenue Contributions
        </h2>
      </div>
    </div>
    <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
      <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
          <div className="col-span-3 px-3 py-2">Matter / Client</div>
          <div className="col-span-5 px-3 py-2">Description</div>
          <div className="col-span-4 px-3 py-2">Commercial Outcome</div>
        </div>
        {[
          {
            matter: '2025 ComLit team revenue',
            desc: 'Supported Head of Department in leading Commercial Litigation revenue performance',
            outcome: 'USD 300,000+ in departmental revenue in 2025',
          },
          {
            matter: 'OPay relationship',
            desc: 'Grew from narrow garnishee-focused instructions into a broader strategic client account',
            outcome: 'USD 60,000+ revenue in 2025; USD 15,000 in 2026 YTD',
          },
          {
            matter: 'Project Compass – Ecobank Litigation Portfolio Audit',
            desc: 'Led the Ecobank portfolio audit mandate from origination to delivery',
            outcome: '₦25 million in fees generated',
          },
          {
            matter: 'AGTF / Sony advisory',
            desc: 'Legal advisory and support services',
            outcome: 'USD 10,000 per client; USD 20,000 combined',
          },
          { matter: 'Multitan advisory', desc: 'Legal support and advisory services', outcome: '₦8 million in fees' },
          {
            matter: 'Axa Mansard advisory',
            desc: 'Led Commercial Litigation team on advisory mandate',
            outcome: '₦6 million in fees',
          },
          {
            matter: 'Baker Hughes – General Hydrocarbons & First Bank',
            desc: 'Led the Baker Hughes team on two major instructions',
            outcome: '₦20 million in fees across both matters',
          },
          {
            matter: 'AMCON portfolio management',
            desc: 'Managed AMCON portfolio across multiple recovery matters since 2024',
            outcome: '₦75 million+ in cumulative recovery professional fees',
          },
          {
            matter: 'Emple arbitration',
            desc: 'Lead team; negotiated and secured professional fee exceeding co-counsel billing',
            outcome: '₦80 million professional fee; ₦20 million above co-counsel billing',
          },
          {
            matter: 'UBA v Epe Resort',
            desc: 'Led team to a major reduction in client obligations and amicable settlement',
            outcome: '₦2 billion+ in client savings preserved',
          },
          {
            matter: 'Receivables clean-up (2023–2024)',
            desc: 'Led clean-up of aged receivables previously unbilled or unsupported',
            outcome: 'Improved practice financial position; material cash recovery',
          },
          {
            matter: 'Targeted proposals',
            desc: 'Led proposals to OPay, TotalEnergies CPFA and Ecobank',
            outcome: 'Instructions secured from all three clients',
          },
        ].map(({ matter, desc, outcome }, i) => (
          <div
            key={i}
            className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}
          >
            <div className="col-span-3 px-3 py-2 font-bold text-[#211B1B]">{matter}</div>
            <div className="col-span-5 px-3 py-2 text-[#211B1B]/60">{desc}</div>
            <div className="col-span-4 px-3 py-2 font-black text-[#E80000]">{outcome}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Page 6 — Market Visibility, Institutional Contribution, Summary
export const PersonalCaseContinued = () => (
  <div className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
    <BG />
    <div className="flex items-center gap-3 mb-5 relative z-10">
      <div className="w-1 h-10 bg-[#E80000]"></div>
      <div>
        <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 2 – Continued</p>
        <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">
          Personal Case, Commercial Impact &amp; Contributions
        </h2>
      </div>
    </div>
    <div className="relative z-10 flex flex-col gap-5 text-xs leading-relaxed">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">
          Market Visibility &amp; Professional Positioning
        </p>
        <p className="text-[#211B1B]/70 text-justify mb-3">
          In addition to revenue generation and mandate execution, I have made deliberate efforts to strengthen my
          professional standing within the disputes ecosystem in ways that support both my own practice development and
          the Firm's wider market visibility. I am an active member of INSOL International, BRIPAN, NICArb, ICMC, Young
          ICCA, ITA and the NBA-SBL. These affiliations are not merely professional adornments; they are part of a
          deliberate effort to remain embedded in the communities that shape arbitration, restructuring, insolvency and
          cross-border disputes work, and to position the Firm more credibly within those networks.
        </p>
        <div className="space-y-2">
          {[
            'INSOL Future Leader of Nigeria',
            'Award of Excellence from the Nigerian Institute of Chartered Arbitrators for contributions to debt recovery, insolvency and arbitration practice',
            'Served as Arbitrator on ₦170 million three-member tribunal alongside Senior Advocates of Nigeria',
            'Active participation in London International Disputes Week',
            'Cultivation of relationships with partners/senior associates in Magic Circle and Silver Circle firms',
          ].map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E80000] shrink-0"></div>
              <p className="text-[#211B1B]/65 text-[10px]">{p}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">
          Institutional Contribution &amp; Team Development
        </p>
        <p className="text-[#211B1B]/70 text-justify mb-3">
          My contribution to the Firm extends beyond my individual matters and client relationships. I provide technical
          and strategic training to associates within the CLDR team, particularly in areas relating to commercial
          arbitration and enforcement, with a view to strengthening the team's ability to manage multiple high-stakes
          mandates effectively. I also serve on the Editorial Board and participate actively in the Graduate and
          Associate Recruitment and Human Resources Committees, which gives me a broader role in shaping the Firm's
          knowledge standards, talent pipeline and institutional development.
        </p>
        <p className="text-[#211B1B]/70 text-justify mb-3">
          I work closely with colleagues across Corporate, Finance and Energy to identify dispute risks arising from
          transactions and to encourage earlier dispute-related engagement where this can improve outcomes for clients
          and strengthen the Firm's retention of disputes work. I also contribute to the Firm's thought leadership and
          client knowledge products, not only to ensure technical quality, but also to support the use of those outputs
          as practical business development tools. In addition, I have participated in internal business development
          discussions and strategic initiatives aimed at expanding international workstreams, improving referral
          opportunities and strengthening the CLDR practice as a more structured and commercially aligned platform.
        </p>
      </div>

      <div className="bg-[#211B1B]/5 border-l-4 border-[#E80000] p-5 rounded-r-xl">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">Summary Statement</p>
        <p className="text-[#211B1B]/75 text-justify leading-relaxed">
          Taken together, my experience at Jackson, Etti &amp; Edu demonstrates a combination of leadership, commercial
          impact, market positioning and institutional contribution that provides a credible foundation for Project
          Fortify. I have shown the ability to translate disputes expertise into business results, to deepen and expand
          client relationships, to engage meaningfully within the wider disputes ecosystem, and to contribute to the
          development of the Firm beyond my own practice. Project Fortify is intended to build on these foundations by
          providing a structured framework for converting those capabilities into a repeatable, scalable and
          revenue-driven disputes platform. In that sense, this proposal is not a departure from the work I have already
          been doing. It is the next and more deliberate stage of it.
        </p>
      </div>
    </div>
  </div>
);
