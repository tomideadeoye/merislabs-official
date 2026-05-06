'use client';

import React from 'react';
import { FootnoteRef } from './PageWrapper';
import { Gavel, ShieldCheck, Landmark, Target, BookOpenText } from 'lucide-react';

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
        <SectionHeader title="Table of Contents" />
        <div className="mt-12 space-y-6 max-w-lg">
            {[
                { t: 'Introduction', p: '3', id: 'introduction' },
                { t: 'ESG Financing', p: '3', id: 'introduction' },
                { t: 'SMEs’ Need For Capital', p: '4', id: 'market-context' },
                { t: 'Demand Side', p: '5', id: 'demand-side' },
                { t: 'Supply Side', p: '6', id: 'supply-side' },
                { t: 'Cultural Shift', p: '8', id: 'supply-side' },
                { t: 'The Way Forward', p: '9', id: 'the-way-forward' },
                { t: 'Conclusion', p: '10', id: 'the-way-forward' },
                { t: 'Footnotes', p: '11', id: 'footnotes' }
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
        <SectionHeader number="01-02" title="Introduction & ESG Finance" />
        <div className="space-y-4 text-[9px] leading-relaxed opacity-90 text-justify overflow-y-auto">
            <p className="font-bold uppercase tracking-widest text-[#05386f] text-[8px]">1.0 Introduction</p>
            <p>The Environmental, Social, and Governance (“ESG”) framework is an investment lens employed to evaluate how a company manages both the risks and the opportunities related to its sustainability and ethical impact.<FootnoteRef number={1} /> It has evolved into a crucial method for assessing long-term value creation that extends beyond conventional financial metrics. The three core components are defined as follows: The Environmental (E) criteria gauge a company’s performance as a steward of the natural world, with key factors including its climate change strategy, the management of carbon emissions, efficiency in resource use like water and land, waste reduction, and the protection of biodiversity<FootnoteRef number={2} />. The Social (S) criteria focus on how a company manages its relationships with stakeholders, encompassing issues like labour standards, health and safety, diversity and inclusion policies, adherence to human rights across the supply chain, and effective community engagement<FootnoteRef number={3} />. Finally, the Governance (G) criteria examine the structures of a company's leadership and operation, involving board composition and independence, transparency in executive compensation and audits, the protection of shareholder rights, and the implementation of robust anti-corruption and ethical conduct policies.</p>
            
            <p className="font-bold uppercase tracking-widest text-[#05386f] text-[8px] pt-2">2.0 ESG Financing</p>
            <p>The growing importance of ESG and ESG Finance is rooted in two significant global trends: (i) its role in strengthening corporate resilience and (ii) a fundamental shift in capital allocation. ESG factors directly influence a business’s long-term operational and financial stability. Ignoring environmental or social risks, such as the physical and transition risks from climate change or poor labour practices that lead to reputational damage, can result in substantial financial losses, regulatory fines, and operational disruptions. By integrating ESG principles, companies are better positioned to anticipate and mitigate these non-financial risks.</p>
            <p>A comprehensive review of academic literature found a positive correlation between strong ESG performance and financial outcomes, noting that companies with higher ESG scores often exhibit lower costs of capital and better operational performance, especially during periods of crisis, which is mediated by factors like improved risk management and greater innovation<FootnoteRef number={4} />. ESG Finance, which involves integrating these non-financial criteria into investment and lending decisions, is crucial for achieving global sustainability targets, such as the Paris Agreement and the UN Sustainable Development Goals (SDGs). This shift is propelled by increasing investor demand, global regulatory mandates, and the need to finance the transition to a green economy. Investors are re-channelling trillions of dollars toward businesses demonstrating credible sustainability performance<FootnoteRef number={5} />.</p>
            <p>Initiatives like the Nigerian Sustainable Banking Principles (NSBP)<FootnoteRef number={6} />, which mandate financial institutions to embed ESG into their risk management and lending processes, and the issuance of green bonds by the Nigerian government and private sector, are key facilitators of this capital flow<FootnoteRef number={7} />. For instance, the Nigeria Green Bond Market Development Programme (NGBMDP) recently announced the launch of a Sustainable Finance Bootcamp aimed at empowering Nigerian SMEs and startups to unlock sustainable funding by deepening their capacity in ESG project structuring, investor-grade frameworks, and financing strategies.<FootnoteRef number={8} /> By embracing ESG, SMEs can improve their resilience against local climate risks, like flooding, and unlock new funding opportunities, often in the form of sustainability-linked loans, which may offer favourable terms for meeting specific impact targets.</p>
        </div>
    </div>
);

export const MarketContextSection: React.FC = () => (
    <div id="market-context" className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="03" title="SMEs’ Need For Capital" subtitle="Economic Analysis" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p>Small and Medium-sized Enterprises (SMEs) form the backbone of economies globally: driving inclusive growth, job creation, poverty reduction, and innovation. Worldwide, SMEs make up around 90% of businesses and contribute over 50% of global GDP.<FootnoteRef number={10} /> The impact is even more pronounced in Africa, where they represent over 90% of all businesses and provide nearly 80% of total employment.<FootnoteRef number={11} /> In Nigeria, while SMEs account for 96% of all businesses and employ about half of the country’s workforce, they only contribute 48% to the national GDP.<FootnoteRef number={12} /></p>
            <p>As a dominant force in Nigeria's economy, SMEs collectively wield significant influence over ESG outcomes through their cumulative operations, workforce practices, and governance structures. While individual SMEs have modest footprints, their aggregate impact is substantial. On the environmental front, their collective carbon emissions, resource consumption, and waste generation are significant contributors to Nigeria's overall environmental footprint. Socially, SME practices directly affect millions of workers and communities: for instance, Nigeria’s recent minimum wage increase from ₦30,000 to ₦70,000<FootnoteRef number={13} /> is yet to be widely adopted and remains largely unadopted by SMEs due to affordability concerns and weak enforcement. Structured corporate social responsibility initiatives are largely absent, as most SMEs focus almost exclusively on profitability and scaling. From a governance perspective, many SMEs operate informally or semi-formally, with limited internal structures to support decision-making, financial transparency, accountability, or regulatory compliance. This weak governance framework often leads to mismanagement and business fragility. Given that SMEs account for the majority of employment in Nigeria, such failures contribute significantly to rising unemployment and economic instability.</p>
            <p>Consequently, while SMEs as a collective are well-positioned to shape ESG outcomes, it must be said that SMEs in Nigeria have, thus far, not positively shaped ESG outcomes. Nigerian SMEs continue to face structural barriers to growth, particularly limited access to finance. According to PwC’s 2023 MSME Survey, 69% of SMEs had not received any government grants in the preceding 24 months, with many citing bottlenecks as key obstacles. Beyond government support, SMEs face significant challenges accessing formal credit facilities, with many expressing low trust in the formal banking system as a primary barrier to financing.<FootnoteRef number={14} /> These findings echo the World Bank’s Doing Business report, which ranked Nigeria 131st out of 190 economies in terms of ease of starting a business.<FootnoteRef number={15} /></p>
            <p className="text-[9px] opacity-80 leading-relaxed italic">An overview of these barriers, divided for ease of reference into demand-side barriers and supply-side barriers, is set out below:</p>
            <div className="space-y-4 pt-2">
                <table className="w-full text-[8.5px] border-collapse">
                    <thead>
                        <tr className="bg-[#211B1B] text-white">
                            <th className="p-2 text-left border border-[#211B1B]/10 uppercase tracking-widest">Demand-Side Challenges (SMEs)</th>
                            <th className="p-2 text-left border border-[#211B1B]/10 uppercase tracking-widest">Supply-Side Challenges (Financial Institutions)</th>
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
            <p className="opacity-80 italic text-[8px]">This paper – the first in a three-part series – provides a comprehensive analysis of both supply-side and demand-side opportunities and challenges facing Nigerian SMEs in their pursuit of sustainability-linked capital. It seeks to highlight the disconnect between financier expectations and SME realities, and to propose actionable recommendations to strengthen SME access to sustainable finance. Part Two will examine proposed regulatory and institutional reforms, while Part Three will set out a practical implementation framework for Nigerian SMEs seeking to integrate ESG into their operations and financing strategies.</p>
        </div>
    </div>
);

export const DemandSideInternalSection: React.FC = () => (
    <div id="demand-side" className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="04" title="Demand Side" subtitle="Internal Barriers" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p>Despite the expanding pool of sustainability-linked capital, Nigerian SMEs remain largely excluded from accessing it, due to persistent demand-side constraints. As global and domestic capital flows increasingly prioritise ESG considerations, SMEs face growing expectations that they are often unprepared to meet. This exclusion chiefly stems from structural and institutional challenges within the SME segment itself.</p>
            
            <div className="grid grid-cols-5 gap-2 my-8 p-4 bg-[#05386f]/5 rounded-2xl border border-[#D4AF37]/10">
                {[
                    { icon: '💡', title: 'Awareness', desc: 'Knowledge gaps in ESG metrics.' },
                    { icon: '📊', title: 'Reporting', desc: 'Weak data infrastructure.' },
                    { icon: '👥', title: 'Talent', desc: 'No in-house ESG specialists.' },
                    { icon: '⚡', title: 'Stability', desc: 'Volatile policy environment.' },
                    { icon: '⏳', title: 'Survival', desc: 'Short-term cash pressures.' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#05386f] border border-[#D4AF37]/30 flex items-center justify-center text-[14px] shadow-sm">
                            <span className="opacity-90 grayscale brightness-200">{item.icon}</span>
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-[#05386f] text-[7px] font-cinzel">{item.title}</h4>
                        <p className="text-[6.5px] opacity-70 leading-tight">{item.desc}</p>
                    </div>
                ))}
            </div>

            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Limited Awareness:</span> Many SMEs remain unaware of ESG-linked finance and its associated reporting requirements. This knowledge gap extends to critical concepts such as ESG metrics, climate risk disclosures, and performance-based loan covenants.<FootnoteRef number={16} /> Globally, a 2023 survey revealed that while 83% of SMEs recognise the importance of sustainability, only 8% actually report on sustainability issues, underscoring the gap between recognition and practical integration.<FootnoteRef number={17} /> In the Nigerian context, “insufficient awareness” is consistently cited as a key reason for limited sustainability reporting.<FootnoteRef number={18} /> This is problematic because insufficient awareness leads to a critical lack of action, creating significant business risks and missed opportunities. To address this, initiatives led by organisations such as the UN Global Compact Network Nigeria, in collaboration with the FRC and Integrity Organisation, have introduced guidelines such as the Small and Medium Enterprises Corporate Governance Guidelines (SME-CGG).<FootnoteRef number={19} /></p>
            
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Poor Reporting Capacity:</span> Few SMEs have the systems required to track non-financial performance. A global study revealed that only about 9% of SMEs operate formal sustainability reporting programmes, largely due to constraints of time, expertise, and budget.<FootnoteRef number={20} /> Without baseline data on emissions, water use, waste generation, employee metrics, or governance practices, SMEs are unable to meet the minimum entry requirements for green bonds, sustainability-linked loans, or climate funds.</p>
            
            <p>In Nigeria, this gap is even more pronounced. A 2023 industry study concluded that “the vast majority of SMEs do not collect or manage any form of ESG-related data”.<FootnoteRef number={21} /> Reported challenges include (a) lack of consistent and reliable data on ESG metrics; (b) difficulty in measuring and quantifying social and environmental impacts; and (c) financial and resource constraints.<FootnoteRef number={22} /> The informal nature of many Nigerian SMEs further exacerbates this issue, with some lacking even basic financial records. This creates a vicious cycle: data gaps hinder reporting, poor reporting limits access to sustainable finance, and the lack of financing prevents investment in the very systems needed to improve reporting. Addressing this requires solutions that build fundamental data infrastructure and literacy, including business formalisation and digital transformation, which can then be leveraged for sustainability reporting. The complexity and fragmentation of current reporting regimes also highlight the need for simplified, standardised, and interoperable reporting frameworks tailored specifically for SMEs.<FootnoteRef number={22} /></p>
            
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Limited Staff and Tools:</span> Most SMEs lack in-house ESG specialists and adequate data-management tools, making the collection and verification of ESG indicators difficult. Reports indicate that the vast majority of SMEs neither employ sustainability experts nor use automated systems, which prevents them from responding effectively to lenders’ data requests.<FootnoteRef number={23} /> As a result, they struggle to produce the disclosures necessary for banks or investors to assess sustainability performance, conduct due diligence, or structure performance-based pricing. Addressing this requires two parallel solutions. Firstly, the development and promotion of accessible, affordable, and user-friendly digital tools for ESG data collection and reporting, tools that are localised, intuitive, and easily integrated into existing SME workflows. Achieving this will require collaboration between technology providers, financial institutions, and SME-support organisations. Secondly, beyond technological tools, the human-capital gap within SMEs must be tackled through systematic upskilling of existing staff in sustainability principles and practices, complemented by accessible pools of external advisory support.</p>
            
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">High Uncertainty:</span> SMEs operate in highly volatile markets characterised by policy shifts and economic instability, which the OECD identifies as “one of the greatest barriers” for SMEs in pursuing green initiatives.<FootnoteRef number={24} /> A 2025 WEF report found that 47% of manufacturing SMEs cited “policy uncertainty” as a significant barrier.<FootnoteRef number={25} /> While Nigeria has endorsed the adoption of ISSB's IFRS S1 and S2 standards with mandatory ESG disclosures from 2028<FootnoteRef number={26} />, the phased implementation implies a period of voluntary adoption where clarity may still be developing. Broader macroeconomic developments, such as fuel subsidy removals and exchange rate reforms, further contribute to instability, undermining SMEs’ ability for long-term planning.<FootnoteRef number={27} /></p>
            
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Short-term Survival Focus:</span> Operating on tight margins, SMEs prioritise immediate needs over long-term sustainability, often putting ESG initiatives on the back burner due to time and cash pressures. In practice, survival needs often supersede strategic green planning. PwC’s MSME Survey 2024 in Nigeria found “inadequate access to finance” as the number one challenge for 35% of businesses, while over 50% reported falling sales due to high prices.<FootnoteRef number={28} /> For sustainability to gain traction, it must be positioned as a pathway to immediate and tangible benefits, such as clear cost savings (e.g., through energy efficiency), entry into new markets, or resilience against economic and climate shocks.<FootnoteRef number={29} /></p>
        </div>
    </div>
);

export const DemandSideExternalSection: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="04" title="Demand Side" subtitle="External Barriers" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p>Beyond these internal limitations, SMEs are also constrained by systemic factors within the broader ESG and financial ecosystem. These external forces lie outside the direct control of the SME yet significantly impact their ability to adopt sustainable practices and secure green financing.</p>

            <div className="grid grid-cols-3 gap-4 my-8 p-6 bg-[#05386f]/5 rounded-2xl border border-[#D4AF37]/10">
                {[
                    { icon: ShieldCheck, title: 'Weak Ecosystem', desc: 'Lack of credible SME-focused ESG scores & verifiers.' },
                    { icon: Landmark, title: 'Sparse Incentives', desc: 'Insufficient tax breaks and concessional finance.' },
                    { icon: BookOpenText, title: 'Fragmented Data', desc: 'No standardised disclosure requirements or protocols.' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#05386f] flex items-center justify-center border border-[#D4AF37]/30">
                            <item.icon className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-[#05386f] text-[8px] font-cinzel">{item.title}</h4>
                        <p className="text-[7px] opacity-70 leading-tight">{item.desc}</p>
                    </div>
                ))}
            </div>
            
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Weak ESG Ecosystem:</span> The broader support infrastructure for SMEs in the ESG space is significantly underdeveloped. Most markets lack sufficient SME-focused ESG scores, certifications, or verifiers.<FootnoteRef number={30} /> This leaves proactive SMEs unable to effectively “highlight their sustainability credentials” because there are no accessible, credible ratings or audit services tailored for small companies. Addressing this gap requires simplified, credible, and affordable ESG assessment and certification mechanisms, potentially delivered through local partnerships or tiered systems calibrated to SME resources.</p>
            
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Sparse Incentives:</span> Public incentives for SME “greening” remain limited and inconsistent. Surveys show that 52% of SMEs consider the lack of government policies or incentives a key obstacle to climate action, while 84% report receiving no emissions-reduction subsidies.<FootnoteRef number={31} /> In Nigeria, evidence suggests that SME access to ESG-linked finance is negligible. A UNDP-backed program identified 25 high-impact Nigerian SMEs with combined sustainable-finance needs of $175 million but mobilised just $15 million for three ventures.<FootnoteRef number={32} /> Closing this gap requires strong “pull” factors, targeted tax reliefs, concessional financing and non-financial incentives to make sustainability an immediate business advantage.</p>
            
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">Fragmented Information:</span> Guidance on sustainable finance is often scattered, leaving SMEs to navigate a confusing patchwork of standards and disclosure requirements. The OECD notes that SMEs urgently need better frameworks and tools to bridge sustainability data gaps when seeking finance.<FootnoteRef number={33} /> In practice, each lender or donor often demands different disclosures, creating an “information overload” paradox. Standardised methodologies, simplified independent verification systems, and trusted data protocols would further build lender confidence and trust in SME-generated ESG data.<FootnoteRef number={34} /></p>
            
            <p className="pt-4 border-t border-[#D4AF37]/20 italic opacity-80 text-[8px]">While demand-side barriers highlight the limitations within SMEs and their immediate environment, the challenges are equally pronounced on the supply side. Financial institutions, investors, and regulators often lack the tools, incentives, and frameworks to originate and scale ESG-linked finance tailored to the realities of Nigerian SMEs.</p>
        </div>
    </div>
);

export const SupplySideSection: React.FC = () => (
    <div id="supply-side" className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="05" title="Supply Side" subtitle="Investors & Information Gap" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p>For SMEs, accessing sustainable finance is not only a question of demand but also of meeting the expectations of financiers. Even when SMEs demonstrate viable business models and a willingness to adopt sustainable practices, their financing prospects ultimately depend on the products, risk appetites, and compliance obligations of financial market participants (“FMPs”). To meet sustainability objectives, investors channel private capital primarily through FMPs operating in the financial services market.</p>
            
            <div className="my-6 rounded-2xl overflow-hidden shadow-lg border border-[#D4AF37]/20">
                <img src="/assets/education-tax.jpg" alt="Education Tax Compliance" className="w-full h-48 object-cover opacity-80" />
            </div>

            <p>In practice, this entails a financial institution (“financier”) offering products funded by end-investors who allocate capital for sustainability purposes. This structure creates an agent-principal relationship: financiers act as agents of the end-investors and owe fiduciary duties to ensure that proceeds of the investment are disbursed in ways that align with stated sustainability objectives. As part of these obligations, financiers must demonstrate ESG-based investment decision-making and governance, their capacity to conduct due diligence on borrowers, and continue to make comprehensive disclosures to end-investors.</p>
            <p>Thus, with respect to access to sustainability finance in Nigeria, the supply side expectations and associated challenges can be categorised into four: (a) securing ESG end-investors; (b) the information gap; (c) determining appropriate financial products; and (d) challenges under applicable laws. These points will be addressed in subsequent paragraphs.</p>
            
            <p><span className="font-bold uppercase tracking-tight text-[#211B1B]">(a) Securing ESG End-Investors:</span> A blocker to SMEs' ability to access ESG finance in Nigeria lies in the inability to attract ESG end-investors whose sustainability objectives are flexible enough to accommodate little to no ESG metrics. Global and domestic investors rely heavily on measurable ESG metrics before committing capital. However, most Nigerian SMEs do not generate verifiable ESG data, creating a credibility gap that undermines investor confidence.</p>
            
            <p>Financiers are responsible for ensuring that capital is deployed in alignment with ESG objectives as agreed with end-investors. This involves conducting ESG due diligence – including sustainability risk assessments, integrating sustainability considerations into investment decision-making and governance, and providing pre-contractual and ongoing disclosures to investors. To safeguard against greenwashing, end-investors screen financiers carefully, avoiding those that misrepresent financial products as sustainable. Therefore, to secure end-investors, financiers must explain how financed activities contribute to environmental or social objectives. To meet this expectation, financiers require borrowers who demonstrate the capacity to maintain reliable ESG data, which will in turn assist their disclosure obligations to end-investors. In the absence of this, mobilising long-term ESG-aligned capital to Nigerian SMEs remains extremely challenging.</p>
        </div>
    </div>
);

export const SupplySideInfoGapSection: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="05" title="Supply Side" subtitle="The Information Gap" />
        <div className="space-y-4 text-[9px] leading-relaxed text-justify opacity-90 overflow-y-auto">
            <p className="font-bold uppercase tracking-widest text-[#05386f] text-[8px] pt-2">(b) The Information Gap – Heightened Perception of Sustainability Risks</p>
            <p>Nigerian SMEs face significant challenges in meeting the information expectations required under sustainability financing. Traditional credit metrics are insufficient for ESG purposes, and Nigerian SMEs generally lack a culture of sustainability reporting and compliance. This absence of verifiable ESG data complicates due diligence, heightens the perception of sustainability risks to end-investors, and limits SME access to much-needed finance.</p>
            
            <p>Sustainability risks are material financial risks that directly affect credit quality, solvency, and long-term profitability. They manifest across established financial risk categories: credit, market, liquidity, operational, and reputational risks. ESG risks arise through multiple channels:</p>
            <ul className="list-disc pl-5 opacity-90 space-y-1">
               <li><span className="font-bold text-[#211B1B]">Environmental risks:</span> Physical risks (floods, droughts, pollution) and transition risks (carbon taxes, stricter environmental regulations, technological shifts) can reduce counterparty productivity, collateral value, and profitability.<FootnoteRef number={35} /></li>
               <li><span className="font-bold text-[#211B1B]">Social risks:</span> Poor labour relations<FootnoteRef number={36} />, weak community engagement, and inadequate working conditions can trigger litigation, operational disruption, or reputational damage. These risks are amplified in Nigeria due to weaker labour protections and limited SME resilience.<FootnoteRef number={37} /></li>
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
               <li><span className="font-bold text-[#211B1B]">Market risk:</span> end-investors increasingly apply negative screening policies based on ESG considerations. In circumstances where ESG data is unreliable or unavailable, many financiers apply negative screening and exclude such investments altogether, impacting the supply of capital.<FootnoteRef number={41} /></li>
               <li><span className="font-bold text-[#211B1B]">Operational & reputational risk:</span> financiers must carefully evaluate the extent to which ESG-related operational exposures could result in reputational or legal damage, ensuring consistency between an entity’s public disclosures and internal practices in order to mitigate the risk of greenwashing.</li>
               <li><span className="font-bold text-[#211B1B]">Liquidity and funding risk:</span> general sustainability concerns impair market access and limit the stability of funding profiles, requiring financiers to assess liquidity risks across varying time horizons.<FootnoteRef number={42} /></li>
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

const RoadmapStep: React.FC<{ icon: any, title: string, desc: string, isLast?: boolean }> = ({ icon: Icon, title, desc, isLast }) => (
    <div className="flex gap-4 relative">
        {!isLast && <div className="absolute left-[15px] top-8 bottom-0 w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent opacity-20" />}
        <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-[#05386f] border border-[#D4AF37]/40 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div className="pb-6">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-[#05386f] mb-1 font-cinzel">{title}</h4>
            <p className="text-[8px] leading-snug opacity-70 max-w-[200px]">{desc}</p>
        </div>
    </div>
);

export const TheWayForwardSection: React.FC = () => (
    <div id="the-way-forward" className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="07" title="The Way Forward" subtitle="Implementation Roadmap" />
        <div className="grid grid-cols-[1.2fr_1fr] gap-12 flex-grow overflow-hidden">
            <div className="space-y-4 text-[8.5px] leading-relaxed text-justify opacity-90 overflow-y-auto pr-4">
                <p>However, Nigerian SMEs have largely been excluded from this momentum as systemic barriers continue to restrict their access to such financing options. The disconnect between both sides (demand and supply side) has contributed to a significant gap in SME-tailored sustainability finance products, leaving a large segment of the private sector excluded from Nigeria’s transition to a greener economy.</p>
                
                <p>In May 2024, the Financial Reporting Council of Nigeria (FRC) issued the SME Corporate Governance Guideline (the “SME CCG”) to assist SMEs in establishing robust business processes and preparing them for future expansion, by enabling them to be more bankable and investable. While the SME CCG is not binding, it serves as a reference and framework for SMEs to understand and practice good corporate governance. Relevant principles include (i) Principle 5 deals with the control environment, comprising internal controls, audit, and risk management, and requires SMEs to maintain credible books of accounts. Section F of the SME CCG deals with ESG considerations and covers principles 9 -11. Principle 9 requires SMEs to be sensitive to the effect of their business on the environment in which they operate, as well as to how they engage and influence a wide range of stakeholders from diverse backgrounds within their communities.</p>
                
                <p>Given that the SME CCG is more of a model document than a mandatory law, we believe that the best way to establish this culture among SMEs is through mandatory legislative action to create an enabling environment. While legislation like the Climate Act provides for such a regime, there are no guidelines or further regulations with clarity on how to implement the obligations imposed by the Act.</p>
                
                <p>As a welcome development, the September 2025 Revised Regulation on Investment of Pension Fund Assets issued by the National Pension Commission represents a significant step in the right direction as it formally requires pension fund administrators to integrate ESG factors into their investment decisions.<FootnoteRef number={56} /> This regulation moves ESG from a voluntary action to a mandatory consideration and will drive sustainable investments in Nigeria in the long term. Against this backdrop, we look forward to more regulation with a view to establishing the culture and practice of sustainability-linked reporting among Nigerian companies.</p>
            </div>

            <div className="bg-[#211B1B]/[0.02] rounded-3xl p-8 border border-[#211B1B]/5 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#211B1B] mb-8 font-cinzel flex items-center gap-3">
                    <div className="w-6 h-[1px] bg-[#D4AF37]" />
                    Implementation Path
                </h3>
                
                <div className="flex-grow">
                    <RoadmapStep 
                        icon={Gavel} 
                        title="Legislative Action" 
                        desc="Creating clear guidelines for the Climate Change Act to provide SME implementation clarity." 
                    />
                    <RoadmapStep 
                        icon={ShieldCheck} 
                        title="Governance Adoption" 
                        desc="Mainstreaming the FRC SME Corporate Governance Guidelines as a standard for bankability." 
                    />
                    <RoadmapStep 
                        icon={Landmark} 
                        title="Institutional Shift" 
                        desc="Enforcing the 2025 Pension Fund Regulations to mandate ESG integration in capital allocation." 
                    />
                    <RoadmapStep 
                        icon={Target} 
                        title="Net-Zero 2060" 
                        desc="Final alignment of the SME sector with Nigeria's long-term sustainability and economic goals." 
                        isLast 
                    />
                </div>

                <div className="mt-4 p-4 border border-[#D4AF37]/20 rounded-xl bg-white shadow-sm">
                    <p className="text-[7.5px] italic opacity-80 leading-tight">
                        "ESG moves from a voluntary choice to a mandatory consideration, driving long-term resilience for Nigerian SMEs."
                    </p>
                </div>
            </div>
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

export const FootnotesPage: React.FC = () => (
    <div className="h-full pt-16 px-16 pb-24 flex flex-col">
        <SectionHeader number="09" title="Footnotes" />
        <div className="columns-2 gap-8 text-[7px] leading-snug text-justify opacity-80 overflow-y-auto pt-4">
            <p id={`fn1`}><sup className="mr-1 font-bold text-[#05386f]">1</sup>Investopedia (N.D) ESG investing: What it is &amp; how it works. Available at: &lt;https://www.investopedia.com/terms/e/environmental-social-and-governance-esg-criteria.asp&gt; (Accessed 14 March 2026).</p>
            <p id={`fn2`}><sup className="mr-1 font-bold text-[#05386f]">2</sup>Deutsche Bank Wealth Management (n.d.) What is ESG investing? Available at: &lt;https://www.deutschewealth.com/en/our-capabilities/esg/what-is-esg-investing-wealth-management.html&gt; (Accessed 14 March 2026)</p>
            <p id={`fn3`}><sup className="mr-1 font-bold text-[#05386f]">3</sup>Ibid., footnote 1.</p>
            <p id={`fn4`}><sup className="mr-1 font-bold text-[#05386f]">4</sup>Clark, A., &amp; Lalit, P. (2021). ESG and Financial Performance. NYU Stern Center for Sustainable Business and Rockefeller Asset Management.</p>
            <p id={`fn5`}><sup className="mr-1 font-bold text-[#05386f]">5</sup>Securities and Exchange Commission. (2022, October 27). Sustainable Finance in Nigeria: Performance and Outlook.</p>
            <p id={`fn6`}><sup className="mr-1 font-bold text-[#05386f]">6</sup>The Nigerian Sustainable Banking Principles (NSBPs) (2012).</p>
            <p id={`fn7`}><sup className="mr-1 font-bold text-[#05386f]">7</sup>FMDQ Group. (2025, July 7). The Nigeria Green Bond Market Development Programme.</p>
            <p id={`fn8`}><sup className="mr-1 font-bold text-[#05386f]">8</sup>Ibid., footnote 7.</p>
            <p id={`fn9`}><sup className="mr-1 font-bold text-[#05386f]">9</sup>Businessday NG. (2025, January 20). ESG—A lifeline for the sustainability of Nigeria's SMEs.</p>
            <p id={`fn10`}><sup className="mr-1 font-bold text-[#05386f]">10</sup>World Bank SME Finance. https://www.worldbank.org/en/topic/smefinance</p>
            <p id={`fn11`}><sup className="mr-1 font-bold text-[#05386f]">11</sup>World Finance (n.d.) Can hybrid finance unburden Africa’s shaky SME sector?</p>
            <p id={`fn12`}><sup className="mr-1 font-bold text-[#05386f]">12</sup>Moniepoint (n.d.) Nigeria small business statistics (2024).</p>
            <p id={`fn13`}><sup className="mr-1 font-bold text-[#05386f]">13</sup>Section 2 of the National Minimum Wage (Amendment) Act, 2024.</p>
            <p id={`fn14`}><sup className="mr-1 font-bold text-[#05386f]">14</sup>PwC Nigeria (2024) PwC MSME Survey Report 2024.</p>
            <p id={`fn15`}><sup className="mr-1 font-bold text-[#05386f]">15</sup>World Bank (n.d.) Doing business economy profile: Nigeria.</p>
            <p id={`fn16`}><sup className="mr-1 font-bold text-[#05386f]">16</sup>OECD (2022) Financing SMEs for sustainability. Page 43.</p>
            <p id={`fn17`}><sup className="mr-1 font-bold text-[#05386f]">17</sup>Sage (2024) Unlocking Sustainable Finance for SMEs: COP29 Report.</p>
            <p id={`fn18`}><sup className="mr-1 font-bold text-[#05386f]">18</sup>IIARD (2025) Sustainability Reporting and SME Access to Green Finance.</p>
            <p id={`fn19`}><sup className="mr-1 font-bold text-[#05386f]">19</sup>Sustainability Directory (2024) Barriers to ESG adoption for SMEs.</p>
            <p id={`fn20`}><sup className="mr-1 font-bold text-[#05386f]">20</sup>Sage (2024) Unlocking Sustainable Finance for SMEs: COP29 Report.</p>
            <p id={`fn21`}><sup className="mr-1 font-bold text-[#05386f]">21</sup>Sage (2024) Unlocking Sustainable Finance for SMEs: COP29 Report.</p>
            <p id={`fn22`}><sup className="mr-1 font-bold text-[#05386f]">22</sup>Sage (2024) Unlocking Sustainable Finance for SMEs: COP29 Report.</p>
            <p id={`fn23`}><sup className="mr-1 font-bold text-[#05386f]">23</sup>Hogan Lovells (n.d.) Are SMEs Being Excluded from Sustainable Finance?</p>
            <p id={`fn24`}><sup className="mr-1 font-bold text-[#05386f]">24</sup>OECD (2022) Financing SMEs for Sustainability, p. 44.</p>
            <p id={`fn25`}><sup className="mr-1 font-bold text-[#05386f]">25</sup>World Economic Forum (2025) Fast-tracking SME sustainability.</p>
            <p id={`fn26`}><sup className="mr-1 font-bold text-[#05386f]">26</sup>IFRS Foundation (n.d.) Nigeria – Jurisdictional Profile.</p>
            <p id={`fn27`}><sup className="mr-1 font-bold text-[#05386f]">27</sup>World Economic Forum (2025) Fast-tracking SME sustainability.</p>
            <p id={`fn28`}><sup className="mr-1 font-bold text-[#05386f]">28</sup>PwC Nigeria (2024) PwC MSME Survey 2024.</p>
            <p id={`fn29`}><sup className="mr-1 font-bold text-[#05386f]">29</sup>UNCTAD (2024) Economic Development in Africa Report 2024.</p>
            <p id={`fn30`}><sup className="mr-1 font-bold text-[#05386f]">30</sup>SSE Initiative (n.d.) Model Guidance for SMEs.</p>
            <p id={`fn31`}><sup className="mr-1 font-bold text-[#05386f]">31</sup>We Mean Business Coalition (n.d.) 84% of SMEs Have Not Received Financial Incentives.</p>
            <p id={`fn32`}><sup className="mr-1 font-bold text-[#05386f]">32</sup>UNDP Nigeria (n.d.) Brokering Private Sector Investments for SDGs.</p>
            <p id={`fn33`}><sup className="mr-1 font-bold text-[#05386f]">33</sup>G20 Sustainable Finance Working Group &amp; OECD (2024).</p>
            <p id={`fn34`}><sup className="mr-1 font-bold text-[#05386f]">34</sup>G20 Sustainable Finance Working Group &amp; OECD (2024).</p>
            <p id={`fn35`}><sup className="mr-1 font-bold text-[#05386f]">35</sup>See paragraph 48 of the EBA Report.</p>
            <p id={`fn36`}><sup className="mr-1 font-bold text-[#05386f]">36</sup>See paragraph 77 of the EBA Report.</p>
            <p id={`fn37`}><sup className="mr-1 font-bold text-[#05386f]">37</sup>See paragraph 76 of the EBA Report.</p>
            <p id={`fn38`}><sup className="mr-1 font-bold text-[#05386f]">38</sup>See paragraph 86 of the EBA Report.</p>
            <p id={`fn39`}><sup className="mr-1 font-bold text-[#05386f]">39</sup>Nigeria maintains strict laws against economic and financial crimes.</p>
            <p id={`fn40`}><sup className="mr-1 font-bold text-[#05386f]">40</sup>See paragraph 108 of the EBA Report.</p>
            <p id={`fn41`}><sup className="mr-1 font-bold text-[#05386f]">41</sup>See paragraphs 373 to 376 of the EBA Report.</p>
            <p id={`fn42`}><sup className="mr-1 font-bold text-[#05386f]">42</sup>See paragraph 382 of the EBA Report.</p>
            <p id={`fn43`}><sup className="mr-1 font-bold text-[#05386f]">43</sup>The Climate Change Act (2021).</p>
            <p id={`fn44`}><sup className="mr-1 font-bold text-[#05386f]">44</sup>See recital (6) of the Sustainability Finance Disclosure Regulation.</p>
            <p id={`fn45`}><sup className="mr-1 font-bold text-[#05386f]">45</sup>See Article 4 of the Sustainable Finance Disclosure Regulation.</p>
            <p id={`fn46`}><sup className="mr-1 font-bold text-[#05386f]">46</sup>See Articles 6 and 9 of the Sustainable Finance Disclosures Regulation.</p>
            <p id={`fn47`}><sup className="mr-1 font-bold text-[#05386f]">47</sup>See Article 9 of the Taxonomy Regulation.</p>
            <p id={`fn48`}><sup className="mr-1 font-bold text-[#05386f]">48</sup>See Article 3 of the Taxonomy Regulation.</p>
            <p id={`fn49`}><sup className="mr-1 font-bold text-[#05386f]">49</sup>See Article 5 of the Taxonomy Regulation.</p>
            <p id={`fn50`}><sup className="mr-1 font-bold text-[#05386f]">50</sup>See Article 10 of the Taxonomy Regulation.</p>
            <p id={`fn51`}><sup className="mr-1 font-bold text-[#05386f]">51</sup>See Article 16 of the Taxonomy Regulation.</p>
            <p id={`fn52`}><sup className="mr-1 font-bold text-[#05386f]">52</sup>See recital 28 of the Sustainable Finance Disclosure Regulation.</p>
            <p id={`fn53`}><sup className="mr-1 font-bold text-[#05386f]">53</sup>The United Nations Sustainable Development Goals (2015).</p>
            <p id={`fn54`}><sup className="mr-1 font-bold text-[#05386f]">54</sup>The Paris Agreement (2015).</p>
            <p id={`fn55`}><sup className="mr-1 font-bold text-[#05386f]">55</sup>Businessday NG (2025).</p>
            <p id={`fn56`}><sup className="mr-1 font-bold text-[#05386f]">56</sup>See Paragraph 3.14 of the Regulation (2025).</p>
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
                    image: '/assets/amanze.jpg',
                    link: 'https://www.linkedin.com/in/amanze-izundu/'
                },
                {
                    n: 'Oluwayansola Jeje',
                    t: 'Associate',
                    image: '/assets/yansola.jpg',
                    link: 'https://www.linkedin.com/in/oluwayansola/'
                }
            ].map((person, i) => (
                <a key={i} href={person.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-5 group no-underline">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border border-[#D4AF37]/50 rounded-full group-hover:scale-110 transition-all duration-700 ease-out" />
                        <div className="absolute -inset-2 border border-[#D4AF37]/10 rounded-full group-hover:scale-125 transition-all duration-1000 ease-out opacity-0 group-hover:opacity-100" />
                        <div className="absolute inset-1.5 rounded-full flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl">
                            <img src={person.image} alt={person.n} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-[12px] font-bold text-white tracking-wider font-cinzel mb-1 group-hover:text-[#D4AF37] transition-colors">{person.n}</div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-cinzel font-semibold">{person.t}</div>
                    </div>
                </a>
            ))}
        </div>

        {/* Offices & Contact */}
        <div className="relative z-10 w-full max-w-4xl flex items-start justify-center gap-6 border-t border-white/10 pt-8 mt-8">
            <div className="text-center">
                <p className="text-[8px] uppercase tracking-[0.2em] font-black font-cinzel text-[#D4AF37] mb-1">Lagos (Head Office)</p>
                <p className="text-[8px] font-garamond opacity-80 leading-tight">48 Awolowo Road, Ikoyi | T: 02013302934 | banwigho@banwo-ighodalo.com</p>
            </div>
            
            <div className="w-[1px] h-8 bg-white/10 self-center" />

            <div className="text-center">
                <p className="text-[8px] uppercase tracking-[0.2em] font-black font-cinzel text-[#D4AF37] mb-1">Abuja Office</p>
                <p className="text-[8px] font-garamond opacity-80 leading-tight">14 Negro Crescent, Maitama | T: 02013302934</p>
            </div>

            <div className="w-[1px] h-8 bg-white/10 self-center" />

            <div className="text-center">
                <p className="text-[8px] uppercase tracking-[0.2em] font-black font-cinzel text-[#D4AF37] mb-1">Port Harcourt</p>
                <p className="text-[8px] font-garamond opacity-80 leading-tight">3 Woke-Koro Street, Old GRA | T: 02013302934</p>
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
