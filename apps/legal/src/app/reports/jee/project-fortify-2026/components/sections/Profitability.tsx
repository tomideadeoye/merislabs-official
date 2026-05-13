import React from 'react';

export const Profitability: React.FC = () => {
  const profitabilityData = [
    { metric: 'Revenue', 2023: '₦695M', 2024: '₦1,134M', 2025: '₦934M (annualised ~₦1.12B)', target: '₦800M+ (CLDR-attributed)' },
    { metric: 'Bad Debt Provision', 2023: '4%', 2024: '8%', 2025: '17%', target: '< 3%' },
    { metric: 'Personnel Cost', 2023: '58%', 2024: '52%', 2025: '64%', target: '< 40%' },
    { metric: 'Marketing / BD Spend', 2023: '9%', 2024: '12%', 2025: '12%', target: 'Structured (see Section 9)' },
    { metric: 'Net Profit Margin', 2023: '-9%', 2024: '7%', 2025: '-14%', target: '≥ 30%' }
  ];

  const collectionProtocols = [
    { protocol: 'Client creditworthiness screening', detail: 'Financial and reputational due diligence on all new clients before engagement, particularly institutional recovery clients who may themselves be in financial distress', outcome: 'Reduce write-off risk at intake' },
    { protocol: 'Engagement letter clarity', detail: 'All engagement letters to specify billing milestones, payment terms (30 days), interest on late payments and right to suspend services on non-payment', outcome: 'Contractual collection basis' },
    { protocol: 'Milestone billing for litigation', detail: 'Bill at defined procedural stages (pleadings complete, hearing concluded, award/judgment, enforcement) rather than accumulating open WIP', outcome: 'Reduce lock-up; eliminate silent write-offs' },
    { protocol: 'Retainer structures', detail: 'Negotiate annual or quarterly retainers with Tier-1 bank clients for recovery advisory services', outcome: 'Predictable inflows; < 3% bad debt target' },
    { protocol: 'Monthly WIP review', detail: 'HOD/Team Lead to review aged WIP and debtors monthly; escalate matters > 90 days unpaid; assign relationship partner responsibility for collection on each matter', outcome: 'Active management; no silent write-offs' },
    { protocol: 'FX invoicing', detail: 'All international arbitration and cross-border mandates invoiced in USD; engagement letters to specify FX billing basis', outcome: 'Protects margin; reduces Naira erosion' }
  ];

  return (
    <section className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
      <h2 className="text-3xl font-serif text-[#1a1a1a] mb-6 border-b-2 border-[#800020] pb-2">
        11. Profitability, Leverage and Fee Collection
      </h2>

      <div className="space-y-4 text-gray-700 leading-relaxed font-light text-sm">
        <p className="mb-4">
          A key commercial premise of Project Fortify is that growth in disputes revenue must also translate into stronger profitability, better leverage and more disciplined fee collection. It is not enough for the practice to originate more work if that work is not priced properly, staffed efficiently, billed in a timely manner and converted into cash with reasonable discipline.
        </p>

        <div>
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Profitability Context</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-2 text-left">Metric</th>
                  <th className="p-2 text-center">2023 Actual</th>
                  <th className="p-2 text-center">2024 Actual</th>
                  <th className="p-2 text-center">2025 (10 months)</th>
                  <th className="p-2 text-center">Fortify Target (Year 2)</th>
                </tr>
              </thead>
              <tbody>
                {profitabilityData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'border-b border-gray-200' : 'border-b border-gray-200 bg-gray-50'}>
                    <td className="p-2 font-medium">{row.metric}</td>
                    <td className="p-2 text-center">{row[2023]}</td>
                    <td className="p-2 text-center">{row[2024]}</td>
                    <td className="p-2 text-center">{row[2025]}</td>
                    <td className="p-2 text-center font-bold text-[#1a1a1a]">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Billing Discipline and Fee Collection Protocols</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-2 text-left">Protocol</th>
                  <th className="p-2 text-left">Protocol Detail</th>
                  <th className="p-2 text-left">Target Outcome</th>
                </tr>
              </thead>
              <tbody>
                {collectionProtocols.map((protocol, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'border-b border-gray-200' : 'border-b border-gray-200 bg-gray-50'}>
                    <td className="p-2 font-medium">{protocol.protocol}</td>
                    <td className="p-2 text-gray-600">{protocol.detail}</td>
                    <td className="p-2 text-gray-600">{protocol.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-gray-500 italic">
          These protocols are intended to ensure that Project Fortify improves the quality and frequency of billed revenue, as well as early collection.
        </p>
      </div>
    </section>
  );
};