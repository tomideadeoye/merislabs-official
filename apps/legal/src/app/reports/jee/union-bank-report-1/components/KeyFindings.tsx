'use client';

import React from 'react';

interface Finding {
    document: string;
    outcome: React.ReactNode;
}

// Page 1: BOI + All Asset Debenture
const findingsPage1: Finding[] = [
    {
        document: "BOI Facility Agreement",
        outcome: (
            <div className="space-y-2">
                <p>The revised BOI Facility Agreement now substantially aligns with LMA-style facility documentation. Key enhancements include:</p>
                <ol className="list-[lower-roman] pl-5 space-y-1">
                    <li>Introduction of robust and harmonised definitions (including Distribution, Financial Indebtedness, Permitted Financial Indebtedness, Sanctions, Sanctions List, and Restricted Party)</li>
                    <li>Expansion of Mandatory Prepayment Events to reflect international standards</li>
                    <li>Strengthening of Financial Covenants</li>
                    <li>Comprehensive revision of General Undertakings</li>
                    <li>Enhanced sanctions and compliance representations.</li>
                </ol>
                <p>The revised agreement now reflects international market standards and improved credit protection architecture changes are consistent with LMA standard and international standards.</p>
            </div>
        )
    },
    {
        document: "All Asset Debenture",
        outcome: (
            <div className="space-y-2">
                <p>The All-Assets Debenture was comprehensively restructured in line with LMA-style security documentation and global secured lending practice.</p>
                <p>New and strengthened clauses include Continuity of Security, Negative Pledge, Further Assurance, Avoidance of Payments, Prior Charges, Indemnity and Protection of Third Parties and Expanded enforcement mechanics.</p>
                <p>These revisions materially enhance the Bank&apos;s secured creditor position and enforcement resilience.</p>
            </div>
        )
    },
];

// Page 2: Overdraft + Personal Guarantee + General Indemnity
const findingsPage2: Finding[] = [
    {
        document: "Overdraft Agreements",
        outcome: (
            <div className="space-y-2">
                <p>The Overdraft Agreements were reviewed against prevailing judicial authorities and CBN regulatory requirements.</p>
                <p>Key revisions include:</p>
                <ol className="list-[lower-roman] pl-5 space-y-1">
                    <li>Clear specification of commercial terms (interest rate, tenure, fees), consistent with Owena Mass Transportation Co. Ltd v. Enterprise Bank (2014)</li>
                    <li>Removal of provisions permitting unilateral variation or cancellation without notice, to align with the CBN Consumer Protection Regulations</li>
                    <li>Inclusion of AML/CFT monitoring and regulatory disclosure clauses.</li>
                </ol>
                <p>These changes reduce litigation exposure and regulatory compliance risk.</p>
            </div>
        )
    },
    {
        document: "Personal Guarantee",
        outcome: "The Personal Guarantee template did not require material amendments. However, minor drafting refinements and technical comments were provided for the Bank's consideration to enhance clarity, consistency with the revised facility documentation suite, and overall enforceability."
    },
    {
        document: "General Indemnity",
        outcome: "The General Indemnity documentation was reviewed and updated to ensure full alignment with the CBN Consumer Protection Regulations and the CBN Guide to Charges for Banks and Other Financial Institutions (OFIs). The revisions focused on regulatory compliance, transparency of obligations, and clarity in the scope of indemnified liabilities, thereby strengthening enforceability while maintaining fairness in contractual allocation of risk."
    },
];

