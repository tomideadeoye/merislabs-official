import React from 'react';
import { InfographicContainer, KeyInsight, Meter } from './helpers';

export const DisclosureMaturityMeter: React.FC = () => (
  <InfographicContainer title="Disclosure Maturity: EU vs. Nigeria">
    <div className="grid grid-cols-2 gap-8 mt-8">
      <Meter title="European Union" level={90} levelText="Comprehensive" color="#002060" />
      <Meter title="Nigeria" level={25} levelText="Emerging" color="#0099ce" />
    </div>
    <KeyInsight text="The significant gap in regulatory maturity highlights the challenge of applying global North standards to the Global South's market realities." />
  </InfographicContainer>
);