import React from 'react';
import { RefreshCw } from 'lucide-react';
import { InfographicContainer, KeyInsight } from './helpers';

export const DataDeficiencyCycle: React.FC = () => (
  <>
    <InfographicContainer title="The Vicious Cycle of Data Deficiency" className="flex flex-col gap-8 h-[33vh]">
      <div className="relative w-48 h-48 mx-auto ">
        <div className="absolute inset-0 border-4 border-dashed border-[#c4c1c1] rounded-full animate-spin [animation-duration:20s]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-10 text-center">
          <p className="font-bold text-[#002060] text-xs">1. Data Gaps</p>
          <p className="text-xs text-slate-500">No systems to track ESG</p>
        </div>
        <div className="absolute top-1/2 left-0 -translate-x-12 -translate-y-1/2 text-center w-20">
          <p className="font-bold text-[#002060] text-xs break-words">2. Hindered Reporting</p>
          <p className="text-xs text-slate-500 break-words">Cannot meet standards</p>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-10 text-center">
          <p className="font-bold text-[#002060] text-xs">3. Limited Finance</p>
          <p className="text-xs text-slate-500">Lenders can&apos;t verify</p>
        </div>
        <div className="absolute top-1/2 right-0 translate-x-12 -translate-y-1/2 text-center w-20">
          <p className="font-bold text-[#002060] text-xs break-words">4. No Investment</p>
          <p className="text-xs text-slate-500 break-words">Can&apos;t afford new systems</p>
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <RefreshCw size={20} className="text-[#0099ce]" />
        </div>
      </div>
    </InfographicContainer>{' '}
    <KeyInsight text="Breaking this self-reinforcing cycle requires an external intervention focused on providing foundational data infrastructure and literacy." />
  </>
);
