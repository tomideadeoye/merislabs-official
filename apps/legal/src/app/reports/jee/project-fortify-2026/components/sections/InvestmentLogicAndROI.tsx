import React from 'react';
import { JEEHeader } from '../Header';

export const InvestmentLogicAndROI: React.FC = () => {
  const roiData = [
    { label: 'Priority Items Only', ratio: 6.9, color: 'bg-[#800020]' },
    { label: 'Full Strategic Budget', ratio: 3.7, color: 'bg-[#1a1a1a]' },
  ];
  
  const investmentBreakdown = [
    { category: 'International Pipeline (IR3 UK)', amount: '₦28–45M', percentage: 37 },
    { category: 'Specialist Credentials', amount: '₦18–24M', percentage: 21 },
    { category: 'Strategic BD & Relationship Mgmt', amount: '₦10–15M', percentage: 15 },
    { category: 'Thought Leadership & Digital', amount: '₦12–18M', percentage: 15 },
    { category: 'Domestic Visibility (NBA/SBL)', amount: '₦6–10M', percentage: 8 },
    { category: 'Panel Registrations', amount: '₦4–7M', percentage: 4 },
  ];

  return (
    <section className="flex-grow flex flex-col px-16 py-12">
      <JEEHeader number="10" title="Investment Logic & ROI" />

      <div className="space-y-8 text-gray-800 leading-relaxed font-light text-sm max-w-4xl">
        <p className="text-gray-500 italic text-xs leading-relaxed">
          Whilst the items listed in the table above are all important for the success of the Project, the <strong>highlighted items</strong> require more immediate attention and consideration. It is also understood that some of the costs in the table above may have been covered by the Firm already, especially regarding International Journals.
        </p>

        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Investment Analysis</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-2 text-left text-[10px] font-bold uppercase text-gray-400">Item</th>
                    <th className="py-2 text-right text-[10px] font-bold uppercase text-gray-400">Figure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-600">Total proposed investment (24-month cycle)</td>
                    <td className="py-3 font-bold text-[#1a1a1a] text-right">₦139M – ₦211M*</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-600">USD equivalent at ₦1,300/USD (conservative rate)</td>
                    <td className="py-3 font-bold text-[#1a1a1a] text-right">USD 107,000 – USD 162,000 approx.</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-600">Year 2 target revenue</td>
                    <td className="py-3 font-bold text-[#800020] text-right">USD 500,000 – 650,000**</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-600">Revenue-to-investment ratio (mid-point)</td>
                    <td className="py-3 font-bold text-[#1a1a1a] text-right">~3.7x (full budget) / ~6.9x (priority items only)</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-600">Net profit contribution at 30% margin</td>
                    <td className="py-3 font-bold text-[#1a1a1a] text-right">USD 150,000 per annum at target (30% of USD 500,000)</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-600">Payback period at Year 2 run rate</td>
                    <td className="py-3 font-bold text-[#800020] text-right">{'<'} 12 months</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 space-y-1">
                <p className="text-[9px] text-gray-500 italic leading-snug">
                  *considering only the figures in the boldened items in the table above, the sum would be around ₦74–₦115
                </p>
                <p className="text-[9px] text-gray-400 italic leading-snug">
                  **based off on Year 1 Actual Income
                </p>
              </div>
            </div>

            <div className="bg-[#1a1a1a] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 relative z-10">Return Analysis</h3>
               <div className="space-y-4 relative z-10">
                 {roiData.map((item) => (
                   <div key={item.label}>
                     <div className="flex justify-between text-[10px] mb-1.5">
                       <span className="text-gray-400">{item.label}</span>
                       <span className="font-bold text-white">{item.ratio}x</span>
                     </div>
                     <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                       <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.ratio / 7) * 100}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Investment Allocation</h3>
              <div className="space-y-4">
                {investmentBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-gray-600 truncate mr-4">{item.category}</span>
                      <span className="font-bold text-gray-900 whitespace-nowrap">{item.amount}</span>
                    </div>
                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-[#800020]/20 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[#800020]/5 rounded-xl border border-[#800020]/10">
              <div className="flex gap-4 items-start">
                <div className="text-xl">📊</div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#800020]">Profit Contribution</p>
                  <p className="text-xs text-gray-700 leading-snug italic">
                    "Net profit contribution at 30% margin is estimated at <strong>USD 150,000 per annum</strong> at target, with a payback period of {'<'} 12 months at Year 2 run rate."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};