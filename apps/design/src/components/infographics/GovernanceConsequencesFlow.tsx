import React from 'react';
import { ShieldOff, Blocks, TrendingDown } from 'lucide-react';
import { InfographicContainer, KeyInsight, FlowStep } from './helpers';

export const GovernanceConsequencesFlow: React.FC = () => (
  <InfographicContainer title="The Domino Effect of Weak Governance">
    <div className="relative flex flex-col items-center space-y-4">
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 border-l-2 border-dashed border-[#c4c1c1] -z-0"></div>
      <FlowStep
        icon={<ShieldOff size={32} className="text-[#0099ce]" />}
        title="Weak Governance"
        text="Informal structures, no transparency or accountability."
      />
      <FlowStep
        icon={<Blocks size={32} className="text-[#0099ce]" />}
        title="Business Fragility & Collapse"
        text="Leads to mismanagement and frequent business failure."
      />
      <FlowStep
        icon={<TrendingDown size={32} className="text-[#002060]" />}
        title="Economic Instability"
        text="Contributes to rising unemployment and market volatility."
      />
    </div>
    <KeyInsight text="This causal chain shows that improving SME governance is a direct lever for strengthening national economic resilience." />
  </InfographicContainer>
);