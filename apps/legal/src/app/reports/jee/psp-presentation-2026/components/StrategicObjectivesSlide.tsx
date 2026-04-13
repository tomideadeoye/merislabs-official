import { JEE_WEBSITE_URL } from '../../constants';

const objectives = [
  {
    n: '1',
    obj: 'Transform the CLDR practice into a more structured, proactive and client-originating disputes platform.',
  },
  { n: '2', obj: 'Build three commercially coherent and mutually reinforcing disputes platforms within the practice.' },
  {
    n: '3',
    obj: "Strengthen the Firm's visibility, credibility and competitive positioning through clearer offerings, thought leadership, ecosystem engagement and specialist credentialing.",
  },
  {
    n: '4',
    obj: "Deepen institutional client relationships and expand the Firm's capture of disputes mandates from existing and prospective clients.",
  },
  {
    n: '5',
    obj: "Improve internal alignment between CLDR and the Firm's sector teams so that dispute risks are identified earlier and mandates are retained more consistently.",
  },
  {
    n: '6',
    obj: 'Develop a more visible and credible platform for higher-value arbitration and cross-border work, including foreign currency-denominated mandates.',
  },
  {
    n: '7',
    obj: 'Generate USD 500,000 in annual attributable incremental revenue by the end of the 24-month Partnership Selection Programme cycle.',
  },
];

const StrategicObjectivesSlide = () => (
  <div
    id="strategic-objectives"
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
      <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Strategic Objectives</span>
    </div>

    <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-6">
      {/* Left: Intro */}
      <div className="col-span-4 flex flex-col justify-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">05</span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
          Seven
          <br />
          <span className="text-red-600">Objectives</span>
        </h2>
        <p className="text-[8px] text-[#211B1B]/50 leading-relaxed border-l-2 border-red-600/20 pl-3">
          Project Fortify is designed to achieve a set of interrelated strategic objectives that strengthen the CLDR
          practice as both a revenue-generating business platform and a core component of the Firm&apos;s wider
          sector-focused strategy.
        </p>
        <div className="bg-[#211B1B] rounded-lg p-4 mt-2">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-1">Strategic Outcome</p>
          <p className="text-white/70 text-justify text-[7px] leading-relaxed">
            At full deployment, Project Fortify will convert CLDR from a practice group into a repeatable business model
            — one that originates its own work, delivers predictable revenues, and cements JEE&apos;s position as a
            market leader in commercial litigation, arbitration, and enforcement across Nigeria and beyond.
          </p>
        </div>
      </div>

      {/* Right: Objectives */}
      <div className="col-span-8 flex flex-col justify-center">
        <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[7px] font-black uppercase tracking-widest">
            <div className="col-span-1 px-3 py-2">#</div>
            <div className="col-span-11 px-3 py-2">Objective</div>
          </div>
          {objectives.map(({ n, obj }, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 border-t border-[#211B1B]/8 ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}
            >
              <div className="col-span-1 px-3 py-2.5 font-black text-[#E80000] text-xs">{n}</div>
              <div className="col-span-11 px-3 py-2.5 text-[#211B1B]/75 text-[8px] leading-relaxed">{obj}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
  </div>
);

export default StrategicObjectivesSlide;
