import React from 'react';
import { JEEHeader } from '../Header';

export const ProposedBusiness: React.FC = () => {
  return (
    <section className="bg-white p-16 border border-gray-200 shadow-sm rounded-sm flex-grow flex flex-col">
      <JEEHeader number="3" title="THE BUSINESS – CLDR PRACTICE – PROJECT FORTIFY" />
      
      <div className="space-y-6 text-gray-700 leading-relaxed font-light text-sm">
        <p>
          <strong>Project Fortify</strong> represents the development of a more structured and commercially deliberate disputes business within Jackson, Etti & Edu. At its core, it is designed to transform the Commercial Litigation & Dispute Resolution practice into a proactive, client-originating and revenue-generating platform that operates as a stronger pillar of the Firm's broader sector-focused strategy.
        </p>
        
        <p>
          The rationale for this is straightforward. Disputes work remains one of the most commercially valuable and strategically important service lines within a full-service law firm, but its long-term growth depends not only on technical legal capability. It also depends on the ability to identify demand early, position the practice credibly in the market, convert existing relationships into dispute mandates, retain work that might otherwise leave the Firm, and build a platform that generates instructions with greater consistency and predictability. <strong>Project Fortify</strong> is intended to provide that platform.
        </p>
        
        <div className="border-l-4 border-[#800020] pl-4 my-6">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3 uppercase">THE THREE CORE BUSINESS PLATFORMS</h3>
          <p>
            The business model under Project Fortify is built around three integrated platforms, each of which corresponds to a recurring category of commercial disputes arising within the Firm's client base, priority sectors and wider market opportunity. These platforms are intended to function as distinct but complementary revenue streams, enabling the Firm to capture disputes work across the commercial lifecycle while building specialisation in areas where demand is strong, recurring and commercially attractive.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-[#800020] mb-3 uppercase text-xs tracking-wider">PLATFORM 1: INSTITUTIONAL DEBT RECOVERY, INSOLVENCY & ENFORCEMENT</h4>
          <p className="mb-3">
            The first platform is the Institutional Debt Recovery, Insolvency & Enforcement Platform. This platform focuses on disputes and advisory work arising from credit exposure, distressed assets, default scenarios, insolvency events and the enforcement of security interests, particularly within the Banking & Financial Institutions sector.
          </p>
          <p className="mb-3">
            The commercial attraction of this platform lies in the fact that it is driven by recurring structural demand. Lending activity, distressed portfolios, recovery pressures and regulatory developments continue to generate a constant pipeline of enforcement and creditor-side instructions.
          </p>
          <p>
            It is also strategically significant because it gives the Firm an opportunity to strengthen long-term institutional relationships with decision-makers whose disputes needs tend to be recurring rather than one-off.
          </p>
        </div>
      </div>
    </section>
  );
};