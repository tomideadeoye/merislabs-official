import React from 'react';
import { JEEHeader } from '../Header';

export function Platform2Commercial() {
  return (
    <section className="bg-white p-16 border border-gray-200 shadow-sm rounded-sm flex-grow flex flex-col">
      <JEEHeader number="3" title="THE BUSINESS – PLATFORM 2: COMMERCIAL DISPUTES" />
      
      <div className="space-y-6 text-gray-700 leading-relaxed font-light text-sm">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-[#800020] mb-3 uppercase text-xs tracking-wider">COMMERCIAL, TRANSACTIONAL & SHAREHOLDER DISPUTES</h4>
          <p className="mb-3">
            The second platform is the Commercial, Transactional & Shareholder Disputes Platform. This platform is designed to capture disputes arising from commercial contracts, corporate relationships, governance breakdowns, shareholder tensions, joint venture arrangements, investment structures and sector-specific operational disputes across the Firm's key industries. Its commercial logic is closely tied to the reality that disputes often emerge from the same transactions, structures and relationships that full-service firms help to create, manage or advise on in the first place.
          </p>
          <p className="mb-3">
            The objective of this platform is therefore twofold. First, it seeks to expand wallet share from existing and prospective corporate clients by positioning the CLDR practice as the natural first point of call when commercial relationships begin to deteriorate or when disputes become imminent. Secondly, it aims to improve internal retention of disputes work by ensuring that matters arising from the Firm's transactional, sectoral and advisory engagements are identified early and channelled into the practice rather than externalised to competing firms.
          </p>
          <p>
            This platform is especially important because it sits at the intersection of sector dominance and disputes strategy. It allows the practice to draw on the Firm's existing presence in Energy, FMCG, Financial Services, Technology and related sectors, while deepening the value extracted from those relationships through disputes mandates that may be high-value, strategically sensitive and capable of generating repeat work.
          </p>
        </div>
      </div>
    </section>
  );
}