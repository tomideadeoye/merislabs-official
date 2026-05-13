import React from 'react';

export const RevenueModelCont: React.FC = () => {
  const platform2 = [
    { mandate: 'Commercial contract disputes (corporate clients)', matters: '4–8', avgFee: '15,000–25,000', revenue: '60,000–200,000', notes: '1. Baker Hughes v Trexim (Potential to bill up to N20m)\n2. Moniepoint v OPay (Potential to bill around N20m)\n3. Opay v Fairmoney (Potential to bill about N15m)' },
    { mandate: 'Shareholder / corporate governance disputes', matters: '1–2', avgFee: '5,000–15,000', revenue: '5,000–30,000', notes: '' },
    { mandate: 'Cross-practice referral mandates (internal)', matters: '2–3', avgFee: '10,000–15,000', revenue: '20,000–45,000', notes: '' }
  ];

  const platform3 = [
    { mandate: 'International arbitration (co-counsel / referral)', matters: '1–2', avgFee: '15,000–50,000', revenue: '15,000–100,000', notes: '' },
    { mandate: 'Domestic arbitration (NCIA / LCA panel matters)', matters: '2–4', avgFee: '10,000–30,000', revenue: '20,000–120,000', notes: 'Current:\n1. Emple Arbitration (billed N40M, to bill N40M)\n2. Chorus Arbitration (potential to bill over N100M in success fees)' },
    { mandate: 'Cross-border award enforcement', matters: '1–2', avgFee: '10,000–25,000', revenue: '10,000–50,000', notes: '' }
  ];

  const revenueProjection = [
    { platform: 'Platform 1 — Institutional Recovery & Enforcement', year1: 'USD 100,000', year2: 'USD 220,000', year2Stretch: 'USD 300,000' },
    { platform: 'Platform 2 — Commercial & Shareholder Disputes', year1: 'USD 80,000', year2: 'USD 160,000', year2Stretch: 'USD 220,000' },
    { platform: 'Platform 3 — Arbitration & Cross-Border', year1: 'USD 50,000', year2: 'USD 120,000', year2Stretch: 'USD 200,000' }
  ];

const feeStructure = [
    { platform: 'Platform 1', primary: 'Fixed fee per portfolio tier (productised)', secondary: 'Success fee (5–15% of recovery) for key mandates', rationale: 'Predictable revenue flow; aligns incentives with banks\' recovery outcomes' },
    { platform: 'Platform 2', primary: 'Hourly / blended rate for litigation', secondary: 'Retainer for ongoing advisory relationships', rationale: 'Matches complexity billing; retainers provide pipeline visibility' },
    { platform: 'Platform 3', primary: 'USD-denominated hourly / lump sum', secondary: 'Co-counsel fee-split arrangements', rationale: 'FX protection and international rate parity; referral arrangements formalise pipeline' }
  ];

  return (
    <section className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
      <div className="space-y-4 text-gray-700 leading-relaxed font-light text-sm">
        <div>
          <h4 className="font-semibold text-[#1a1a1a] mb-2">Platform 2 — Commercial Disputes</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-2 text-left">Mandate Type</th>
                  <th className="p-2 text-center">Est. Matters (Year 1 & 2)</th>
                  <th className="p-2 text-center">Avg. Fee (USD)</th>
                  <th className="p-2 text-center">Platform Revenue (USD)</th>
                </tr>
              </thead>
              <tbody>
                {platform2.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'border-b border-gray-200' : 'border-b border-gray-200 bg-gray-50'}>
                    <td className="p-2">
                      <div>{row.mandate}</div>
                      {row.notes && <div className="text-[10px] text-gray-500 mt-1 italic whitespace-pre-line">{row.notes}</div>}
                    </td>
                    <td className="p-2 text-center">{row.matters}</td>
                    <td className="p-2 text-center">{row.avgFee}</td>
                    <td className="p-2 text-center font-medium">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm font-bold text-[#1a1a1a] mt-1">Platform 2 Total: USD 85,000 – 275,000</p>
        </div>

        <div>
          <h4 className="font-semibold text-[#1a1a1a] mb-2">Platform 3 — Arbitration</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-2 text-left">Mandate Type</th>
                  <th className="p-2 text-center">Est. Matters (Year 1 & 2)</th>
                  <th className="p-2 text-center">Avg. Fee (USD)</th>
                  <th className="p-2 text-center">Platform Revenue (USD)</th>
                </tr>
              </thead>
              <tbody>
                {platform3.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'border-b border-gray-200' : 'border-b border-gray-200 bg-gray-50'}>
                    <td className="p-2">
                      <div>{row.mandate}</div>
                      {row.notes && <div className="text-[10px] text-gray-500 mt-1 italic whitespace-pre-line">{row.notes}</div>}
                    </td>
                    <td className="p-2 text-center">{row.matters}</td>
                    <td className="p-2 text-center">{row.avgFee}</td>
                    <td className="p-2 text-center font-medium">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm font-bold text-[#1a1a1a] mt-1">Platform 3 Total: USD 45,000 – 270,000</p>
        </div>

        <div>
          <h4 className="font-semibold text-[#1a1a1a] mb-2">Consolidated Revenue Projection</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-2 text-left">Platform</th>
                  <th className="p-2 text-center">Year 1 Conservative (2026–27)</th>
                  <th className="p-2 text-center">Year 2 Target (2027–28)</th>
                  <th className="p-2 text-center">Year 2 Stretch</th>
                </tr>
              </thead>
              <tbody>
                {revenueProjection.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'border-b border-gray-200' : 'border-b border-gray-200 bg-gray-50'}>
                    <td className="p-2 font-medium">{row.platform}</td>
                    <td className="p-2 text-center">{row.year1}</td>
                    <td className="p-2 text-center font-bold text-[#1a1a1a]">{row.year2}</td>
                    <td className="p-2 text-center">{row.year2Stretch}</td>
                  </tr>
                ))}
                <tr className="border-b border-gray-200 bg-[#800020]">
                  <td className="p-2 font-bold text-white">TOTAL</td>
                  <td className="p-2 text-center font-bold text-white">USD 230,000</td>
                  <td className="p-2 text-center font-bold text-white">USD 500,000</td>
                  <td className="p-2 text-center font-bold text-white">USD 720,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#1a1a1a] mb-2">Fee Structure by Platform</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-2 text-left">Platform</th>
                  <th className="p-2 text-left">Primary Fee Structure</th>
                  <th className="p-2 text-left">Secondary / Supplementary</th>
                  <th className="p-2 text-left">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((fee, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'border-b border-gray-200' : 'border-b border-gray-200 bg-gray-50'}>
                    <td className="p-2 font-medium">{fee.platform}</td>
                    <td className="p-2">{fee.primary}</td>
                    <td className="p-2">{fee.secondary}</td>
                    <td className="p-2">{fee.rationale}</td>
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