import React from 'react';
import { HybridPage } from '../HybridPage';

interface ESGPage8Props {
  pageNumber?: number;
  footnoteStart?: number;
  footnotes?: string[];
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

const defaultFootnotes = [
  "For example, Regulation (EU) 2019/2088 (the \"Sustainable Finance Disclosure Regulation\" or \"SFDR\") lays down harmonised transparency rules for FMPs and their professional advisers on how they integrate ESG factors into their investment decisions and financial advice and on their overall and product-related sustainability ambition.",
  "See recital 12 of the SFDR, by which FMPs and their advisers are expected to specify in their policies how they integrate sustainability risks that might have a relevant material negative impact on the financial return of an investment or advice.",
  "See paragraph 32 of the European Banking Authority Report on Management and Supervision of ESG Risks for Credit Institutions and Investment Firms (EBA/REP/2021/18) (the \"EBA Report\"), which defines ESG Risks as risks of any negative financial impact on an FI stemming from the current or prospective impact of ESG factors on its counterparties or invested assets.",
  "The FI is vulnerable to external shocks within an ESG context. Where the counterparty/borrower is affected by an of the ESG drivers it affects the counterparty's risk profile ais transmitted to the FI's balance sheet. See 34 of the EBA Report."
];

export const ESGPage8: React.FC<ESGPage8Props> = ({ pageNumber, footnoteStart = 28, footnotes = defaultFootnotes, width = 794, height = 1123, showFootnotes = true }) => {
  return (
		<HybridPage
			pageNumber={pageNumber}
			footnotes={showFootnotes ? [
        "For example, Regulation (EU) 2019/2088 (the \"Sustainable Finance Disclosure Regulation\" or \"SFDR\") lays down harmonised transparency rules for FMPs and their professional advisers on how they integrate ESG factors into their investment decisions and financial advice and on their overall and product-related sustainability ambition.",
        "See recital 12 of the SFDR, by which FMPs and their advisers are expected to specify in their policies how they integrate sustainability risks that might have a relevant material negative impact on the financial return of an investment or advice.",
        "See paragraph 32 of the European Banking Authority Report on Management and Supervision of ESG Risks for Credit Institutions and Investment Firms (EBA/REP/2021/18) (the \"EBA Report\"), which defines ESG Risks as risks of any negative financial impact on an FI stemming from the current or prospective impact of ESG factors on its counterparties or invested assets.",
        "The FI is vulnerable to external shocks within an ESG context. Where the counterparty/borrower is affected by an of the ESG drivers it affects the counterparty's risk profile ais transmitted to the FI's balance sheet. See 34 of the EBA Report."
      ] : undefined}
			footnoteStart={28}
			components={{}}
			width={width}
			height={height}
		>
			<h4 className="font-semibold mb-2">Fragmented Information</h4>

			<p className="mb-4">
				Guidance on sustainable finance is often scattered, leaving SMEs to
				navigate a confusing patchwork of standards and disclosure requirements.
				The OECD notes that SMEs urgently need better frameworks and tools to
				bridge sustainability data gaps when seeking finance. In practice, each lender or donor often demands different disclosures,
				creating an "information overload" paradox: SMEs simultaneously lack
				awareness of relevant ESG finance tools yet face an overwhelming flood
				of disparate requirements. This leads to paralysis or misdirected efforts, or outright
				disengagement. A centralized, harmonized guidance system is therefore
				essential. This could take the form of a national portal or advisory hub
				that consolidates requirements, offers standardised templates, and
				clarifies which frameworks apply to different SME segments. Standardised
				methodologies, simplified independent verification systems, and trusted
				data protocols would further build lender confidence in trust in
				SME-generated ESG data.
			</p>

			<p className="mb-4">
				While demand-side barriers highlight the limitations within SMEs and
				their immediate environment, the challenges are equally pronounced on
				the supply side. Financial institutions, investors, and regulators often
				lack the tools, incentives, and frameworks to originate and scale
				ESG-linked finance tailored to the realities of Nigerian SMEs. The next
				section, therefore, examines the structural, institutional, and
				commercial constraints that hinder the flow of sustainable
				capital—highlighting why even willing capital providers struggle to
				connect with the SME segment in a meaningful and scalable way.
			</p>
			<br />
			<br />
			<br />
			<br />
			<br />
			<h2 className="text-xl font-semibold mb-3 text-blue-500">SUPPLY SIDE</h2>

			<p className="mb-4">
				For SMEs, accessing sustainable finance is not only a question of demand
				but also of how finance is supplied. Even when SMEs demonstrate viable
				business models and a willingness to adopt sustainable practices, their
				financing prospects ultimately depend on the products, risk appetites,
				and compliance obligations of financial market participants ("FMPs").
			</p>

			<p className="mb-4">
				Sustainability objectives can only be achieved if private capital is
				effectively channelled towards sustainable investments, primarily
				through FMPs operating in the financial services market (the "Market").
				In practice, this may involve a financial institution ("FI") offering
				products such as concessional or sustainability-linked loans to a
				corporate borrower ("counterparty"). These products are ultimately
				funded by end-investors who allocate capital for sustainability
				purposes. This structure creates an agent-principal relationship: FIs
				act as agents of the end-investors and owe fiduciary duties to ensure
				that investments align with stated sustainability objectives. As part of
				these obligations, FIs must (i) conduct adequate due diligence
				including, sustainability risk assessments before making investments;
				(ii) integrate sustainability considerations into investment
				decision-making and governance; and (iii) provide pre-contractual and
				ongoing disclosures to investors
				<sup>
					<a
						href="#footnote-28"
						className="text-blue-600 hover:text-blue-600"
					>
						28
					</a>
				</sup>
				.
			</p>

			<p className="mb-4">
				To safeguard against 'greenwashing', end-investors carefully scrutinise
				FMPs, avoiding those that misrepresent financial products as sustainable
				without meeting environmental standards. FMPs are therefore, required to
				explain and demonstrate how the activities they finance contribute to
				environmental or social objectives.
			</p>
		</HybridPage>
	);
};

export { defaultFootnotes };
