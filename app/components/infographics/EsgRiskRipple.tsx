import React from 'react';
import { Zap } from 'lucide-react';
import { InfographicContainer, KeyInsight } from './helpers';

export const EsgRiskRipple: React.FC = () => (
  <InfographicContainer title="The Ripple Effect of ESG Risk">
    <div className="relative h-80 w-80 mx-auto flex justify-center items-center">
      <div className="absolute w-full h-full rounded-full border border-[#0099ce] animate-ping"></div>
      <div className="absolute w-2/3 h-2/3 rounded-full border border-[#0099ce] animate-ping [animation-delay:0.5s]"></div>
      <div className="absolute w-1/3 h-1/3 rounded-full border border-[#0099ce] animate-ping [animation-delay:1s]"></div>
      <div className="z-10 text-center bg-white p-2 rounded-full">
        <div className="w-24 h-24 rounded-full bg-[#002060] text-white flex flex-col justify-center items-center">
          <Zap size={24} />
          <p className="font-bold text-sm mt-1">ESG Event</p>
        </div>
      </div>
      <p className="absolute top-2 left-1/2 -translate-x-1/2 font-semibold bg-white px-2">Credit Risk</p>
      <p className="absolute top-1/2 right-0 translate-x-8 font-semibold bg-white px-2">Market Risk</p>
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 font-semibold bg-white px-2">Reputational Risk</p>
      <p className="absolute top-1/2 left-0 -translate-x-8 font-semibold bg-white px-2">Liquidity Risk</p>
    </div>
    <KeyInsight text="An ESG event doesn't impact one area; it sends ripples across all major financial risk categories, demanding a holistic assessment from FIs." />
  </InfographicContainer>
);