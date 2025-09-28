import React from 'react';

export const DataDeficiencyCycle: React.FC = () => {
  return (
    <div className="my-8">
      <p className="text-center font-bold text-blue-600 mb-2">The Vicious Cycle of Data Deficiency</p>
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 border-4 border-dashed border-[#c4c1c1] rounded-full"></div>
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
          <p className="text-xs text-slate-500">Lenders can't verify</p>
        </div>
        <div className="absolute top-1/2 right-0 translate-x-12 -translate-y-1/2 text-center w-20">
          <p className="font-bold text-[#002060] text-xs break-words">4. No Investment</p>
          <p className="text-xs text-slate-500 break-words">Can't afford new systems</p>
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
        </div>
      </div>
      <p className="text-center text-sm text-slate-500">Breaking this self-reinforcing cycle requires an external intervention focused on providing foundational data infrastructure and literacy.</p>
    </div>
  );
};
