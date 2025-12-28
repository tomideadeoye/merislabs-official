import React from 'react';
import { HybridPage } from '../HybridPage';

interface ESGPage9Props {
  pageNumber?: number;
  footnoteStart?: number;
  footnotes?: string[];
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

const defaultFootnotes = [
  'See paragraph 32 of the European Banking Authority Report on Management and Supervision of ESG Risks for Credit Institutions and Investment Firms (EBA/REP/2021/18) (the "**EBA Report**"), which defines ESG Risks as risks of any negative financial impact on an FI stemming from the current or prospective impact of ESG factors on its counterparties or invested assets.',
  'See 34 of the EBA Report.',
  'See paragraph 48 of the EBA Report.',
  'See paragraph 67 of the EBA Report.',
  'See paragraph 77 of the EBA Report.',
  'See paragraph 76 of the EBA Report. See also "European Pillar of Social Rights" which lists 20 principles towards fair and inclusive employment opportunities and social rights and affairs.',
  'See paragraph 86 of the EBA Report.'
];

export const ESGPage9: React.FC<ESGPage9Props> = ({ pageNumber, footnoteStart = 29, footnotes = defaultFootnotes, width = 794, height = 1123, showFootnotes = true }) => {
  return (
		<HybridPage
			pageNumber={pageNumber}
			footnotes={showFootnotes ? [
        "See paragraph 32 of the European Banking Authority Report on Management and Supervision of ESG Risks for Credit Institutions and Investment Firms (EBA/REP/2021/18) (the \"**EBA Report**\"), which defines ESG Risks as risks of any negative financial impact on an FI stemming from the current or prospective impact of ESG factors on its counterparties or invested assets.",
        "See 34 of the EBA Report.",
        "See paragraph 48 of the EBA Report.",
        "See paragraph 67 of the EBA Report.",
        "See paragraph 77 of the EBA Report.",
        "See paragraph 76 of the EBA Report. See also \"European Pillar of Social Rights\" which lists 20 principles towards fair and inclusive employment opportunities and social rights and affairs.",
        "See paragraph 86 of the EBA Report."
      ] : undefined}
			footnoteStart={29}
			components={{}}
			width={width}
			height={height}
		>
			<h3 className="text-lg font-semibold mb-3 text-blue-400">
				Sustainability (ESG) Risks and Management Considerations for the Supply
				Side
			</h3>

			<p className="mb-4">
				For FIs, sustainability risks are not abstract concerns but material
				financial risks that directly affect credit quality, solvency, and
				long-term profitability. Sustainability risks (or ESG risks) arise when
				environmental, social, or governance factors negatively affect the
				financial performance of counterparties, whether corporate borrowers,
				sovereigns, or individuals, and, through them, the balance sheets of
				financing institutions
				<sup>
					<a
						href="#footnote-29"
						className="text-blue-600 hover:text-blue-600"
					>
						29
					</a>
				</sup>
				.
			</p>

			<h4 className="font-semibold mb-2">
				Transmission Channels and Risk Drivers of ESG Risk
			</h4>

			<p className="mb-4">
				ESG risks typically materialise through established financial risk
				categories: credit, market, liquidity, operational, and reputational
				risk. The impacts are transmitted to FIs via their borrowers, clients,
				and invested assets
				<sup>
					<a
						href="#footnote-30"
						className="text-blue-600 hover:text-blue-600"
					>
						30
					</a>
				</sup>{" "}
				through channels such as: (a) reduced profitability and cashflow of
				counterparties; (b) declining collateral and asset values (e.g., real
				estate, stranded assets); (c) deterioration of asset performance; (d)
				increased compliance and legal costs; and (e) loss of customer and
				investor confidence (reputational damage)
				<sup>
					<a
						href="#footnote-31"
						className="text-blue-600 hover:text-blue-600"
					>
						31
					</a>
				</sup>
				.
			</p>

			{/* Added image showing pillars of ESG risk drivers */}
			<div className="my-6 flex justify-center">
				<img
					src="/bridgin_financing_gap/three_pillars_of_esg_risk.png"
					alt="Pillars of ESG Risk Drivers"
					className="max-w-full h-auto rounded-lg shadow-md"
				/>
			</div>
			<div className="my-6 flex justify-center">
				<img
					src="/bridgin_financing_gap/litigation_risk_theme.png"
					alt="Governance Challenges and Opportunities"
					className="max-w-full h-auto rounded-lg shadow-md"
				/>
			</div>

			<h4 className="font-semibold mb-2">Environmental Risk Drivers</h4>

			<p className="mb-4">
				Environmental risks arise from both physical risks (direct consequences
				of climate change and environmental degradation) and transition risks
				(shifts in policy, technology, or market behaviour during the transition
				to a sustainable economy)
				<sup>
					<a
						href="#footnote-32"
						className="text-blue-600 hover:text-blue-600"
					>
						32
					</a>
				</sup>
				.
			</p>

			<ul className="list-disc pl-6 mb-4">
				<li className="mb-2">
					<strong>Physical risks:</strong> Floods, droughts, and pollution can
					reduce counterparties' productivity and profitability. For example, a
					borrower in the agricultural sector affected by oil spill
					contamination may face declining yields, higher default probability,
					and greater credit risk for the lending FI.
				</li>
				<li>
					<strong>Transition risks:</strong> Policy shifts such as carbon taxes
					or stricter environmental regulations can erode profitability for
					carbon-intensive businesses. Technological change and consumer
					preference shifts (e.g., away from fossil fuels) can lower the value
					of collateral and lead to stranded assets
					<sup>
						<a
							href="#footnote-33"
							className="text-blue-600 hover:text-blue-600"
						>
							33
						</a>
					</sup>
					.
				</li>
			</ul>

			<h4 className="font-semibold mb-2">Social Risk Drivers</h4>

			<p className="mb-4">
				Social risks stem from how counterparties manage relationships with
				their workforce, communities, and consumers
				<sup>
					<a
						href="#footnote-34"
						className="text-blue-600 hover:text-blue-600"
					>
						34
					</a>
				</sup>
				. Key issues include labour rights, diversity and inclusion, working
				conditions, and access to essential services
				<sup>
					<a
						href="#footnote-35"
						className="text-blue-600 hover:text-blue-600"
					>
						35
					</a>
				</sup>
				. Further, violations of labour rights or community relations can
				trigger litigation, reputational damage, or operational disruption. For
				instance, the COVID-19 pandemic illustrated how systemic social shocks
				affect creditworthiness: widespread lockdowns reduced SME revenues,
				raised unemployment, and increased credit risks across bank portfolios.
				For Nigerian SMEs, these risks are magnified given limited resilience
				and weaker labour protections.
			</p>
		</HybridPage>
	);
};

export { defaultFootnotes };