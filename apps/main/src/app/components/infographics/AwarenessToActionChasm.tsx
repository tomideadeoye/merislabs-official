import React from 'react';
import { InfographicContainer, KeyInsight } from './helpers';

export const AwarenessToActionChasm: React.FC = () => (<>
  <InfographicContainer title="The Awareness-to-Action Chasm">
    <div className="flex items-center justify-between my-8 p-4">
      <div className="text-center w-1/3">
        <div className="relative w-32 h-32 rounded-full bg-[#0099ce] flex justify-center items-center text-white text-3xl font-bold mx-auto">
          83%
        </div>
        <p className="mt-4 font-semibold text-[#002060]">Recognize Importance</p>
      </div>
      <div className="flex-grow h-px relative bg-transparent">
        <svg width="100%" height="60" viewBox="0 0 200 60" preserveAspectRatio="none" className="absolute -top-[30px] left-0">
          <path d="M0 30 Q 50 0, 100 30 T 200 30" stroke="#c4c1c1" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          <path d="M0 35 Q 50 65, 100 35 T 200 35" stroke="#c4c1c1" strokeWidth="2" fill="none" strokeDasharray="5,5" />
        </svg>
      </div>
      <div className="text-center w-1/3">
        <div className="relative w-16 h-16 rounded-full bg-[#002060] flex justify-center items-center text-white text-xl font-bold mx-auto">
          8%
        </div>
        <p className="mt-4 font-semibold text-[#002060]">Take Action</p>
      </div>
    </div>
  </InfographicContainer>
   <KeyInsight text="This stark gap highlights that awareness alone is insufficient; SMEs need practical tools, simplified processes, and clear incentives to act." /></>
);