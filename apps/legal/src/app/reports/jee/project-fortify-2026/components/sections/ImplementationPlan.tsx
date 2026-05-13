import React from 'react';
import { JEEHeader } from '../Header';

interface ImplementationPlanProps {
  workstreamIds?: string[];
  showTitle?: boolean;
}

export const ImplementationPlan: React.FC<ImplementationPlanProps> = ({ 
  workstreamIds, 
  showTitle = true 
}) => {
  const allWorkstreams = [
    {
      id: 'WS1',
      title: 'Structured Dispute Offerings',
      objective: 'Articulate capabilities through productised service lines',
      leadMeasures: 'Develop and promote at least 4 offerings',
      keyActivities: 'Litigation Portfolio Audit; Structured Debt Recovery Advisory; Garnishee & Enforcement Toolkit; Shareholder & Governance Dispute Advisory; Nigeria Arbitration & Enforcement Support Notes; Cross-Border Recovery Support. Prepare concise capacity statements for each.',
      expectedOutcomes: 'Clear articulation of disputes capabilities; improved ability to convert conversations into mandates; easier market presentation to institutional clients'
    },
    {
      id: 'WS2',
      title: 'Thought Leadership',
      objective: 'Establish JEE as the authority in debt recovery, insolvency, credit enforcement and arbitration',
      leadMeasures: 'Publish 4+ insights annually; host 1 client-facing session per year. Two articles are being finalised one from each of insolvency and arbitration.',
      keyActivities: 'Launch Strategic Debt Recovery & Insolvency Series; launch Arbitration & Cross-Border Series; leverage outputs for client meetings, conferences and media; target Mondaq, NBA journals and international platforms',
      expectedOutcomes: 'Enhanced reputation and visibility in priority sectors; thought leadership as a lead-generation tool'
    },
    {
      id: 'WS3',
      title: 'Ecosystem Engagement',
      objective: 'Build credible presence and referral networks in priority disputes ecosystems',
      leadMeasures: '7+ sector-facing engagements per year; pursue CIArb Fellowship, INSOL Fellowship, NICArb Fellow and panel appointments',
      keyActivities: 'Active roles in INSOL, BRIPAN, NICArb, ICMC, NBA-SBL, LIDW; join LCCI, NBBC, NBLF, NICCI and bilateral chambers; seek appointments to LCA, NICArb, NCIA and ICC Nigeria panels',
      expectedOutcomes: 'Strengthened referral pipelines; specialist recognition; improved access to cross-border opportunities'
    },
    {
      id: 'WS4',
      title: 'Relationship Development',
      objective: 'Build a disciplined pipeline of institutional relationships',
      leadMeasures: 'Maintain 15+ strategic relationships; conduct 1 institutional meeting monthly',
      keyActivities: 'Target and maintain relationships with GCs, Heads of Recovery, Heads of Risk and senior management in banks, priority-sector corporates, investors and international Counsel; use capability notes and track via pipeline tool',
      expectedOutcomes: 'Development of a structured mandate pipeline; increased opportunities for enforcement, commercial disputes and arbitration instructions'
    },
    {
      id: 'WS5',
      title: 'Internal Referral Capture',
      objective: 'Capture and retain disputes arising from transactional and sector work',
      leadMeasures: 'Generate at least 4 cross-practice referrals across the PSP period.',
      keyActivities: 'Regular engagement with Corporate/M&A, Energy & Projects, Regulatory and Real Estate teams; offer early-stage dispute risk assessments; conduct internal training on dispute triggers',
      expectedOutcomes: 'Higher internal retention; earlier involvement in stressed matters; CLDR embedded as natural internal partner'
    }
  ];

  const workstreams = workstreamIds 
    ? allWorkstreams.filter(ws => workstreamIds.includes(ws.id))
    : allWorkstreams;

  return (
    <section className="flex-grow flex flex-col px-16 py-12">
      {showTitle && <JEEHeader number="6" title="Implementation Plan" />}

      <div className="space-y-8 text-gray-800 leading-relaxed font-light text-sm max-w-4xl">
        {showTitle && (
          <p className="text-gray-600 italic">
            Project Fortify's implementation approach is intended to ensure that the strategic objectives of the plan are supported by identifiable workstreams, measurable activities and commercially relevant outcomes. The implementation framework is built around five interrelated workstreams, each addressing a distinct driver of mandate origination and practice growth.
          </p>
        )}

        <div className="space-y-6">
          {workstreams.map((ws) => (
            <div key={ws.id} className="group relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#800020] opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl"></div>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[#800020] font-bold text-xs uppercase tracking-widest  block">{ws.id}</span>
                  <h3 className="text-xl font-serif font-bold text-[#1a1a1a] tracking-tight">{ws.title}</h3>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#800020]/20 font-serif italic text-2xl">
                  {ws.id.slice(-1)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div >
                  <h4 className="text-[10px] font-bold text-[#800020] uppercase tracking-widest">Objective</h4>
                  <p className="text-xs text-gray-700 leading-normal">{ws.objective}</p>
                </div>
                <div >
                  <h4 className="text-[10px] font-bold text-[#800020] uppercase tracking-widest">Lead Measures</h4>
                  <p className="text-xs text-gray-700 leading-normal">{ws.leadMeasures}</p>
                </div>
                <div className=" md:col-span-2  border-t border-gray-50">
                  <h4 className="text-[10px] font-bold text-[#800020] uppercase tracking-widest pt-4">Key Activities</h4>
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">
                    {ws.keyActivities}
                  </p>
                </div>
                <div className=" md:col-span-2  border-t border-gray-50">
                  <h4 className="text-[10px] font-bold text-[#800020] uppercase tracking-widest pt-4">Expected Outcomes</h4>
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">
                    {ws.expectedOutcomes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
