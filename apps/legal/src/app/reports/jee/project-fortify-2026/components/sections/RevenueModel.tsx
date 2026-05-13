import React from 'react';

export const RevenueModel: React.FC = () => {
  const platform1 = [
    { mandate: 'NPL portfolio recovery mandates / Receivership / insolvency appointments', matters: '3–4', avgFee: '15,000–25,000', revenue: '45,000–100,000', notes: '1. AMCON (with potential to bill for over N30m)\n2. Moses Asaga v Advanced Coating (with potential to bill about N30m)\n3. Pressure Controls v Eroton (potential to bill over N50m upon recovery)' },
    { mandate: 'Enforcement & collateral realisation matters', matters: '2–3', avgFee: '10,000–15,000', revenue: '20,000–45,000', notes: '' },
    { mandate: 'Creditor advisory / restructuring retainers', matters: '2–4', avgFee: '8,000–12,000', revenue: '16,000–36,000', notes: '' }
  ];

  const platform2 = [
    { mandate: 'Commercial contract disputes', matters: '4–8', avgFee: '15,000–25,000', revenue: '60,000–200,000', notes: '1. Baker Hughes v Trexim (Potential to bill up to 20m)\n2. Moniepoint v OPay (Potential to bill around N20m)\n3. Opay v Fairmoney (Potential to bill about 15m)' },
    { mandate: 'Shareholder / governance disputes', matters: '1–2', avgFee: '5,000–15,000', revenue: '5,000–30,000', notes: '' },
    { mandate: 'Cross-practice referral mandates', matters: '2–3', avgFee: '10,000–15,000', revenue: '20,000–45,000', notes: '' }
  ];

  const platform3 = [
    { mandate: 'International arbitration (co-counsel)', matters: '1–2', avgFee: '15,000–50,000', revenue: '15,000–100,000', notes: '' },
    { mandate: 'Domestic arbitration (NCIA/LCA)', matters: '2–4', avgFee: '10,000–30,000', revenue: '20,000–120,000', notes: 'Current:\n1. Emple Arbitration (billed 40M, to bill 40M)\n2. Chorus Arbitration (potential to bill over N100 in success fees)' },
    { mandate: 'Cross-border award enforcement', matters: '1–2', avgFee: '10,000–25,000', revenue: '10,000–50,000', notes: '' }
  ];

  const revenueProjection = [
    { platform: 'Platform 1 — Institutional Debt Recovery, Insolvency & Enforcement', year1: '100,000', year2: '220,000', year2Stretch: '300,000' },
    { platform: 'Platform 2 — Commercial Disputes', year1: '80,000', year2: '160,000', year2Stretch: '220,000' },
    { platform: 'Platform 3 — Arbitration', year1: '50,000', year2: '120,000', year2Stretch: '200,000' }
  ];

  return (
    <section className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
      <h2 className="text-3xl font-serif text-[#1a1a1a] mb-6 border-b-2 border-[#800020] pb-2">
        10. Bottom-Up Revenue Model & Financial Projections
      </h2>

      <div className="space-y-4 text-gray-700 leading-relaxed font-light text-sm">
        <p className="mb-4">
          A critical strength of Project Fortify is that its revenue ambition is not based on abstract growth assumptions, but on a bottom-up view of the types of mandates the practice is positioned to originate, convert and retain across its three core platforms. The financial model is therefore designed to show how the target of USD 500,000 in annual attributable incremental revenue can be achieved through a realistic combination of (a) institutional recovery work, (b) commercial disputes and (c) arbitration and cross-border enforcement mandates.
        </p>

        <div className="bg-[#800020]/10 p-3 rounded-lg mb-4">
          <h3 className="font-semibold text-[#1a1a1a] mb-2">PROJECT FORTIFY ANCHOR: EXISTING MATTERS</h3>
          <p className="text-xs">
            The revenue projections across all three platforms are not built on speculative new origination alone but firmly anchored on the Practice's existing active mandate base. This includes the ongoing AMCON debt recovery portfolio, three high-value USD-denominated enforcement matters currently in execution, a pipeline of commercial enforcement matters at various stages, and arbitration matters that are positioned to progress to the award and enforcement stages where further billing will become due. The fees generated from these existing matters during the 24-month programme cycle will form a solid baseline contribution, with new origination activity building incrementally on this foundation.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">PROJECTED REVENUE BUILD-UP BY PLATFORM</h3>

        <div>
          <h4 className="font-semibold text-[#1a1a1a] mb-2">Platform 1 — Institutional Debt Recovery, Insolvency & Enforcement</h4>
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
                {platform1.map((row, idx) => (
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
          <p className="text-sm font-bold text-[#1a1a1a] mt-1">Platform 1 Total: USD 81,000 – 193,000</p>
        </div>
      </div>
    </section>
  );
};