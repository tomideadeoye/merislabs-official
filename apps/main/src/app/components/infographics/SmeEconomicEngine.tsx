import React from 'react';
import { Building2, Wallet, Users } from 'lucide-react';
import { InfographicContainer, KeyInsight } from './helpers';

export const SmeEconomicEngine: React.FC = () => (
  <InfographicContainer title="The Undeniable Engine: SME Economic Impact">
    <div className="grid grid-cols-2 grid-rows-2 gap-2 -mt-4">
      <div className="col-span-2 row-span-1 bg-white p-2 rounded-lg text-center flex flex-col justify-center items-center">
        <p className="text-5xl font-black text-[#002060]">96%</p>
        <p className="text-lg font-medium text-slate-600">of all Nigerian Businesses</p>
      </div>
      <div className="col-span-1 row-span-1 bg-white p-2 rounded-lg text-center flex flex-col justify-center items-center">
        <Wallet className="text-[#0099ce]" size={32} />
        <p className="text-3xl font-bold text-[#002060]">48%</p>
        <p className="text-sm text-slate-500">of National GDP</p>
      </div>
      <div className="col-span-1 row-span-1 bg-white p-2 rounded-lg text-center flex flex-col justify-center items-center">
        <Users className="text-[#0099ce]" size={32} />
        <p className="text-3xl font-bold text-[#002060]">50%</p>
        <p className="text-sm text-slate-500">of National Workforce</p>
      </div>
    </div>
    <KeyInsight text="This immense scale establishes SMEs not as a niche, but as the core of Nigeria's economic landscape, making their stability crucial." />
  </InfographicContainer>
);