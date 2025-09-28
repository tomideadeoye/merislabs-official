import React from 'react';
import { Zap, ShieldAlert, TrendingUp, Building2, ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { InfographicContainer, KeyInsight } from './helpers';

export const TheGreatDisconnect: React.FC = () => (
  <InfographicContainer title="The Great Disconnect">
    <div className="flex flex-col items-center text-center py-8 space-y-6">
      {/* ESG Capital Pool */}
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <TrendingUp size={36} className="text-green-600" />
          <h3 className="text-md font-bold text-[#002060] ml-2">Growing Pool of ESG Capital</h3>
        </div>
        <p className="text-slate-500 text-sm mb-4">Seeking credible, sustainable investments.</p>
        <ArrowBigDown size={32} className="text-gray-400 mx-auto" />
      </div>

      {/* Systemic Barriers - Central Disconnect */}
      <div className="w-64 bg-gradient-to-r from-red-600 to-orange-500 p-5 rounded-xl text-center z-10 shadow-xl">
        <div className="flex items-center justify-center gap-3">
          <ShieldAlert size={40} className="text-white flex-shrink-0" />
          <div className="text-left">
            <p className="font-bold text-white text-md mb-1">Systemic Barriers</p>
            <p className="text-white/90 text-sm">Preventing Connection</p>
          </div>
        </div>
      </div>

      {/* SME Financing Gap */}
      <div className="w-full flex flex-col items-center">
        <ArrowBigUp size={32} className="text-gray-400 mx-auto mb-3" />
        <div className="flex items-center justify-center gap-4 mb-3">
          <Building2 size={36} className="text-[#002060]" />
          <div className="w-5 h-5 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="text-md font-bold text-[#002060] ml-2">Persistent SME Financing Gap</h3>
        </div>
        <p className="text-slate-500 text-sm">Facing instability and limited access.</p>
      </div>
    </div>
    <div className="mt-4">
      <KeyInsight text="The central challenge is not a lack of capital or need, but the formidable barriers that prevent them from connecting effectively." />
    </div>
  </InfographicContainer>
);