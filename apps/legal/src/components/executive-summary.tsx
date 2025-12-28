/**
 * EXECUTIVE SUMMARY COMPONENT
 * Redesigned with proper web aesthetics while preserving ALL original content
 */
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@merislabs/ui';
import { Badge } from '@merislabs/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@merislabs/ui';
import { Download } from 'lucide-react';

export function ExecutiveSummary() {
  React.useEffect(() => {
    console.log('[EXECUTIVE_SUMMARY] Rendering Executive Summary Component');
  }, []);

  const handleDownloadPDF = () => {
    console.log('[EXECUTIVE_SUMMARY] Initiating PDF download: Ecobank-Litigation-Audit-Executive-Summary.pdf');
    const a = document.createElement('a');
    a.href = '/Ecobank-Litigation-Audit-Executive-Summary.pdf';
    a.download = 'Ecobank-Litigation-Audit-Executive-Summary.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Executive Summary</h1>
            <p className="text-sm text-slate-500">PROJECT COMPASS • Litigation Audit Report</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Content Container - Constrained Width */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {/* Document Header */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="mb-4">Ecobank Nigeria Limited</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            EXECUTIVE SUMMARY
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Litigation Audit Report – Ecobank Nigeria Limited by Jackson, Etti &amp; Edu</p>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Introduction Section */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">1.0 Introduction</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              This Executive Summary presents the key findings, insights, and priority risks arising from the litigation audit conducted for <strong>Ecobank Nigeria Limited (&quot;the Bank&quot;)</strong>. Undertaken pursuant to the Bank&apos;s engagement instructions of 28 July 2025, the audit provides an independent, comprehensive, and data-driven assessment of the Bank&apos;s litigation posture across 348 matters.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              The review cut across multiple courts, subject-matter categories, and timelines, including long-standing commercial disputes, regulatory-related matters, legacy Oceanic Bank cases, and pre-emptory suits instituted to frustrate loan recovery. The findings distill the litigation landscape into a structured, management-level overview, highlighting systemic risks, strategic exposure areas, and opportunities for improved governance and case management.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              This Executive Summary is intended to guide the Bank&apos;s Legal, Risk, Compliance, Remedial, and Executive Management Teams.
            </p>
          </div>
        </section>

        {/* Purpose Section */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">2.0 Purpose of the Litigation Audit</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              The audit was undertaken to provide the Bank with a clear, independent, and strategic evaluation of its litigation portfolio, consistent with the Bank&apos;s instructions of 14 July 2025. The core objectives were to assess:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
              <li>The strength of the Bank&apos;s defence or claims in each matter.</li>
              <li>The sufficiency and completeness of supporting documentation.</li>
              <li>Legal, financial, procedural, operational, and reputational risks across the portfolio.</li>
              <li>The accuracy of case statuses reported to the Bank.</li>
              <li>Areas requiring immediate intervention; and</li>
              <li>Improvements needed in litigation governance, counsel oversight, and documentation management.</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              The audit further sought to evaluate external counsel performance, confirm procedural compliance, and develop recommendations that support a more proactive, structured, and risk-sensitive approach to litigation management.
            </p>
          </div>
        </section>

        {/* Scope Section */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">3.0 Scope of Work</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              The scope of the audit encompassed the full breadth of the Bank&apos;s 348 litigation matters, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>190 matters</strong> before the High Court of Lagos State;</li>
              <li><strong>134 matters</strong> before the Court of Appeal; and</li>
              <li><strong>24 matters</strong> instituted by the Bank.</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              The review covered active, dormant, legacy, and EndSARS-affected matters. It involved an examination of pleadings, motions, rulings, judgments, appeal records, facility and security documents, internal correspondence, and counsel reports. Particular attention was given to procedural posture, including pending appeals, the need for stays of proceedings, consolidation opportunities, dismissal applications, and reactivation of dormant matters.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              Counsel performance, reporting quality, strategic input, and filings were assessed, and each matter was evaluated for legal, financial, and reputational exposure. Clusters of related disputes, systemic issues, and high-priority cases were identified for focused management attention.
            </p>
          </div>
        </section>

        {/* Methodology Section */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">4.0 Methodology</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              The audit was executed using a structured framework designed to ensure independence, accuracy, and alignment with the Bank&apos;s strategic objectives. The methodology comprised the following elements:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>Engagement with the Bank:</strong> Initial engagements with the Legal and Remedial Units provided documentary baselines, clarified expectations, and established reporting protocols.</li>
              <li><strong>Engagement with External Counsel:</strong> Information was obtained from the Bank&apos;s panel of law firms, including Punuka, F.O. Akinrele, Bayo Osipitan &amp; Co., Kunle Ogunba &amp; Associates, Pinheiro LP, G. Elias, Templars, Aluko &amp; Oyebode, Paul Usoro &amp; Co., among others.</li>
              <li><strong>Court Verification and Independent Case Status Confirmation:</strong> Where discrepancies or gaps were identified, the audit team undertook court registry verification to obtain certified rulings and confirm case statuses.</li>
              <li><strong>Consolidation, Case Profiling, and Risk Assessment:</strong> All information was consolidated into a unified database to assess documentary strength, procedural posture, prospects of success, and exposure.</li>
              <li><strong>Reporting Framework:</strong> Findings were compiled into this Executive Summary, a detailed status report, and recommendations.</li>
            </ul>
          </div>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Portfolio Overview */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">5.0 Portfolio Overview, Litigation Themes and Key Statistics</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              The Bank&apos;s litigation portfolio reflects the breadth of its operations and the lasting impact of legacy obligations. While the Bank generally maintains a strong defence position supported by executed facility letters and perfected securities, several matters exhibit structural challenges including documentation gaps, inconsistent external counsel reporting, and dormant cases.
            </p>
          </div>
        </section>

        {/* Key Litigation Themes */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Key Litigation Themes</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Loan Related Claims/Pre-Emptory Actions to Forestall Debt Recovery:</strong> The most common disputes involve suits from defaulting borrowers to restrain recovery efforts.</li>
            <li><strong>High-Value Commercial Disputes:</strong> A smaller subset of matters involving large corporate facilities and structured finance contribute significantly to total exposure.</li>
            <li><strong>Legacy Oceanic Bank and AMCON/ESRC-Mapped Matters:</strong> These cases often exhibit prolonged dormancy and missing records.</li>
            <li><strong>Employment and Ex-Staff Class Actions:</strong> While individual exposure is modest, aggregated liability and reputational sensitivity are high.</li>
            <li><strong>Operational Negligence and Reputational-Sensitive Claims:</strong> Matters involving regulatory correspondence or collateral handling require carefully managed responses.</li>
            <li><strong>Real Property and Mortgage Litigation:</strong> Delays and competing title claims create operational complexity.</li>
          </ul>
          <p className="text-sm text-slate-500 mt-4 italic">
            <strong>See Appendix C</strong> for a detailed breakdown of litigation themes and case categorization.
          </p>
        </section>

        {/* Key Statistics */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Key Statistics</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>A substantial proportion of cases are defensive actions aimed at restraining enforcement.</li>
            <li>Legacy matters display significant dormancy or procedural stagnation.</li>
            <li>Many cases include strong Bank counterclaims.</li>
            <li><strong>14 matters</strong> account for over <strong>₦150 billion</strong> in financial exposure.</li>
            <li>Several matters present opportunities for discharge due to AMCON/ESRC assignments.</li>
          </ul>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Key Findings */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">6.0 Key Findings and Systemic Risks Identified</h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify mb-4">
            The audit reveals a generally strong litigation posture. However, systemic risks persist across five dimensions:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Borrower Financial Distress and Market Conditions:</strong> Macroeconomic volatility has driven borrower defaults and litigation.</li>
            <li><strong>Legacy Mergers and Consolidation Effects:</strong> Oceanic Bank-era matters contribute to weak documentation and procedural uncertainty.</li>
            <li><strong>Litigation as a Negotiation Tool:</strong> Many suits are instituted to gain leverage in restructuring negotiations.</li>
            <li><strong>Procedural Vulnerabilities:</strong> Risks include appeals without corresponding stay applications and inconsistent counsel reporting.</li>
            <li><strong>Dormancy and Judicial Delays:</strong> Multiple matters adjourned <em>sine die</em> or awaiting reassignment pose contingent liability risks.</li>
            <li><strong>High Financial Exposure:</strong> Fourteen matters exceed ₦150 billion in claims; class actions involve reputational sensitivity.</li>
          </ul>
        </section>

        {/* Strategic Observations */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">7.0 Strategic Observations</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>The Bank&apos;s strongest cases are recovery-based and supported by robust documentation.</li>
            <li>Exposure is heavily concentrated in fourteen matters requiring elevated oversight.</li>
            <li>A unified litigation governance structure is necessary to mitigate reporting gaps.</li>
            <li>Several matters are suitable for discharge, settlement, or rationalisation.</li>
            <li>Employment and class-action matters require sensitive handling due to reputational implications.</li>
            <li>Related matters require a unified strategy to avoid inconsistency.</li>
          </ul>
        </section>

        {/* Immediate Priority Themes */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">8.0 Immediate Priority Themes</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>High-value matters</strong> exceeding ₦150 billion require bi-weekly reporting.</li>
            <li><strong>Dormant and EndSARS-affected matters</strong> require reconstitution or dismissal strategies.</li>
            <li><strong>Appeals without stays</strong> require immediate applications to avoid prejudicial trial court activity.</li>
            <li><strong>AMCON/ESRC matters</strong> require discharge applications where the Bank is no longer a proper party.</li>
            <li><strong>Class actions and staff-related claims</strong> require careful oversight.</li>
            <li><strong>Counsel performance gaps</strong> require immediate escalation or reassignment.</li>
          </ul>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* High Priority Matters Table - ALL 14 CASES */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">9.0 High Priority Matters and Exposure</h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify mb-4">
            The Bank&apos;s highest financial, procedural, and reputational exposure is concentrated in fourteen matters with combined claims exceeding <strong>₦150 billion</strong>.
          </p>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">No.</TableHead>
                    <TableHead>Case Name</TableHead>
                    <TableHead className="text-right">Claim Value (₦)</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Court</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>1</TableCell><TableCell className="font-medium">Honeywell Flour Mills Plc v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">72,291,990,705</TableCell><TableCell className="text-sm">Loan-related / Damages</TableCell><TableCell className="text-sm">FHC / CA</TableCell><TableCell><Badge variant="destructive">High</Badge></TableCell></TableRow>
                  <TableRow><TableCell>2</TableCell><TableCell className="font-medium">Energy Shield Petrochemical Ltd v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">58,004,533,138</TableCell><TableCell className="text-sm">FX Facility Dispute</TableCell><TableCell className="text-sm">FHC</TableCell><TableCell><Badge variant="destructive">High</Badge></TableCell></TableRow>
                  <TableRow><TableCell>3</TableCell><TableCell className="font-medium">Suru Worldwide Ventures (FHC)</TableCell><TableCell className="text-right font-mono text-sm">36,581,478,352</TableCell><TableCell className="text-sm">Loan / AMCON-linked</TableCell><TableCell className="text-sm">FHC</TableCell><TableCell><Badge variant="destructive">High</Badge></TableCell></TableRow>
                  <TableRow><TableCell>4</TableCell><TableCell className="font-medium">Broad Communications Ltd v. Ecobank &amp; Ors</TableCell><TableCell className="text-right font-mono text-sm">22,500,000,000</TableCell><TableCell className="text-sm">Corporate / Shares</TableCell><TableCell className="text-sm">FHC / SC</TableCell><TableCell><Badge className="bg-orange-500">Medium–High</Badge></TableCell></TableRow>
                  <TableRow><TableCell>5</TableCell><TableCell className="font-medium">Chief Ebi Odeigah v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">17,022,603,940</TableCell><TableCell className="text-sm">Security / Shares</TableCell><TableCell className="text-sm">FHC</TableCell><TableCell><Badge className="bg-orange-500">Medium–High</Badge></TableCell></TableRow>
                  <TableRow><TableCell>6</TableCell><TableCell className="font-medium">Suru Worldwide Ventures (Lagos HC)</TableCell><TableCell className="text-right font-mono text-sm">20,000,000,000</TableCell><TableCell className="text-sm">Loan / AMCON</TableCell><TableCell className="text-sm">Lagos HC</TableCell><TableCell><Badge className="bg-yellow-500 text-black">Medium</Badge></TableCell></TableRow>
                  <TableRow><TableCell>7</TableCell><TableCell className="font-medium">Osigwe Foods v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">9,317,006,897</TableCell><TableCell className="text-sm">Excess Charges / AMCON</TableCell><TableCell className="text-sm">FHC</TableCell><TableCell><Badge className="bg-yellow-500 text-black">Medium</Badge></TableCell></TableRow>
                  <TableRow><TableCell>8</TableCell><TableCell className="font-medium">Wellsmart Drilling v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">6,171,000,000</TableCell><TableCell className="text-sm">Recovery / Regulatory</TableCell><TableCell className="text-sm">Lagos HC</TableCell><TableCell><Badge className="bg-orange-500">Medium–High</Badge></TableCell></TableRow>
                  <TableRow><TableCell>9</TableCell><TableCell className="font-medium">Bissados Nigeria Ltd v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">3,779,129,317</TableCell><TableCell className="text-sm">Excess Charges / AMCON</TableCell><TableCell className="text-sm">FHC</TableCell><TableCell><Badge className="bg-yellow-500 text-black">Medium</Badge></TableCell></TableRow>
                  <TableRow><TableCell>10</TableCell><TableCell className="font-medium">Xath Resources Ltd v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">3,104,336,250</TableCell><TableCell className="text-sm">Agric Credit Scheme</TableCell><TableCell className="text-sm">FHC</TableCell><TableCell><Badge className="bg-yellow-500 text-black">Medium</Badge></TableCell></TableRow>
                  <TableRow><TableCell>11</TableCell><TableCell className="font-medium">Nocids Investment Nigeria Ltd v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">3,009,833,876</TableCell><TableCell className="text-sm">Credit / BOI Funds</TableCell><TableCell className="text-sm">Lagos HC</TableCell><TableCell><Badge className="bg-yellow-500 text-black">Medium</Badge></TableCell></TableRow>
                  <TableRow><TableCell>12</TableCell><TableCell className="font-medium">Olumayowa Vincent Ayoade v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">2,783,112,917</TableCell><TableCell className="text-sm">Employment</TableCell><TableCell className="text-sm">NICN</TableCell><TableCell><Badge className="bg-yellow-500 text-black">Medium</Badge></TableCell></TableRow>
                  <TableRow><TableCell>13</TableCell><TableCell className="font-medium">Kingsley Ubani &amp; 221 Ors v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">2,230,000,000</TableCell><TableCell className="text-sm">Staff Class Action</TableCell><TableCell className="text-sm">NICN</TableCell><TableCell><Badge variant="destructive">High (Reputation)</Badge></TableCell></TableRow>
                  <TableRow><TableCell>14</TableCell><TableCell className="font-medium">Uzoma Ihediohanma &amp; 1,742 Ors v. Ecobank</TableCell><TableCell className="text-right font-mono text-sm">1,146,470,394</TableCell><TableCell className="text-sm">Legacy Staff Action</TableCell><TableCell className="text-sm">NICN</TableCell><TableCell><Badge className="bg-orange-500">Medium–High</Badge></TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Strategic Recommendations - ALL 8 */}
        <section>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 pb-2 border-b-2 border-blue-800 dark:border-blue-400">10.0 Strategic Recommendations</h2>
          <div className="space-y-4">
            {[
              { num: 1, title: 'Establishment of a Central Litigation Governance Framework', desc: 'The Bank would benefit from adopting a unified governance structure to ensure consistent oversight of all litigation activity. A central Litigation Management Committee comprising Legal, Risk, Remedial, Compliance and Internal Audit should provide strategic direction, approve settlement decisions, monitor high-risk matters and review counsel performance. This structure should be supported by a monthly portfolio review cycle and a centralised litigation dashboard capturing case status, exposure, deadlines, appeal progression and counsel activity. A single, transparent oversight mechanism will enhance coordination and enable faster escalation of risks.' },
              { num: 2, title: 'Strengthening of External Counsel Management', desc: 'External counsel performance should be strengthened through standardised service thresholds requiring prompt hearing updates, immediate circulation of rulings, proactive filing of interlocutory applications and more substantive strategic input. A clear escalation regime should be adopted for repeated defaults, including formal warnings, suspension of new briefs and removal from the panel where necessary. High-value and reputationally sensitive matters may require reassignment to experienced or specialist firms to ensure that they receive the level of expertise and urgency they demand.' },
              { num: 3, title: 'Prioritisation and Active Management of High-Value Litigation', desc: 'The fourteen high-value matters representing over ₦150 billion in exposure require dedicated case management. Each should have a designated lead counsel, internal case manager and documented litigation strategy. Given the scale of risk, these matters should be reviewed on a bi-monthly basis, with scenario planning to assess probable outcomes, settlement options, timelines and associated financial impact. Where multiple matters share common facts or parties, unified strategic handling will help avoid inconsistencies and strengthen overall case theory.' },
              { num: 4, title: 'Rationalisation of the Litigation Portfolio', desc: 'A proportion of the portfolio may be more efficiently resolved through negotiated settlement, particularly low-value claims, matters involving borrower hardship or cases where litigation costs exceed likely recovery. The Bank should also take early steps to strike out improperly constituted suits, challenge jurisdiction in inappropriate forums and file discharge applications in matters where underlying liabilities have been assigned to AMCON or ESRC. These steps will streamline the portfolio and reduce unnecessary cost and exposure.' },
              { num: 5, title: 'Strengthened Appellate and Procedural Risk Management', desc: 'The Bank should adopt a mandatory protocol requiring immediate applications for stay of proceedings in all matters where appeals are filed, to prevent parallel trial-level activity. A consolidated appellate tracker should monitor filing deadlines, briefs of argument, hearing dates and compliance periods, reducing the risk of procedural lapses and ensuring that appeals progress with appropriate urgency.' },
              { num: 6, title: 'Addressing Dormant, Lost-File, and Sine Die Matters', desc: 'Matters affected by dormancy, lost files or adjournments sine die require targeted intervention. A dedicated task team should engage with the courts to reconstitute destroyed files, relist appropriate matters and move long-stalled cases forward. Where the Bank has valid counterclaims or where claimants have abandoned their suits, steps should be taken to pursue summary judgment, default judgment or expedited hearing.' },
              { num: 7, title: 'Improved Internal Coordination and Records Management', desc: 'Stronger coordination between Legal, Remedial, Risk and Business Units is essential to ensure consistency in litigation strategy. A unified document-management protocol should be implemented to ensure complete, accurate and centrally stored case records. Early internal engagement upon receipt of new claims will support risk assessment, settlement decisions and consistency in the Bank\'s legal position.' },
              { num: 8, title: 'Formal Litigation Risk Framework', desc: 'The Bank should adopt a formal litigation risk framework incorporating consistent risk ratings for every matter, periodic heat-maps showing emerging risk clusters and an annual review of litigation strategy and counsel performance. This will ensure that litigation activity aligns with broader business, risk and regulatory objectives while supporting data-driven oversight.' },
            ].map((rec, idx) => (
              <div key={rec.num} className={`flex gap-4 p-4 rounded-lg ${idx % 2 === 0 ? 'bg-slate-100 dark:bg-slate-800/50 border-l-4 border-l-blue-800' : 'border border-slate-200 dark:border-slate-700'}`}>
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-800 text-white rounded-full text-sm font-bold">
                  {rec.num}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{rec.title}</h4>
                  <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed text-justify">{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clauses - FULL TEXT */}
        <Card className="border-l-4 border-l-blue-800">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800 dark:text-blue-400">Reliance Clause</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600 dark:text-slate-400">
            <p className="text-justify leading-relaxed">
              This Litigation Audit Report has been prepared by the firm of Jackson, Etti &amp; Edu (&quot;the firm&quot;) for Ecobank Plc solely to assess the litigation status and risk profile of the matters identified. The findings and recommendations are based on information, documents, and representations provided to the Firm at the time of preparation and are given in good faith.
            </p>
            <p className="text-justify leading-relaxed">
              Ecobank Plc may rely on this Report exclusively for internal decision-making, regulatory engagement, and risk management purposes. No other person or entity may rely on this Report for any purpose without the Firm&apos;s prior written consent. Any reliance by third parties is strictly at their own risk, and the Firm disclaims all responsibility or liability to such parties.
            </p>
            <p className="text-justify leading-relaxed">
              This Report does not guarantee any outcome in current or future litigation and does not replace specific legal advice on individual matters. The Firm reserves the right to revise or update this Report if additional information or developments arise after its delivery.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-800">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800 dark:text-blue-400">Confidentiality Clause</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600 dark:text-slate-400">
            <p className="text-justify leading-relaxed">
              This Litigation Audit Report has been prepared by the firm of Jackson, Etti and Edu (&quot;the firm&quot;). This report including all analysis, findings, and recommendations, is confidential and proprietary to Ecobank Plc. It is intended solely for the Bank&apos;s internal use in connection with its legal, regulatory, and risk management functions.
            </p>
            <p className="text-justify leading-relaxed">
              Ecobank Plc shall keep this Report strictly confidential and shall not disclose, reproduce, or share, in whole or in part, with any third party without the Firm&apos;s prior written consent, except where disclosure is required by law, regulation, court order, or a competent regulatory authority. Where legally permissible, Ecobank Plc shall promptly notify the Firm of any such requirement.
            </p>
            <p className="text-justify leading-relaxed">
              The Firm shall treat all information and documentation provided by Ecobank Plc in connection with this Report as confidential and shall not disclose such information to any third party except as required by law.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
