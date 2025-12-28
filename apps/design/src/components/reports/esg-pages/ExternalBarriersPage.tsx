import React from 'react';
import { HybridPage } from '../HybridPage';
import Image from 'next/image';

interface ExternalBarriersPageProps {
  pageNumber: number;
  footnoteStart?: number;
  width?: number;
  height?: number;
  showFootnotes?: boolean;
}

export const ExternalBarriersPage: React.FC<ExternalBarriersPageProps> = ({
  pageNumber,
  footnoteStart = 23,
  width = 794,
  height = 1123,
  showFootnotes = true
}) => {
  return (
    <HybridPage
      key={`external-barriers-${pageNumber}`}
      pageNumber={pageNumber}
      components={{}}
      footnotes={
        showFootnotes
          ? [
            "SSE Initiative (n.d.) *Model Guidance for SMEs to Integrate Sustainable Business Practices: A Template for Exchanges*. Available at: https://sseinitiative.org/sites/sseinitiative/files/publications-files/model-guidance-for-smes-to-integrate-sustainable-business-practices-a-template-for-exchanges.pdf (Accessed 3 August 2025)",
            "We Mean Business Coalition (n.d.) *84% of SMEs Have Not Received Any Financial Incentives to Reduce Emissions*. Available at: https://esgnews.com/84-of-smes-have-not-received-any-financial-incentives-to-reduce-emissions-reveals-we-mean-business-report/ (Accessed 3 August 2025)",
            "UNDP Nigeria (n.d.) *Brokering Private Sector Investments for SDGs: $15 Million Mobilized in Healthcare and Agritech SMEs in Nigeria*. Available at: https://www.undp.org/nigeria/press-releases/brokering-private-sector-investments-sdgs-15-million-investments-mobilized-healthcare-and-agritech-smes-nigeria (Accessed 3 August 2025)",
            "G20 Sustainable Finance Working Group & OECD (2024) *Implementing Sustainability Reporting that Works for SMEs*. Available at: <https://g20sfwg.org/wp-content/uploads/2024/06/P3-G20-SFWG-OECD-Implementing-sustainability-reporting-that-works-for-SMEs.pdf> (Accessed 3 August 2025)",
            "G20 Sustainable Finance Working Group & OECD (2024) *Implementing Sustainability Reporting that Works for SMEs*. Available at: <https://g20sfwg.org/wp-content/uploads/2024/06/P3-G20-SFWG-OECD-Implementing-sustainability-reporting-that-works-for-SMEs.pdf> (Accessed 3 August 2025)"
          ]
          : undefined
      }
      footnoteStart={footnoteStart}
      columns={2}
      width={width}
      height={height}
    >
      <h3 className="text-lg font-semibold mb-3 text-blue-400">
        External Barriers
      </h3>

      <p className="mb-4">
        Beyond these internal limitations, SMEs are also constrained by systemic
        factors within the broader ESG and financial ecosystem. These external
        forces lie outside the direct control of the SME yet significantly
        impact their ability to adopt sustainable practices and secure green
        financing.
      </p>

      <h4 className="font-semibold mb-2">Weak ESG Ecosystem:</h4>

      <p className="mb-4">
        The broader support infrastructure for SMEs in the ESG space is
        significantly underdeveloped. Most markets lack sufficient SME-focused
        ESG scores, certifications, or verifiers
        <sup>
          <a
            href="#footnote-23"
            className="text-blue-600 hover:text-blue-800"
          >
            23
          </a>
        </sup>
        . This leaves proactive SMEs
        unable to effectively "highlight their sustainability credentials"
        because there are no accessible, credible ratings or audit services
        tailored for small companies. While global assurance firms cater to
        large corporations, Nigerian SMEs face a "credibility gap". Due to the
        absence of a government-endorsed or widely recognised ESG certification
        framework. As a result, even committed SMEs struggle to access green
        finance, since lenders lack standardized, verifiable methods of
        assessing their sustainability performance. Addressing this gap requires
        a simplified, credible, and affordable ESG assessment and certification
        mechanisms, potentially delivered through local partnerships, digital
        platforms, or tiered certification systems calibrated to SME resources.
      </p>
      <div className="my-6 flex justify-center">
        <img
          src="/bridgin_financing_gap/incentive_vacuum_and_funding_chasm.png"
          alt="Fragmented Information Landscape"
          className="max-w-full h-auto rounded-lg shadow-md "
        />
      </div>
      <h4 className="font-semibold mb-2">Sparse Incentives:</h4>

      <p className="mb-4">
        Public incentives for SME "greening" remain limited and inconsistent.
        Surveys show that 52% of SMEs consider the lack of government policies
        or incentives a key obstacle to climate action, while 84% report
        receiving no emissions-reduction subsidies
        <sup>
          <a
            href="#footnote-24"
            className="text-blue-600 hover:text-blue-800"
          >
            24
          </a>
        </sup>
        . While governments are
        enacting sustainable finance policies (e.g., Nigeria's Climate Change
        Act), a significant gap exists between high-level policy commitments and
        the practical, on-the-ground experience of SMEs, suggesting policies are
        not effectively communicated, accessible, or tailored to their specific
        needs. Without tax breaks, grants, or concessional schemes, SMEs see
        little financial gain from sustainability investments. In Nigeria,
        evidence suggests that SME access to ESG-linked finance is negligible.
        Development initiatives have mobilized only limited funds for a handful
        of SMEs; for instance, a UNDP-backed program identified 25 high-impact
        Nigerian SMEs combined sustainable-finance needs of $175 million but
        mobilized just $15 million for three ventures
        <sup>
          <a
            href="#footnote-25"
            className="text-blue-600 hover:text-blue-800"
          >
            25
          </a>
        </sup>
        . This mismatch illustrates how most bankable, sustainability-aligned
        SMEs cannot easily tap into available green or SDG-linked financing,
        often leaving them with standard lending at higher rates
        <sup>
          <a
            href="#footnote-26"
            className="text-blue-600 hover:text-blue-800"
          >
            26
          </a>
        </sup>
        . Closing this
        gap requires strong "pull" factors—targeted tax reliefs, concessional
        financing and non-financial incentives, beyond mere "push" regulations,
        to make sustainability an immediate business advantage, rather than just
        another compliance burden
        <sup>
          <a
            href="#footnote-27"
            className="text-blue-600 hover:text-blue-800"
          >
            27
          </a>
        </sup>
        .
      </p>


    </HybridPage>
  );
};
