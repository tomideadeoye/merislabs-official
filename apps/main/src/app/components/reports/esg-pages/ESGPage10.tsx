import React from 'react';
import { HybridPage } from '../HybridPage';

interface ESGPage10Props {
  pageNumber?: number;
  footnoteStart?: number;
  footnotes?: string[];
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

const defaultFootnotes = [
   "See paragraph 86 of the EBA Report.",
   "Nigeria maintains strict laws against economic and financial crimes superintended by the primary financial intelligence authority, the Nigerian Financial Intelligence Unit and the Economic and Financial Crimes Commission, through a slew of legislation including the Nigeria Financial Intelligence Unit Act 2018, the Economic and Financial Crimes Commission (Establishment) Act, 2004Money Laundering (Prevention and Prohibition) Act 2022, Terrorism Prevention and Prohibition Act 2022, and the Corrupt Practices and Other Related Offences Act, 2003.",
   "See paragraph 108 of the EBA Report.",
   "See paragraph 131 of the EBA Report.",
   "See paragraph 135 of the EBA Report."
];

export const ESGPage10: React.FC<ESGPage10Props> = ({ pageNumber, footnoteStart = 36, footnotes = defaultFootnotes, width = 794, height = 1123, showFootnotes = true }) => {
  return (
		<HybridPage
			pageNumber={pageNumber}
			footnotes={showFootnotes ? defaultFootnotes : undefined}
			footnoteStart={36}
			components={{}}
			width={width}
			height={height}
		>
			
			<h4 className="font-semibold mb-2">Governance Risk Drivers</h4>
			<p className="mb-4">
				Governance factors affect the transparency, integrity, and long-term
				sustainability of counterparties. Weak governance undermines financial
				performance and increases FI exposure{" "}
				<sup>
					<a
						href="#footnote-36"
						className="text-blue-600 hover:text-blue-600"
					>
						36
					</a>
				</sup>
				{" "}. Common drivers include poor internal controls, inadequate financial reporting, lack of board independence, and corruption. Nigerian SMEs face heightened governance risks due to informality, weak disclosure practices, and limited oversight capacity. Failures in corporate governance can escalate into broader reputational crises, especially since economic crim such as bribery, corruption, or money laundering scandals attract regulatory and market sanctions<sup><a href="#footnote-37" className="text-blue-600 hover:text-blue-600">37</a></sup>.
			</p>{" "}
			<h4 className="font-semibold mb-2">Litigation (Liability) Risk</h4>
			<p className="mb-4">
				Litigation risk cuts across environmental, social, and governance
				issues. Counterparties may face lawsuits for environmental damage,
				discriminatory labour practices, corruption, or regulatory breaches.
				Such claims can impair counterparties' financial performance, reduce
				their ability to repay, and create direct financial and reputational
				exposure for FIs.
			</p>
			<h4 className="font-semibold mb-2">FI Risk Management Obligations</h4>
			<p className="mb-4">
				To mitigate sustainability risks, FIs are expected to embed ESG risk
				considerations within their overall business strategy; define and
				disclose their ESG risk appetite; establish clear governance structures
				with assigned responsibilities for ESG risk management; and maintain
				robust risk management frameworks capable of identifying ESG exposures,
				addressing data and methodology gaps, and stress-testing resilience. By
				aligning their investment and lending activities with ESG risk
				principles, FIs not only protect their balance sheets but also reinforce
				the integrity and scalability of the broader sustainable finance
				ecosystem.
			</p>
			<h4 className="font-semibold mb-2">
				Assessment of Financial Risk Categories Occasioned by Sustainability
				Risks
			</h4>
			<p className="mb-4">
				Operating in fast-evolving markets, FIs must carry out regular
				assessments to identify both current and prospective impacts of ESG
				factors on counterparties or invested assets. This requires the
				integration of ESG risks into their business strategies, internal
				governance arrangements and overall risk management frameworks.
			</p>
			<p className="mb-4">
				According to the EBA Report, three main approaches are used in assessing
				ESG risks – the portfolio alignment method, the risk framework method,
				and the exposure method{" "}
				<sup>
					<a
						href="#footnote-38"
						className="text-blue-600 hover:text-blue-600"
					>
						38
					</a>
				</sup>
				. Of these, the exposure method is regarded as the most practical. It
				involves a direct assessment of individual counterparties and exposures
				and covers all three aspects of ESG. This method evaluates the ESG
				attributes of a counterparty or exposure at company level, calibrated by
				granular sectoral characteristics, and the results are then used to
				complement the standard assessment of financial risk categories{" "}
				<sup>
					<a
						href="#footnote-39"
						className="text-blue-600 hover:text-blue-600"
					>
						39
					</a>
				</sup>
				. Methodologies employed under this approach include ESG ratings
				provided by specialised rating agencies, ESG evaluations from credit
				rating agencies, ESG evaluation models developed in-house by banks for,
				and ESG scoring models created by asset managers or public data
				providers{" "}
				<sup>
					<a
						href="#footnote-40"
						className="text-blue-600 hover:text-blue-600"
					>
						40
					</a>
				</sup>
				. However, as noted in the demand-side section above, SMEs frequently
				lack the data and transparency necessary for this exposure-based
				assessment, which makes it particularly challenging for FIs to extend
				sustainable finance products to them.
			</p>
		</HybridPage>
	);
};

export { defaultFootnotes };