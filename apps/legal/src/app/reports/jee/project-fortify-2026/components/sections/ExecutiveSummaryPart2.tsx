import React from 'react';

export const ExecutiveSummaryPart2: React.FC = () => {
  return (
    <section className="bg-white p-16 border border-gray-200 shadow-sm rounded-sm flex-grow flex flex-col">
      <div className="space-y-6 text-gray-700 leading-relaxed font-light text-sm">
        <p>
          <strong>Project Fortify</strong> is designed to deliver <span className="text-[#800020] font-bold">USD 500,000</span> in annual attributable incremental revenue by the end of the 24-month Partnership Selection Programme cycle, an ambitious but credible target that is grounded in identifiable market drivers, including sustained banking sector stress, credit recovery activity, energy sector restructuring, and the continued growth of the fintech and payments ecosystem, in addition to an increasing demand for arbitration and cross-border enforcement work. The Proposal is thus built on real demand conditions that align closely with the Firm's client base, sector priorities and competitive strengths.
        </p>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] text-white p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-[#800020]">Revenue Target</p>
            <p className="text-xl font-bold mt-1">USD 500k</p>
            <p className="text-[9px] mt-0.5">Incremental Annual Revenue</p>
          </div>
          <div className="bg-[#1a1a1a] text-white p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-[#800020]">Cycle</p>
            <p className="text-xl font-bold mt-1">24 Months</p>
            <p className="text-[9px] mt-0.5">Growth Programme</p>
          </div>
          <div className="bg-[#1a1a1a] text-white p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-[#800020]">Platforms</p>
            <p className="text-xl font-bold mt-1">3</p>
            <p className="text-[9px] mt-0.5">Integrated Streams</p>
          </div>
        </div>

        <p className="mt-8">
          Execution will be driven through focused workstreams that convert expertise and relationships into mandates. These include the productisation of dispute offerings, targeted institutional engagement, strategic thought leadership, ecosystem and panel positioning, international referral development and stronger internal referral capture across practice areas. The objective is not merely to increase activity, but to build a repeatable and disciplined origination engine for the practice.
        </p>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg text-white mt-6">
          <p className="text-base font-serif italic">
            Ultimately, Project Fortify is more than a practice growth proposal. It is my business case for how I intend to contribute to the Firm's long-term growth through the development of a stronger disputes platform – one that delivers more predictable revenue, enhances the Firm's standing in priority sectors, deepens institutional client relationships and positions JEE more competitively within the Nigerian and cross-border disputes market. 
          </p>
          <p className="mt-4 text-xs text-gray-400">
            It reflects the kind of Partner I aspire to be within the Firm: commercially minded, institutionally committed, and accountable for building a practice that is both high-performing and enduring.
          </p>
        </div>
      </div>
    </section>
  );
};