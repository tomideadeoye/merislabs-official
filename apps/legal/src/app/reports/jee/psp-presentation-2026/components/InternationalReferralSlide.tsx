import { JEE_WEBSITE_URL } from '../../constants';

const foundations = [
  {
    n: '1',
    title: 'Existing & Developing International Relationships',
    desc: 'Contacts cultivated through LIDW, London Arbitration Week, INSOL International Conference. Reinforced by the IR3 UK initiative through structured relationship development, opportunity identification, follow-up and conversion.',
  },
  {
    n: '2',
    title: 'Specialist Arbitration Visibility & Credibility',
    desc: 'Strengthening through targeted professional participation, credentials (CIArb Fellowship, NICArb, LCA panel appointments) and thought leadership published on international platforms (Kluwer, CIArb journals).',
  },
  {
    n: '3',
    title: 'Clear Capability Materials & Referral Structures',
    desc: 'Dedicated international disputes capability note for the CLDR practice, targeted circulation in relevant forums, and development of referral understandings with selected international firms where there is sufficient alignment in trust, market focus and opportunity.',
  },
];

const InternationalReferralSlide = () => (
  <div
    id="international-referral"
    className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]"
  >
    <div className="absolute top-10 left-12 right-12 z-50 flex items-center space-x-4 border-b border-[#211B1B]/10 pb-5">
      <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
        <img
          src="/clients/jackson etti and edu logo (1).png"
          alt="JEE"
          className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
        />
      </a>
      <div className="h-3 w-px bg-[#211B1B]/20" />
      <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">
        International Referral Architecture
      </span>
    </div>

    <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-6">
      {/* Left: IR3 UK */}
      <div className="col-span-4 flex flex-col justify-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">07</span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
          IR3 UK
          <br />
          <span className="text-red-600">Initiative</span>
        </h2>
        <div className="bg-[#211B1B]/5 border-l-4 border-[#E80000] p-4 rounded-r-xl">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">
            International Referrals Strategy
          </p>
          <p className="text-[#211B1B]/70 text-justify text-[8px] leading-relaxed">
            Led by the candidate, the IR3 UK initiative is a structured international referrals strategy focused on
            deepening relationships with selected UK and international law firms and converting those relationships into
            Nigerian mandates and sustained engagements.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {[
            { label: 'Target Firms', value: 'Magic Circle & Silver Circle; INSOL network; LIDW contacts' },
            { label: 'Year 1 Target', value: '1 MOU signed with UK disputes firm' },
            { label: 'Year 2 Target', value: '2+ MOUs; first FX-denominated referral instruction' },
          ].map(({ label, value }) => (
            <div key={label} className="border border-[#211B1B]/10 rounded-lg p-2.5">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#211B1B]/30 mb-0.5">{label}</p>
              <p className="text-[9px] font-bold text-[#211B1B]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Three Foundations */}
      <div className="col-span-8 flex flex-col justify-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">07</span>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
          Three Foundations of the
          <br />
          <span className="text-red-600">Referral Architecture</span>
        </h2>
        <div className="space-y-2.5">
          {foundations.map(({ n, title, desc }) => (
            <div key={n} className="flex gap-3 items-start border border-[#211B1B]/8 rounded-lg p-3">
              <div className="w-6 h-6 rounded-full bg-[#E80000]/10 border border-[#E80000]/20 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-black text-[#E80000]">{n}</span>
              </div>
              <div>
                <p className="font-black text-[#211B1B] text-[9px] mb-1">{title}</p>
                <p className="text-[#211B1B]/60 text-justify text-[8px] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
  </div>
);

export default InternationalReferralSlide;
