import React from 'react';
import { useHybridPagination } from '../useHybridPagination';
import { HybridPage } from '../HybridPage';
import { defaultFootnotes } from '@/data/esgFootnotes';


interface HybridPageData {
  content: string;
  components: Record<string, React.ReactNode>;
  hasFootnotes: boolean;
}

interface HybridESGMainContentProps {
  pageNumber?: number;
  footnoteStart?: number;
  footnotes?: string[];
  onPageCountChange?: (count: number) => void;
}

// Helper function to convert footnote text with markdown-style links to HTML
const convertFootnoteToHtml = (text: string): string => {
  // Convert <url> to <a href="url">url</a>
  return text.replace(/<([^>]+)>/g, (match, url) => {
    // Check if it's a URL (starts with http:// or https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${url}</a>`;
    }
    // If it's not a URL, keep the original format
    return match;
  });
};

export const HybridESGMainContent: React.FC<HybridESGMainContentProps> = ({
  pageNumber = 1,
  footnoteStart = 1,
  onPageCountChange
}) => {
  const footnotes = defaultFootnotes;

  // Define components that will be rendered as React components
  const components = {
    // awarenessToActionChasm: <AwarenessToActionChasm />, // Commented out to avoid duplication
    // esgPolicyTimeline: <ESGPolicyTimeline /> // Commented out to avoid duplication - using text version instead
  };

  // Convert React components to HTML string for pagination
  const content = `
    <h1 class="text-xl font-bold mb-4 text-blue-600">Bridging the ESG Finance Gap: Demand and Supply-Side Constraints Facing Nigerian Small and Medium-Sized Enterprises (SMEs)</h1>

    <h2 class="text-xl font-semibold mb-3 mt-6 text-blue-500">Introduction</h2>

    <p class="mb-4">
      Small and Medium-sized Enterprises (SMEs) form the backbone of economies globally, driving inclusive growth, job creation, poverty reduction, and innovation. Worldwide, SMEs make up around 90% of businesses and contribute over 50% of global GDP<sup><a href="#footnote-${footnoteStart}" class="text-blue-600 hover:text-blue-800">1</a></sup>. The impact is even more pronounced in Africa, where they represent over 90% of all businesses and provide nearly 80% of total employment<sup><a href="#footnote-${footnoteStart + 1}" class="text-blue-600 hover:text-blue-800">2</a></sup>. In Nigeria, SMEs account for 96% of all businesses, contribute 48% to national GDP, and employ about half of the country's workforce<sup><a href="#footnote-${footnoteStart + 2}" class="text-blue-600 hover:text-blue-800">3</a></sup>.
    </p>

    <div class="my-8">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-md mx-auto">
        <p class="text-center font-bold text-blue-600 mb-2">The Undeniable Engine: SME Economic Impact</p>
        <div class="grid grid-cols-2 grid-rows-2 gap-2 -mt-4">
          <div class="col-span-2 row-span-1 bg-white p-2 rounded-lg text-center flex flex-col justify-center items-center">
            <p class="text-5xl font-black text-[#002060]">96%</p>
            <p class="text-lg font-medium text-slate-600">of all Nigerian Businesses</p>
          </div>
          <div class="col-span-1 row-span-1 bg-white p-2 rounded-lg text-center flex flex-col justify-center items-center">
            <p class="text-3xl font-bold text-[#002060]">48%</p>
            <p class="text-sm text-slate-500">of National GDP</p>
          </div>
          <div class="col-span-1 row-span-1 bg-white p-2 rounded-lg text-center flex flex-col justify-center items-center">
            <p class="text-3xl font-bold text-[#002060]">50%</p>
            <p class="text-sm text-slate-500">of National Workforce</p>
          </div>
        </div>
        <p class="text-center text-sm text-slate-500 mt-2">This immense scale establishes SMEs not as a niche, but as the core of Nigeria's economic landscape, making their stability crucial.</p>
      </div>
    </div>

    <div class="my-6 flex justify-center">
      <div class="bg-green-50 p-4 rounded-lg border border-green-200 max-w-md">
        <p class="text-center text-green-600 font-medium">ESG Finance Gap Analysis</p>
      </div>
    </div>

    <p class="mb-4">
      As a dominant force, SMEs are well-positioned to shape environmental, social, and governance (ESG) outcomes through their operations, workforce practices, and governance structures. Although individual SMEs have relatively modest operations, their collective environmental impact is substantial, particularly in terms of cumulative carbon emissions. On the social front, SME businesses often fall short in addressing labour standards, inequality concerns, or broader community development. For instance, Nigeria's recent minimum wage increased from ₦30,000 to ₦70,000<sup><a href="#footnote-${footnoteStart + 3}" class="text-blue-600 hover:text-blue-800">4</a></sup> has not been widely adopted in the SME sector due to affordability concerns or weak enforcement. In addition, structured corporate social responsibility initiatives are largely absent, even at a small scale.
    </p>

    <p class="mb-4">
      From a governance perspective, many SMEs operate informally or semi-formally, with limited or no internal structure to support for decision-making, financial transparency, accountability, or regulatory compliance. This weak governance framework often leads to mismanagement, business fragility, and ultimately financial collapse. Considering that SMEs account for the majority of employment in Nigeria, such failures contribute significantly to rising unemployment and economic instability.
    </p>

    <h1 class="text-2xl font-bold mb-4 text-blue-600 mt-12">Industrialization and ESG Integration in Nigeria</h1>

    <h2 class="text-xl font-semibold mb-3 mt-6 text-blue-500">The Imperative for Sustainable Industrialization</h2>

    <p class="mb-4">
      Nigeria's industrialization journey has been characterized by a series of policy initiatives aimed at transforming the economy from an oil-dependent structure to a more diversified, manufacturing-based economy. The Nigeria Industrial Revolution Plan (NIRP) 2014-2020<sup><a href="#footnote-${footnoteStart + 4}" class="text-blue-600 hover:text-blue-800">5</a></sup> was a comprehensive framework designed to accelerate industrial development through strategic interventions in key sectors. Despite these efforts, the manufacturing sector's contribution to GDP has remained relatively modest, hovering around 12-15% over the past decade<sup><a href="#footnote-${footnoteStart + 5}" class="text-blue-600 hover:text-blue-800">6</a></sup>.
    </p>

    <p class="mb-4">
      The integration of Environmental, Social, and Governance (ESG) principles into industrialization strategies presents both opportunities and challenges for Nigeria. On one hand, sustainable industrial practices can enhance long-term competitiveness, attract responsible investment, and contribute to national development goals. On the other hand, the transition requires significant adjustments in business models, regulatory frameworks, and stakeholder expectations.
    </p>

    <h2 class="text-xl font-semibold mb-3 mt-6 text-blue-500">Environmental Considerations in Manufacturing</h2>

    <p class="mb-4">
      Nigeria's industrial sector faces mounting pressure to adopt environmentally sustainable practices. The country's manufacturing base is heavily reliant on energy-intensive processes, with many facilities operating outdated equipment that contributes to air and water pollution. The textile, cement, and petrochemical industries are particularly significant contributors to environmental degradation<sup><a href="#footnote-${footnoteStart + 6}" class="text-blue-600 hover:text-blue-800">7</a></sup>.
    </p>

    <p class="mb-4">
      The transition to cleaner production technologies requires substantial capital investment, which poses a significant challenge for SMEs that dominate the manufacturing landscape. These enterprises often lack the financial resources and technical expertise needed to implement environmental management systems. Additionally, weak regulatory enforcement has allowed many industrial facilities to operate without adequate environmental safeguards.
    </p>

    <div class="my-6 flex justify-center">
      <img
        src="/bridgin_financing_gap/three_pillars_of_esg_risk.png"
        alt="Environmental Considerations in Manufacturing"
        class="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>

    <h2 class="text-xl font-semibold mb-3 mt-6 text-blue-500">Social Impact and Labour Standards</h2>

    <p class="mb-4">
      The social dimension of ESG in Nigerian manufacturing encompasses labour standards, community relations, and inclusive growth. While the sector provides employment for millions of Nigerians, working conditions in many manufacturing facilities fall short of international standards. Child labour, unsafe working environments, and inadequate compensation remain persistent issues<sup><a href="#footnote-${footnoteStart + 7}" class="text-blue-600 hover:text-blue-800">8</a></sup>.
    </p>

    <p class="mb-4">
      The informal nature of much of Nigeria's manufacturing sector complicates efforts to enforce labour standards. Many SMEs operate outside formal regulatory frameworks, making it difficult to monitor compliance with workplace safety regulations and fair wage policies. This situation is exacerbated by limited institutional capacity and competing economic priorities.
    </p>

    <p class="mb-4">
      The successful integration of ESG principles into Nigeria's industrialization strategy will require sustained commitment from government, industry, and civil society. While the challenges are significant, the potential benefits in terms of economic resilience, environmental protection, and social equity make this transition essential for long-term prosperity.
    </p>

    <h1 class="text-2xl font-bold mb-4 text-blue-600 mt-12">Governance Challenges and ESG Integration</h1>

    <h2 class="text-xl font-semibold mb-3 mt-6 text-blue-500">Governance Challenges and Opportunities</h2>

    <p class="mb-4">
      Effective governance is crucial for successful ESG integration in Nigeria's industrial sector. This encompasses regulatory frameworks, corporate governance practices, and institutional capacity. The country has made progress in developing ESG-related regulations, but implementation remains inconsistent<sup><a href="#footnote-${footnoteStart + 8}" class="text-blue-600 hover:text-blue-800">9</a></sup>.
    </p>

    <p class="mb-4">
      Corruption, bureaucratic inefficiencies, and weak institutional frameworks continue to hinder the effective implementation of industrial policies. These governance challenges are particularly pronounced at the state and local levels, where many manufacturing facilities are located. Addressing these issues requires coordinated efforts across multiple government agencies and sustained political commitment.
    </p>

    <div class="my-6 flex justify-center">
      <img
        src="/bridgin_financing_gap/litigation_risk_theme.png"
        alt="Governance Challenges and Opportunities"
        class="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>

    <h2 class="text-xl font-semibold mb-3 mt-6 text-blue-500">Pathways to Sustainable Industrialization</h2>

    <p class="mb-4">
      Achieving sustainable industrialization in Nigeria requires a multi-faceted approach that addresses environmental, social, and governance challenges simultaneously. Key strategies include:
    </p>

    <ul class="list-disc pl-6 mb-4">
      <li class="mb-2">Developing targeted financial instruments to support SME adoption of clean technologies</li>
      <li class="mb-2">Strengthening regulatory frameworks and enforcement mechanisms</li>
      <li class="mb-2">Building institutional capacity for ESG implementation and monitoring</li>
      <li class="mb-2">Promoting public-private partnerships to share the costs of sustainable practices</li>
      <li class="mb-2">Investing in skills development and technology transfer programs</li>
    </ul>

    <p class="mb-4">
      The successful integration of ESG principles into Nigeria's industrialization strategy will require sustained commitment from government, industry, and civil society. While the challenges are significant, the potential benefits in terms of economic resilience, environmental protection, and social equity make this transition essential for long-term prosperity.
    </p>

    <h2 class="text-xl font-semibold mb-3 mt-6 text-blue-500">Demand-Side and Supply-Side Barriers</h2>

    <p class="mb-4">
      On the demand side, SMEs face internal barriers such as the absence of ESG-related data or metrics, the lack tailored ESG standards, and limited awareness or capacity to integrate ESG considerations into daily operations or long-term strategy. Most SMEs also lack the technical resources to track, measure, or report on ESG performance and, these are often required by sustainability-focused lenders and investors. On the supply side, financial institutions are developing internal ESG frameworks in response to evolving regulatory requirements and international standards. However, these frameworks are typically designed for large corporates and rarely account for the unique constraints of SMEs. As a result, sustainable finance products are often too complex, rigid, or inaccessible for SMEs to access effectively. Moreover, government and market-level interventions intended to support MSMEs often prove ineffective or remain underutilized.
    </p>

    <div class="my-3 flex justify-center">
      <img
        src="/bridgin_financing_gap/access_to_finance_priority.png"
        alt="Demand-Side vs Supply-Side Challenges"
        class="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>

    <p class="mb-4">
      For example, although Nigeria has introduced initiatives such as the National Collateral Registry, the Development Bank of Nigeria, and the Bank of Industry's energy-efficient loan schemes, their overall impact remains limited. The PwC MSME Survey (2024) further highlights priority areas for reforms, including: (i) improving access to affordable finance; (ii) streamlining regulatory burdens; (iii) enhancing MSME adaptability to shifting market conditions; and (iv) accelerating digital and green transformation through targeted incentives<sup><a href="#footnote-${footnoteStart + 9}" class="text-blue-600 hover:text-blue-800">10</a></sup>.
    </p>

    <p class="mb-4">
      The disconnect between both sides has contributed to a significant gap in SME-tailored sustainability finance products, leaving a large segment of the private sector excluded from Nigeria's transition to a greener and more inclusive economy. This exclusion is particularly concerning given Nigeria's commitment to achieving net-zero emissions by 2060. SMEs will be central to this transition—particularly in energy, agriculture, manufacturing, and transport sectors. Yet without practical and scalable pathways to align with ESG objectives, they risk being left behind in the evolving green economy.
    </p>

    <p class="mb-4">
      This paper – the first in a three-part series – provides a comprehensive analysis of both supply-side and demand-side opportunities and challenges facing Nigerian SMEs in their pursuit of sustainability-linked capital. It seeks to highlight the disconnect between financier expectations and SME realities, and to propose actionable recommendations to strengthen SME access to sustainable finance.
    </p>

    <h2 class="text-xl font-semibold mb-3 mt-6 text-blue-500">DEMAND SIDE</h2>

    <p class="mb-4">
      Despite the expanding pool of sustainability-linked capital, Nigerian SMEs remain largely excluded from accessing it, due to persistent demand-side constraints. As global and domestic capital flows increasingly prioritise ESG considerations, SMEs face growing expectations that they are often unprepared to meet.
    </p>

    <p class="mb-4">
      This exclusion chiefly stems from structural and institutional challenges within the SME segment itself. These demand-side barriers can be grouped into two categories:
    </p>

    <ul class="list-disc pl-6 mb-4">
      <li class="mb-2"><strong>Internal barriers</strong> within SMEs, such as limited ESG awareness, weak reporting capacity, and resource constraints; and</li>
      <li><strong>External barriers</strong> across the wider ecosystem, including inadequate ESG infrastructure, insufficient incentives, and fragmented guidance frameworks.</li>
    </ul>

    <p class="mb-4">
      Together, these factors undermine SME readiness and credibility, restricting their participation in sustainable finance landscape and widening the gap between the availability of capital and the ability to access it.
    </p>

    <h3 class="text-lg font-semibold mb-3 text-blue-400">INTERNAL BARRIERS</h3>

    <h4 class="font-semibold mb-2">Limited Awareness:</h4>

    <p class="mb-3">
      Many SMEs remain unaware of ESG-linked finance and its associated reporting requirements. This knowledge gap extends to critical concepts such as ESG metrics, climate risk disclosures, and performance-based loan covenants. A 2023 global survey revealed that while 83% of SMEs recognise the importance of sustainability, only 8% actually report on sustainability issues, underscoring the gap between recognition and practical integration. In Nigeria, "insufficient awareness" is consistently cited as a key reason for limited sustainability reporting, with many SMEs lacking the necessary knowledge and resources to track and disclose their ESG performance. To address this, initiatives led by organizations such as the UN Global Compact Network Nigeria, in collaboration with the Financial Reporting Council of Nigeria (FRC) and Integrity Organisation, have introduced guidelines such as the Small and Medium Enterprises Corporate Governance Guidelines (SME-CGG).
    </p>

    <!-- AwarenessToActionChasm component will be inserted here -->

    <h4 class="font-semibold mb-2">Poor Reporting Capacity:</h4>

    <p class="mb-4">
      Few small firms have the systems required to track non-financial performance. A global study revealed that only about 9% of SMEs operate formal sustainability-reporting programmes, largely due to constraints of time, expertise, and budget. Without baseline data on emissions, water use, waste generation, employee metrics, or governance practices, SMEs are unable to meet the minimum entry requirements for green bonds, sustainability-linked loans, or climate funds.
    </p>

    <!-- Removed DataDeficiencyCycle component to avoid duplication -->
    <p class="mb-4">
      In Nigeria, this gap is even more pronounced. A 2023 industry study concluded that "the vast majority of SMEs do not collect or manage any form of ESG-related data." Reported challenges include (a) lack of consistent and reliable data on ESG metrics; (b) difficulty in measuring and quantifying social and environmental impacts; and (c) financial and resource constraints. The informal nature of many Nigerian SMEs further exacerbates this issue, with some lacking even basic financial records. This creates a vicious cycle: data gaps hinder reporting, poor reporting limits access to sustainable finance, and lack of financing prevents investment in the very systems needed to improve reporting. Addressing this requires solutions that build fundamental data infrastructure and literacy, including business formalisation and digital transformation, which can then be leveraged for sustainability reporting. The complexity and fragmentation of current reporting regimes also highlight the need for simplified, standardized, and interoperable reporting frameworks tailored specifically for SMEs.
    </p>

    <h4 class="font-semibold mb-2">Limited Staff and Tools:</h4>

    <p class="mb-4">
      Most SMEs lack in-house ESG specialists and adequate data-management tools, making the collection and verification of ESG indicators difficult. Reports indicate that the vast majority of SMEs neither employ sustainability experts nor use automated systems, which prevents them from responding effectively to lenders' data requests. As a result, they struggle to produce the disclosures necessary for banks or investors to assess sustainability performance, conduct due diligence, or structure performance-based pricing. Addressing this requires two parallel solutions. Firstly, the development and promotion of accessible, affordable, and user-friendly digital tools for ESG data collection and reporting – tools that are localised, intuitive, and easily integrated into existing SME workflows. Achieving this will require collaboration between technology providers, financial institutions, and SME-support organizations. Secondly, beyond technological tools, the human-capital gap within SMEs must be tackled through systematic upskilling of existing staff in sustainability principles and practices, complemented by accessible pools of external advisory support.
    </p>

    <div class="my-6 flex justify-center">
      <img
        src="/bridgin_financing_gap/top_barriers_to_sustainability.png"
        alt="Internal Barriers to ESG Integration"
        class="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>
    <div class="my-6 flex justify-center">
      <img
        src="/bridgin_financing_gap/nigeria_regulatory_lag_timeline.png"
        alt="High Uncertainty in ESG Investments"
        class="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>

    <h4 class="font-semibold mb-2">High Uncertainty:</h4>

    <p class="mb-4">
      SMEs also operate in highly volatile markets characterised by policy
      shifts and economic instability, which the OECD identifies as "one of
      the greatest barriers" for SMEs in pursuing green initiatives
      . SMEs often hesitate to invest in sustainability due to concerns about
      uncertain returns or future regulatory changes. A 2025 World Economic
      Forum (WEF) report found that 47% of manufacturing SMEs cited "policy
      uncertainty" as a significant barrier
      . While Nigeria has endorsed the adoption of ISSB's IFRS S1 and S2
      standards with mandatory ESG disclosures from 2028, the phased
      implementation implies a period of voluntary adoption where clarity may
      still be developing
      . Broader macroeconomic developments such as fuel subsidy removals and
      exchange rate reforms, further contribute to instability, undermining
      SMEs' ability for long-term planning, including sustainability
      investments. This "regulatory lag" fosters a "wait-and-see" mentality.
    </p>

    <p class="mb-4">
      To counter this, clear, consistent, and long-term policy signals from
      governments are critical, including a stable regulatory environment,
      well-defined incentives, and a transparent roadmap for sustainability
      integration. Furthermore, the WEF survey also highlights that 53% of
      SMEs identify competing priorities such as cost pressures and business
      expansion as the main obstacles. This suggests that even with regulatory
      clarity, immediate financial and operational constraints make long-term
      sustainability investments a lower priority
      .
    </p>

    <h4 class="font-semibold mb-2">Short-term Survival Focus:</h4>

    <p class="mb-4">
      Operating on tight margins, SMEs tend to prioritize immediate needs over
      long-term sustainability, often putting ESG initiatives on the back
      burner due to time and cash pressures. In practice, this means survival
      needs often supersede strategic green planning, and ESG becomes a "nice
      to have" rather than a core business priority, especially when its
      return on investment (ROI) is uncertain or indirect. PwC's MSME Survey
      2024 in Nigeria found "inadequate access to finance" as the number one
      challenge for 35% of businesses, while over 50% reported falling sales
      due to high prices and weak consumer spending power
      . Other reports highlight additional pressures such as "obtaining
      finance, finding customers and infrastructure deficits"
      . These factors directly explain why short-term cashflow and immediate
      survival dominate SME priorities.
    </p>

    <div class="my-6 flex justify-center">
      <img
        src="/bridgin_financing_gap/falling_sales_challenge.png"
        alt="Fragmented Information Landscape"
        class="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>
    <div class="my-6 flex justify-center">
      <img
        src="/bridgin_financing_gap/incentive_vacuum_and_funding_chasm.png"
        alt="Fragmented Information Landscape"
        class="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>

    <h3 class="text-lg font-semibold mb-3 text-blue-400">
      External Barriers
    </h3>

    <p class="mb-4">
      Beyond these internal limitations, SMEs are also constrained by systemic
      factors within the broader ESG and financial ecosystem. These external
      forces lie outside the direct control of the SME yet significantly
      impact their ability to adopt sustainable practices and secure green
      financing.
    </p>

    <h4 class="font-semibold mb-2">Weak ESG Ecosystem:</h4>

    <p class="mb-4">
      The broader support infrastructure for SMEs in the ESG space is
      significantly underdeveloped. Most markets lack sufficient SME-focused
      ESG scores, certifications, or verifiers
      . This leaves proactive SMEs unable to effectively "highlight their
      sustainability credentials" because there are no accessible, credible
      ratings or audit services tailored for small companies. While global
      assurance firms cater to large corporations, Nigerian SMEs face a
      "credibility gap". Due to the absence of a government-endorsed or widely
      recognised ESG certification framework. As a result, even committed SMEs
      struggle to access green finance, since lenders lack standardized,
      verifiable methods of assessing their sustainability performance.
      Addressing this gap requires a simplified, credible, and affordable ESG
      assessment and certification mechanisms, potentially delivered through
      local partnerships, digital platforms, or tiered certification systems
      calibrated to SME resources.
    </p>

    <h4 class="font-semibold mb-2">Sparse Incentives:</h4>

    <p class="mb-4">
      Public incentives for SME "greening" remain limited and inconsistent.
      Surveys show that 52% of SMEs consider the lack of government policies
      or incentives a key obstacle to climate action, while 84% report
      receiving no emissions-reduction subsidies
      . While governments are enacting sustainable finance policies (e.g.,
      Nigeria's Climate Change Act), a significant gap exists between
      high-level policy commitments and the practical, on-the-ground
      experience of SMEs, suggesting policies are not effectively
      communicated, accessible, or tailored to their specific needs. Without
      tax breaks, grants, or concessional schemes, SMEs see little financial
      gain from sustainability investments. In Nigeria, evidence suggests that
      SME access to ESG-linked finance is negligible. Development initiatives
      have mobilized only limited funds for a handful of SMEs; for instance, a
      UNDP-backed program identified 25 high-impact Nigerian SMEs combined
      sustainable-finance needs of $175 million but mobilized just $15 million
      for three ventures
      . This mismatch illustrates how most bankable, sustainability-aligned
      SMEs cannot easily tap into available green or SDG-linked financing,
      often leaving them with standard lending at higher rates. Closing this
      gap requires strong "pull" factors—targeted tax reliefs, concessional
      financing and non-financial incentives, beyond mere "push" regulations,
      to make sustainability an immediate business advantage, rather than just
      another compliance burden.
    </p>

    <div class="my-6 flex justify-center">
      <img
        src="/bridgin_financing_gap/litigation_risk_theme.png"
        alt="Governance Challenges and Opportunities"
        class="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>

    <div class="my-4">
      <h3 class="text-lg font-semibold mb-4 text-blue-600">ESG Policy Implementation Roadmap</h3>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="timeline-container">
          <div class="timeline-item">
            <div class="timeline-marker completed">24</div>
            <div class="timeline-content">
              <h4>Initial Assessment</h4>
              <p>Baseline ESG evaluation completed</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker in-progress">25</div>
            <div class="timeline-content">
              <h4>Capacity Building</h4>
              <p>Training programs launched for 500 SMEs</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker planned">26</div>
            <div class="timeline-content">
              <h4>Regulatory Framework</h4>
              <p>New ESG disclosure requirements implemented</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker planned">27</div>
            <div class="timeline-content">
              <h4>Funding Mechanisms</h4>
              <p>Sustainable finance instruments deployed</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker planned">28</div>
            <div class="timeline-content">
              <h4>Full Compliance</h4>
              <p>Achieve 80% ESG compliance across sectors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const { pages, loading } = useHybridPagination({
    content,
    components,
    pageWidth: 794,
    pageHeight: 1123,
    margin: 50,
    footerHeight: 40,
    columnCount: 2
  });

  // Notify parent of page count when pages are determined
  React.useEffect(() => {
    if (!loading && pages.length > 0 && onPageCountChange) {
      onPageCountChange(pages.length);
    }
  }, [loading, pages.length, onPageCountChange]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {pages.map((page: HybridPageData, index: number) => (
        <HybridPage
          key={`page-${pageNumber}-${index}`}
          pageNumber={pageNumber + index}
          htmlContent={page.content}
          components={page.components}
          footnotes={undefined}
          footnoteStart={footnoteStart}
          columns={2}
        />
      ))}
    </div>
  );
};
