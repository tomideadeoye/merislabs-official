import React from 'react';
import { HybridPage } from '../HybridPage';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Shield, Globe } from 'lucide-react';
import { DataDeficiencyCycle } from 'components/infographics/DataDeficiencyCycle';
import { AwarenessToActionChasm } from 'components/infographics/AwarenessToActionChasm';

interface InternalBarriersPageProps {
  pageNumber: number;
  footnoteStart?: number;
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

export const InternalBarriersPage1: React.FC<InternalBarriersPageProps> = ({
  pageNumber,
  footnoteStart = 10,
  width = 794,
  height = 1123,
  showFootnotes = true
}) => {
  return (
		<HybridPage
			key={`internal-barriers-1-${pageNumber}`}
			pageNumber={pageNumber}
			components={{}}
			footnotes={
				showFootnotes
					? [
							"OECD (2022) Financing SMEs for sustainability. Page 43 – Information and awareness-related barriers. Available at:  <https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/12/financing-smes-for-sustainability_19414952/a5e94d92-en.pdf> (Accessed 3 August 2025)",
							"World Economic Forum (2025) *Fast-tracking SME sustainability could accelerate global climate targets and unlock economic value*. <https://www.weforum.org/press/2025/06/fast-tracking-sme-sustainability-could-accelerate-global-climate-targets-and-unlock-economic-value-says-new-report/> (Accessed 3 August 2025)",
							"IFRS Foundation (n.d.) *Nigeria – Jurisdictional Profile*. <https://www.ifrs.org/content/dam/ifrs/publications/sustainability-jurisdictions/pdf-profiles/nigeria-ifrs-profile.pdf> (Accessed 3 August 2025)"
					  ]
					: undefined
			}
			footnoteStart={footnoteStart}
			useColumns={true}
			width={width}
			height={height}
		>
			<h2 className="text-xl font-semibold mb-3 text-blue-500">DEMAND SIDE</h2>
			<p className="mb-4">
				Despite the expanding pool of sustainability-linked capital, Nigerian
				SMEs remain largely excluded from accessing it, due to persistent
				demand-side constraints. As global and domestic capital flows
				increasingly prioritise ESG considerations, SMEs face growing
				expectations that they are often unprepared to meet.
			</p>
			<p className="mb-4">
				This exclusion chiefly stems from structural and institutional
				challenges within the SME segment itself. These demand-side barriers can
				be grouped into two categories:
			</p>
			<div className="grid w-full max-w-xl items-start gap-4 mb-4">
				<Alert>
					<Shield className="h-4 w-4" />
					<AlertTitle>Internal Barriers</AlertTitle>
					<AlertDescription>
						<p>Challenges within SMEs, such as:</p>
						<ul className="list-inside list-disc text-sm mt-1">
							<li>Limited ESG awareness</li>
							<li>Weak reporting capacity</li>
							<li>Resource constraints</li>
						</ul>
					</AlertDescription>
				</Alert>
				<Alert>
					<Globe className="h-4 w-4" />
					<AlertTitle>External Barriers</AlertTitle>
					<AlertDescription>
						<p>Challenges across the wider ecosystem, including:</p>
						<ul className="list-inside list-disc text-sm mt-1">
							<li>Inadequate ESG infrastructure</li>
							<li>Insufficient incentives</li>
							<li>Fragmented guidance frameworks</li>
						</ul>
					</AlertDescription>
				</Alert>
			</div>
			<p className="mb-4">
				Together, these factors undermine SME readiness and credibility,
				restricting their participation in sustainable finance landscape and
				widening the gap between the availability of capital and the ability to
				access it.
			</p>
			<h3 className="text-lg font-semibold mb-3 text-blue-400">
				INTERNAL BARRIERS
			</h3>
			<h4 className="font-semibold mb-2">Limited Awareness:</h4>

			<p className="mb-3">
				Many SMEs remain unaware of ESG-linked finance and its associated
				reporting requirements. This knowledge gap extends to critical concepts
				such as ESG metrics, climate risk disclosures, and performance-based
				loan covenants.
				<sup>
					<a
						href="#footnote-10"
						className="text-blue-600 hover:text-blue-600"
					>
						10
					</a>
				</sup>{" "}
				A 2023 global survey revealed that while 83% of SMEs
				recognise the importance of sustainability, only 8% actually report on
				sustainability issues, underscoring the gap between recognition and
				practical integration.
				<sup>
					<a
						href="#footnote-11"
						className="text-blue-600 hover:text-blue-600"
					>
						11
					</a>
				</sup>{" "}
				In Nigeria, insufficient awareness is
				consistently cited as a key reason for limited sustainability reporting,
				with many SMEs lacking the necessary knowledge and resources to track
				and disclose their ESG performance.
				<sup>
					<a
						href="#footnote-12"
						className="text-blue-600 hover:text-blue-600"
					>
						12
					</a>
				</sup>{" "}
				To address this, initiatives led by
				organizations such as the UN Global Compact Network Nigeria, in
				collaboration with the Financial Reporting Council of Nigeria (FRC) and
				Integrity Organisation, have introduced guidelines such as the Small and
				Medium Enterprises Corporate Governance Guidelines (SME-CGG).
			</p>
			<AwarenessToActionChasm />
		</HybridPage>
	);
};

export const InternalBarriersPage2: React.FC<InternalBarriersPageProps> = ({
  pageNumber,
  footnoteStart = 13,
  width = 794,
  height = 1123,
  showFootnotes = true
}) => {
  return (
		<HybridPage
			key={`internal-barriers-2-${pageNumber}`}
			pageNumber={pageNumber}
			components={{}}
			footnotes={
				showFootnotes
					? [
							"G20 Sustainable Finance Working Group & OECD (2024) *Implementing Sustainability Reporting that Works for SMEs*. Available at: <https://g20sfwg.org/wp-content/uploads/2024/06/P3-G20-SFWG-OECD-Implementing-sustainability-reporting-that-works-for-SMEs.pdf> (Accessed 3 August 2025)",
							"G20 Sustainable Finance Working Group & OECD (2024) *Implementing Sustainability Reporting that Works for SMEs*. Available at: <https://g20sfwg.org/wp-content/uploads/2024/06/P3-G20-SFWG-OECD-Implementing-sustainability-reporting-that-works-for-SMEs.pdf> (Accessed 3 August 2025)",
							"For example, Regulation (EU) 2019/2088 (the \"**Sustainable Finance Disclosure Regulation**\" or \"**SFDR**\") lays down harmonised transparency rules for FMPs and their professional advisers on how they integrate ESG factors into their investment decisions and financial advice and on their overall and product-related sustainability ambition.",
							"See recital 12 of the SFDR, by which FMPs and their advisers are expected to specify in their policies how they integrate sustainability risks that might have a relevant material negative impact on the financial return of an investment or advice.",
							"Hogan Lovells (n.d.) *Are SMEs Being Excluded from Sustainable Finance?* Available at: <https://www.hoganlovells.com/en/publications/are-smes-being-excluded-from-sustainable-finance> (Accessed 3 August 2025)"
					  ]
					: undefined
			}
			footnoteStart={footnoteStart}
			useColumns={true}
			width={width}
			height={height}
		>
			<h4 className="font-semibold mb-2">Poor Reporting Capacity:</h4>
			<p className="mb-4">
				Few small firms have the systems required to track non-financial
				performance. A global study revealed that only about 9% of SMEs operate
				formal sustainability-reporting programmes, largely due to constraints
				of time, expertise, and budget.
				<sup>
					<a
						href="#footnote-13"
						className="text-blue-600 hover:text-blue-600"
					>
						13
					</a>
				</sup>{" "}
				Without baseline data on emissions,
				water use, waste generation, employee metrics, or governance practices,
				SMEs are unable to meet the minimum entry requirements for green bonds,
				sustainability-linked loans, or climate funds.
			</p>
            <DataDeficiencyCycle />
			<h4 className="font-semibold mb-2">Resource Constraints:</h4>
			<p className="mb-4">
				In Nigeria, this gap is even more pronounced. A 2023 industry study
				concluded that "the vast majority of SMEs do not collect or manage any
				form of ESG-related data."
				<sup>
					<a
						href="#footnote-14"
						className="text-blue-600 hover:text-blue-600"
					>
						14
					</a>
				</sup>{" "}
				Reported challenges include (a) lack of
				consistent and reliable data on ESG metrics; (b) difficulty in measuring
				and quantifying social and environmental impacts; and (c) financial and
				resource constraints.
				<sup>
					<a
						href="#footnote-15"
						className="text-blue-600 hover:text-blue-600"
					>
						15
					</a>
				</sup>{" "}
				The informal nature of many Nigerian SMEs further
				exacerbates this issue, with some lacking even basic financial records.
				This creates a vicious cycle: data gaps hinder reporting, poor reporting
				limits access to sustainable finance, and lack of financing prevents
				investment in the very systems needed to improve reporting. Addressing
				this requires solutions that build fundamental data infrastructure and
				literacy, including business formalisation and digital transformation,
				which can then be leveraged for sustainability reporting. The complexity
				and fragmentation of current reporting regimes also highlight the need
				for simplified, standardized, and interoperable reporting frameworks
				tailored specifically for SMEs.
				<sup>
					<a
						href="#footnote-16"
						className="text-blue-600 hover:text-blue-600"
					>
						16
					</a>
				</sup>
			</p>
			
			<h4 className="font-semibold mb-2">Limited Staff and Tools:</h4>

			<p className="mb-4">
				Most SMEs lack in-house ESG specialists and adequate data-management
				tools, making the collection and verification of ESG indicators
				difficult. Reports indicate that the vast majority of SMEs neither
				employ sustainability experts nor use automated systems, which prevents
				them from responding effectively to lenders' data requests.
				<sup>
					<a
						href="#footnote-17"
						className="text-blue-600 hover:text-blue-600"
					>
						17
					</a>
				</sup>{" "}
				As a result,
				they struggle to produce the disclosures necessary for banks or
				investors to assess sustainability performance, conduct due diligence,
				or structure performance-based pricing. Addressing this requires two
				parallel solutions. Firstly, the development and promotion of
				accessible, affordable, and user-friendly digital tools for ESG data
				collection and reporting – tools that are localised, intuitive, and
				easily integrated into existing SME workflows. Achieving this will
				require collaboration between technology providers, financial
				institutions, and SME-support organizations. Secondly, beyond
				technological tools, the human-capital gap within SMEs must be tackled
				through systematic upskilling of existing staff in sustainability
				principles and practices, complemented by accessible pools of external
				advisory support.
			</p>


		</HybridPage>
	);
};

export const InternalBarriersPage3: React.FC<InternalBarriersPageProps> = ({
  pageNumber,
  footnoteStart = 17,
  width = 794,
  height = 1123,
  showFootnotes = true
}) => {
  return (
		<HybridPage
			key={`internal-barriers-3-${pageNumber}`}
			pageNumber={pageNumber}
			components={{}}
			footnotes={
				showFootnotes
					? [
							"See paragraph 86 of the EBA Report.",
							"G20 Sustainable Finance Working Group & OECD (2024) *Implementing Sustainability Reporting that Works for SMEs*. Available at: <https://g20sfwg.org/wp-content/uploads/2024/06/P3-G20-SFWG-OECD-Implementing-sustainability-reporting-that-works-for-SMEs.pdf> (Accessed 3 August 2025)",
							"G20 Sustainable Finance Working Group & OECD (2024) *Implementing Sustainability Reporting that Works for SMEs*. Available at: <https://g20sfwg.org/wp-content/uploads/2024/06/P3-G20-SFWG-OECD-Implementing-sustainability-reporting-that-works-for-SMEs.pdf> (Accessed 3 August 2025)",
							"For example, Regulation (EU) 2019/2088 (the \"**Sustainable Finance Disclosure Regulation**\" or \"**SFDR**\") lays down harmonised transparency rules for FMPs and their professional advisers on how they integrate ESG factors into their investment decisions and financial advice and on their overall and product-related sustainability ambition.",
							"See recital 12 of the SFDR, by which FMPs and their advisers are expected to specify in their policies how they integrate sustainability risks that might have a relevant material negative impact on the financial return of an investment or advice.",
							"Sage (2024) *Unlocking Sustainable Finance for SMEs: COP29 Report*. Available at: <https://www.sage.com/en-gb/-/media/files/company/documents/pdf/sustainability-and-society/2024-reports/unlocking-sustainable-finance-for-smes-report-cop-29-final.pdf> (Accessed 3 August 2025)"
					  ]
					: undefined
			}
			footnoteStart={footnoteStart}
			useColumns={true}
			width={width}
			height={height}
		>
			<div className="mb-6 flex justify-center">
				<img
					src="/bridgin_financing_gap/top_barriers_to_sustainability.png"
					alt="Internal Barriers to ESG Integration"
					className="max-w-full h-auto rounded-lg shadow-md"
					style={{ width: "70%", height: "auto" }}
				/>
			</div>

			<h4 className="font-semibold mb-2">High Uncertainty:</h4>

			<p className="mb-4">
				SMEs also operate in highly volatile markets characterised by policy
				shifts and economic instability, which the OECD identifies as "one of
				the greatest barriers" for SMEs in pursuing green initiatives
				<sup>
					<a
						href="#footnote-18"
						className="text-blue-600 hover:text-blue-600"
					>
						18
					</a>
				</sup>
				. SMEs often hesitate to invest in sustainability due to concerns about
				uncertain returns or future regulatory changes. A 2025 World Economic
				Forum (WEF) report found that 47% of manufacturing SMEs cited "policy
				uncertainty" as a significant barrier
				<sup>
					<a
						href="#footnote-19"
						className="text-blue-600 hover:text-blue-600"
					>
						19
					</a>
				</sup>
				. While Nigeria has endorsed the adoption of ISSB's IFRS S1 and S2
				standards with mandatory ESG disclosures from 2028, the phased
				implementation implies a period of voluntary adoption where clarity may
				still be developing
				<sup>
					<a
						href="#footnote-20"
						className="text-blue-600 hover:text-blue-600"
					>
						20
					</a>
				</sup>
				. Broader macroeconomic developments such as fuel
				subsidy removals and exchange rate reforms, further contribute to
				instability, undermining SMEs' ability for long-term planning, including
				sustainability investments. This "regulatory lag" fosters a
				"wait-and-see" mentality.
			</p>
			
			<p className="mb-4">
				To counter this, clear, consistent, and long-term policy signals from
				governments are critical, including a stable regulatory environment,
				well-defined incentives, and a transparent roadmap for sustainability
				integration. Furthermore, the WEF survey also highlights that 53% of
				SMEs identify competing priorities such as cost pressures and business
				expansion as the main obstacles. This suggests that even with regulatory
				clarity, immediate financial and operational constraints make long-term
				sustainability investments a lower priority .
			</p><div className="my-6 flex justify-center">
				<img
					src="/bridgin_financing_gap/nigeria_regulatory_lag_timeline.png"
					alt="High Uncertainty in ESG Investments"
					className="max-w-full h-auto rounded-lg shadow-md"
					style={{ width: "90%", height: "auto" }}
				/>
			</div>
			<h4 className="font-semibold mb-2">Short-term Survival Focus:</h4>

			<p className="mb-4">
				Operating on tight margins, SMEs tend to prioritize immediate needs over
				long-term sustainability, often putting ESG initiatives on the back
				burner due to time and cash pressures. In practice, this means survival
				needs often supersede strategic green planning, and ESG becomes a "nice
				to have" rather than a core business priority, especially when its
				return on investment (ROI) is uncertain or indirect. PwC's MSME Survey
				2024 in Nigeria found "inadequate access to finance" as the number one
				challenge for 35% of businesses, while over 50% reported falling sales
				due to high prices and weak consumer spending power
				<sup>
					<a
						href="#footnote-21"
						className="text-blue-600 hover:text-blue-600"
					>
						21
					</a>
				</sup>
				. Other reports highlight additional pressures such as "obtaining
				finance, finding customers and infrastructure deficits"
				<sup>
					<a
						href="#footnote-22"
						className="text-blue-600 hover:text-blue-600"
					>
						22
					</a>
				</sup>
				. These factors
				directly explain why short-term cashflow and immediate survival dominate
				SME priorities.
			</p>

			<div className="my-4 flex justify-center space-x-4">
				<img
					src="/bridgin_financing_gap/falling_sales_challenge.png"
					alt="Fragmented Information Landscape"
					className="max-w-full h-auto rounded-lg shadow-md"
					style={{ width: "50%", height: "auto" }}
				/>
				<img
					src="/bridgin_financing_gap/access_to_finance_priority.png"
					alt="Demand-Side vs Supply-Side Challenges"
					className="max-w-full h-auto rounded-lg shadow-md"
					style={{ width: "50%", height: "auto" }}
				/>
			</div>
		</HybridPage>
	);
};