'use client';

import { useState } from 'react';

const proofPoints = [
  { metric: '353+', label: 'Litigation Cases Audited', project: 'Project Compass (JEE/Ecobank)' },
  { metric: 'NGN 273B+', label: 'Financial Exposure Tracked', project: 'Project Compass (JEE/Ecobank)' },
  { metric: '500+', label: 'Pages Auto-Generated per Report', project: 'Project Compass (JEE/Ecobank)' },
  { metric: '70+', label: 'High-Stakes Documents Automated', project: 'Across 10+ Clients' },
  { metric: '2x', label: 'System Built for NICArb', project: 'Report Automation Engine' },
  { metric: 'NGN 450k', label: 'Phase 1 Automation', project: 'Lawyard Content Pipeline' },
];

const tier1Services = [
  { service: 'Presentation Design', price: 'NGN 150k - NGN 300k', delivery: '5-7 days', desc: 'Pitch decks, conference slides, annual report presentations, and board decks.' },
  { service: 'Proposal / Capability Statement', price: 'NGN 100k - NGN 250k', delivery: '3-5 days', desc: 'RFP responses, capability brochures, and business development documents.' },
  { service: 'Brochure / Marketing Collateral', price: 'NGN 100k - NGN 200k', delivery: '3-5 days', desc: 'Company profiles, service menus, and client-facing marketing materials.' },
  { service: 'Brand Identity Package', price: 'NGN 200k - NGN 400k', delivery: '7-10 days', desc: 'Logo design, brand guidelines, color systems, and visual identity.' },
];

const tier2Services = [
  { service: 'Automated Report/Doc System', price: 'NGN 400k - NGN 800k', delivery: '2-3 weeks', desc: 'Code-generated reports with consistent branding, real-time data, and batch output.' },
  { service: 'Corporate / Firm Website', price: 'NGN 500k - NGN 1M', delivery: '3-4 weeks', desc: 'Next.js-powered websites with CMS, performance optimization, and Vercel deployment.' },
  { service: 'Event Branding Package', price: 'NGN 300k - NGN 600k', delivery: '2 weeks', desc: 'Full conference suite: banners, programmes, certificates, email signatures, and flyers.' },
  { service: 'Newsletter / Content Automation', price: 'NGN 350k - NGN 600k', delivery: '2-3 weeks', desc: 'Automated content pipelines with templates, scheduling, and multi-platform distribution.' },
];

const tier3Services = [
  { service: 'Litigation/Compliance Dashboard', price: 'NGN 1M - NGN 2.5M', delivery: '4-6 weeks', desc: 'Real-time intelligence dashboards for legal audits, compliance tracking, and regulatory monitoring.' },
  { service: 'Custom Client Portal / Internal Tool', price: 'NGN 1.2M - NGN 3M', delivery: '6-8 weeks', desc: 'Bespoke web applications for client management, case tracking, and workflow automation.' },
  { service: 'Full LegalTech Platform Build', price: 'NGN 2M+', delivery: '8-12 weeks', desc: 'End-to-end platform development from architecture design to production deployment.' },
  { service: 'Retainer (Ongoing Automation & Maintenance)', price: 'NGN 150k - NGN 400k/mo', delivery: 'Ongoing', desc: 'Continuous system optimization, content updates, feature enhancements, and technical support.' },
];

const aiWorkflows = [
  {
    title: 'Document Intelligence',
    desc: 'AI-powered document review, classification, and extraction. Turn unstructured files into structured, queryable data.',
    outcomes: ['Reduce document review time by 70%', 'Automate contract clause extraction', 'Build searchable knowledge bases from document archives'],
  },
  {
    title: 'Report & Compliance Automation',
    desc: 'End-to-end automated report generation with dynamic data binding. From raw data to branded PDF in seconds.',
    outcomes: ['Eliminate manual report assembly', 'Ensure consistent branding across all outputs', 'Generate 500+ page reports in under 10 seconds'],
  },
  {
    title: 'Workflow Orchestration',
    desc: 'Connect your existing tools (email, calendar, CRM, document systems) into automated workflows that run themselves.',
    outcomes: ['Automate multi-step business processes', 'Reduce operational overhead by 60%+', 'Build audit trails for every automated action'],
  },
  {
    title: 'AI Content & Communication',
    desc: 'Automated content generation, newsletter pipelines, and multi-platform communication systems.',
    outcomes: ['Schedule and distribute content across platforms', 'Generate personalized communications at scale', 'Maintain consistent brand voice across all output'],
  },
];

const processSteps = [
  { step: '01', title: 'Discovery Call', desc: 'We identify your manual workflows, pain points, and automation opportunities. No pitch — just diagnosis.' },
  { step: '02', title: 'Blueprint & Proposal', desc: 'We deliver a detailed scope: what we will build, how it integrates with your existing systems, timeline, and fixed price.' },
  { step: '03', title: 'Build & Iterate', desc: 'We build the system in stages. You review working output at each milestone. No black boxes — you see everything as it is built.' },
  { step: '04', title: 'Launch & Handover', desc: 'We deploy, test, and hand over with documentation. Your team owns the system. We remain on retainer for support and iteration.' },
];

