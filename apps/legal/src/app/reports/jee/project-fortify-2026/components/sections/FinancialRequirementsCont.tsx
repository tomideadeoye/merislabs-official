import React from 'react';
import { JEEHeader } from '../Header';

export const FinancialRequirementsCont: React.FC = () => {
  const budgetItems = [
    { sn: 8, item: 'Institutional client entertainment & relationship management (regular engagement across 15 target relationships — ₦300K–500K per month)', budget: '10–15', owner: 'Marketing / BD', rationale: 'Primary conversion mechanism for Workstream 4', priority: true },
    { sn: 9, item: 'Team capability development (CIArb Fellowship pathway ×1–2 members, BRIPAN programme, INSOL short courses, NICArb certification, internal training)', budget: '12–18', owner: 'CPD / Training', rationale: 'Specialist credentials are revenue-enabling infrastructure; CIArb Fellowship alone USD 3,000–8,000 per person' },
    { sn: 10, item: 'Branded materials & capacity statement design (6 productised offerings, firm profile materials, event collateral, pitch materials)', budget: '4–6', owner: 'Marketing / BD', rationale: 'Professional presentation of productised offerings; critical for Workstream 1 conversion', priority: true },
    { sn: 11, item: 'BD pipeline tools & infrastructure (CRM adaptation, pipeline tracking tool, opportunity management system)', budget: '2–4', owner: 'IT / Operations', rationale: 'Referenced throughout the plan; essential for disciplined relationship tracking', priority: true },
    { sn: 12, item: 'Digital presence & content amplification (LinkedIn Premium, Mondaq subscription, platform distribution, digital outreach)', budget: '3–6', owner: 'Marketing / BD', rationale: 'Low-cost, high-impact; generates inbound visibility from international practitioners' },
    { sn: 13, item: 'International travel documentation (UK/Other country visa applications (INSOL), biometrics, travel insurance across 24-month cycle)', budget: '2–3', owner: 'Professional Development', rationale: 'Visa costs non-trivial at current rates', priority: true },
    { sn: 14, item: 'Contingency (10% of base) (FX volatility, event cost inflation, unplanned professional opportunities)', budget: '13–19', owner: 'Firm Reserve', rationale: 'Standard prudent provision: FX movement alone can materially affect international travel costs' },
  ];

  return (
    <section className="flex-grow flex flex-col px-16 py-6">
      <div className=" bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] text-white">
              <th className="px-4  text-[10px] font-bold uppercase tracking-widest">S/N</th>
              <th className="px-4 text-[10px] font-bold uppercase tracking-widest">Investment Line</th>
              <th className="px-4 text-[10px] font-bold uppercase tracking-widest">24M Budget (₦M)</th>
              <th className="px-4 text-[10px] font-bold uppercase tracking-widest">Strategic Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {budgetItems.map((item, idx) => (
              <tr key={idx} className={`hover:bg-gray-50/50 transition-colors ${item.priority ? 'bg-[#800020]/5' : ''}`}>
                <td className="px-4 text-[#800020] font-bold">{item.sn}</td>
                <td className="px-4 py-2.5">
                  <div className={`text-[12px] font-medium ${item.priority ? 'text-[#800020] font-bold' : 'text-gray-900'}`}>{item.item}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-tighter mt-1">Owner: {item.owner}</div>
                </td>
                <td className={`px-4 text-[12px] font-bold ${item.priority ? 'text-[#800020]' : 'text-[#1a1a1a]'}`}>{item.budget}</td>
                <td className="px-4 text-[12px] text-gray-600 italic leading-snug">{item.rationale}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#1a1a1a] text-white border-t border-gray-100">
              <td colSpan={2} className="px-4 py-4 text-[10px] font-bold uppercase">TOTAL (24-MONTH CYCLE)</td>
              <td className="px-4 font-bold text-white">₦139M – ₦211M</td>
              <td className="px-4 text-[10px] uppercase tracking-widest text-gray-400">~4–6x ROI at Year 2 target revenue of ₦800M+</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
