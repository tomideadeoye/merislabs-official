import React from 'react';

export const RevenueContributions: React.FC = () => {
  const memberships = [
    'INSOL International',
    'BRIPAN',
    'NICArb',
    'ICMC',
    'Young ICCA',
    'ITA',
    'NBA-SBL'
  ];

  const contributions = [
    { matter: '2025 ComLit Team Revenue', description: 'Supported Head of Department in leading Commercial Litigation revenue performance', outcome: 'USD 300,000+ in departmental revenue in 2025' },
    { matter: 'OPay Relationship', description: 'Grew from narrow garnishee-focused instructions into a broader strategic client account', outcome: 'USD 60,000+ revenue in 2025; USD 25,000+ in 2026 YTD' },
    { matter: 'Project Compass – Ecobank', description: 'Led the Ecobank portfolio audit mandate from origination to delivery', outcome: '₦25 million in fees generated' },
    { matter: 'AGTF / Sony Advisory', description: 'Legal advisory and support services', outcome: 'USD 10,000 per client; USD 20,000 combined' },
    { matter: 'Multitan Advisory', description: 'Legal support and advisory services', outcome: '₦8 million in fees' },
    { matter: 'Axa Mansard Advisory', description: 'Led Commercial Litigation team on advisory mandate', outcome: '₦6 million in fees' },
    { matter: 'Baker Hughes Matters', description: 'Led the Baker Hughes team on two major instructions (General Hydrocarbons & First Bank)', outcome: '₦20 million in fees across both matters' },
    { matter: 'AMCON Portfolio', description: 'Managed AMCON portfolio across multiple recovery matters since 2024', outcome: '₦75 million+ in cumulative recovery professional fees' },
    { matter: 'Emple Arbitration', description: 'Lead team; negotiated and secured professional fee exceeding co-counsel billing', outcome: '₦80 million professional fee; ₦20 million above co-counsel billing' },
    { matter: 'UBA v Epe Resort', description: 'Led team to a major reduction in client obligations and amicable settlement', outcome: '₦2 billion+ in client savings preserved. Positioned to earn ₦25m+ for the work done so far.' },
    { matter: 'Receivables clean-up (2023–2024)', description: 'Led clean-up of aged receivables previously unbilled or unsupported', outcome: 'Improved practice financial position; material cash recovery.' },
    { matter: 'Targeted proposals', description: 'Led proposals to OPay, TotalEnergies CPFA and Ecobank', outcome: 'Instructions secured from all three clients, earning about USD 110,000 in combined income' },
  ];

  return (
    <section className="bg-white p-16 border border-gray-200 shadow-sm rounded-sm flex-grow flex flex-col">
      <div className="text-sm text-gray-700 leading-relaxed font-light flex-grow flex flex-col">
        <div className="flex-grow overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#1a1a1a] text-white">
              <tr>
                <th className="p-3 text-left">Matter / Client</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Commercial Outcome</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'border-b border-gray-200 bg-white' : 'border-b border-gray-200 bg-gray-50'}>
                  <td className="p-3 font-medium">{item.matter}</td>
                  <td className="p-3 text-gray-600">{item.description}</td>
                  <td className="font-medium text-[#1a1a1a]">{item.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 tracking-tight">MARKET VISIBILITY AND PROFESSIONAL POSITIONING</h3>
          <p>
            In addition to revenue generation and mandate execution, I have made deliberate efforts to strengthen my professional standing within the Disputes ecosystem in ways that support both my own practice development and the Firm's wider market visibility. I am an active member of:
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {memberships.map((m, i) => (
              <span key={i} className="px-3 py-1 bg-[#800020]/20 text-[#1a1a1a] text-xs font-medium rounded-full">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
