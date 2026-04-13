import { JEE_WEBSITE_URL } from '../../constants';

const team = [
  {
    level: 'Partner Candidate',
    current: '1 (pending PSP)',
    target: '1',
    contribution: 'Origination, supervision, strategic mandates',
  },
  {
    level: 'Senior Associate',
    current: '2',
    target: '2',
    contribution: 'Primary billing layer; complex mandates; client-facing execution',
  },
  {
    level: 'Associate',
    current: '1',
    target: '4',
    contribution: 'Volume billing; portfolio management, enforcement, research',
  },
  {
    level: 'Trainee Associate',
    current: '1',
    target: '2',
    contribution: 'Volume billing; portfolio management, enforcement, research',
  },
  {
    level: 'Arbitration Specialist',
    current: 'Developing',
    target: '1–2 experts',
    contribution: 'Higher-value arbitration and cross-border matters',
  },
  {
    level: 'Litigation Officer / Paralegal',
    current: 'Existing',
    target: '1',
    contribution: 'Process work, enforcement execution, court filings; highest utilisation ratio',
  },
];

const kmItems = [
  { init: 'Litigation Precedent Bank', date: 'Month 3 (Jun 2026)' },
  { init: 'Matter Timeline & Cost Tracking', date: 'Month 4 (Jul 2026)' },
  { init: 'Case Law Repository', date: 'Month 6 (Sep 2026)' },
  { init: 'Capacity Statement Library', date: 'Month 2 (May 2026)' },
  { init: 'Client Satisfaction Protocol', date: 'Month 6 (Sep 2026)' },
  { init: 'Digital Knowledge Hub', date: 'Month 6 (Sep 2026)' },
];

const TeamDevelopmentSlide = () => (
  <div id="team-development" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
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
        Team Development & Practice Capacity
      </span>
    </div>

    <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-6">
      {/* Left: Team Architecture */}
      <div className="col-span-7 flex flex-col gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">08</span>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
          Team
          <br />
          <span className="text-red-600">Architecture</span>
        </h2>
        <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[7px] font-black uppercase tracking-widest">
            <div className="col-span-3 px-2 py-2">Level</div>
            <div className="col-span-1 px-2 py-2">Now</div>
            <div className="col-span-1 px-2 py-2">2028</div>
            <div className="col-span-7 px-2 py-2">Revenue Contribution</div>
          </div>
          {team.map(({ level, current, target, contribution }, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[8px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}
            >
              <div className="col-span-3 px-2 py-2 font-black text-[#211B1B]">{level}</div>
              <div className="col-span-1 px-2 py-2 text-[#211B1B]/50">{current}</div>
              <div className="col-span-1 px-2 py-2 font-black text-[#E80000]">{target}</div>
              <div className="col-span-7 px-2 py-2 text-[#211B1B]/60 leading-relaxed">{contribution}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-[#211B1B]/10 rounded-lg p-3">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-1">Insolvency Pathway</p>
            <p className="text-[#211B1B]/60 text-[7px] leading-relaxed">
              INSOL Global Insolvency Practice Course; BRIPAN Fellowship Programme; active participation in AMCON and
              NPL portfolio work.
            </p>
          </div>
          <div className="border border-[#211B1B]/10 rounded-lg p-3">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-1">Arbitration Pathway</p>
            <p className="text-[#211B1B]/60 text-[7px] leading-relaxed">
              CIArb Fellowship; Young ICCA and ITA; LCA and NICArb panel appointments; publication in international
              arbitration platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Knowledge Management */}
      <div className="col-span-5 flex flex-col gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">08</span>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
          Knowledge
          <br />
          <span className="text-red-600">Management</span>
        </h2>
        <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden flex-1">
          <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[7px] font-black uppercase tracking-widest">
            <div className="col-span-7 px-2 py-2">Initiative</div>
            <div className="col-span-5 px-2 py-2">Target Date</div>
          </div>
          {kmItems.map(({ init, date }, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[8px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}
            >
              <div className="col-span-7 px-2 py-2 font-black text-[#211B1B]">{init}</div>
              <div className="col-span-5 px-2 py-2 font-black text-[#E80000]">{date}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#211B1B]/5 border border-[#211B1B]/10 rounded-lg p-3">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-1">
            Team Leverage Target
          </p>
          <p className="text-[#211B1B]/70 text-justify text-[7px] leading-relaxed">
            At full staffing, the practice is expected to operate at an approximate associate-to-partner leverage ratio
            of 4:1 at current team size, moving toward 6:1 as the practice scales toward its 2028 target.
          </p>
        </div>
      </div>
    </div>

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
  </div>
);

export default TeamDevelopmentSlide;