export default function ServicesPage() {
  const [activeTier, setActiveTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier2');

  return (
    <section className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ────────────────── HERO ────────────────── */}
        <div className="py-16 md:py-24 text-center">
          <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-purple-600 bg-purple-200 rounded-full mb-4">
            MERISLABS SERVICES
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Systems That Generate<br />
            <span className="text-purple-400">The Output Automatically</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            We do not just design. We build systems that design. <br />
            We do not just develop. We build systems that publish themselves. <br />
            We do not just consult. We build systems that do the work.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            AI workflow consulting, web development, and document design — unified under one roof.
          </p>
          <a
            href="mailto:tomide@merislabs.com?subject=Consultation Inquiry"
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-lg"
          >
            Schedule a Consultation
          </a>
        </div>

        {/* ────────────────── THE EDGE ────────────────── */}
        <div className="pb-16">
          <div className="max-w-3xl mx-auto text-center pb-8">
            <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-blue-600 bg-blue-200 rounded-full mb-4">
              PROVEN OUTPUT
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">The Numbers That Back The Claim</h2>
            <p className="text-gray-400 text-lg">
              Every system we build is measured by the time it saves and the accuracy it guarantees.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {proofPoints.map((point) => (
              <div key={point.label} className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">{point.metric}</div>
                <div className="text-sm text-gray-300 mb-2">{point.label}</div>
                <div className="text-xs text-gray-500">{point.project}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gray-800/50 rounded-xl border border-gray-700 p-8">
            <p className="text-gray-300 text-center text-lg leading-relaxed max-w-4xl mx-auto">
              <span className="text-purple-400 font-semibold">Most agencies deliver a finished file.</span> We deliver a system — so when your data changes, your output updates automatically. When you need 50 variations of a document, we generate them in minutes. <span className="text-purple-400 font-semibold">That is the level we operate at.</span>
            </p>
          </div>
        </div>

        {/* ────────────────── AI WORKFLOW CONSULTING ────────────────── */}
        <div className="pb-16" id="ai-workflows">
          <div className="max-w-3xl mx-auto text-center pb-10">
            <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-emerald-600 bg-emerald-200 rounded-full mb-4">
              FEATURED OFFERING
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">AI Workflow Implementation</h2>
            <p className="text-gray-400 text-lg">
              We identify, blueprint, build, and launch a custom AI workflow for your firm — in weeks, not months. Solo engagement, no cohort overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiWorkflows.map((wf) => (
              <div key={wf.title} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-purple-700/50 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3">{wf.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{wf.desc}</p>
                <ul className="space-y-2">
                  {wf.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────── FULL-SCREEN WIDTH: SERVICES MENU ──────────────── */}
      <div className="w-full bg-gray-950/50 border-t border-b border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="max-w-3xl mx-auto text-center pb-10">
            <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-amber-600 bg-amber-200 rounded-full mb-4">
              FULL SERVICES MENU
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">What We Build</h2>
            <p className="text-gray-400 text-lg">
              Three tiers of service. One consistent approach: build systems, not deliverables.
            </p>
          </div>

          {/* Tier Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTier('tier1')}
                className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTier === 'tier1' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Fast Cash (1-2 wks)
              </button>
              <button
                onClick={() => setActiveTier('tier2')}
                className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTier === 'tier2' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Mid-Ticket (2-4 wks)
              </button>
              <button
                onClick={() => setActiveTier('tier3')}
                className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTier === 'tier3' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                High-Ticket (4-8 wks)
              </button>
            </div>
          </div>

          {/* Tier 1 */}
          {activeTier === 'tier1' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tier1Services.map((s) => (
                <div key={s.service} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{s.service}</h3>
                    <span className="text-purple-400 font-semibold text-sm whitespace-nowrap ml-4">{s.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{s.desc}</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">{s.delivery}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tier 2 */}
          {activeTier === 'tier2' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tier2Services.map((s) => (
                <div key={s.service} className="bg-gray-800 rounded-lg border border-purple-700/30 p-6 ring-1 ring-purple-600/20">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{s.service}</h3>
                    <span className="text-purple-400 font-semibold text-sm whitespace-nowrap ml-4">{s.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{s.desc}</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">{s.delivery}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tier 3 */}
          {activeTier === 'tier3' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tier3Services.map((s) => (
                <div key={s.service} className="bg-gray-800 rounded-lg border border-amber-700/30 p-6 ring-1 ring-amber-600/20">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{s.service}</h3>
                    <span className="text-amber-400 font-semibold text-sm whitespace-nowrap ml-4">{s.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{s.desc}</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">{s.delivery}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pricing Note */}
          <div className="mt-8 bg-gray-800/50 rounded-lg border border-gray-700 p-5 text-center">
            <p className="text-sm text-gray-400">
              <span className="text-gray-300 font-medium">Pricing Psychology:</span> All prices are project-based with 50% deposit upfront and 50% on delivery. For automation projects, we offer a one-time build plus optional retainer. We never discount on price — we discount on scope.
            </p>
          </div>
        </div>
      </div>

      {/* ──────────────── HOW IT WORKS ──────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center pb-12">
          <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-indigo-600 bg-indigo-200 rounded-full mb-4">
            HOW WE WORK
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">From Diagnosis to Delivery</h2>
          <p className="text-gray-400 text-lg">
            Every engagement follows the same four-stage process. No surprises. No scope creep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {processSteps.map((step) => (
            <div key={step.step} className="bg-gray-800 rounded-lg border border-gray-700 p-6 relative">
              <div className="text-4xl font-bold text-purple-600/30 mb-4">{step.step}</div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────── CTA ──────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-800/50 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Automate Your Workflows?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Tell us what you are doing manually. We will tell you how to make it run itself — and send you a fixed-price proposal.
          </p>
          <a
            href="mailto:tomide@merislabs.com?subject=AI Workflow Consultation"
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-lg"
          >
            Start the Conversation
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Response within 24 hours. No commitment required.
          </p>
        </div>
      </div>
    </section>
  );
}
