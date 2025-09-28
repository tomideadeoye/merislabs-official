import React from 'react';
import { HybridPage } from '../HybridPage';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../ui/table";import { IntroductionSection } from '../ESGDashboard';
interface IntroductionPage2Props {
  pageNumber: number;
  footnoteStart?: number;
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

export const IntroductionPage2: React.FC<IntroductionPage2Props> = ({
  pageNumber,
  footnoteStart = 5,
  width = 794,
  height = 1123,
  showFootnotes = true
}) => {
  const content = (
		<div className="space-y-6">
			<p className="mb-4">
				Despite their economic importance, Nigerian SMEs continue to face
				structural barriers to growth, particularly limited access to finance.
				According to PwC's 2023 MSME Survey, 69% of SMEs had not received any
				government grants in the preceding 24 months, with many citing
				bottlenecks and low trust in the formal banking system as key obstacles
				to financing access.
				<sup>
					<a
						href="#footnote-5"
						className="text-blue-600 hover:text-blue-600"
					>
						5
					</a>
				</sup>{" "}
				These findings echo the World Bank's <i>Doing Business</i> report, which
				ranked Nigeria 131st out of 190 economies in terms of ease of starting a
				business
				<sup>
					<a
						href="#footnote-6"
						className="text-blue-600 hover:text-blue-600"
					>
						6
					</a>
				</sup>{" "}
				.
			</p>
			<p className="mb-4">
				SMEs, by virtue of their ubiquity, are both potential drivers of
				sustainable development and, conversely, sources of unsustainable
				practices due to systemic constraints. It is important to address their
				financing-access gap, especially through solutions aligned with ESG
				principles. Strengthening SMEs' ESG practices is not only essential to
				advancing sustainability but also to strengthening the long-term
				resilience and competitiveness of economies like Nigeria.
			</p>
			<p className="mb-4">
				Concurrently, the financial ecosystem is undergoing a structural shift
				towards achieving the Sustainable Development Goals
				<sup>
					<a
						href="#footnote-7"
						className="text-blue-600 hover:text-blue-600"
					>
						7
					</a>
				</sup>
				. ESG considerations are now central to capital allocation, driven by
				international climate commitments (such as the Paris Agreement
				<sup>
					<a
						href="#footnote-8"
						className="text-blue-600 hover:text-blue-600"
					>
						8
					</a>
				</sup>
				), growing investor interest, and the rise of sustainability-linked
				financial instruments. Financial institutions including banks, DFIs,
				venture capitalists, and insurers are now embedding ESG factors into
				their lending and investment frameworks. This shift, however, requires
				all borrowers, including SMEs, to demonstrate credible sustainability
				credentials through robust ESG metrics, climate-related disclosures, and
				demonstrable alignment with social or environmental goals.
			</p>
			<p className="mb-4">
				This convergence creates a paradox. On one hand, Nigerian SMEs face a
				deep and persistent financing gap, worsened by macroeconomic
				instability, regulatory uncertainty, and limited capacity to scale. On
				the other hand, there is a growing pool of sustainability-linked capital
				seeking credible investment opportunities in developing markets. These
				include impact and blended finance instruments, as well as sustainable
				finance products such as green, social and, sustainability-linked loans.
				Yet, Nigerian SMEs have largely been excluded from this momentum
				systemic barriers continue to restrict their access to such financing
				options.
			</p>
			<p className="mb-4">
				On the demand side, SMEs face internal barriers such as the absence of
				ESG-related data or metrics, the lack tailored ESG standards, and
				limited awareness or capacity to integrate ESG considerations into daily
				operations or long-term strategy. Most SMEs also lack the technical
				resources to track, measure, or report on ESG performance and, these are
				often required by sustainability-focused lenders and investors. On the
				supply side, financial institutions are developing internal ESG
				frameworks in response to evolving regulatory requirements and
				international standards. However, these frameworks are typically
				designed for large corporates and rarely account for the unique
				constraints of SMEs. As a result, sustainable finance products are often
				too complex, rigid, or inaccessible for SMEs to access effectively.
				Moreover, government and market-level interventions intended to support
				MSMEs often prove ineffective or remain underutilized.
			</p>
			<p className="mb-4">
				For example, although Nigeria has introduced initiatives such as the
				National Collateral Registry, the Development Bank of Nigeria, and the
				Bank of Industry's energy-efficient loan schemes, their overall impact
				remains limited. The PwC MSME Survey (2024) further highlights priority
				areas for reforms, including: (i) improving access to affordable
				finance; (ii) streamlining regulatory burdens; (iii) enhancing MSME
				adaptability to shifting market conditions; and (iv) accelerating
				digital and green transformation through targeted incentives
				<sup>
					<a
						href="#footnote-9"
						className="text-blue-600 hover:text-blue-600"
					>
						9
					</a>
				</sup>
				.
			</p>{" "}
		</div>
	);

  return (
    <HybridPage
      key={`introduction-2-${pageNumber}`}
      pageNumber={pageNumber}
      components={{}}
      footnotes={showFootnotes ? [
        "PwC Nigeria (2024) *PwC MSME Survey Report 2024*. Available at: <https://www.pwc.com/ng/en/assets/pdf/pwc-msme-survey-report-2024.pdf> (Accessed 3 August 2025)",
        "World Bank (n.d.) *Doing business economy profile: Nigeria*. Available at: <https://archive.doingbusiness.org/en/data/exploreeconomies/nigeria> (Accessed 3 August 2025)",
        "The United Nations Sustainable Development Goals adopted by all UN member states in 2015 comprises a global agenda to alleviate poverty and inequality, expand access to health and education, and spur economic growth and employment, while tackling climate change and working to preserve the world's habitats by 20230.",
        "The Paris Agreement is a legally binding international treaty on climate change adopted in December 2015 under the United Nations Framework Convention on Climate Change (UNFCCC). Its central aim is to limit global warming to well below 2°C, preferably 1.5°C, above pre-industrial levels, through commitments by countries (Nationally Determined Contributions) to reduce greenhouse gas emissions and strengthen climate resilience.",
        "PwC Nigeria (2024) *PwC MSME Survey Report 2024*. Available at: <https://www.pwc.com/ng/en/assets/pdf/pwc-msme-survey-report-2024.pdf> (Accessed 3 August 2025)"
      ] : undefined}
      footnoteStart={5}
      useColumns={true}
      width={width}
      height={height}
    >
      {content}
    </HybridPage>
  );
};