// Page 3: FX Trade + Letter of Consent + Letter of Hypothecation
const findingsPage3: Finding[] = [
    {
        document: "FX Trade Master Agreement",
        outcome: "The FX Trade Master Agreement did not require substantive amendments. Minor drafting comments and technical refinements were provided to improve internal consistency, enhance clarity of obligations, and ensure continued alignment with applicable FX regulatory guidelines and market practice."
    },
    {
        document: "Letter of Consent to register a deed of tripartite legal mortgage",
        outcome: (
            <div className="space-y-2">
                <p>The Letter of Consent was revised to incorporate enhanced indemnity provisions designed to safeguard the Bank against any claims, liabilities, losses, or expenses arising in connection with the registration of the tripartite legal mortgage.</p>
                <p>These amendments strengthen the Bank&apos;s risk protection framework by ensuring that any registration related exposure whether procedural, third-party, or title-related is contractually mitigated through clear indemnification obligations.</p>
            </div>
        )
    },
    {
        document: "Letter of Hypothecation",
        outcome: "The Letter of Hypothecation was reviewed and refined to align with prevailing market standards and to ensure consistency with the CBN Consumer Protection Regulations. The revisions focused on clarifying the scope of the secured obligations, strengthening enforcement language, and ensuring that the rights and remedies of the Bank are clearly articulated while maintaining regulatory fairness and transparency."
    },
];

// Page 4: Irrevocable Undertaking + Letter of Domiciliation
const findingsPage4: Finding[] = [
    {
        document: "Irrevocable Undertaking for Domiciliation of Sales Proceeds",
        outcome: (
            <div className="space-y-2">
                <p>The Irrevocable Undertaking for Domiciliation of Sales Proceeds was revised to align with international best practices and to strengthen enforceability. In particular, new clarificatory provisions were introduced in light of the Court of Appeal&apos;s decision in UBA Plc v. Midas Samdra Nig. Ltd (2020) LPELR-51254 (CA) wherein the Court affirmed that the domiciliation of proceeds constitutes merely a repayment mechanism and does not relieve the borrower of its primary obligation to repay the facility as and when due.</p>
                <p>The revised template therefore expressly reinforces the borrower&apos;s continuing repayment obligation and mitigates the risk of any argument that domiciliation arrangements extinguish or dilute underlying repayment liabilities.</p>
            </div>
        )
    },
    {
        document: "Letter of Domiciliation of Contract",
        outcome: (
            <div className="space-y-2">
                <p>We revised the letter to reflect the position of the Court of Appeal in UBA Plc v Midas Samdra Nig. Ltd (2020) LPELR-51254 (CA) wherein the Court of Appeal emphasized the nature of domiciliation of payment agreement. The Court of Appeal stated that domiciliation of payment agreement merely provides a repayment mechanism by which payments due to a borrower from a third party are channelled through the bank. Such an arrangement does not relieve the borrower of the primary obligation to repay the loan as and when due, nor does it create privity of contract between the bank and the third party, such that the bank may enforce the loan against the third party in the event of default. This position was also affirmed by the Court of Appeal in Everly United Associates Ltd. &amp; Anor v FBN LTD. (2025) LPELR- 81736 (CA)</p>
                <p>Additionally, we included the right of the Bank to make disclosures to regulatory or enforcement authorities in keeping with the provisions of the CBN AML/CFT Regulation.</p>
            </div>
        )
    },
];

// Page 5: Bid Bond + Offer Letters
const findingsPage5: Finding[] = [
    {
        document: "Bid Bond",
        outcome: (
            <div className="space-y-2">
                <p>The Bid Bond template was revised to align with international best practices and prevailing market standards applicable to demand guarantees and performance-related instruments. The revisions enhance clarity around the Bank&apos;s obligations, trigger events, and claim procedures.</p>
                <p>In addition, specific provisions were introduced to restrict the transfer or assignment of the Bond by any party other than the named beneficiary, thereby preserving the integrity of the instrument and mitigating the risk of unintended third-party enforcement exposure.</p>
            </div>
        )
    },
    {
        document: "Offer Letters",
        outcome: (
            <div className="space-y-2">
                <p>A key amendment implemented across the Offer Letter templates was a comprehensive review for compliance with the CBN Consumer Protection Regulations 2019. During our review, we identified certain provisions that could be construed as onerous, particularly clauses permitting the Bank to unilaterally vary contractual terms without prior notice to the customer. Such provisions present potential regulatory and litigation risks. These clauses have been revised to ensure fairness, transparency, and regulatory alignment.</p>
                <p>While the Bank&apos;s existing templates demonstrate substantial compliance with the CBN Guide to Charges for Banks and Other Financial Institutions (OFIs), we have made targeted refinements and provided drafting comments to further strengthen full alignment with the applicable regulatory framework.</p>
                <p>In addition, in light of the recent innovations introduced under the Nigeria Tax Act, 2025, the Offer Letters have been updated to reflect the Nigeria Revenue Service (NRS) as the relevant authority for the administration and collection of stamp duties, thereby ensuring statutory accuracy and forward-looking compliance.</p>
            </div>
        )
    }
];

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
        <div className="absolute top-[20%] left-[-5%] w-[30%] aspect-square rounded-full border-[2px] border-[#E80000]" />
    </div>
);

