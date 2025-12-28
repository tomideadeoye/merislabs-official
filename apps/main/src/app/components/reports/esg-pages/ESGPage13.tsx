import React from 'react';
import { HybridPage } from '../HybridPage';

interface ESGPage13Props {
  pageNumber?: number;
  footnoteStart?: number;
  footnotes?: string[];
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

const defaultFootnotes = [
  'Exemptions to this application exist for financial advisers which employ fewer than three persons – however, they are required to consider and factor in sustainability risks in their advisory processes. See recital (6) of the Sustainability Finance Disclosure Regulation.',
  'See Article 4 of the Sustainable Finance Disclosure Regulation.',
  'See Articles 6 and 9 of the Sustainable Finance Disclosures Regulation',
  'See Article 9 of the Taxonomy Regulation. These include (a) climate change mitigation; (b) climate change adaptation; (c) the sustainable use and protection of water and marine resources; (d) the transition to a circular economy; (e) pollution prevention and control; and (f) the protection and restoration of biodiversity and ecosystems',
  'See Article 3 of the Taxonomy Regulation',
  'See Article 5 of the Taxonomy Regulation',
  'See Article 10 of the Taxonomy Regulation',
  'See Article 16 of the Taxonomy Regulation',
  'See recital 28 of the Sustainable Finance Disclosure Regulation'
];

export const ESGPage13: React.FC<ESGPage13Props> = ({ pageNumber, footnoteStart = 56, footnotes = defaultFootnotes, width = 794, height = 1123, showFootnotes = true }) => {
  return (
    <HybridPage
      pageNumber={pageNumber}
      footnotes={showFootnotes ? [
        'Exemptions to this application exist for financial advisers which employ fewer than three persons – however, they are required to consider and factor in sustainability risks in their advisory processes. See recital (6) of the Sustainability Finance Disclosure Regulation.',
        'See Article 4 of the Sustainable Finance Disclosure Regulation.',
        'See Articles 6 and 9 of the Sustainable Finance Disclosures Regulation',
        'See Article 9 of the Taxonomy Regulation. These include (a) climate change mitigation; (b) climate change adaptation; (c) the sustainable use and protection of water and marine resources; (d) the transition to a circular economy; (e) pollution prevention and control; and (f) the protection and restoration of biodiversity and ecosystems',
        'See Article 3 of the Taxonomy Regulation',
        'See Article 5 of the Taxonomy Regulation',
        'See Article 10 of the Taxonomy Regulation',
        'See Article 16 of the Taxonomy Regulation',
        'See recital 28 of the Sustainable Finance Disclosure Regulation'
      ] : undefined}
      footnoteStart={55}
      components={{}}
      width={width}
      height={height}
    >
      <h2 className="text-xl font-semibold mb-3 text-blue-500">Conclusion</h2>
      
      <p className="mb-4">
        The financing divide limiting Nigerian SMEs' access to ESG-linked capital is a dual challenge rooted in both the supply and demand dynamics. On the demand side, SMEs face significant internal and external barriers that create a persistent credibility gap, leaving them unable to satisfy the stringent reporting and governance standards required by financial institutions. On the supply side, Fis, bound by fiduciary duties to end-investors and evolving regulations, apply ESG risk assessment and disclosure frameworks that are ill-suited to the informal and data-scarce reality of the Nigerian SME sector.
      </p>
      
      <p className="mb-4">
        The disconnect between SMEs lacking the capacity for comprehensive ESG reporting and FIs mandated to require it, remains the central constraint to mobilizing green capital. Bridging the gap will require a coordinated, multi-stakeholder effort to tackle systemic issues such as data scarcity, fragmented guidance, and the misalignment of international standards and local market realities. Only through coordinated action among regulators, FIs, investors, and SME support networks can Nigeria establish a practical and inclusive sustainable finance ecosystem that channels ESG-linked capital to small businesses.
      </p>
    </HybridPage>
  );
};

export { defaultFootnotes };