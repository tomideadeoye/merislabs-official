import React from 'react';
import { JEEHeader } from '../Header';

export const FinancialRequirements: React.FC = () => {
  const budgetItems = [
    { sn: 1, item: 'Professional memberships & credentials (INSOL, CIArb, NICArb, BRIPAN, CIBN, Young ICCA, ITA – membership subscriptions and annual dues)', budget: '18–24', owner: 'CPD/Professional Development', rationale: 'Maintains specialist ecosystem access and credibility signals to clients and referrers', priority: true },
    { sn: 2, item: 'Arbitral & insolvency panel registrations (LCA, NICArb, NCIA, ICC Nigeria, BRIPAN insolvency panel – application fees and annual maintenance)', budget: '4–7', owner: 'CPD/Professional Development', rationale: 'Panel appointments are credibility infrastructure for Platform 3 and INSOL-facing Platform 1 work', priority: true },
    { sn: 3, item: 'Chambers of Commerce memberships (NACCIMA, LCCI, bilateral chambers – BNLF, NBCC, NBBC – annual subscriptions)', budget: '10–14', owner: 'Marketing/BD', rationale: 'Access to institutional decision-makers; NACCIMA provides manufacturing sector access critical for Platform 1 client development' },
    { sn: 4, item: 'International conferences & travel (LIDW ×2, London Arbitration Week, INSOL Global, ICC/CIArb forums – flights, hotel, per diems, registration) 4–5 trips over 24 months at ₦5.2M–10.8M per trip', budget: '28–45', owner: 'Professional Development / BD', rationale: 'Primary international referral pipeline investment; underpins Platform 3 and IR3 UK initiative', priority: true },
    { sn: 5, item: 'Domestic conferences & events (BRIPAN, NICArb, NBA-SBL, local forums – 8–10 engagements over 24 months)', budget: '6–10', owner: 'Professional Development / BD', rationale: 'Domestic ecosystem visibility: NBA-SBL and BRIPAN directly support Platforms 1 and 3' },
    { sn: 6, item: 'Thought leadership production & dissemination (design, Mondaq/platform fees, digital amplification, event materials, PR support)', budget: '12–18', owner: 'Marketing / BD', rationale: 'Authority positioning and lead generation; supports all three platforms' },
    { sn: 7, item: 'Client-facing events (2 major roundtables, webinar series, seminar materials, venue, AV, catering)/Event Sponsorship', budget: '15–22', owner: 'Firm Events / Marketing', rationale: 'Direct conversion events for institutional relationships; foundational for Workstream 2' },
  ];

  return (
    <section className="flex-grow flex flex-col px-16 py-6">
      <JEEHeader number="9" title="Financial Requirements" />

      <div className="space-y-8 text-gray-800 leading-relaxed font-light text-sm max-w-4xl">
        <p className="text-gray-600">
          Project Fortify will require some financial investment in order to reap the anticipated rewards.
          This financial requirement is not driven by capital expenditure in the traditional sense, but by
          the need to strengthen the practice's market visibility, specialist positioning, relationship
          development, capability-building and operational support. The core premise is that a focused
          investment in positioning, relationships, credentials, thought leadership and execution support
          can unlock significantly greater revenue opportunities across the three priority platforms.
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] text-white">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest">S/N</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest">Investment Line</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest">24M Budget (₦M)</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest">Strategic Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {budgetItems.map((item, idx) => (
                <tr key={idx} className={`hover:bg-gray-50/50 transition-colors ${item.priority ? 'bg-[#800020]/5' : ''}`}>
                  <td className="px-4 py-2.5 text-[#800020] font-bold">{item.sn}</td>
                  <td className="px-4">
                    <div className={`text-[12px] font-medium ${item.priority ? 'text-[#800020] font-bold' : 'text-gray-900'}`}>{item.item}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter mt-1">Owner: {item.owner}</div>
                  </td>
                  <td className={`px-4 py-2.5 font-bold ${item.priority ? 'text-[#800020]' : 'text-[#1a1a1a]'}`}>{item.budget}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-600 italic leading-snug">{item.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
