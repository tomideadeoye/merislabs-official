import React from 'react';

export const TeamDevelopment: React.FC = () => {
  const teamArchitecture = [
    { level: 'Partner', current: 1, target: 1, role: 'Origination, Supervision, Strategic mandates', revenueLogic: 'Candidate attains partnership through PSP.', developmentPriority: '-' },
    { level: 'Senior Associate', current: 0, target: 1, role: 'Primary billing layer; complex mandates; client-facing execution', revenueLogic: 'Identify 1 high-potential associates (Emeka Azuwuike in contention) for SA elevation within 24 months. Assign mandates that develop commercial judgment and client-facing skills.', developmentPriority: 'Primary billing layer' },
    { level: 'Associate', current: 1, target: 4, role: 'Volume billing layer; portfolio management, enforcement, research', revenueLogic: 'Deliberate talent acquisition in Year 1. Target: 3 new associates with at least insolvency/restructuring focus (Platform 1) and 1 with arbitration background (Platform 3).', developmentPriority: 'Volume billing layer' },
    { level: 'Trainee Associate', current: 1, target: 1, role: 'Volume billing layer; portfolio management, enforcement, research', revenueLogic: 'Deliberate talent acquisition', developmentPriority: 'Volume billing layer' },
    { level: 'Arbitration Specialist', current: 0, target: '1-2', role: 'Higher-value arbitration and cross-border matters', revenueLogic: 'Build capacity through CIArb and NICArb professional programmes. Identify 1-2 associates for arbitration specialisation pathway. Fund CIArb Fellowship application.', developmentPriority: '-' },
    { level: 'Litigation Officer / Paralegal', current: 1, target: 1, role: 'Process work, enforcement execution, court filings; highest utilisation ratio', revenueLogic: 'Standardise functions through Knowledge/Precedent Bank. Reduce Partner/SA time on process work.', developmentPriority: 'Existing' }
  ];

  return (
    <section className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
      <h2 className="text-3xl font-serif text-[#1a1a1a] mb-6 border-b-2 border-[#800020] pb-2">
        8. Team Development & Practice Capacity Plan
      </h2>
      
      <div className="space-y-6 text-gray-700 leading-relaxed font-light text-sm">
        <p className="mb-6">
          Apart from originating more disputes work, Project Fortify will ensure that the CLDR practice has the capacity, structure and internal depth required to deliver work that is consistently of a high standard and to scale the same over time: to win work and to also build a more resilient institutional platform within which that work can be handled more efficiently, profitably and at increasing scale.
        </p>

        <div>
          <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3">TEAM ARCHITECTURE</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-2 text-left">Level</th>
                  <th className="p-2 text-center">Current</th>
                  <th className="p-2 text-center">Target (2028)</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Revenue Contribution Logic</th>
                  <th className="p-2 text-left">Development Priority</th>
                </tr>
              </thead>
              <tbody>
                {teamArchitecture.map((member, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'border-b border-gray-200' : 'border-b border-gray-200 bg-gray-50'}>
                    <td className="p-2 font-medium">{member.level}</td>
                    <td className="p-2 text-center">{member.current}</td>
                    <td className="p-2 text-center font-bold text-[#1a1a1a]">{member.target}</td>
                    <td className="p-2 text-gray-600">{member.role}</td>
                    <td className="p-2 text-gray-600">{member.revenueLogic}</td>
                    <td className="p-2 text-gray-600">{member.developmentPriority}</td>
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