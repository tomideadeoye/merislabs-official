'use client';

import React from 'react';
import { Scale } from 'lucide-react';

export const KeyFindings = () => {
    const findings = [
        {
            document: "BOI Facility Agreement",
            outcome: (
                <div className="space-y-4">
                    <p>The revised BOI Facility Agreement now substantially aligns with LMA-style facility documentation. Key enhancements include:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Introduction of robust and harmonised definitions (including Distribution, Financial Indebtedness, Permitted Financial Indebtedness, Sanctions, Sanctions List, and Restricted Party);</li>
                        <li>Expansion of Mandatory Prepayment Events to reflect international standards;</li>
                        <li>Strengthening of Financial Covenants;</li>
                        <li>Comprehensive revision of General Undertakings; and</li>
                        <li>Enhanced sanctions and compliance representations.</li>
                    </ul>
                    <p>The revised agreement now reflects international market standards and improved credit protection architecture changes are consistent with LMA standard and international standards.</p>
                </div>
            )
        },
        {
            document: "All Asset Debenture",
            outcome: (
                <div className="space-y-4">
                    <p>The All-Assets Debenture was comprehensively restructured in line with LMA-style security documentation and global secured lending practice.</p>
                    <p>New and strengthened clauses include Continuity of Security, Negative Pledge, Further Assurance, Avoidance of Payments, Prior Charges, Indemnity and Protection of Third Parties; and Expanded enforcement mechanics.</p>
                    <p>These revisions materially enhance the Bank’s secured creditor position and enforcement resilience.</p>
                </div>
            )
        },
        {
            document: "Overdraft Agreements",
            outcome: (
                <div className="space-y-4">
                    <p>The Overdraft Agreements were reviewed against prevailing judicial authorities and CBN regulatory requirements.</p>
                    <p>Key revisions include:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Clear specification of commercial terms (interest rate, tenure, fees), consistent with Owena Mass Transportation Co. Ltd v. Enterprise Bank (2014);</li>
                        <li>Removal of provisions permitting unilateral variation or cancellation without notice, to align with the CBN Consumer Protection Regulations;</li>
                        <li>Inclusion of AML/CFT monitoring and regulatory disclosure clauses.</li>
                    </ul>
                    <p>These changes reduce litigation exposure and regulatory compliance risk.</p>
                </div>
            )
        },
        {
            document: "Personal Guarantee",
            outcome: "The Personal Guarantee template did not require material amendments. However, minor drafting refinements and technical comments were provided for the Bank’s consideration to enhance clarity, consistency with the revised facility documentation suite, and overall enforceability."
        },
        {
            document: "General Indemnity",
            outcome: "The General Indemnity documentation was reviewed and updated to ensure full alignment with the CBN Consumer Protection Regulations and the CBN Guide to Charges for Banks and Other Financial Institutions (OFIs). The revisions focused on regulatory compliance, transparency of obligations, and clarity in the scope of indemnified liabilities, thereby strengthening enforceability while maintaining fairness in contractual allocation of risk."
        },
        {
            document: "FX Trade Master Agreement",
            outcome: "The FX Trade Master Agreement did not require substantive amendments. Minor drafting comments and technical refinements were provided to improve internal consistency, enhance clarity of obligations, and ensure continued alignment with applicable FX regulatory guidelines and market practice."
        },
        {
            document: "Letter of Consent to register a deed of tripartite legal mortgage",
            outcome: (
                <div className="space-y-2">
                    <p>The Letter of Consent was revised to incorporate enhanced indemnity provisions designed to safeguard the Bank against any claims, liabilities, losses, or expenses arising in connection with the registration of the tripartite legal mortgage.</p>
                    <p>These amendments strengthen the Bank’s risk protection framework by ensuring that any registration related exposure whether procedural, third-party, or title-related is contractually mitigated through clear indemnification obligations.</p>
                </div>
            )
        },
        {
            document: "Letter of Hypothecation",
            outcome: "The Letter of Hypothecation was reviewed and refined to align with prevailing market standards and to ensure consistency with the CBN Consumer Protection Regulations. The revisions focused on clarifying the scope of the secured obligations, strengthening enforcement language, and ensuring that the rights and remedies of the Bank are clearly articulated while maintaining regulatory fairness and transparency."
        },
        {
            document: "Irrevocable Undertaking for Domiciliation of Sales Proceeds",
            outcome: (
                <div className="space-y-4">
                    <p>The Irrevocable Undertaking for Domiciliation of Sales Proceeds was revised to align with international best practices and to strengthen enforceability. In particular, new clarificatory provisions were introduced in light of the Court of Appeal’s decision in UBA Plc v. Midas Samdra Nig. Ltd (2020) LPELR-51254 (CA), wherein the Court affirmed that the domiciliation of proceeds constitutes merely a repayment mechanism and does not relieve the borrower of its primary obligation to repay the facility as and when due.</p>
                    <p>The revised template therefore expressly reinforces the borrower’s continuing repayment obligation and mitigates the risk of any argument that domiciliation arrangements extinguish or dilute underlying repayment liabilities.</p>
                </div>
            )
        },
        {
            document: "Letter of Domiciliation of Contract",
            outcome: (
                <div className="space-y-4">
                    <p>We revised the letter to reflect the position of the Court of Appeal in UBA Plc v Midas Samdra Nig. Ltd (2020) LPELR-51254 (CA) wherein the Court of Appeal emphasized the nature of domiciliation of payment agreement. The Court of Appeal stated that domiciliation of payment agreement merely provides a repayment mechanism by which payments due to a borrower from a third party are channelled through the bank. Such an arrangement does not relieve the borrower of the primary obligation to repay the loan as and when due, nor does it create privity of contract between the bank and the third party, such that the bank may enforce the loan against the third party in the event of default. This position was also affirmed by the Court of Appeal in Everly United Associates Ltd. & Anor v FBN LTD. (2025) LPELR- 81736 (CA).</p>
                    <p>Additionally, we included the right of the Bank to make disclosures to regulatory or enforcement authorities in keeping with the provisions of the CBN AML/CFT Regulation.</p>
                </div>
            )
        },
        {
            document: "Bid Bond",
            outcome: (
                <div className="space-y-4">
                    <p>The Bid Bond template was revised to align with international best practices and prevailing market standards applicable to demand guarantees and performance-related instruments. The revisions enhance clarity around the Bank’s obligations, trigger events, and claim procedures.</p>
                    <p>In addition, specific provisions were introduced to restrict the transfer or assignment of the Bond by any party other than the named beneficiary, thereby preserving the integrity of the instrument and mitigating the risk of unintended third-party enforcement exposure.</p>
                </div>
            )
        },
        {
            document: "Offer Letters",
            outcome: (
                <div className="space-y-4">
                    <p>A key amendment implemented across the Offer Letter templates was a comprehensive review for compliance with the CBN Consumer Protection Regulations, 2019. During our review, we identified certain provisions that could be construed as onerous, particularly clauses permitting the Bank to unilaterally vary contractual terms without prior notice to the customer. Such provisions present potential regulatory and litigation risks. These clauses have been revised to ensure fairness, transparency, and regulatory alignment.</p>
                    <p>While the Bank’s existing templates demonstrate substantial compliance with the CBN Guide to Charges for Banks and Other Financial Institutions (OFIs), we have made targeted refinements and provided drafting comments to further strengthen full alignment with the applicable regulatory framework.</p>
                    <p>In addition, in light of the recent innovations introduced under the Nigeria Tax Act, 2025, the Offer Letters have been updated to reflect the Nigeria Revenue Service (NRS) as the relevant authority for the administration and collection of stamp duties, thereby ensuring statutory accuracy and forward-looking compliance.</p>
                </div>
            )
        }
    ];

    return (
        <div id="findings" className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl p-16 mb-12 print:mb-0 print:shadow-none print:break-after-page min-h-[297mm] relative text-[#0A1930] shrink-0 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#009fe3]/5 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1930]/5 rounded-tr-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-8 border-b border-[#009fe3]/30 pb-4 relative z-10">
                <h2 className="text-3xl font-serif font-bold text-[#0A1930]">3. KEY DOCUMENT REVIEW OUTCOMES</h2>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0A1930] mb-8 relative z-10">
                <p>
                    Below is a summary of material revisions and enhancements made across the documentation suite:
                </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 not-prose relative z-10">
                <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#0A1930] text-white">
                        <tr>
                            <th className="p-3 w-[25%] border-r border-[#009fe3]/20">Document</th>
                            <th className="p-3">Review Outcome</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {findings.map((finding, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                <td className="p-4 font-bold text-[#0A1930] border-r border-gray-100 align-top">
                                    {finding.document}
                                </td>
                                <td className="p-4 text-gray-700 leading-relaxed text-justify">
                                    {finding.outcome}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
