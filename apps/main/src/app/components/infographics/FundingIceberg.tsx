import React from 'react';
import { InfographicContainer, KeyInsight } from './helpers';

export const FundingIceberg: React.FC = () => (
  <InfographicContainer title="The Funding Iceberg">
    <div className="relative w-full h-96 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/3 text-center pt-4">
        <h3 className="text-3xl font-bold text-[#0099ce]">$15M</h3>
        <p className="font-semibold text-slate-600">Mobilized</p>
      </div>
      <div className="absolute top-1/3 left-0 w-full h-2 bg-[#0099ce] opacity-50"></div>
      <div className="absolute top-1/3 left-0 w-full h-2/3 bg-[#0099ce] bg-opacity-10 pt-8 text-center">
        <h3 className="text-5xl font-black text-[#002060]">$160M</h3>
        <p className="text-xl font-semibold text-[#002060]">Unmet Need</p>
      </div>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <polygon points="50,25 20,33 80,33" fill="#0099ce" />
        <polygon points="20,33 80,33 95,100 5,100" fill="#002060" />
      </svg>
    </div>
    <KeyInsight text="The visible funding is merely the tip of the iceberg, obscuring the immense, unmet capital requirements of bankable, sustainable SMEs." />
  </InfographicContainer>
);