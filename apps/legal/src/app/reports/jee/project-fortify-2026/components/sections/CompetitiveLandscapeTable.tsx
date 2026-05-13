import React from 'react';

export const CompetitiveLandscapeTable: React.FC = () => {
  return (
    <section className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
      <div className="space-y-4 text-gray-700 leading-relaxed font-light text-sm">
        <div>
          <h4 className="text-lg font-semibold text-[#1a1a1a] mb-3">Tier 1 – Full-Service Leaders</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-3 text-left">Firm</th>
                  <th className="p-3 text-left">Principal Strength</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Aluko & Oyebode</td>
                  <td className="p-3">Strong disputes team; deep Tier-1 bank panel relationships; larger team</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium">Banwo & Ighodalo</td>
                  <td className="p-3">Strong in Banking & Regulatory disputes and Corporate Transactions</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Aelex</td>
                  <td className="p-3">Premier arbitration brand; strong ICSID/ICC presence; Energy Disputes depth</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium">Olaniwun Ajayi</td>
                  <td className="p-3">Oil & Gas and M&A disputes; strong Transaction-to-disputes pipeline</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Templars</td>
                  <td className="p-3">Energy sector relationships; international Co-Counsel Network</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium">Udo Udoma & Belo-Osagie</td>
                  <td className="p-3">Banking, Financial Institutions and Commercial Litigation; strong sector presence</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-[#1a1a1a] mb-3 mt-6">Tier 2 – Specialist & Mid-Tier Competitors by Platform</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="p-3 text-left">Platform</th>
                  <th className="p-3 text-left">Key Competitors</th>
                  <th className="p-3 text-left">Competitive Dynamic</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Platform 1 — Debt Recovery, Insolvency & Enforcement</td>
                  <td className="p-3">Pinheiro LP, Insolvency Forte, Stren & Bran, Temilolu Adamolekun & Co, Perchstone & Graeys, Resolution Law Firm, Kunle Ogunba & Associates, Alliance Law Firm, Tayo Oyetibo LP, Fred-Young & Evans</td>
                  <td className="p-3">Most crowded tier. Competition primarily on specialist depth, panel position and speed. JEE differentiates through productised recovery solutions, INSOL credentialing and full-lifecycle capability from insolvency through enforcement.</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium">Platform 2 — Commercial & Shareholder Disputes</td>
                  <td className="p-3">Punuka Attorneys & Solicitors, ACAS-Law, SPA Ajibade & Co, Babalakin & Co, G. Elias & Co, Detail Solicitors</td>
                  <td className="p-3">Relationship-driven. Competition depends on sector proximity and transactional access. JEE's full-service structure and existing corporate client base provide natural entry points.</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Platform 3 — Arbitration & Cross-Border Enforcement</td>
                  <td className="p-3">Punuka Attorneys & Solicitors, ACAS-Law, ALP, DLA Piper Africa/Nigeria (Olajide Oyewole), Kola Awodein & Co, Detail Disputes, Chris Ogunbanjo & Co</td>
                  <td className="p-3">Brand and credibility sensitive. JEE builds its lane through ecosystem participation, international referral architecture, arbitral panel appointments and strong Nigerian enforcement capability.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitiveLandscapeTable;