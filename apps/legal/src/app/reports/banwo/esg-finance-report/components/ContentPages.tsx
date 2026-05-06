'use client';

import React from 'react';
import { FootnoteRef } from './PageWrapper';

export const SectionHeader: React.FC<{ number?: string; title: string; subtitle?: string; color?: string }> = ({ number, title, subtitle, color = "#05386f" }) => (
    <div className="relative mb-8 group">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-baseline gap-4 mb-2">
            {number && <span className="text-[14px] font-bold gold-shimmer font-cinzel tracking-tighter" style={{ fontSize: '18px' }}>{number}</span>}
            <h2 className="text-[20px] font-black uppercase tracking-tight m-0 font-cinzel" style={{ color }}>{title}</h2>
        </div>
        {subtitle && (
            <p className="text-[11px] font-semibold tracking-widest uppercase opacity-60 m-0 font-cinzel" style={{ color }}>{subtitle}</p>
        )}
        <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-[#D4AF37]/30 via-gray-100 to-transparent" />
    </div>
);

export const TableOfContents: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader title="Table of Contents" subtitle="Report Overview" />
        <div className="mt-12 space-y-6 max-w-lg">
            {[
                { t: 'Introduction', p: '3', id: 'introduction' },
                { t: 'ESG Financing', p: '3', id: 'introduction' },
                { t: 'SMEs’ Need For Capital', p: '4', id: 'market-context' },
                { t: 'Demand Side', p: '5', id: 'demand-side' },
                { t: 'Supply Side', p: '6', id: 'supply-side' },
                { t: 'Cultural Shift', p: '8', id: 'supply-side' },
                { t: 'The Way Forward', p: '9', id: 'the-way-forward' },
                { t: 'Conclusion', p: '10', id: 'the-way-forward' }
            ].map((item, i) => (
                <a key={i} href={`#${item.id}`} className="flex items-end gap-4 group hover:opacity-70 transition-opacity no-underline">
                    <div className="text-[#05386f] font-bold text-[10px] tabular-nums opacity-40">0{i+1}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#211B1B]">{item.t}</div>
                    <div className="flex-grow border-b border-dotted border-[#211B1B]/20 mb-1" />
                    <div className="text-[10px] font-bold text-[#05386f] tabular-nums">{item.p}</div>
                </a>
            ))}
        </div>
    </div>
);


export const IntroductionSection: React.FC = () => (
    <div id="introduction" className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="01-02" title="Introduction & ESG Finance" subtitle="Foundational Context" />
        <div className="space-y-4 text-[9px] leading-relaxed opacity-90 text-justify overflow-y-auto">
            <p className="font-bold uppercase tracking-widest text-[#05386f] text-[8px]">1.0 Introduction</p>
            <p>The Environmental, Social, and Governance (“ESG”) framework is an investment lens employed to evaluate how a company manages both the risks and the opportunities related to its sustainability and ethical impact.<FootnoteRef number={1} /> It has evolved into a crucial method for assessing long-term value creation that extends beyond conventional financial metrics. The three core components are defined as follows: The Environmental (E) criteria gauge a company’s performance as a steward of the natural world, with key factors including its climate change strategy, the management of carbon emissions, efficiency in resource use like water and land, waste reduction, and the protection of biodiversity<FootnoteRef number={2} />. The Social (S) criteria focus on how a company manages its relationships with stakeholders, encompassing issues like labour standards, health and safety, diversity and inclusion policies, adherence to human rights across the supply chain, and effective community engagement<FootnoteRef number={3} />. Finally, the Governance (G) criteria examine the structures of a company's leadership and operation, involving board composition and independence, transparency in executive compensation and audits, the protection of shareholder rights, and the implementation of robust anti-corruption and ethical conduct policies.</p>
            <p className="font-bold uppercase tracking-widest text-[#05386f] text-[8px] pt-2">2.0 ESG Financing</p>
            <p>The growing importance of ESG and ESG Finance is rooted in two significant global trends: (i) its role in strengthening corporate resilience and (ii) a fundamental shift in capital allocation. ESG factors directly influence a business’s long-term operational and financial stability. Ignoring environmental or social risks, such as the physical and transition risks from climate change or poor labour practices that lead to reputational damage, can result in substantial financial losses, regulatory fines, and operational disruptions. By integrating ESG principles, companies are better positioned to anticipate and mitigate these non-financial risks.</p>
            <p>A comprehensive review of academic literature found a positive correlation between strong ESG performance and financial outcomes, noting that companies with higher ESG scores often exhibit lower costs of capital and better operational performance, especially during periods of crisis, which is mediated by factors like improved risk management and greater innovation<FootnoteRef number={4} />. ESG Finance, which involves integrating these non-financial criteria into investment and lending decisions, is crucial for achieving global sustainability targets, such as the Paris Agreement and the UN Sustainable Development Goals (SDGs). This shift is propelled by increasing investor demand, global regulatory mandates, and the need to finance the transition to a green economy. Investors are re-channelling trillions of dollars toward businesses demonstrating credible sustainability performance<FootnoteRef number={5} />. Initiatives like the Nigerian Sustainable Banking Principles (NSBP)<FootnoteRef number={6} />, which mandate financial institutions to embed ESG into their risk management and lending processes, and the issuance of green bonds by the Nigerian government and private sector, are key facilitators of this capital flow<FootnoteRef number={7} />. For instance, the Nigeria Green Bond Market Development Programme recently announced the launch of a Sustainable Finance Bootcamp aimed at empowering Nigerian SMEs and startups to unlock sustainable funding.<FootnoteRef number={8} /></p>
        </div>
    </div>
);

