import React from 'react';
import { JEEHeader } from '../Header';

export const ExecutiveSummary: React.FC = () => {
  return (
    <section className="bg-white p-16 border border-gray-200 shadow-sm rounded-sm flex-grow flex flex-col">
      <JEEHeader number="1" title="Executive Summary" />

      <div className="space-y-6 text-gray-700 leading-relaxed font-light text-sm">
        <p>
          <strong>Project Fortify</strong> is my 24-month growth plan for building Jackson, Etti & Edu's Commercial Litigation & Dispute Resolution (CLDR) practice into a more structured, visible and consistently revenue-generating platform within the Firm. It is based on a conviction I have developed through my work within the practice, that while the team already delivers strong technical work and benefits from the Firm's institutional relationships, the next phase must be one of growth, driven deliberately by a more commercial mindset.
        </p>

        <p>
          The projected growth, in my view, must transcend the existing portfolios and be anchored on a platform that enhances market visibility, strengthens credibility, and enables the origination, conversion and retention of high-value mandates across the Firm's priority sectors in particular. This is particularly important in a market where peer Firms, and even some lower-tier practices, are becoming more intentional about how they position for complex dispute work through visibility, strategic relationships and disciplined business development. For JEE to attain and sustain the position it desires in this space, the CLDR Practice must evolve from a support function into a more proactive and intentional client-originating business.
        </p>

        <p>
          <strong>Project Fortify</strong> is intended to drive that transition. It is not simply a plan for more activities within the Practice, but a structured commercial framework for strengthening the Practice as a core pillar of the Firm's strategy going forward. It builds on the strengths already present within JEE – <em>Strong Client Relationships, Sector Reach, Technical Capability and Cross-Practice Opportunities</em> – and seeks to convert those strengths into a more predictable and scalable pipeline of Briefs, from waiting to intentionally creating the conditions that make those Briefs more likely to come to us, grow with us and remain with us.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#800020]">
          <p className="font-medium text-[#1a1a1a]">This strategy is built around three integrated business platforms:</p>
          <ol className="list-alpha pl-5 space-y-2 mt-3">
            <li>
              <strong>The Institutional Debt Recovery, Insolvency & Enforcement Platform,</strong> which is designed to generate recurring mandates from financial institutions and corporates through structured recovery and enforcement solutions;
            </li>
            <li>
              <strong>The Commercial, Transactional & Shareholder Disputes Platform,</strong> which is aimed at deepening wallet share from existing and prospective corporate clients by positioning the practice as the first point of call when commercial tensions mature into disputes; and
            </li>
            <li>
              <strong>The Domestic and International Arbitration & Cross-Border Enforcement Platform,</strong> which is intended to secure higher-value and foreign currency-denominated mandates through arbitral visibility, international relationships and cross-border enforcement capability.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};