const FindingsTable = ({ findings, startIndex = 0 }: { findings: Finding[]; startIndex?: number }) => (
    <div className="overflow-hidden rounded-xl border border-[#211B1B]/10 not-prose relative z-10 shadow-sm bg-white">
        <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#211B1B] text-white">
                <tr>
                    <th className="p-4 w-[28%] border-r border-white/10 uppercase tracking-[0.1em] font-black text-[10px]">Document Category</th>
                    <th className="p-4 uppercase tracking-[0.1em] font-black text-[10px]">Review Outcome</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#211B1B]/5">
                {findings.map((finding, index) => (
                    <tr key={index} className={(startIndex + index) % 2 === 0 ? "bg-white" : "bg-[#F9F7ED]/30"}>
                        <td className="p-4 font-black text-[#211B1B] border-r border-[#211B1B]/5 align-top text-sm uppercase tracking-tight">
                            {finding.document}
                        </td>
                        <td className="p-4 text-[#211B1B]/80 leading-relaxed text-justify text-[13px] font-medium">
                            {finding.outcome}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const SectionHeader = ({ id, hasSubtitle = false }: { id?: string; hasSubtitle?: boolean }) => (
    <div className="flex items-center gap-4 mb-8 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
        <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">03</span>
        <h2 id={id} className={`${hasSubtitle ? 'text-3xl' : 'text-xl'} font-serif font-black text-[#211B1B] uppercase scroll-mt-20 no-justify`}>
            KEY DOCUMENT REVIEW OUTCOMES
        </h2>
    </div>
);

export const KeyFindingsPage1 = () => {
    return (
        <div id="findings" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BackgroundPattern />

            <SectionHeader id="findings-credit" hasSubtitle={true} />
            <span id="findings-secured" className="absolute top-0"></span>

            <div className="mb-8 relative z-10">
                <p className="text-lg text-[#211B1B]/60 font-medium italic">
                    Below is a summary of material revisions and enhancements made across the documentation suite:
                </p>
            </div>

            <FindingsTable findings={findingsPage1} startIndex={0} />
        </div>
    );
};

export const KeyFindingsPage2 = () => {
    return (
        <div id="findings-2" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow font-sans">
            <BackgroundPattern />
            <SectionHeader id="findings-third-party" />
            <FindingsTable findings={findingsPage2} startIndex={2} />
        </div>
    );
};

export const KeyFindingsPage3 = () => {
    return (
        <div id="findings-3" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow font-sans">
            <BackgroundPattern />
            <SectionHeader />
            <FindingsTable findings={findingsPage3} startIndex={5} />
        </div>
    );
};

export const KeyFindingsPage4 = () => {
    return (
        <div id="findings-4" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow font-sans">
            <BackgroundPattern />
            <SectionHeader />
            <FindingsTable findings={findingsPage4} startIndex={8} />
        </div>
    );
};

export const KeyFindingsPage5 = () => {
    return (
        <div id="findings-5" className="max-w-[210mm] w-full mx-auto bg-transparent p-16 relative text-[#211B1B] overflow-hidden flex flex-col flex-grow font-sans">
            <BackgroundPattern />
            <SectionHeader id="findings-specialized" />
            <FindingsTable findings={findingsPage5} startIndex={10} />
        </div>
    );
};

// Backward-compatible export
export const KeyFindings = KeyFindingsPage1;
