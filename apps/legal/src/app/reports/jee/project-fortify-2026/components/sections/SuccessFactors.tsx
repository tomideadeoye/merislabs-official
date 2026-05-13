import React from 'react';

export const SuccessFactors: React.FC = () => {
  const successFactors = [
    { title: 'Consistent and visible market positioning', desc: 'The disputes market is competitive and relationship-driven; credibility must be built before it can convert', num: 1 },
    { title: 'Effective client and referral conversion', desc: 'Stronger visibility only generates revenue where it is followed by disciplined follow-through actions and conversion activities.', num: 2 },
    { title: 'Internal alignment and referral capture', desc: "A meaningful share of the commercial opportunity lies within the Firm's own extensive, but not fully tapped, client base – Practice and Sector combined.", num: 3 },
    { title: 'Specialist credibility in priority segments', desc: 'In insolvency, restructuring and arbitration, recognised expertise materially affects mandate access', num: 4 },
    { title: 'Delivery discipline and commercial execution', desc: 'Winning mandates is not enough; scope, staffing, billing and collection discipline protect profitability', num: 5 }
  ];

  const kpis = [
    { category: 'Revenue', metric: 'Attributable incremental revenue (USD)', year1: 'USD 300,000+', year2: 'USD 500,000+', frequency: 'Monthly' },
    { category: 'Revenue', metric: 'Net profit margin on CLDR practice', year1: '≥ 15%', year2: '≥ 30%', frequency: 'Quarterly' },
    { category: 'Revenue', metric: 'Bad debt provision as % of revenue', year1: '< 5%', year2: '< 3%', frequency: 'Quarterly' },
    { category: 'Revenue', metric: 'FX-denominated revenue (Platform 3)', year1: 'USD 50,000+', year2: 'USD 100,000+', frequency: 'Quarterly' },
    { category: 'Mandates', metric: 'New mandate instructions — Platform 1', year1: '4–6', year2: '8–12', frequency: 'Monthly' },
    { category: 'Relationships', metric: 'Active institutional relationships maintained', year1: '10+', year2: '15+', frequency: 'Monthly' },
    { category: 'Visibility', metric: 'Thought leadership pieces published', year1: '4+', year2: '6+', frequency: 'Quarterly' },
    { category: 'Visibility', metric: 'Conferences / forum appearances', year1: '5+', year2: '8+', frequency: 'Twice yearly' },
    { category: 'Visibility', metric: 'Speaking roles secured (domestic or international)', year1: '2+', year2: '3+', frequency: 'Twice yearly' },
    { category: 'People', metric: 'Associates with specialist credential pathway commenced', year1: '1–2', year2: '2–3', frequency: 'Annually' }
  ];

  return (
    <section className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
      <h2 className="text-3xl font-serif text-[#1a1a1a] mb-6 border-b-2 border-[#800020] pb-2">
        12. Success Factors, KPIs and Risk Register
      </h2>

      <div className="space-y-4 text-gray-700 leading-relaxed font-light text-[10px]">
        <p className="text-[11px] text-gray-600 mb-4">
          The success of Project Fortify will depend not only on the quality of the underlying strategy, but also on disciplined execution over the life of the programme cycle. In practical terms, this means that the plan must be supported by a clear understanding of the factors most likely to drive success, the indicators by which progress can be measured, and the principal risks that may affect delivery if not actively managed. Project Fortify is therefore intended to operate within a framework that combines commercial ambition with measurable accountability and risk awareness.
        </p>

        <div>
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Critical Success Factors</h3>
          <div className="grid grid-cols-1 gap-2">
            {successFactors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
                <div className="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {factor.num}
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900 text-[11px]">{factor.title}</h4>
                  <p className="text-gray-600 text-[9px] leading-snug mt-0.5">{factor.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Key Performance Indicators</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-1.5 text-left w-20">Category</th>
                  <th className="p-1.5 text-left">Metric</th>
                  <th className="p-1.5 text-center w-16">Year 1</th>
                  <th className="p-1.5 text-center w-16">Year 2</th>
                  <th className="p-1.5 text-center w-20">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((kpi, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'border-b border-gray-200' : 'border-b border-gray-200 bg-gray-50'}>
                    <td className="p-1.5 font-medium">{kpi.category}</td>
                    <td className="p-1.5 text-gray-700">{kpi.metric}</td>
                    <td className="p-1.5 text-center">{kpi.year1}</td>
                    <td className="p-1.5 text-center font-bold text-[#800020]">{kpi.year2}</td>
                    <td className="p-1.5 text-center text-gray-500">{kpi.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessFactors;