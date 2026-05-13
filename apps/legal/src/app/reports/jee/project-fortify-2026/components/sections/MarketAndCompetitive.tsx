import React from 'react';
import { JEEHeader } from '../Header';

export function MarketAndCompetitive() {
  return (
    <section className="bg-white p-16 border border-gray-200 shadow-sm rounded-sm flex-grow flex flex-col">
      <JEEHeader number="4" title="MARKET & COMPETITIVE LANDSCAPE ANALYSIS" />
      
      <div className="space-y-6 text-gray-700 leading-relaxed font-light text-sm">
        <div>
          <h4 className="font-bold text-[#800020] mb-3 uppercase text-xs tracking-wider">MARKET OPPORTUNITY</h4>
          <p className="mb-4">
            Although precise public data on the value of the country's commercial disputes is limited, the available competitive signals, sector activity and institutional demand drivers support the conclusion that substantial opportunity exists. The segments most relevant to Project Fortify, (a) institutional debt recovery and enforcement; (b) commercial and shareholder disputes and (c) domestic and international arbitration, are all active, commercially meaningful and capable of supporting sustained growth for a well-positioned disputes practice.
          </p>
          <p className="mb-4">
            Against that background, the revenue ambition under Project Fortify is commercially credible. The Firm's current position in these segments provides a meaningful foundation, and the target of USD 500,000 in annual attributable incremental revenue would require a measured increase in market capture rather than an unrealistic leap in competitive position. This is significant because it means the proposal does not depend on market disruption or dramatic structural change. It depends instead on focused execution, stronger visibility, better internal capture, and more deliberate client and referral conversion.
          </p>
          <p>
            The opportunity is therefore best understood not as an attempt to enter the market from the outside, but as an effort to deepen the Firm's position within a market in which it already has a credible foundation. JEE already possesses client relationships, sector access, a functioning disputes practice and a growing profile in key ecosystems. Project Fortify is intended to convert those assets into a more deliberate, commercially coherent and scalable growth platform.
          </p>
        </div>

        <div className="mt-8">
          <h4 className="font-bold text-[#800020] mb-3 uppercase text-xs tracking-wider">COMPETITIVE LANDSCAPE</h4>
          <p className="mb-4">
            The competitive environment for commercial disputes work in Nigeria is layered. At the top end of the market are established full-service firms with strong disputes brands, deep institutional relationships and long-standing market visibility. Beneath them is a growing layer of specialised and mid-tier competitors, some of whom compete effectively in narrower but commercially important segments such as debt recovery, insolvency, arbitration and sector-specific disputes. A realistic competitive analysis must therefore recognise both tiers, particularly because the competitive dynamics in debt recovery and insolvency differ materially from those in shareholder disputes or arbitration.
          </p>
        </div>
      </div>
    </section>
  );
}

export default MarketAndCompetitive;