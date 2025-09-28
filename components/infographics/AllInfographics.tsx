import React from 'react';

// Import all infographic components
import { SmeEconomicEngine } from './SmeEconomicEngine';
import { GovernanceConsequencesFlow } from './GovernanceConsequencesFlow';
import { TheGreatDisconnect } from './TheGreatDisconnect';
import { AwarenessToActionChasm } from './AwarenessToActionChasm';
import { DataDeficiencyCycle } from './DataDeficiencyCycle';
import { FundingIceberg } from './FundingIceberg';
import { EsgRiskRipple } from './EsgRiskRipple';
import { DataChallengeStack } from './DataChallengeStack';
import { DisclosureMaturityMeter } from './DisclosureMaturityMeter';

// Main component to display all infographics
export const AllInfographics: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
        body {
          font-family: 'Roboto', sans-serif;
          background-color: #f8f9fa;
        }
      `}</style>
      <div className="bg-[#f8f9fa] p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black text-[#002060] text-center mb-12 pb-6 border-b-4 border-[#002060]">
            Bridging the Financing Divide: Key Insights
          </h1>

          <SmeEconomicEngine />
          <GovernanceConsequencesFlow />
          <TheGreatDisconnect />
          <AwarenessToActionChasm />
          <DataDeficiencyCycle />
          <FundingIceberg />
          <EsgRiskRipple />
          <DataChallengeStack />
          <DisclosureMaturityMeter />

        </div>
      </div>
    </>
  );
};