export const MarketContextSection: React.FC = () => (
    <div id="market-context" className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="03" title="SMEs’ Need For Capital" subtitle="Economic Analysis" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p>Small and Medium-sized Enterprises (SMEs) form the backbone of economies globally: driving inclusive growth, job creation, poverty reduction, and innovation. Worldwide, SMEs make up around 90% of businesses and contribute over 50% of global GDP<FootnoteRef number={10} />. In Nigeria, while SMEs account for 96% of all businesses and employ about half of the country’s workforce, they only contribute 48% to the national GDP.<FootnoteRef number={12} /></p>
            <p>As a dominant force in Nigeria's economy, SMEs collectively wield significant influence over ESG outcomes through their cumulative operations, workforce practices, and governance structures. While individual SMEs have modest footprints, their aggregate impact is substantial. On the environmental front, their collective carbon emissions, resource consumption, and waste generation are significant contributors to Nigeria's overall environmental footprint. Socially, SME practices directly affect millions of workers and communities. Structured corporate social responsibility initiatives are largely absent, as most SMEs focus almost exclusively on profitability and scaling. From a governance perspective, many SMEs operate informally or semi-formally, with limited internal structures to support decision-making, financial transparency, accountability, or regulatory compliance.</p>
            <p>Consequently, while SMEs as a collective are well-positioned to shape ESG outcomes, it must be said that SMEs in Nigeria have, thus far, not positively shaped ESG outcomes. Nigerian SMEs continue to face structural barriers to growth, particularly limited access to finance. According to PwC’s 2023 MSME Survey, 69% of SMEs had not received any government grants in the preceding 24 months, with many citing bottlenecks as key obstacles. Beyond government support, SMEs face significant challenges accessing formal credit facilities, with many expressing low trust in the formal banking system as a primary barrier to financing<FootnoteRef number={14} />. These findings echo the World Bank’s Doing Business report, which ranked Nigeria 131st out of 190 economies in terms of ease of starting a business<FootnoteRef number={15} />.</p>
            <div className="space-y-4 pt-2">
                <table className="w-full text-[8.5px] border-collapse">
                    <thead>
                        <tr className="bg-[#211B1B] text-white">
                            <th className="p-2 text-left border border-[#211B1B]/10 uppercase tracking-widest">Demand-Side Challenges (SMEs)</th>
                            <th className="p-2 text-left border border-[#211B1B]/10 uppercase tracking-widest">Supply-Side Challenges (FIs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['Lack of ESG-related data/metrics', 'Frameworks designed for large corporates'],
                            ['No clear/applicable ESG standards', 'Do not consider SME-specific constraints'],
                            ['Limited knowledge/capacity for ESG integration', 'Too complex, rigid, or inaccessible products'],
                            ['Few technical resources for ESG reporting', 'Dependence on reliable data, SMEs lack']
                        ].map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-[#211B1B]/[0.03]' : ''}>
                                <td className="p-2 border border-[#211B1B]/10">{row[0]}</td>
                                <td className="p-2 border border-[#211B1B]/10">{row[1]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="opacity-80 italic text-[8.5px]">This paper provides a comprehensive analysis of both supply-side and demand-side opportunities and challenges facing Nigerian SMEs in their pursuit of sustainability-linked capital. It seeks to highlight the disconnect between financier expectations and SME realities.</p>
        </div>
    </div>
);

export const DemandSideSection: React.FC = () => (
    <div id="demand-side" className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="04" title="Demand Side" subtitle="Internal & External Barriers" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p>Despite the expanding pool of sustainability-linked capital, Nigerian SMEs remain largely excluded from accessing it, due to persistent demand-side constraints. Together, these factors undermine SME readiness and credibility, restricting their participation in the sustainable finance landscape and widening the gap between the availability of capital and the ability to access it.</p>
            
            <p className="font-bold uppercase tracking-widest text-[#05386f] text-[8px] pt-2">Internal Barriers</p>
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Limited Awareness:</span> Many SMEs remain unaware of ESG-linked finance and its associated reporting requirements. This knowledge gap extends to critical concepts such as ESG metrics, climate risk disclosures, and performance-based loan covenants.<FootnoteRef number={16} /> Globally, a 2023 survey revealed that while 83% of SMEs recognise the importance of sustainability, only 8% actually report on sustainability issues, underscoring the gap between recognition and practical integration.<FootnoteRef number={17} /> In the Nigerian context, “insufficient awareness” is consistently cited as a key reason for limited sustainability reporting.<FootnoteRef number={18} /></p>
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Poor Reporting Capacity:</span> Few SMEs have the systems required to track non-financial performance. A global study revealed that only about 9% of SMEs operate formal sustainability reporting programmes, largely due to constraints of time, expertise, and budget.<FootnoteRef number={20} /> Without baseline data on emissions, water use, waste generation, employee metrics, or governance practices, SMEs are unable to meet the minimum entry requirements for green bonds, sustainability-linked loans, or climate funds. In Nigeria, this gap is even more pronounced. A 2023 industry study concluded that “the vast majority of SMEs do not collect or manage any form of ESG-related data”.<FootnoteRef number={21} /> The informal nature of many Nigerian SMEs further exacerbates this issue, with some lacking even basic financial records. This creates a vicious cycle: data gaps hinder reporting, poor reporting limits access to sustainable finance, and the lack of financing prevents investment in the very systems needed to improve reporting.</p>
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Limited Staff and Tools:</span> Most SMEs lack in-house ESG specialists and adequate data-management tools. Reports indicate that the vast majority of SMEs neither employ sustainability experts nor use automated systems, which prevents them from responding effectively to lenders’ data requests.<FootnoteRef number={23} /> Firstly, the development of accessible, affordable, and user-friendly digital tools for ESG data collection is required. Secondly, beyond technological tools, the human-capital gap within SMEs must be tackled through systematic upskilling of existing staff in sustainability principles and practices.</p>
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">High Uncertainty:</span> SMEs also operate in highly volatile markets characterised by policy shifts and economic instability, which the OECD identifies as “one of the greatest barriers” for SMEs in pursuing green initiatives.<FootnoteRef number={24} /> SMEs often hesitate to invest in sustainability due to concerns about uncertain returns or future regulatory changes. A 2025 World Economic Forum (WEF) report found that 47% of manufacturing SMEs cited “policy uncertainty” as a significant barrier.<FootnoteRef number={25} /> Broader macroeconomic developments, such as fuel subsidy removals and exchange rate reforms, further contribute to instability, undermining SMEs’ ability for long-term planning.</p>
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Short-term Survival Focus:</span> Operating on tight margins, SMEs tend to prioritise immediate needs over long-term sustainability, often putting ESG initiatives on the back burner due to time and cash pressures. In practice, this means survival needs often supersede strategic green planning, and ESG becomes a “nice to have” rather than a core business priority. PwC’s MSME Survey 2024 in Nigeria found “inadequate access to finance” as the number one challenge for 35% of businesses, while over 50% reported falling sales due to high prices.<FootnoteRef number={28} /> For sustainability to gain traction, it must be positioned as a pathway to immediate and tangible benefits, such as clear cost savings (e.g., through energy efficiency), entry into new markets, or resilience against economic and climate shocks.</p>
            
            <p className="font-bold uppercase tracking-widest text-[#05386f] text-[8px] pt-4">External Barriers</p>
            <p>Beyond these internal limitations, SMEs are also constrained by systemic factors within the broader ESG and financial ecosystem. These external forces lie outside the direct control of the SME yet significantly impact their ability to adopt sustainable practices and secure green financing.</p>
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Weak ESG Ecosystem:</span> The broader support infrastructure for SMEs in the ESG space is significantly underdeveloped. Most markets lack sufficient SME-focused ESG scores, certifications, or verifiers.<FootnoteRef number={30} /> This leaves proactive SMEs unable to effectively “highlight their sustainability credentials”. Addressing this gap requires simplified, credible, and affordable ESG assessment and certification mechanisms, potentially delivered through local partnerships or tiered systems calibrated to SME resources.</p>
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Sparse Incentives:</span> Public incentives for SME “greening” remain limited and inconsistent. Surveys show that 52% of SMEs consider the lack of government policies or incentives a key obstacle to climate action, while 84% report receiving no emissions-reduction subsidies.<FootnoteRef number={31} /> Closing this gap requires strong “pull” factors, targeted tax reliefs, concessional financing and non-financial incentives to make sustainability an immediate business advantage.</p>
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Fragmented Information:</span> Guidance on sustainable finance is often scattered, leaving SMEs to navigate a confusing patchwork of standards and disclosure requirements. The OECD notes that SMEs urgently need better frameworks and tools to bridge sustainability data gaps when seeking finance.<FootnoteRef number={33} /> In practice, each lender or donor often demands different disclosures, creating an “information overload” paradox. Standardised methodologies, simplified independent verification systems, and trusted data protocols would further build lender confidence and trust in SME-generated ESG data.</p>
        </div>
    </div>
);



export const SupplySideSection: React.FC = () => (
    <div id="supply-side" className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="05" title="Supply Side" subtitle="Investors & Information Gap" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p>For SMEs, accessing sustainable finance is not only a question of demand but also of meeting the expectations of financiers.  Even when SMEs demonstrate viable business models and a willingness to adopt sustainable practices, their financing prospects ultimately depend on the products, risk appetites, and compliance obligations of financial market participants (“FMPs”). To meet sustainability objectives, investors channel private capital primarily through FMPs operating in the financial services market.</p>
            <p>In practice, this entails a financial institution (“financier”) offering products funded by end-investors who allocate capital for sustainability purposes. This structure creates an agent-principal relationship: financiers act as agents of the end-investors and owe fiduciary duties to ensure that proceeds of the investment are disbursed in ways that align with stated sustainability objectives. As part of these obligations, financiers must demonstrate ESG-based investment decision-making and governance, their capacity to conduct due diligence on borrowers, and continue to make comprehensive disclosures to end-investors.</p>
            <p>Thus, with respect to access to sustainability finance in Nigeria, the supply side expectations and associated challenges can be categorised into four: (a) securing ESG end-investors; (b) the information gap; (c) determining appropriate financial products; and (d) challenges under applicable laws. These points will be addressed in subsequent paragraphs.</p>
            
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">(a) Securing ESG End-Investors:</span> A blocker to SMEs' ability to access ESG finance in Nigeria lies in the inability to attract ESG end-investors whose sustainability objectives are flexible enough to accommodate little to no ESG metrics. Global and domestic investors rely heavily on measurable ESG metrics before committing capital. However, most Nigerian SMEs do not generate verifiable ESG data, creating a credibility gap that undermines investor confidence.</p>
            <p>Financiers are responsible for ensuring that capital is deployed in alignment with ESG objectives as agreed with end-investors. This involves conducting ESG due diligence – including sustainability risk assessments, integrating sustainability considerations into investment decision-making and governance, and providing pre-contractual and ongoing disclosures to investors. To safeguard against greenwashing, end-investors screen financiers carefully, avoiding those that misrepresent financial products as sustainable. Therefore, to secure end-investors, financiers must explain how financed activities contribute to environmental or social objectives. To meet this expectation, financiers require borrowers who demonstrate the capacity to maintain reliable ESG data, which will in turn assist their disclosure obligations to end-investors. In the absence of this, mobilising long-term ESG-aligned capital to Nigerian SMEs remains extremely challenging.</p>
        </div>
    </div>
);

export const SupplySideInfoGapSection: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="05" title="Supply Side (Cont.)" subtitle="The Information Gap" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p className="font-bold uppercase tracking-widest text-[#05386f] text-[8px] pt-2">(b) The Information Gap – Heightened Perception of Sustainability Risks</p>
            <p>Nigerian SMEs face significant challenges in meeting the information expectations required under sustainability financing. Traditional credit metrics are insufficient for ESG purposes, and Nigerian SMEs generally lack a culture of sustainability reporting and compliance. This absence of verifiable ESG data complicates due diligence, heightens the perception of sustainability risks to end-investors, and limits SME access to much-needed finance.</p>
            <p>Sustainability risks are material financial risks that directly affect credit quality, solvency, and long-term profitability. They manifest across established financial risk categories: credit, market, liquidity, operational, and reputational risks. ESG risks arise through multiple channels:</p>
            <ul className="list-disc pl-5 opacity-90 space-y-1">
               <li><span className="font-bold text-[#211B1B]">Environmental risks:</span> Physical risks (floods, droughts, pollution) and transition risks (carbon taxes, stricter environmental regulations, technological shifts) can reduce counterparty productivity, collateral value, and profitability.<FootnoteRef number={35} /></li>
               <li><span className="font-bold text-[#211B1B]">Social risks:</span> Poor labour relations<FootnoteRef number={36} />, weak community engagement, and inadequate working conditions can trigger litigation, operational disruption, or reputational damage. These risks are amplified in Nigeria due to weaker labour protections and limited SME resilience. <FootnoteRef number={37} /></li>
               <li><span className="font-bold text-[#211B1B]">Governance risks:</span> Weak internal controls, poor financial reporting, lack of board independence, and corruption elevate financial exposure.<FootnoteRef number={38} /> Failures in corporate governance may escalate into broader reputational crises.<FootnoteRef number={39} /></li>
               <li><span className="font-bold text-[#211B1B]">Litigation risk:</span> ESG-related lawsuits over environmental damage, labour rights violations, or regulatory breaches can impair counterparty performance and create direct exposure for financiers.</li>
            </ul>
            <p>Financiers are required to carry out regular assessments to identify both present and prospective impacts of ESG factors on counterparties or invested assets. Most financiers use the exposure method to assess ESG risks. The exposure assessment involves a direct evaluation of a counterparty’s ESG attributes at a company level.<FootnoteRef number={40} /> However, SMEs frequently lack the data and transparency necessary for this exposure-based assessment. Most companies still do not integrate ESG factors into their reported data, which limits the ability of financiers to incorporate these considerations into critical risk parameters such as probability of default or loss given default.</p>
            <p>Even when data is available, it is frequently inconsistent, incoherent, or insufficiently comparable, making it difficult to translate ESG information into meaningful expectations on financial performance or the resilience of business models. Without credible ESG information, financiers cannot distinguish between genuinely sustainable enterprises and those adopting ESG labels without substance. This erodes confidence in extending sustainability finance products to SMEs.</p>
        </div>
    </div>
);

export const SupplySideContSection: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="05-06" title="Supply Side (Cont.) & Cultural Shift" subtitle="Products & Legal Challenges" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">(c) Determining Appropriate Financing Product:</span> Besides the unavailability of capital, structuring the right sustainability financing deal for Nigerian SMEs presents unique difficulties. ESG-centric data scarcity leaves lenders uncertain about whether to deploy debt, equity, or blended finance products. The exposure-based assessment approach, which evaluates ESG attributes at the company level, is undermined by SMEs’ lack of transparency and data.</p>
            <p>To determine the appropriate product to deploy, financiers assess ESG impacts on credit, market, operational, reputational, and liquidity risks, applying forward-looking metrics for long-term financing.</p>
            <ul className="list-disc pl-5 opacity-90 space-y-1">
               <li><span className="font-bold text-[#211B1B]">Credit and counterparty risk:</span> the ESG profile of a counterparty must be evaluated both at inception and throughout the duration of the relationship. Lack of demonstrable ESG data impairs this assessment.</li>
               <li><span className="font-bold text-[#211B1B]">Market risk:</span> end-investors increasingly apply negative screening policies based on ESG considerations. In circumstances where ESG data is unreliable or unavailable, many financiers apply negative screening and exclude such investments altogether, impacting the supply of capital. <FootnoteRef number={41} /></li>
               <li><span className="font-bold text-[#211B1B]">Operational & reputational risk:</span> financiers must carefully evaluate the extent to which ESG-related operational exposures could result in reputational or legal damage, ensuring consistency between an entity’s public disclosures and internal practices in order to mitigate the risk of greenwashing.</li>
               <li><span className="font-bold text-[#211B1B]">Liquidity and funding risk:</span> general sustainability concerns impair market access and limit the stability of funding profiles, requiring financiers to assess liquidity risks across varying time horizons. <FootnoteRef number={42} /></li>
            </ul>
            <p>Fear of greenwashing further discourages financiers from designing innovative, context-appropriate ESG products for companies in the Nigerian SME category. Consequently, the Nigerian ESG finance market remains narrow and insufficiently diversified.</p>

            <p className="font-bold uppercase tracking-widest text-[#05386f] text-[8px] pt-2">(d) Challenges in Applicable Law</p>
            <p>The Nigerian legal and regulatory environment for ESG finance remains nascent and fragmented. There are no specific regulations requiring robust sustainability disclosure regimes suited to the expectations of financiers. Notably, Section 24(1)(a) of the Climate Change Act 2021 (the “Act”) requires private companies with 50+ employees to establish measures to achieve the annual carbon emission reduction targets in line with Nigeria’s climate change action plan.<FootnoteRef number={43} /> By Section 24(2)(b), eligible companies are required to designate an officer who shall submit annual reports on their efforts at meeting the targets to the secretariat established under the Act. While these statutory provisions create climate change obligations for private companies, there are no associated regulations or guidelines on how this obligation is to be implemented.</p>
            <p>Conversely, FMPs subject to EU laws must comply with the provisions of the Sustainability Finance Disclosure Regulation (SFDR) and the Taxonomy Regulation (together, the “EU Disclosure Regulations”)<FootnoteRef number={44} />. The EU Disclosure Regulations require FMPs to publish and maintain disclosures on their websites, covering the principal adverse impacts of investment decisions on sustainability factors and the due diligence policies applied<FootnoteRef number={45} />. They also prescribe detailed pre-contractual disclosures<FootnoteRef number={46} />, including environmental objectives<FootnoteRef number={47} />, criteria for assessing environmentally sustainable activities<FootnoteRef number={48} />, the nature and details of information to be disclosed<FootnoteRef number={49} />, activities contributing to climate change mitigation<FootnoteRef number={50} />, and enabling activities<FootnoteRef number={51} />. Importantly, EU member states retain discretion to adopt more stringent disclosure requirements for market participants headquartered in their respective jurisdictions.<FootnoteRef number={52} /></p>
            <p>Thus, the absence of a robust statutory ESG disclosure framework leaves financiers without reliable standards to evaluate ESG risks and opportunities in Nigeria. Moreover, many ESG financiers are bound by the regulations of their own jurisdictions. This creates a lopsided relationship, where financiers operate under strict regulation while borrowers operate in a far less demanding regime. This regulatory disparity heightens the compliance burden and risk for financiers dealing with Nigerian SMEs.</p>
            
            <div className="pt-6">
                <SectionHeader number="06" title="Cultural Shift" subtitle="Global Trends" />
                <p>The financial ecosystem is undergoing a structural shift towards achieving the Sustainable Development Goals.<FootnoteRef number={53} /> ESG considerations are now central to capital allocation, driven by international climate commitments (such as the Paris Agreement<FootnoteRef number={54} />), growing investor interest, and the rise of sustainability-linked financial instruments. Financial institutions, including banks, Development Finance Institutions (DFIs), venture capitalists, and insurers, are now embedding ESG factors into their lending and investment frameworks. This shift, however, requires all borrowers, including SMEs, to demonstrate credible sustainability credentials through robust ESG metrics, climate-related disclosures, and demonstrable alignment with social or environmental goals. Put simply, ESG Financing addresses two concerns previously referenced, namely: (a) promoting ESG practices by SMEs; and (b) providing SMEs with access to much-needed financing.</p>
            </div>
        </div>
    </div>
);

