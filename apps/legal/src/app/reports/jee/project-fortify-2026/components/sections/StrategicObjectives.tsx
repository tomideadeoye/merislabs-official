import React from 'react';

export const StrategicObjectives: React.FC = () => {
  const objectives = [
    {
      id: 1,
      title: 'Transform the CLDR practice',
      description: 'Transform the CLDR practice into a more structured, proactive and client-originating disputes platform'
    },
    {
      id: 2,
      title: 'Build three platforms',
      description: 'Build three commercially coherent and mutually reinforcing disputes platforms within the practice'
    },
    {
      id: 3,
      title: 'Strengthen visibility',
      description: "Strengthen the Firm's visibility, credibility and competitive positioning through clearer offerings, thought leadership, ecosystem engagement and specialist credentialing"
    },
    {
      id: 4,
      title: 'Deepen client relationships',
      description: "Deepen institutional client relationships and expand the Firm's capture of disputes mandates from existing and prospective clients"
    },
    {
      id: 5,
      title: 'Improve internal alignment',
      description: 'Improve internal alignment between CLDR and the Firm\'s sector teams so that dispute risks are identified earlier and mandates are retained more consistently'
    },
    {
      id: 6,
      title: 'Develop arbitration platform',
      description: 'Develop a more visible and credible platform for higher-value arbitration and cross-border work, including foreign currency-denominated mandates'
    },
    {
      id: 7,
      title: 'Generate revenue',
      description: 'Generate USD 500,000 in annual attributable incremental revenue by the end of the 24-month Partnership Selection Programme cycle through optimal income generation from current clients and files, and securing mandates from new clients.'
    }
  ];

  return (
    <section className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
      <h2 className="text-3xl font-serif text-[#1a1a1a] mb-6 border-b-2 border-[#800020] pb-2">
        5. Strategic Objectives
      </h2>
      
      <div className="space-y-4 text-gray-700 leading-relaxed font-light text-[11px]">
        <p className="mb-4">
          Project Fortify is designed to achieve a set of interrelated strategic objectives that strengthen the Commercial Litigation & Dispute Resolution practice as both a revenue-generating business platform and a core component of the Firm's wider sector-focused strategy.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] text-white">
                <th className="p-2 text-left w-10">No.</th>
                <th className="p-2 text-left w-36">Objective</th>
                <th className="p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {objectives.map((obj) => (
                <tr key={obj.id} className={obj.id % 2 === 0 ? 'border-b border-gray-200 bg-white' : 'border-b border-gray-200 bg-gray-50'}>
                  <td className="p-2 font-medium w-10 align-top">{obj.id}</td>
                  <td className="p-2 font-medium w-36 align-top">{obj.title}</td>
                  <td className="p-2 align-top">{obj.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-[#1a1a1a] text-white rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-widest text-[#800020]">Primary Target</p>
              <p className="text-3xl font-bold mt-1">USD 500,000</p>
              <p className="text-[9px] mt-0.5">Incremental Annual Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-widest text-[#800020]">Timeline</p>
              <p className="text-3xl font-bold mt-1">24 Months</p>
              <p className="text-[9px] mt-0.5">Partnership Selection Programme</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-widest text-[#800020]">Objectives</p>
              <p className="text-3xl font-bold mt-1">7</p>
              <p className="text-[9px] mt-0.5">Strategic Pillars</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};