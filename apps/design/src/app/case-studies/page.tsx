/**
 * @fileoverview Case Studies page showcasing proprietary systems architecture
 * @description Displays detailed case studies of high-stakes systems built for clients
 * 
 * NOTE: All case studies are marked as PROPRIETARY & CONFIDENTIAL
 * - No direct links to production systems
 * - Client names anonymized (Tier-1 Bank, etc.)
 * - Demo available upon request only
 */

import type { Metadata } from 'next';
import { generatePageSEO, seoPresets } from '@/lib/seo';

export const metadata: Metadata = generatePageSEO({
  ...seoPresets.home,
  title: 'Case Studies | MerisLabs',
  description: 'Proprietary systems architecture for high-stakes legal, financial, and regulatory operations',
});

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  status: 'PROPRIETARY' | 'PUBLIC';
  description: string;
  challenge: string;
  solution: string;
  impact: string[];
  systemsDesign: string[];
  techStack: string[];
  metrics: { value: string; label: string }[];
  demoAvailable: boolean;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'project-compass',
    title: 'Project Compass',
    client: 'Tier-1 Nigerian Bank',
    status: 'PROPRIETARY',
    description: 'Litigation audit system tracking ₦273B+ in financial exposure across 350+ cases with automated 500+ page report generation.',
    challenge: 'A Tier-1 Nigerian bank needed to audit 350+ litigation matters across 6 states, tracking financial exposure across multiple currencies (NGN, USD, GBP, EUR). The existing data had 9 duplicate cases across 4 data sources, risking a ₦107B overestimation.',
    solution: 'Built a comprehensive digital infrastructure with Next.js 15, featuring real-time filtering, dynamic financial calculations, cross-reference analysis for deduplication, and an automated PDF report generation engine using Puppeteer and Playwright with batch processing.',
    impact: [
      'Prevented ₦107B double-counting error through cross-reference analysis',
      'Reduced PDF generation time from hours to 8 seconds with batch processing',
      'Standardized data for 37 external law firms with 100+ name variations',
      'Enabled real-time filtering by risk level, currency, case status, and litigation theme',
    ],
    systemsDesign: [
      'Data Deduplication Engine - Cross-reference analysis preventing financial discrepancies',
      'Batch Processing Pipeline - 5-case batches for PDF generation optimization',
      'Multi-Currency Architecture - Smart formatting with context-aware statistics',
      'Type-Safe Data Layer - Centralized TypeScript types from 4 data sources',
    ],
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Puppeteer', 'Playwright', 'Vercel'],
    metrics: [
      { value: '₦273B+', label: 'Financial Exposure Tracked' },
      { value: '353+', label: 'Litigation Cases' },
      { value: '₦107B', label: 'Discrepancy Prevented' },
      { value: '500+', label: 'Pages Auto-Generated' },
      { value: '37', label: 'Law Firms Evaluated' },
      { value: '8s', label: 'PDF Generation Time' },
    ],
    demoAvailable: true,
  },
  {
    id: 'orion-mcp',
    title: 'Orion MCP',
    client: 'Proprietary System',
    status: 'PROPRIETARY',
    description: 'Autonomous AI orchestration system with 20+ MCP tools, distributed architecture, and multi-platform integration for task automation.',
    challenge: 'Needed a unified system to orchestrate multiple AI models, communication platforms (WhatsApp, Gmail, Beeper), calendar, Drive, and memory systems with autonomous task execution capabilities.',
    solution: 'Built a distributed MCP (Model Context Protocol) architecture with daemon processes, Qdrant vector memory, multi-model LLM routing, and 20+ integrated tools for WhatsApp, Gmail, Calendar, Drive, tasks, and network management.',
    impact: [
      'Autonomous task execution with background daemon processes',
      'Multi-platform communication orchestration (WhatsApp, Gmail, Beeper, Telegram)',
      'Vector-based memory system with Qdrant for semantic search',
      'Cascading LLM architecture with automatic fallback (Gemini → Groq → Ollama)',
    ],
    systemsDesign: [
      'Event-Driven Architecture - MCP daemons for autonomous background processing',
      'Distributed State Management - Qdrant vector DB + PostgreSQL hybrid storage',
      'Cascading Fallback Pattern - Multi-provider LLM routing with quota management',
      'Tool Abstraction Layer - Unified interface for 20+ external APIs',
    ],
    techStack: ['Node.js', 'TypeScript', 'Qdrant', 'PostgreSQL', 'Playwright', 'Google APIs', 'Vercel'],
    metrics: [
      { value: '20+', label: 'MCP Tools' },
      { value: '6', label: 'Platforms Integrated' },
      { value: '4', label: 'LLM Providers' },
      { value: '∞', label: 'Autonomous Tasks' },
    ],
    demoAvailable: true,
  },
  {
    id: 'brandqor',
    title: 'BrandQor',
    client: 'BrandQor (Sister Company)',
    status: 'PROPRIETARY',
    description: 'Enterprise personal branding platform with Supabase backend, Google Cloud integration, and automated content distribution system.',
    challenge: 'Needed a scalable platform for personal brand building with automated test result collection, email delivery, and content management for high-profile clients without the complexity of traditional e-commerce platforms.',
    solution: 'Built a full-stack platform with Next.js 15, Supabase for database/auth/real-time subscriptions, Google Sheets API for data collection, Gmail API for automated email delivery with personalized results, and Vercel edge deployment for global low-latency access.',
    impact: [
      'Automated personal brand assessment with instant results delivery',
      'Google Sheets integration for seamless data collection and analysis',
      'Automated Gmail delivery with personalized test results and recommendations',
      'Edge deployment for sub-100ms response times globally',
      'Zod schema validation ensuring data integrity across client/server boundary',
    ],
    systemsDesign: [
      'Serverless Architecture - Supabase for database, auth, and real-time subscriptions',
      'API Integration Layer - Google Cloud Console, Sheets API, Gmail API orchestration',
      'Schema-First Validation - Zod schemas as single source of truth for form submissions',
      'Edge Caching - Vercel CDN for sub-100ms response times worldwide',
      'Email Automation - Nodemailer + Gmail API for personalized result delivery',
    ],
    techStack: ['Next.js 15', 'TypeScript', 'Supabase', 'Google Cloud', 'Gmail API', 'Google Sheets API', 'Vercel', 'Zod', 'Tailwind CSS', 'Nodemailer'],
    metrics: [
      { value: '100+', label: 'Assessments Completed' },
      { value: '<100ms', label: 'Response Time' },
      { value: '100%', label: 'Email Delivery Rate' },
      { value: '0', label: 'Manual Data Entry' },
    ],
    demoAvailable: true,
  },
  {
    id: 'qorepay',
    title: 'QorePay',
    client: 'QorePay Technologies',
    status: 'PROPRIETARY',
    description: 'Payment orchestration platform enabling African businesses to make global payments with local currency through unified multi-provider abstraction layer.',
    challenge: 'African businesses faced fragmented payment infrastructure—multiple gateways (Paystack, Klasha, SarePay) with different APIs, settlement processes, and compliance requirements. Needed unified abstraction, white-label capabilities for B2B2C, and developer-friendly documentation.',
    solution: 'Built Version 2 with Express.js microservices architecture, Next.js dashboard, Algolia-powered developer documentation, Postman API collections, and white-label multi-tenant infrastructure. Integrated 5+ FinTech APIs with 2 ERP systems, automated failure reporting via Slack, and Vercel Cron for scheduled settlements.',
    impact: [
      'Compressed product lifecycle from 1 year to 3 months',
      '80% reduction in ops overhead via automated reconciliation',
      '30% potential annualized savings through multi-gateway cost routing',
      '40% reduction in month-end closing time',
      'Algolia documentation search improving developer onboarding',
      'White-label architecture enabling B2B2C enterprise deployments',
    ],
    systemsDesign: [
      'Payment Provider Abstraction Layer - Unified interface over 5+ heterogeneous APIs',
      'API Gateway Pattern - Centralized routing, rate limiting, and provider failover',
      'Multi-Tenant Architecture - White-label infrastructure for B2B2C deployments',
      'Event-Driven Reporting - Slack API integration for real-time failure alerts',
      'Scheduled Processing - Vercel Cron for automated settlement and reconciliation',
      'Documentation as Product - Algolia search + Postman collections for DX',
    ],
    techStack: ['Express.js', 'Next.js 15', 'AWS', 'Algolia', 'Postman', 'Paystack API', 'Klasha API', 'SarePay API', 'Slack API', 'Vercel Cron'],
    metrics: [
      { value: '5+', label: 'Payment Providers' },
      { value: '80%', label: 'Ops Overhead Reduction' },
      { value: '30%', label: 'Cost Savings' },
      { value: '3mo', label: 'Time to Launch' },
      { value: '2', label: 'ERP Integrations' },
      { value: '∞', label: 'White-Label Scale' },
    ],
    demoAvailable: true,
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-4">
              Case Studies
            </h1>
            <p className="text-xl text-gray-400">
              Proprietary systems architecture for high-stakes environments
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="bg-red-900/50 text-red-400 px-3 py-1 rounded text-sm font-medium border border-red-800">
                CONFIDENTIAL
              </span>
              <span className="text-gray-500 text-sm">
                Demo available upon request
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Case Studies */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="space-y-20">
          {caseStudies.map((study) => (
            <article
              key={study.id}
              className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-gray-800 px-6 py-8 bg-gray-900">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-white">{study.title}</h2>
                      {study.status === 'PROPRIETARY' && (
                        <span className="bg-purple-900/50 text-purple-400 px-3 py-1 rounded text-xs font-medium border border-purple-800">
                          PROPRIETARY
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">{study.client}</p>
                  </div>
                  {study.demoAvailable && (
                    <a
                      href="mailto:tomide@merislabs.com?subject=Demo Request: {study.title}"
                      className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Request Demo
                    </a>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Description */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{study.description}</p>
                </section>

                {/* Metrics */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {study.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700"
                      >
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          {metric.value}
                        </div>
                        <div className="text-xs text-gray-400">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Challenge */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">The Challenge</h3>
                  <p className="text-gray-300 leading-relaxed">{study.challenge}</p>
                </section>

                {/* Solution */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Solution</h3>
                  <p className="text-gray-300 leading-relaxed">{study.solution}</p>
                </section>

                {/* Systems Design Patterns */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4">Systems Design Patterns</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {study.systemsDesign.map((pattern) => (
                      <div
                        key={pattern}
                        className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                      >
                        <p className="text-gray-300">{pattern}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Tech Stack */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {study.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded text-sm border border-purple-800/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Impact */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Business Impact</h3>
                  <ul className="space-y-2">
                    {study.impact.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <svg
                          className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-800/50 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need a High-Stakes System?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We specialize in building mission-critical infrastructure for legal, financial, and regulatory operations.
            </p>
            <a
              href="mailto:tomide@merislabs.com?subject=Project Inquiry"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-lg"
            >
              Schedule a Consultation
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
