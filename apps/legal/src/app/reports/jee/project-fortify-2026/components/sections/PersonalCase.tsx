import React from 'react';
import { JEEHeader } from '../Header';

export const PersonalCase: React.FC = () => {
  return (
    <section className="bg-white p-16 border border-gray-200 shadow-sm rounded-sm flex-grow flex flex-col">
      <JEEHeader number="2" title="Personal Case, Commercial Impact & Contributions" />
      
      <div className="space-y-6 text-gray-700 leading-relaxed font-light text-sm">
        <div>
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3 uppercase">LEADERSHIP & ROLE</h3>
          <p>
            Since joining Jackson, Etti & Edu in February 2024, I have assumed increasing leadership responsibility within the Commercial Litigation & Dispute Resolution Practice. Working closely with departmental leadership, I currently play a central role in the strategic direction of the practice, the coordination of mandate execution, client relationship development and the broader effort to position the team as a stronger and more commercially deliberate Disputes platform within the Firm.
          </p>
          <p className="mt-3">
            My work has increasingly required me to operate not only as a disputes lawyer responsible for technical delivery, but also as a Practice builder focused on how the team originates work, deepens client relationships, improves commercial outcomes and aligns more intentionally with the Firm's sector priorities. In practical terms, this has involved leading on major disputes, managing client-facing engagements, supporting internal business development efforts, strengthening collaboration across practice groups and contributing to the long-term development of the CLDR Practice as a structured business platform.
          </p>
          <p className="mt-3">
            I also support the Firm's <strong>IR3 UK initiative</strong>, a structured international referrals strategy focused on deepening relationships with selected UK and international law firms and converting those relationships into Nigerian mandates and sustained engagements. That role reflects a broader institutional responsibility in relation to UK-facing visibility, referrals and cross-border opportunity development.
          </p>
        </div>
        
        <div className="mt-12 pt-6">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 tracking-tight uppercase">COMMERCIAL IMPACT AND REVENUE CONTRIBUTIONS</h3>
          <p>
            A central feature of my practice has been the ability to translate technical disputes capability into measurable commercial outcomes for both clients and the Firm. Over the course of my career, I have built a proven record in dispute positioning, advocacy, enforcement strategy and commercial resolution. That record includes leading a complex arbitration that resulted in a US$9.7 million award and successful enforcement prior to joining JEE, as well as securing over ₦5 billion in recoveries for Tier 1 financial institutions. These experiences have provided a strong practical foundation for the development of creditor-side mandates, enforcement work and complex commercial disputes within the Firm.
          </p>
          <p className="mt-3">
            Since joining JEE, I have contributed directly to the practice's commercial performance in significant ways, summarised in the table below.
          </p>
        </div>
      </div>
    </section>
  );
};