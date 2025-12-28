import React from 'react';
import { HybridPage } from '../HybridPage';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../ui/table";

interface IntroductionPage3Props {
  pageNumber: number;
  footnoteStart?: number;
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

export const IntroductionPage3: React.FC<IntroductionPage3Props> = ({
  pageNumber,
  footnoteStart = 1,
  width = 794,
  height = 1123,
  showFootnotes = true
}) => {
  const content = (
		<div className="space-y-6">
			{/* Demand-Side vs Supply-Side Challenges Table */}
			<div className="mb-6">
				<Table className="text-xs border-gray-300">
					<TableHeader>
						<TableRow className="border-b border-gray-300 bg-blue-50">
							<TableHead className="text-left font-medium text-gray-800 py-2">
								Demand-Side Challenges (SMEs)
							</TableHead>
							<TableHead className="text-left font-medium text-gray-800 py-2">
								Supply-Side Challenges (Financial Institutions)
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow className="border-b border-gray-200">
							<TableCell className="align-top py-2 text-gray-700">
								Lack of ESG-related data/metrics
							</TableCell>
							<TableCell className="align-top py-2 text-gray-700">
								Frameworks designed for large corporates
							</TableCell>
						</TableRow>
						<TableRow className="border-b border-gray-200">
							<TableCell className="align-top py-2 text-gray-700">
								No clear/applicable ESG standards
							</TableCell>
							<TableCell className="align-top py-2 text-gray-700">
								Do not consider SME-specific constraints
							</TableCell>
						</TableRow>
						<TableRow className="border-b border-gray-200">
							<TableCell className="align-top py-2 text-gray-700">
								Limited knowledge/capacity for ESG integration
							</TableCell>
							<TableCell className="align-top py-2 text-gray-700">
								Too complex, rigid, or inaccessible products
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="align-top py-2 text-gray-700">
								Few technical resources for ESG reporting
							</TableCell>
							<TableCell className="align-top py-2 text-gray-700">
								Dependence on reliable data SMEs lack
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>

			<p className="mb-4">
				The disconnect between both sides has contributed to a significant gap in
				SME-tailored sustainability finance products, leaving a large segment of
				the private sector excluded from Nigeria's transition to a greener and
				more inclusive economy. This exclusion is particularly concerning given
				Nigeria's commitment to achieving net-zero emissions by 2060. SMEs will
				be central to this transition—particularly in energy, agriculture,
				manufacturing, and transport sectors. Yet without practical and scalable
				pathways to align with ESG objectives, they risk being left behind in
				the evolving green economy.
			</p>

			<p className="mb-4">
				This paper – the first in a three-part series – provides a comprehensive
				analysis of both supply-side and demand-side opportunities and challenges
				facing Nigerian SMEs in their pursuit of sustainability-linked capital.
				It seeks to highlight the disconnect between financier expectations and
				SME realities, and to propose actionable recommendations to strengthen
				SME access to sustainable finance.
			</p>
		</div>
	);

  return (
    <HybridPage
      key={`introduction-3-${pageNumber}`}
      pageNumber={pageNumber}
      components={{}}
      footnotes={showFootnotes ? [] : undefined}
      footnoteStart={footnoteStart}
      columns={2}
      width={width}
      height={height}
    >
      {content}
    </HybridPage>
  );
};