export const TheWayForwardSection: React.FC = () => (
    <div id="the-way-forward" className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="07" title="The Way Forward" subtitle="Implementation Roadmap" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p>However, Nigerian SMEs have largely been excluded from this momentum as systemic barriers continue to restrict their access to such financing options. The disconnect between both sides (demand and supply side) has contributed to a significant gap in SME-tailored sustainability finance products, leaving a large segment of the private sector excluded from Nigeria’s transition to a greener and more inclusive economy. This exclusion is particularly concerning given Nigeria’s commitment to achieving net-zero emissions by 2060. SMEs will be central to this transition, particularly in energy, agriculture, manufacturing, and transport sectors. Yet without practical and scalable pathways to align with ESG objectives, they risk being left behind in the evolving green economy.</p>
            <p>For Nigerian SMEs, accessing this expanding pool of ESG-aligned capital is vital for their survival and competitiveness in the global economy<FootnoteRef number={55} />. However, in the absence of robust regulations and formal requirements, Nigerian SMEs have no incentive to establish and maintain ESG-linked data or to incorporate ESG considerations into their operations. The bulk of SMEs lack the culture of tracking information, incorporating sustainability objectives and providing consistent information flow to the investors and shareholders, and this makes the sector unattractive to financiers.</p>
            <p>In May 2024, the Financial Reporting Council of Nigeria (FRC) issued the SME Corporate Governance Guideline (the “SME CCG”) to assist SMEs in establishing robust business processes and preparing them for future expansion, by enabling them to be more bankable and investable. While the SME CCG is not binding, it serves as a reference and framework for SMEs to understand and practice good corporate governance. Relevant principles include (i) Principle 5 deals with the control environment, comprising internal controls, audit, and risk management, and requires SMEs to maintain credible books of accounts, which are free from material misstatements and reflect a true and fair view of the financial performance of the entity which shall be prepared in accordance with the financial reporting framework issued, pronounced and/or adopted by the FRC. Section F of the SME CCG deals with ESG considerations and covers principles 9 -11. Principle 9 requires SMEs to be sensitive to the effect of their business on the environment in which they operate, as well as to how they engage and influence a wide range of stakeholders from diverse backgrounds within their communities.</p>
            <p>Given that the SME CCG is more of a model document than a mandatory law, we believe that the best way to establish this culture among SMEs is through mandatory legislative action to create an enabling environment. While legislation like the Climate Act provides for such a regime, there are no guidelines or further regulations with clarity on how to implement the obligations imposed by the Act.</p>
            <p>As a welcome development, the September 2025 Revised Regulation on Investment of Pension Fund Assets issued by the National Pension Commission represents a significant step in the right direction as it formally requires pension fund administrators to integrate ESG factors into their investment decisions.<FootnoteRef number={56} /> This regulation moves ESG from a voluntary action to a mandatory consideration and will drive sustainable investments in Nigeria in the long term. Against this backdrop, we look forward to more regulation with a view to establishing the culture and practice of sustainability-linked reporting among Nigerian companies.</p>
        </div>
    </div>
);

