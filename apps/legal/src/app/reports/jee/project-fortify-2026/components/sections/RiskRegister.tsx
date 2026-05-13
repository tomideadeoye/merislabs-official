import React from 'react';

export const RiskRegister: React.FC = () => {
  const getSeverityColor = (level: string) => {
    if (level === 'HIGH') return 'bg-red-600 text-white';
    if (level === 'MEDIUM') return 'bg-amber-500 text-white';
    return 'bg-yellow-400 text-gray-900';
  };

  const risks = [
    { risk: 'Key-person dependency: plan is architected around candidate\'s relationships and profile', likelihood: 'Low', impact: 'High', level: 'MEDIUM', mitigation: 'Institutionalise relationships through team engagement. All key client relationships to involve at least one other CLDR team member. Document pipeline in CRM.' },
    { risk: 'Fee collection failure: bad debt provision reached 17% in 2025', likelihood: 'Medium', impact: 'High', level: 'HIGH', mitigation: 'Implement collection protocols in Section 11. Retainer structures for institutional clients. Monthly debtor review. Client creditworthiness screening at intake.' },
    { risk: 'Market competition: Tier-1 firms intensify pursuit of institutional recovery mandates', likelihood: 'Medium', impact: 'Medium', level: 'MEDIUM', mitigation: 'Differentiate through productised offerings, INSOL/BRIPAN credentialing, and speed-to-mandate advantage. Target mid-tier banks and FMCG corporates underserved by larger firms.' },
    { risk: 'Budget constraint: reduced BD budget limits conference attendance and thought leadership', likelihood: 'Low-Medium', impact: 'Medium', level: 'MEDIUM', mitigation: 'Prioritise LIDW and INSOL as non-negotiable international events. Phase domestic activities. Seek co-sponsorship with practice groups.' },
    { risk: 'Macroeconomic deterioration: NGN devaluation or recession reduces legal spend', likelihood: 'Low', impact: 'Medium', level: 'LOW-MEDIUM', mitigation: 'USD-denominated revenue provides partial hedge. Economic stress typically increases litigation and recovery volumes — CLDR is a counter-cyclical practice area.' },
    { risk: 'Court inefficiency: Nigerian court delays impede milestone billing', likelihood: 'High', impact: 'Medium', level: 'MEDIUM', mitigation: 'Maintain strong procedural familiarity and efficient court-facing processes in priority jurisdictions. Prioritise arbitration and out-of-court settlement tracks. Milestone billing minimises dependency on court timetables. Garnishee and enforcement workstreams less affected.' },
    { risk: 'Talent attrition: key Associates depart mid-programme', likelihood: 'Medium', impact: 'Medium', level: 'MEDIUM', mitigation: 'Structured mentorship and development path. Team members named on key mandates. Engage HR committee on competitive compensation benchmarking.' },
    { risk: 'Conflict of interest: creditor-side mandates create conflicts in debtor-side disputes', likelihood: 'Medium', impact: 'Low-Medium', level: 'LOW-MEDIUM', mitigation: 'Maintain formal conflict-checking protocols. Identify in advance which financial institution relationships are creditor-only. Build separate debtor-advisory capacity for FMCG and energy clients.' }
  ];

  return (
    <section className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
      <h2 className="text-3xl font-serif text-[#1a1a1a] mb-6 border-b-2 border-[#800020] pb-2">
        Risk Register
      </h2>

      <div className="space-y-3 text-gray-700 leading-relaxed font-light text-[10px]">
        <div className="grid grid-cols-1 gap-3">
          {risks.map((r, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-medium text-gray-900 leading-tight flex-grow">{r.risk}</span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${getSeverityColor(r.level)}`}>
                  {r.level}
                </span>
              </div>
              <div className="flex gap-4 mb-2 text-[9px]">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Likelihood:</span>
                  <span className="font-medium">{r.likelihood}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Impact:</span>
                  <span className="font-medium">{r.impact}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gray-600 leading-snug">{r.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};