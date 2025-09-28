import React from 'react';
import { FileQuestion, Shuffle, Puzzle } from 'lucide-react';
import { InfographicContainer, KeyInsight, ChallengeBlock } from './helpers';

export const DataChallengeStack: React.FC = () => (
  <InfographicContainer title="The Data Challenge Stack">
    <div className="space-y-[-20px] relative flex flex-col items-center">
      <ChallengeBlock
        icon={<FileQuestion />}
        title="Data Scarcity"
        text="ESG data for SMEs is often unavailable or insufficient."
        style={{ transform: 'rotate(-2deg)' }}
      />
      <ChallengeBlock
        icon={<Shuffle />}
        title="Data Inconsistency"
        text="Reported data lacks coherence, hindering financial analysis."
        style={{ transform: 'rotate(3deg)' }}
      />
      <ChallengeBlock
        icon={<Puzzle />}
        title="Lack of Integration"
        text="ESG factors are not reflected in core risk parameter calculations."
        style={{ transform: 'rotate(-1deg)' }}
      />
    </div>
    <KeyInsight text="These stacked, unstable challenges show that without solving the foundational data problem, effective ESG risk assessment by FIs is nearly impossible." />
  </InfographicContainer>
);