export const ConclusionSection: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="08" title="Conclusion" subtitle="Final Thoughts" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p>In our view, sustainability objectives can truly be achieved when the bulk of businesses with the largest carbon footprints are able to access sustainability-linked finance. Access to sustainability-linked finance sometimes means cheap capital, as some loan products are structured as blended financing and afford the borrower uniquely low pricing.</p>
            <p>On the surface, it seems as though there is little demand from the SMEs for sustainability-linked loans. However, the reality is that these SMEs are unable to meet the expectations of the investors and the FMPs. Lenders require strict ESG-linked undertakings from the borrower in order to meet their own reporting obligations to end-investors. Few SMEs can demonstrate the capacity to meet the ESG obligations required in sustainability transactions. Therefore, most transactions are tailored to suit big corporations or multinationals.</p>
            <p>As SMEs remain starved of capital, the full potential of sustainability financing in Nigeria remains largely untapped. Addressing the challenges identified in this paper requires coordinated efforts to improve SME ESG reporting and sustainability-aligned operations and to establish enforceable disclosure standards aligned with international best practices. Only then can sustainable finance effectively scale in Nigeria and mobilise private capital toward genuinely impactful investments.</p>
        </div>
    </div>
);

export const FootnotesPage1: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="09" title="Footnotes" />
        <div className="space-y-4 text-[8px] leading-relaxed text-justify opacity-80 overflow-y-auto pt-4">
            <p id={`fn1`}><sup className="mr-1 font-bold text-[#05386f]">1</sup>Investopedia (N.D) Environmental, social, and governance (ESG) investing: What it is &amp; how it works. Available at: &lt;https://www.investopedia.com/terms/e/environmental-social-and-governance-esg-criteria.asp&gt; (Accessed 14 March 2026).</p>
            <p id={`fn2`}><sup className="mr-1 font-bold text-[#05386f]">2</sup>Deutsche Bank Wealth Management (no date) What is ESG investing? Available at: &lt;https://www.deutschewealth.com/en/our-capabilities/esg/what-is-esg-investing-wealth-management.html&gt;   (Accessed: 14 March 2026)</p>
            <p id={`fn3`}><sup className="mr-1 font-bold text-[#05386f]">3</sup>Investopedia (N.D) Environmental, social, and governance (ESG) investing: What it is &amp; how it works. Available at: &lt;https://www.investopedia.com/terms/e/environmental-social-and-governance-esg-criteria.asp&gt; (Accessed: 14 March 2026)</p>
            <p id={`fn4`}><sup className="mr-1 font-bold text-[#05386f]">4</sup>Clark, A., &amp; Lalit, P. (2021). ESG and Financial Performance: Aggregating the Evidence from more than 1,000 Studies. NYU Stern Center for Sustainable Business and Rockefeller Asset Management. Retrieved from &lt;https://www.stern.nyu.edu/sites/default/files/assets/documents/NYU-RAM_ESG-Paper_2021%20Rev_0.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn5`}><sup className="mr-1 font-bold text-[#05386f]">5</sup>Securities and Exchange Commission. (2022, October 27). Sustainable Finance in Nigeria: Performance and Outlook. Retrieved from &lt;https://sec.gov.ng/wp-content/uploads/2022/10/Sustainable-Finance-in-Nigeria-Performance-and-Outlook-Femi-Shobanjo_Oct-2022.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn6`}><sup className="mr-1 font-bold text-[#05386f]">6</sup>The Nigerian Sustainable Banking Principles (NSBPs), developed by the Central Bank of Nigeria (CBN) and the Bankers Committee in 2012, are guidelines for banks to integrate environmental and social considerations into their operations, processes, and strategies.</p>
            <p id={`fn7`}><sup className="mr-1 font-bold text-[#05386f]">7</sup>FMDQ Group. (2025, July 7). The Nigeria Green Bond Market Development Programme Launches Sustainable Finance Bootcamp to Empower Nigerian Businesses for Green Growth. Retrieved from https://fmdqgroup.com/the-nigeria-green-bond-market-development-programme-launches-sustainable-finance-bootcamp-to-empower-nigerian-businesses-for-green-growth/</p>
            <p id={`fn8`}><sup className="mr-1 font-bold text-[#05386f]">8</sup>Ibid., footnote 7.</p>
            <p id={`fn9`}><sup className="mr-1 font-bold text-[#05386f]">9</sup>Businessday NG. (2025, January 20). ESG—A lifeline for the sustainability of Nigeria's SMEs.  &lt;https://businessday.ng/opinion/article/esg-a-lifeline-for-the-sustainability-of-nigerias-smes/&gt; (Accessed 14 March 2026)</p>
            <p id={`fn10`}><sup className="mr-1 font-bold text-[#05386f]">10</sup>World Bank SME Finance. Available at &lt;https://www.worldbank.org/en/topic/smefinance&gt; (Accessed 14 March 2026)</p>
            <p id={`fn11`}><sup className="mr-1 font-bold text-[#05386f]">11</sup>World Finance (n.d.) Can hybrid finance unburden Africa’s shaky SME sector? Available at: &lt;https://www.worldfinance.com/markets/can-hybrid-finance-unburden-africas-shaky-sme-sector&gt; (Accessed 14 March 2026)</p>
            <p id={`fn12`}><sup className="mr-1 font-bold text-[#05386f]">12</sup>Moniepoint (n.d.) Nigeria small business statistics: Everything you should know in 2024. Available at &lt;https://moniepoint.com/blog/nigeria-small-business-statistics&gt; (Accessed 14 March 2026)</p>
            <p id={`fn13`}><sup className="mr-1 font-bold text-[#05386f]">13</sup>Section 2 of the National Minimum Wage (Amendment) Act, 2024, provides that every employer in Nigeria shall pay a national minimum wage of not less than ₦70,000.00 per month to every worker under his/her establishment. The Act also shortened the wage rate review period from 5 years to 3 years.</p>
            <p id={`fn14`}><sup className="mr-1 font-bold text-[#05386f]">14</sup>PwC Nigeria (2024) PwC MSME Survey Report 2024. Available at: &lt;https://www.pwc.com/ng/en/assets/pdf/pwc-msme-survey-report-2024.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn15`}><sup className="mr-1 font-bold text-[#05386f]">15</sup>World Bank (n.d.) Doing business economy profile: Nigeria. Available at: &lt;https://archive.doingbusiness.org/en/data/exploreeconomies/nigeria&gt; (Accessed 14 March 2026)</p>
            <p id={`fn16`}><sup className="mr-1 font-bold text-[#05386f]">16</sup>OECD (2022) Financing SMEs for sustainability. Page 43 – Information and awareness-related barriers. Available at:  &lt;https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/12/financing-smes-for-sustainability_19414952/a5e94d92-en.pdf&gt; (Accessed 13 March 2026)</p>
            <p id={`fn17`}><sup className="mr-1 font-bold text-[#05386f]">17</sup>Sage (2024) Unlocking Sustainable Finance for SMEs: COP29 Report. Available at: &lt;https://www.sage.com/en-gb/-/media/files/company/documents/pdf/sustainability-and-society/2024-reports/unlocking-sustainable-finance-for-smes-report-cop-29-final.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn18`}><sup className="mr-1 font-bold text-[#05386f]">18</sup>IIARD (2025) Sustainability Reporting and SME Access to Green Finance, Journal of Business and African Economy, 11(5), pp. 27–43. Available at: &lt;https://www.iiardjournals.org/get/JBAE/VOL.%2011%20NO.%205%202025/SUSTAINABILITY%20REPORTING%2027-43.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn19`}><sup className="mr-1 font-bold text-[#05386f]">19</sup>Sustainability Directory (2024) What are the barriers to ESG adoption for SMEs? Available at: https://sustainability-directory.com/question/what-are-the-barriers-to-esg-adoption-for-smes/ (Accessed 14 March 2026)</p>
            <p id={`fn20`}><sup className="mr-1 font-bold text-[#05386f]">20</sup>Sage (2024) Unlocking Sustainable Finance for SMEs: COP29 Report. Available at &lt;https://www.sage.com/en-gb/-/media/files/company/documents/pdf/sustainability-and-society/2024-reports/unlocking-sustainable-finance-for-smes-report-cop-29-final.pdf&gt; (Accessed 14 March 2026)</p>
        </div>
    </div>
);

