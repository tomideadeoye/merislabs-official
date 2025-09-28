import React from 'react';
import { HybridPage } from '../HybridPage';

interface ESGPage11Props {
  pageNumber?: number;
  footnoteStart?: number;
  footnotes?: string[];
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

const defaultFootnotes = [
  'See paragraph 382 of the EBA Report. Situations of environmental crisis or social unrest can lead to higher withdrawals, share buybacks, or other stresses on liquidity position.',
  'See paragraphs 89 and 90 of the EBA Report.',
  'See paragraph 91(b) of the EBA Report',
  'See paragraph 91(c) of the EBA Report.',
  'See paragraph 91(c) of the EBA Report.',
  'See recital 18 of Regulation (EU) 2020/852 on the establishment of a framework to facilitate sustainable investment (the "**Taxonomy Regulation**") which, amends the Sustainable Finance Disclosure Regulation.'
];

export const ESGPage11: React.FC<ESGPage11Props> = ({ pageNumber, footnoteStart = 41, footnotes = defaultFootnotes, width = 794, height = 1123, showFootnotes = true }) => {
  return (
    <HybridPage
      pageNumber={pageNumber}
      footnotes={showFootnotes ? [
        "See paragraph 382 of the EBA Report. Situations of environmental crisis or social unrest can lead to higher withdrawals, share buybacks, or other stresses on liquidity position.",
        "See paragraphs 89 and 90 of the EBA Report.",
        "See paragraph 91(b) of the EBA Report",
        "See paragraph 91(c) of the EBA Report.",
        "See paragraph 91(c) of the EBA Report.",
        "See recital 18 of Regulation (EU) 2020/852 on the establishment of a framework to facilitate sustainable investment (the \"**Taxonomy Regulation**\") which, amends the Sustainable Finance Disclosure Regulation."
      ] : undefined}
      footnoteStart={41}
      components={{}}
      width={width}
      height={height}
    >
      <h4 className="font-semibold mb-2">FIs Treatment of Financial Risk Categories Occasioned by ESG Risk</h4>
      
      <p className="mb-4">
        FIs apply forward-looking metrics to assess how ESG factors affect standard financial risk categories, especially for long-term financing exposures such as real estate loans<sup><a href="#footnote-41" className="text-blue-600 hover:text-blue-600">41</a></sup>.
      </p>
      
      <ul className="list-disc pl-6 mb-4">
        <li className="mb-2"><strong>Credit and Counterparty Risk</strong><br/>
        FIs are required to assess the impact of ESG risk on its credit risk for each portfolio or counterparty, incorporate these risks into their risk appetite statements, and integrate them into loan origination and ongoing monitoring. The ESG profile of a counterparty is therefore evaluated both at inception and throughout the duration of the relationship.</li>
        
        <li className="mb-2"><strong>Market risk</strong><br/>
        End investors increasingly apply negative screening policies based on ESG considerations. As a result, FIs must closely monitor the impact of ESG risks on their market risk position, adopting comprehensive ESG market risk policies that include due diligence requirements and ESG checklists. In circumstances where ESG data is unreliable or unavailable, many FIs apply negative screening and exclude such investments altogether<sup><a href="#footnote-42" className="text-blue-600 hover:text-blue-600">42</a></sup>.</li>
        
        <li className="mb-2"><strong>Operational & Reputational Risk</strong><br/>
        FIs must carefully evaluate the extent to which ESG-related operational exposures could result in reputational or legal damage, ensuring consistency between their public disclosures and internal practices in order to mitigate the risk of greenwashing.</li>
        
        <li><strong>Liquidity and Funding Risk</strong><br/>
        ESG risks can also affect liquidity and funding positions. In the short and medium term, liquidity risks may arise from unexpected net cash outflows linked to environmental or social crises<sup><a href="#footnote-43" className="text-blue-600 hover:text-blue-600">43</a></sup>, while in the medium to long term, reputational or sustainability concerns may impair market access and limit the stability of funding profiles. FIs are, therefore, required to assess liquidity risks across varying time horizons to ensure resilience to ESG-related shocks.</li>
      </ul>
      
      <h4 className="font-semibold mb-2">Challenges in Assessing Sustainability Risks</h4>
      
      <p className="mb-4">
        To integrate ESG risks effectively, FIs must calibrate assessments at the counterparty level, taking into account sector-specific characteristics and combining qualitative and quantitative indicators<sup><a href="#footnote-44" className="text-blue-600 hover:text-blue-600">44</a></sup>. In practice, this often requires the use of data from dedicated ESG providers or partnerships with public initiatives. However, several challenges persist. ESG data for counterparties such as SMEs or companies in emerging markets is often scarce, discouraging investors from allocating capital to sustainable products linked to these entities. Even when data is available, it is frequently inconsistent, incoherent, or insufficiently comparable, making it difficult for FIs to translate ESG information into meaningful expectations about financial performance<sup><a href="#footnote-45" className="text-blue-600 hover:text-blue-600">45</a></sup> or the resilience of business models<sup><a href="#footnote-46" className="text-blue-600 hover:text-blue-600">46</a></sup>. Moreover, most companies still do not integrate ESG factors into their reported data, which limits the ability of FIs to incorporate these considerations into critical risk parameters such as probability of default or loss given default<sup><a href="#footnote-47" className="text-blue-600 hover:text-blue-600">47</a></sup>.
      </p>
    </HybridPage>
  );
};

export { defaultFootnotes };