import React from 'react';
import { HybridPage } from '../HybridPage';
import { IntroductionSection } from '../ESGDashboard';
import { defaultFootnotes } from '@/data/esgFootnotes';

interface IntroductionPageProps {
	pageNumber: number;
	footnoteStart?: number;
	width?: number;
	height?: number;
	showFootnotes?: boolean;
}

export const IntroductionPage: React.FC<IntroductionPageProps> = ({
	pageNumber,
	footnoteStart = 1,
	width = 794,
	height = 1123,
	showFootnotes = true
}) => {
	const content = (
		<div className="space-y-6">
			<h1 className="text-xl font-bold mb-4 text-blue-600">
				Bridging the ESG Finance Gap: Demand and Supply-Side Constraints Facing
				Nigerian Small and Medium-Sized Enterprises (SMEs)
			</h1>

			<h2 className="text-xl font-semibold mb-3 mt-6 text-blue-500">
				Introduction
			</h2>

			<p className="mb-4">
				Small and Medium-sized Enterprises (SMEs) form the backbone of economies
				globally, driving inclusive growth, job creation, poverty reduction, and
				innovation. Worldwide, SMEs make up around 90% of businesses and
				contribute over 50% of global GDP
				<sup>
					<a
						href="#footnote-1"
						className="text-blue-600 hover:text-blue-600"
					>
						1
					</a>
				</sup>
				. The impact is even more pronounced in Africa, where they represent
				over 90% of all businesses and provide nearly 80% of total employment
				<sup>
					<a
						href="#footnote-2"
						className="text-blue-600 hover:text-blue-600"
					>
						2
					</a>
				</sup>
				. In Nigeria, SMEs account for 96% of all businesses, contribute 48% to
				national GDP, and employ about half of the country's workforce
				<sup>
					<a
						href="#footnote-3"
						className="text-blue-600 hover:text-blue-600"
					>
						3
					</a>
				</sup>
				.
			</p>
			<p className="mb-4">
				As a dominant force, SMEs are well-positioned to shape environmental,
				social, and governance (ESG) outcomes through their operations,
				workforce practices, and governance structures. Although individual SMEs
				have relatively modest operations, their collective environmental impact
				is substantial, particularly in terms of cumulative carbon emissions. On
				the social front, SME businesses often fall short in addressing labour
				standards, inequality concerns, or broader community development. For
				instance, Nigeria's recent minimum wage increased from ₦30,000 to
				₦70,000
				<sup>
					<a
						href="#footnote-4"
						className="text-blue-600 hover:text-blue-600"
					>
						4
					</a>
				</sup>{" "}
				has not been widely adopted in the SME sector due to affordability
				concerns or weak enforcement. In addition, structured corporate social
				responsibility initiatives are largely absent, even at a small scale.
			</p>

			<p className="mb-4">
				From a governance perspective, many SMEs operate informally or
				semi-formally, with limited or no internal structure to support for
				decision-making, financial transparency, accountability, or regulatory
				compliance. This weak governance framework often leads to mismanagement,
				business fragility, and ultimately financial collapse. Considering that
				SMEs account for the majority of employment in Nigeria, such failures
				contribute significantly to rising unemployment and economic
				instability.
			</p>
			<IntroductionSection />

		</div>
	);

	return (
		<HybridPage
			key={`introduction-${pageNumber}`}
			pageNumber={pageNumber}
			components={{}}
			footnotes={showFootnotes ? defaultFootnotes.slice(0, 4) : undefined}
			footnoteStart={footnoteStart}
			columns={2}
			width={width}
			height={height}
		>
			{content}
		</HybridPage>
	);
};