export const FootnotesPage2: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="10" title="Footnotes" />
        <div className="space-y-4 text-[8px] leading-relaxed text-justify opacity-80 overflow-y-auto pt-4">
            <p id={`fn21`}><sup className="mr-1 font-bold text-[#05386f]">21</sup>Sage (2024) Unlocking Sustainable Finance for SMEs: COP29 Report. Available at &lt;https://www.sage.com/en-gb/-/media/files/company/documents/pdf/sustainability-and-society/2024-reports/unlocking-sustainable-finance-for-smes-report-cop-29-final.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn22`}><sup className="mr-1 font-bold text-[#05386f]">22</sup>Sage (2024) Unlocking Sustainable Finance for SMEs: COP29 Report. Available at &lt;https://www.sage.com/en-gb/-/media/files/company/documents/pdf/sustainability-and-society/2024-reports/unlocking-sustainable-finance-for-smes-report-cop-29-final.pdf&gt; (Accessed: 14 March 2026)</p>
            <p id={`fn23`}><sup className="mr-1 font-bold text-[#05386f]">23</sup>Hogan Lovells (n.d.) Are SMEs Being Excluded from Sustainable Finance? Available at: &lt;https://www.hoganlovells.com/en/publications/are-smes-being-excluded-from-sustainable-finance&gt; (Accessed 14 March 2026)</p>
            <p id={`fn24`}><sup className="mr-1 font-bold text-[#05386f]">24</sup>OECD (2022) Financing SMEs for Sustainability, p. 44. Available at: &lt;https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/12/financing-smes-for-sustainability_19414952/a5e94d92-en.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn25`}><sup className="mr-1 font-bold text-[#05386f]">25</sup>World Economic Forum (2025) Fast-tracking SME sustainability could accelerate global climate targets and unlock economic value. &lt;https://www.weforum.org/press/2025/06/fast-tracking-sme-sustainability-could-accelerate-global-climate-targets-and-unlock-economic-value-says-new-report/&gt; (Accessed 14 March 2026)</p>
            <p id={`fn26`}><sup className="mr-1 font-bold text-[#05386f]">26</sup>IFRS Foundation (n.d.) Nigeria – Jurisdictional Profile. &lt;https://www.ifrs.org/content/dam/ifrs/publications/sustainability-jurisdictions/pdf-profiles/nigeria-ifrs-profile.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn27`}><sup className="mr-1 font-bold text-[#05386f]">27</sup>World Economic Forum (2025) Fast-tracking SME sustainability could accelerate global climate targets and unlock economic value. &lt;https://www.weforum.org/press/2025/06/fast-tracking-sme-sustainability-could-accelerate-global-climate-targets-and-unlock-economic-value-says-new-report/&gt; (Accessed 14 March 2026)</p>
            <p id={`fn28`}><sup className="mr-1 font-bold text-[#05386f]">28</sup>PwC Nigeria (2024) PwC MSME Survey 2024: Available at &lt;https://www.pwc.com/ng/en/press-room/pwc-msme-survey-2024.html&gt; (Accessed 14 March 2026)</p>
            <p id={`fn29`}><sup className="mr-1 font-bold text-[#05386f]">29</sup>UNCTAD (2024) Economic Development in Africa Report 2024. Available at: &lt;https://unctad.org/publication/economic-development-africa-report-2024&gt; (Accessed 14 March 2026)</p>
            <p id={`fn30`}><sup className="mr-1 font-bold text-[#05386f]">30</sup>SSE Initiative (n.d.) Model Guidance for SMEs to Integrate Sustainable Business Practices: A Template for Exchanges. Available at: &lt;https://sseinitiative.org/sites/sseinitiative/files/publications-files/model-guidance-for-smes-to-integrate-sustainable-business-practices-a-template-for-exchanges.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn31`}><sup className="mr-1 font-bold text-[#05386f]">31</sup>We Mean Business Coalition (n.d.) 84% of SMEs Have Not Received Any Financial Incentives to Reduce Emissions. Available at: &lt;https://esgnews.com/84-of-smes-have-not-received-any-financial-incentives-to-reduce-emissions-reveals-we-mean-business-report/&gt; (Accessed 14 March 2026)</p>
            <p id={`fn32`}><sup className="mr-1 font-bold text-[#05386f]">32</sup>UNDP Nigeria (n.d.) Brokering Private Sector Investments for SDGs: $15 Million Mobilized in Healthcare and Agritech SMEs in Nigeria. Available at: &lt;https://www.undp.org/nigeria/press-releases/brokering-private-sector-investments-sdgs-15-million-investments-mobilized-healthcare-and-agritech-smes-nigeria&gt; (Accessed 14 March 2026)</p>
            <p id={`fn33`}><sup className="mr-1 font-bold text-[#05386f]">33</sup>G20 Sustainable Finance Working Group &amp; OECD (2024) Implementing Sustainability Reporting that Works for SMEs. Available at: &lt;https://g20sfwg.org/wp-content/uploads/2024/06/P3-G20-SFWG-OECD-Implementing-sustainability-reporting-that-works-for-SMEs.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn34`}><sup className="mr-1 font-bold text-[#05386f]">34</sup>G20 Sustainable Finance Working Group &amp; OECD (2024) Implementing Sustainability Reporting that Works for SMEs. Available at: &lt;https://g20sfwg.org/wp-content/uploads/2024/06/P3-G20-SFWG-OECD-Implementing-sustainability-reporting-that-works-for-SMEs.pdf&gt; (Accessed 14 March 2026)</p>
            <p id={`fn35`}><sup className="mr-1 font-bold text-[#05386f]">35</sup>See paragraph 48 of the EBA Report.</p>
            <p id={`fn36`}><sup className="mr-1 font-bold text-[#05386f]">36</sup>See paragraph 77 of the EBA Report.</p>
            <p id={`fn37`}><sup className="mr-1 font-bold text-[#05386f]">37</sup>See paragraph 76 of the EBA Report. See also “European Pillar of Social Rights” which lists 20 principles towards fair and inclusive employment opportunities and social rights and affairs.</p>
            <p id={`fn38`}><sup className="mr-1 font-bold text-[#05386f]">38</sup>See paragraph 86 of the EBA Report.</p>
            <p id={`fn39`}><sup className="mr-1 font-bold text-[#05386f]">39</sup>Nigeria maintains strict laws against economic and financial crimes superintended by the primary financial intelligence authority, the Nigerian Financial Intelligence Unit and the Economic and Financial Crimes Commission, through a slew of legislation including the Nigeria Financial Intelligence Unit Act 2018, the Economic and Financial Crimes Commission (Establishment) Act, 2004, Money Laundering (Prevention and Prohibition) Act 2022, Terrorism Prevention and Prohibition Act 2022, and the Corrupt Practices and Other Related Offences Act, 2003.</p>
            <p id={`fn40`}><sup className="mr-1 font-bold text-[#05386f]">40</sup>See paragraph 108 of the EBA Report.</p>
        </div>
    </div>
);

