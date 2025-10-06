import React from 'react';
import { HybridPage } from '../HybridPage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ESGPage12Props {
  pageNumber?: number;
  footnoteStart?: number;
  footnotes?: string[];
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

const defaultFootnotes = [
  'See recital 14 of the Taxonomy Regulation.',
  'These disclosures are required, especially as the FIs are acting as agents of those end-investors. See recital 10 of the Taxonomy Regulation.',
  'Ibid.',
  'Established pursuant to Articles 10(3), 11(3), 12(2), 13(2), 14(2), and 15(2) of the Taxonomy Regulation',
  'The technical screening criteria are based on scientific evidence, takes into account life-cycle considerations, including existing life-cycle assessments and are update regularly. See recital 40 of the Taxonomy Regulation. Information and disclosures received from FIs and other financial market participants assist in updating the technical screening criteria.',
  'The Climate Change Act provides a framework for achieving low greenhouse gas emission (GHG), inclusive green growth and sustainable economic development through, inter alios, facilitating the mobilisation of finance and other resources necessary to ensure effective action on climate change and ensuring that private and public entities comply with stated climate change strategies, targets and National Climate Change Action Plan.',
  'See recital 28 of the Sustainable Finance Disclosure Regulation'
];

export const ESGPage12: React.FC<ESGPage12Props> = ({
  pageNumber,
  footnoteStart = 48,
  footnotes = defaultFootnotes,
  width = 794,
  height = 1123,
  showFootnotes = true
}) => {
  return (
		<HybridPage
			pageNumber={pageNumber}
			footnotes={
				showFootnotes
					? [
							'See recital 18 of Regulation (EU) 2020/852 on the establishment of a framework to facilitate sustainable investment (the "**Taxonomy Regulation**") which, amends the Sustainable Finance Disclosure Regulation.',
							"See recital 14 of the Taxonomy Regulation.",
							"These disclosures are required, especially as the FIs are acting as agents of those end-investors. See recital 10 of the Taxonomy Regulation.",
							"Ibid.",
							"Established pursuant to Articles 10(3), 11(3), 12(2), 13(2), 14(2), and 15(2) of the Taxonomy Regulation",
							"The technical screening criteria are based on scientific evidence, takes into account life-cycle considerations, including existing life-cycle assessments and are update regularly. See recital 40 of the Taxonomy Regulation. Information and disclosures received from FIs and other financial market participants assist in updating the technical screening criteria.",
							"The Climate Change Act provides a framework for achieving low greenhouse gas emission (GHG), inclusive green growth and sustainable economic development through, inter alios, facilitating the mobilisation of finance and other resources necessary to ensure effective action on climate change and ensuring that private and public entities comply with stated climate change strategies, targets and National Climate Change Action Plan.",
							'For example, Regulation (EU) 2019/2088 (the "Sustainable Finance Disclosure Regulation" or "SFDR") lays down harmonised transparency rules for FMPs and their professional advisers on how they integrate ESG factors into their investment decisions and financial advice and on their overall and product-related sustainability ambition.',
							"See recital 12 of the SFDR, by which FMPs and their advisers are expected to specify in their policies how they integrate sustainability risks that might have a relevant material negative impact on the financial return of an investment or advice.",
							'See paragraph 32 of the European Banking Authority Report on Management and Supervision of ESG Risks for Credit Institutions and Investment Firms (EBA/REP/2021/18) (the "EBA Report"), which defines ESG Risks as risks of any negative financial impact on an FI stemming from the current or prospective impact of ESG factors on its counterparties or invested assets.',
							"The FI is vulnerable to external shocks within an ESG context. Where the counterparty/borrower is affected by an of the ESG drivers it affects the counterparty's risk profile ais transmitted to the FI's balance sheet. See 34 of the EBA Report.",
							"See paragraph 48 of the EBA Report.",
							"See paragraph 67 of the EBA Report.",
							"See paragraph 77 of the EBA Report.",
							'See paragraph 76 of the EBA Report. See also "European Pillar of Social Rights" which lists 20 principles towards fair and inclusive employment opportunities and social rights and affairs.',
							"See recital 28 of the Sustainable Finance Disclosure Regulation",
					  ]
					: undefined
			}
			footnoteStart={48}
			components={{}}
			width={width}
			height={height}
		>
			<h3 className="text-lg font-semibold mb-3 text-blue-400">
				Sustainability Disclosures for the Financial Services Sector
			</h3>

			<p className="mb-4">
				FIs that provide financial products, as well as market participants that
				promote products with sustainability objectives are required to make
				comprehensive disclosures. These disclosures build end-investor
				confidence by clarifying the degree of sustainability investment, with
				most disclosure regimes placing emphasis on environmental
				considerations.
			</p>

			<p className="mb-4">
				These disclosures typically cover (i) the environmental objectives to
				which underlying investments contribute (ii) how and to what extent
				criteria for sustainable economic activities are applied, including ESG
				risk management and governance practices; and (iii) the extent to which
				sustainable products invest in activities meeting the sustainability
				criteria
				<sup>
					<a href="#footnote-48" className="text-blue-600 hover:text-blue-600">
						48
					</a>
				</sup>
				.
			</p>

			<p className="mb-4">
				Disclosure regulations such as the SFDR and the Taxonomy Regulation
				impose obligations specifically on FIs, market participants, and issuers
				of sustainable products
				<sup>
					<a href="#footnote-49" className="text-blue-600 hover:text-blue-600">
						49
					</a>
				</sup>{" "}
				requiring them to provide both pre-contractual and ongoing disclosures
				to end-investors
				<sup>
					<a href="#footnote-50" className="text-blue-600 hover:text-blue-600">
						50
					</a>
				</sup>
				. These frameworks aim to reduce information asymmetries in the
				principal-agent relationship by clarifying how sustainability risks are
				integrated, how adverse sustainability impacts are considered, and how
				environmental or social characteristics are promoted
				<sup>
					<a href="#footnote-51" className="text-blue-600 hover:text-blue-600">
						51
					</a>
				</sup>
				. They also strengthen transparency, enhance investor protection, and
				provide comparable benchmarks on the proportion of investments aligned
				with sustainable economic activities.
			</p>

			<p className="mb-4">
				At the EU level, regulations establish technical screening criteria
				regime
				<sup>
					<a href="#footnote-52" className="text-blue-600 hover:text-blue-600">
						52
					</a>
				</sup>{" "}
				for environmental objectives, notably climate change mitigation, with
				provisions for regular updates to reflect evolving science and
				technology
				<sup>
					<a href="#footnote-53" className="text-blue-600 hover:text-blue-600">
						53
					</a>
				</sup>
				.
			</p>

			<h4 className="font-semibold mb-2">Disclosure Obligations</h4>

			<p className="mb-4">
				Nigeria does not yet have a sustainability disclosure regime specific to
				the financial services sector, Section 24(1)(a) of the Climate Change
				Act requires private companies with more than 50 employees to adopt
				measures aligned with national annual carbon-emission reduction targets
				under the National Climate Change Action Plan
				<sup>
					<a href="#footnote-54" className="text-blue-600 hover:text-blue-600">
						54
					</a>
				</sup>
				.
			</p>

			<p className="mb-4">
				By contrast, FMPs subject to EU laws must comply with the Sustainability
				Finance Disclosure Regulation and the Taxonomy Regulation (together, the
				"EU Disclosure Regulations")
				<sup>
					<a href="#footnote-55" className="text-blue-600 hover:text-blue-600">
						55
					</a>
				</sup>
				. The EU Disclosure Regulations require market participants to publish
				and maintain disclosures on their websites, covering the principal
				adverse impacts of investment decisions on sustainability factors and
				the due diligence policies applied
				<sup>
					<a href="#footnote-56" className="text-blue-600 hover:text-blue-600">
						56
					</a>
				</sup>
				. They also prescribe detailed pre-contractual disclosures
				<sup>
					<a href="#footnote-57" className="text-blue-600 hover:text-blue-600">
						57
					</a>
				</sup>
				, including environmental objectives
				<sup>
					<a href="#footnote-58" className="text-blue-600 hover:text-blue-600">
						58
					</a>
				</sup>
				, criteria for assessing environmentally sustainable activities
				<sup>
					<a href="#footnote-59" className="text-blue-600 hover:text-blue-600">
						59
					</a>
				</sup>
				, the nature and details of information to be disclosed
				<sup>
					<a href="#footnote-60" className="text-blue-600 hover:text-blue-600">
						60
					</a>
				</sup>
				, activities contributing to climate change mitigation
				<sup>
					<a href="#footnote-61" className="text-blue-600 hover:text-blue-600">
						61
					</a>
				</sup>
				, and enabling activities
				<sup>
					<a href="#footnote-62" className="text-blue-600 hover:text-blue-600">
						62
					</a>
				</sup>
				. Importantly, EU member states retain discretion to adopt more
				stringent disclosure requirements for market participants headquartered
				in their jurisdictions
				<sup>
					<a href="#footnote-63" className="text-blue-600 hover:text-blue-600">
						63
					</a>
				</sup>
				.
			</p>

			{/* Disclosure Obligations Comparison Tables */}
			<div className="my-8">
				<h3 className="text-lg font-semibold mb-4 text-blue-600">
					Disclosure Obligations: Nigeria vs EU
				</h3>
			</div>
			{/* Nigeria vs EU Regulatory Comparison Table */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<Table className="text-xs">
					<TableHeader>
						<TableRow className="bg-blue-600">
							<TableHead className="font-semibold text-white text-xs">
								Aspect
							</TableHead>
							<TableHead className="font-semibold text-white text-xs">
								Nigeria
							</TableHead>
							<TableHead className="font-semibold text-white text-xs">
								EU
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium text-xs">Scope</TableCell>
							<TableCell className="text-xs bg-red-50">
								{" "}
								Companies{">"} 50 employees
							</TableCell>
							<TableCell className="text-xs bg-blue-50">
								All Market Participants
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium text-xs">
								Requirements
							</TableCell>
							<TableCell className="text-xs bg-red-50">
								Carbon reduction measures
							</TableCell>
							<TableCell className="text-xs bg-blue-50">
								Comprehensive ESG disclosures
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium text-xs">
								Detail Level
							</TableCell>
							<TableCell className="text-xs bg-red-50">Basic</TableCell>
							<TableCell className="text-xs bg-blue-50">
								Highly Detailed
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium text-xs">Enforcement</TableCell>
							<TableCell className="text-xs bg-red-50">Developing</TableCell>
							<TableCell className="text-xs bg-blue-50">Strict</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</HybridPage>
	);
};

export { defaultFootnotes };