export const FootnotesPage3: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="11" title="Footnotes" />
        <div className="space-y-4 text-[8px] leading-relaxed text-justify opacity-80 overflow-y-auto pt-4">
            <p id={`fn41`}><sup className="mr-1 font-bold text-[#05386f]">41</sup>See paragraphs 373 to 376 of the EBA Report.</p>
            <p id={`fn42`}><sup className="mr-1 font-bold text-[#05386f]">42</sup>See paragraph 382 of the EBA Report. Situations of environmental crisis or social unrest can lead to higher withdrawals, share buybacks, or other stresses on liquidity position.</p>
            <p id={`fn43`}><sup className="mr-1 font-bold text-[#05386f]">43</sup>The Climate Change Act provides a framework for achieving low greenhouse gas emission (GHG), inclusive green growth and sustainable economic development through, inter alios, facilitating the mobilisation of finance and other resources necessary to ensure effective action on climate change and ensuring that private and public entities comply with stated climate change strategies, targets and National Climate Change Action Plan<FootnoteRef number={43} />.</p>
            <p id={`fn44`}><sup className="mr-1 font-bold text-[#05386f]">44</sup>Exemptions to this application exist for financial advisers which employ fewer than three persons – however, they are required to consider and factor in sustainability risks in their advisory processes. See recital (6) of the Sustainability Finance Disclosure Regulation.</p>
            <p id={`fn45`}><sup className="mr-1 font-bold text-[#05386f]">45</sup>See Article 4 of the Sustainable Finance Disclosure Regulation.</p>
            <p id={`fn46`}><sup className="mr-1 font-bold text-[#05386f]">46</sup>See Articles 6 and 9 of the Sustainable Finance Disclosures Regulation</p>
            <p id={`fn47`}><sup className="mr-1 font-bold text-[#05386f]">47</sup>See Article 9 of the Taxonomy Regulation. These include (a) climate change mitigation<FootnoteRef number={50} />; (b) climate change adaptation; (c) the sustainable use and protection of water and marine resources; (d) the transition to a circular economy; (e) pollution prevention and control; and (f) the protection and restoration of biodiversity and ecosystems</p>
            <p id={`fn48`}><sup className="mr-1 font-bold text-[#05386f]">48</sup>See Article 3 of the Taxonomy Regulation</p>
            <p id={`fn49`}><sup className="mr-1 font-bold text-[#05386f]">49</sup>See Article 5 of the Taxonomy Regulation</p>
            <p id={`fn50`}><sup className="mr-1 font-bold text-[#05386f]">50</sup>See Article 10 of the Taxonomy Regulation</p>
            <p id={`fn51`}><sup className="mr-1 font-bold text-[#05386f]">51</sup>See Article 16 of the Taxonomy Regulation</p>
            <p id={`fn52`}><sup className="mr-1 font-bold text-[#05386f]">52</sup>See recital 28 of the Sustainable Finance Disclosure Regulation</p>
            <p id={`fn53`}><sup className="mr-1 font-bold text-[#05386f]">53</sup>The United Nations Sustainable Development Goals adopted by all UN member states in 2015 comprises a global agenda to alleviate poverty and inequality, expand access to health and education, and spur economic growth and employment, while tackling climate change and working to preserve the world’s habitats by 2030.</p>
            <p id={`fn54`}><sup className="mr-1 font-bold text-[#05386f]">54</sup>The Paris Agreement is a legally binding international treaty on climate change adopted in December 2015 under the United Nations Framework Convention on Climate Change (UNFCCC). Its central aim is to limit global warming to well below 2°C, preferably 1.5°C, above pre-industrial levels, through commitments by countries (Nationally Determined Contributions) to reduce greenhouse gas emissions and strengthen climate resilience.</p>
            <p id={`fn55`}><sup className="mr-1 font-bold text-[#05386f]">55</sup>Businessday NG. (2025, January 20). ESG—A lifeline for the sustainability of Nigeria's SMEs. Retrieved from &lt;https://businessday.ng/opinion/article/esg-a-lifeline-for-the-sustainability-of-nigerias-smes/&gt; (Accessed: 14 March 2026)</p>
            <p id={`fn56`}><sup className="mr-1 font-bold text-[#05386f]">56</sup>See Paragraph 3.14 of the Regulation, which provides that PFAs/CPFAs shall incorporate ESG factors into their investment decision-making process, emphasizing governance and responsible investing, encouraging collaboration and inclusive growth and allocating long-term assets to priority sectors that promote sustainable national development or other thematic areas as designated by the National Pensions Commission.</p>
        </div>
    </div>
);

export const BackCover: React.FC = () => (
    <div id="back-cover" className="relative h-full flex flex-col justify-between items-center bg-[#05386f] text-white pt-24 pb-24 px-24 overflow-hidden">
        {/* Background Layers & Luxury Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 silk-texture opacity-10" />
        
        {/* Architectural Geometry (JEE Influence) */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        <div className="absolute top-0 right-0 w-[40%] h-full bg-white/[0.01] skew-x-12 -z-10" />

        <div className="relative z-10 flex flex-col items-center">
            {/* Logo without the white box - larger and more integrated */}
            <div className="w-32 h-32 flex items-center justify-center mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <img src="/assets/banwo-logo.webp" alt="Banwo & Ighodalo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-[22px] font-black uppercase tracking-[0.5em] mb-3 font-cinzel text-white">BANWO & IGHODALO</h2>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <div className="w-2 h-2 rotate-45 border border-[#D4AF37]" />
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
        </div>

        {/* Contributors Section with Refined Frames */}
        <div className="relative z-10 flex justify-center gap-20 mb-16">
            {[
                {
                    n: 'Amanze Izundu',
                    t: 'Associate',
                    image: '/assets/amanze.jpg'
                },
                {
                    n: 'Oluwayansola Jeje',
                    t: 'Associate',
                    image: '/assets/yansola.jpg'
                }
            ].map((person, i) => (
                <div key={i} className="flex flex-col items-center gap-5 group">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border border-[#D4AF37]/50 rounded-full group-hover:scale-110 transition-all duration-700 ease-out" />
                        <div className="absolute -inset-2 border border-[#D4AF37]/10 rounded-full group-hover:scale-125 transition-all duration-1000 ease-out opacity-0 group-hover:opacity-100" />
                        <div className="absolute inset-1.5 rounded-full flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl">
                            <img src={person.image} alt={person.n} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-[12px] font-bold text-white tracking-wider font-cinzel mb-1">{person.n}</div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-cinzel font-semibold">{person.t}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer with Vertical Divider (NICArb Influence) */}
        <div className="relative z-10 w-full max-w-2xl flex items-start justify-center gap-12 pt-12 border-t border-white/10">
            <div className="flex-1 text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black font-cinzel text-[#D4AF37] mb-3">Lagos Office</p>
                <p className="text-[11px] font-garamond opacity-80 leading-relaxed tracking-wide">
                    48 Awolowo Road, Ikoyi<br />
                    Lagos, Nigeria<br />
                    T: +234 1 270 2551
                </p>
            </div>
            
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent self-center" />

            <div className="flex-1 text-left">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black font-cinzel text-[#D4AF37] mb-3">Abuja Office</p>
                <p className="text-[11px] font-garamond opacity-80 leading-relaxed tracking-wide">
                    4th Floor, Rivers House<br />
                    Plot 83 Ralph Shodeinde St<br />
                    CBD, Abuja, Nigeria
                </p>
            </div>
        </div>

        <div className="relative z-10 mt-16 flex flex-col items-center gap-6">
            <div className="flex items-center gap-8">
                <div className="h-[0.5px] w-20 bg-gradient-to-r from-transparent to-white/20" />
                <p className="text-[11px] font-cinzel tracking-[0.4em] uppercase text-white/60">www.banwo-ighodalo.com</p>
                <div className="h-[0.5px] w-20 bg-gradient-to-l from-transparent to-white/20" />
            </div>
        </div>

        {/* Bottom Ghost Text - Refined */}
        <div className="absolute bottom-8 w-full flex justify-center opacity-20 text-[9px] uppercase tracking-[1.2em] font-black font-cinzel text-[#D4AF37]">
            Sustainable Finance Series 2026
        </div>
    </div>
);
