/**
 * @fileoverview Case Studies page showcasing proprietary systems architecture
 * @description A grid of case studies and business software knowledge base
 * 
 * NOTE: All case studies are marked as PROPRIETARY & CONFIDENTIAL
 * - No direct links to production systems
 * - Client names anonymized (Tier-1 Bank, etc.)
 * - Demo available upon request only
 */

'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  status: 'PROPRIETARY' | 'PUBLIC';
  description: string;
  tag: string;
  challenge: string;
  solution: string;
  impact: string[];
  systemsDesign: string[];
  techStack: string[];
  metrics: { value: string; label: string }[];
  demoAvailable: boolean;
}

interface BusinessNote {
  id: string;
  title: string;
  description: string;
  tag: string;
  technical: string[];
  businessLegal: string[];
  advice: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'project-compass',
    title: 'Project Compass',
    client: 'Tier-1 Nigerian Bank',
    status: 'PROPRIETARY',
    tag: 'ARCHITECT: ₦273B+ Litigation Audit System',
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
    tag: 'AI ORCHESTRATION: 20+ MCP Tools',
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
    tag: 'PERSONAL BRANDING PLATFORM',
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
    tag: 'PAYMENT ORCHESTRATION PLATFORM',
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

const businessNotes: BusinessNote[] = [
  {
    id: 'software-requirements-checklist',
    title: 'SOFTWARE BUSINESS REQUIREMENTS CHECKLIST',
    description: 'Requirements for launching and managing five core categories of software businesses',
    tag: 'Software Business Requirements',
    technical: [
      'FINTECH APP: Secure backend (Node.js/Python), database (PostgreSQL/MongoDB), frontend (React Native/Swift/Kotlin), logging (ELK/CloudWatch)',
      'AI SOFTWARES: Core Stack: Backend (Python/Node), DB (PostgreSQL), frontend (React) for scalable fullstack architecture',
      'WHATSAPP AGENTS: Core Setup: Meta Business Account, WhatsApp Business API access, and verified phone number',
      'MARKETPLACE WEBSITES: Core Stack: Backend (Node/Rails), DB (PostgreSQL), frontend (React/Next.js)',
      'CURRENCY EXCHANGE SOFTWARES: Core Stack: Backend (Node.js/Python), DB (PostgreSQL/MongoDB), mobile/web frontend (React Native/Flutter)'
    ],
    businessLegal: [
      'FINTECH APP: Business Model: Define revenue streams, target audience, and analyze competitors',
      'AI SOFTWARES: Model: Define subscription or usage-based pricing with churn tracking and LTV metrics',
      'WHATSAPP AGENTS: Model: Subscription fees or per-message pricing with ROI tracked via engagement metrics',
      'MARKETPLACE WEBSITES: Model: Commission fees, premium listings, and multi-sided revenue streams',
      'CURRENCY EXCHANGE SOFTWARES: Model: Commissions on trades (1-5%), subscriptions for premium rates, and volume-based fees'
    ],
    advice: 'This comprehensive checklist helps founders and CTOs avoid regulatory and technical blind spots while providing execution-ready items for faster product launch.'
  }
];

export default function CaseStudiesPage() {
  const [selectedNote, setSelectedNote] = useState<BusinessNote | null>(null);

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-purple-600 bg-purple-200 rounded-full mb-4">
              PROPRIETARY & CONFIDENTIAL
            </div>
            <h1 className="h2 mb-4">Case Studies & Business Software Notes</h1>
            <p className="text-xl text-gray-400">
              High-stakes systems architecture and software business knowledge base
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="bg-red-900/50 text-red-400 px-3 py-1 rounded text-sm font-medium border border-red-800">
                CONFIDENTIAL
              </span>
              <span className="text-gray-500 text-sm">
                Demo available upon request
              </span>
            </div>
          </div>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
            {caseStudies.map((study) => (
              <Dialog key={study.id}>
                <DialogTrigger asChild>
                  <div className="flex flex-col gap-4 p-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors duration-200 min-h-[300px]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-purple-400">{study.tag}</span>
                      {study.status === 'PROPRIETARY' && (
                        <span className="bg-purple-900/50 text-purple-400 px-2 py-1 rounded text-xs font-medium border border-purple-800">
                          PROPRIETARY
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{study.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{study.client}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">{study.description}</p>
                    
                    {/* Metrics Preview */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {study.metrics.slice(0, 3).map((metric, idx) => (
                        <div key={idx} className="bg-gray-900 rounded p-2 text-center">
                          <div className="text-lg font-bold text-purple-400">{metric.value}</div>
                          <div className="text-xs text-gray-500">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto">
                      <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                        View Case Study
                      </span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
                  <DialogTitle className="text-3xl font-bold mb-6 text-white">{study.title}</DialogTitle>

                  <div className="space-y-8">
                    {/* Metrics */}
                    <section>
                      <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {study.metrics.map((metric, idx) => (
                          <div key={idx} className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                            <div className="text-2xl font-bold text-purple-400 mb-1">{metric.value}</div>
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
                        {study.systemsDesign.map((pattern, idx) => (
                          <div key={idx} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <p className="text-gray-300">{pattern}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Tech Stack */}
                    <section>
                      <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {study.techStack.map((tech, idx) => (
                          <span key={tech} className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded text-sm border border-purple-800/50">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </section>

                    {/* Impact */}
                    <section>
                      <h3 className="text-lg font-semibold text-white mb-3">Business Impact</h3>
                      <ul className="space-y-2">
                        {study.impact.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-300">
                            <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* CTA */}
                    {study.demoAvailable && (
                      <div className="pt-6 border-t border-gray-700">
                        <a
                          href={`mailto:tomide@merislabs.com?subject=Demo Request: ${study.title}`}
                          className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Request Demo
                        </a>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* Business Software Notes Section */}
          <div className="border-t border-gray-800 pt-12">
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-green-600 bg-green-200 rounded-full mb-4">
                Business Software Knowledge Base
              </div>
              <h2 className="h2 mb-4">Software Business Requirements</h2>
              <p className="text-xl text-gray-400">
                Execution-ready checklists for launching software businesses
              </p>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessNotes.map((note) => (
                <Dialog key={note.id}>
                  <DialogTrigger asChild>
                    <div className="flex flex-col gap-4 p-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors duration-200 min-h-[250px]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-400">{note.tag}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{note.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{note.description}</p>
                      <div className="mt-auto">
                        <span className="inline-block bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                          Read Full Note
                        </span>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
                    <DialogTitle className="text-3xl font-bold mb-6 text-white">{note.title}</DialogTitle>

                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 text-white" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-4 mt-8 text-purple-400" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mb-3 mt-6 text-green-400" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
                          ul: ({ node, ...props }) => <ul className="mb-4 space-y-2 text-gray-300" {...props} />,
                          ol: ({ node, ...props }) => <ol className="mb-4 space-y-2 text-gray-300 list-decimal list-inside" {...props} />,
                          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                          em: ({ node, ...props }) => <em className="italic text-yellow-400" {...props} />,
                        }}
                      >
                        {`
Requirements for launching and managing five core categories of software businesses

## Advantages of This Document:
- Helps founders and CTOs avoid regulatory and technical blind spots
- Provides execution-ready items for faster product launch
- Offers a standardized requirement template for team alignment
- Ensures compliance, security, and scalability across product types

## FINTECH APP
Fintech Apps can be from Funds Holding, Wallet Generation, Escrow Services, Lending, Exchange Apps …

### Technical Requirements:
1. Secure backend (Node.js/Python), database (PostgreSQL/MongoDB), frontend (React Native/Swift/Kotlin), logging (ELK/CloudWatch)
2. Security & Auth: OAuth/JWT, AES/TLS encryption, fraud detection (ML), KYC/AML.
3. Integrations: REST/GraphQL APIs, payment gateway (Stripe/Plaid), real-time (WebSockets).
4. Infrastructure: Scalable cloud (AWS/Azure), microservices, CI/CD pipeline.
5. Compliance & Testing: PCI-DSS/GDPR, unit/integration testing, monitoring (Sentry/Prometheus).
6. Expert Advice: Prioritize security/MVP; comply early; test/monitor/iterate fast.

### Business & Legal Requirements:
1. Business Model: Define revenue streams, target audience, and analyze competitors.
2. Market Research: Validate demand, build user personas, and set pricing strategy.
3. Financials: Create a budget, forecast cash flow, and determine break-even point.
4. Operations: Build a skilled team, form partnerships, and establish workflows.
5. Marketing: Identify acquisition channels, track growth metrics, and refine positioning.
6. Compliance & Risk: Handle legal setup, licenses, contracts, insurance, and expert guidance.

### Expert Advice:
Here's my take: Developing a Fintech app is akin to gearing up to battle a dragon. Just because your ancestors faced similar challenges doesn't mean it's a walk in the park; you need to be ready because the stakes are high and the reality is tough.

## AI SOFTWARES
AI software such as ProvoloAI, Spitch, and Sorce.jobs, among others, is what we refer to as hot cakes in this decade; Arguably, even in this century.

### Technical Requirements:
1. Core Stack: Backend (Python/Node), DB (PostgreSQL), frontend (React) for scalable fullstack architecture.
2. AI/ML: Build and deploy models (TensorFlow/PyTorch) with data pipelines and inference APIs.
3. Security: Implement OAuth, TLS encryption, and automate vulnerability scanning.
4. Infrastructure: Deploy on AWS/GCP with Docker, Kubernetes, and CI/CD pipelines.
5. Integrations: Connect REST APIs, WebSockets for real-time updates, and ELK for logging.
6. Ops & Testing: Use Prometheus for monitoring, enable auto-scaling, and maintain full unit/e2e coverage.

### Business & Legal Requirements:
1. Model: Define subscription or usage-based pricing with churn tracking and LTV metrics.
2. Market: Validate problem-solution fit, user personas, and competitive moat.
3. Financials: Build projections, track runway, and prep for seed-stage funding.
4. Team/Legal: Incorporate (C-Corp), assign IP, and ensure GDPR/data compliance.
5. Go-to-Market: Drive SEO/content growth, partnerships, and A/B test acquisition funnels.
6. Advice: Ship MVP fast, monitor AI bias, and hire a lawyer early for compliance.

### Expert Advice:
In AI, clarity equals credibility. Be upfront about your model's capabilities, limitations, and data sources. Document every workflow, it becomes part of your defense and differentiation.

## WHATSAPP AGENTS
WhatsApp AI Agents connect brands to customers directly, example like usexara.ai, owo.co and so much more

### Technical Requirements:
1. Core Setup: Meta Business Account, WhatsApp Business API access, and verified phone number.
2. Backend & Flows: Node.js/Python server with webhook configuration and conversational logic (rules/AI).
3. AI Integration: NLP via Dialogflow/OpenAI for intent recognition and fallback to human agents.
4. Security: Apply TLS encryption, auth tokens, and robust data privacy measures.
5. Infrastructure: Cloud hosting (AWS/GCP), scalable servers, and optional no-code tools (Landbot/Wati).
6. Ops & Testing: Approve message templates, monitor analytics, and run end-to-end testing.

### Business & Legal Requirements:
1. Model: Subscription fees or per-message pricing with ROI tracked via engagement metrics.
2. Market: Validate use cases (support/sales), target industries, and build opt-in strategies.
3. Financials: Budget for API costs, create projections, and partner with BSPs (Business Solution Providers).
4. Compliance: Respect Meta's policies—no general-purpose bots (post-2026) and follow Commerce/vertical rules.
5. Legal: Maintain verified business entity, consent records, and GDPR/TCP compliance.
6. Advice: Use official providers, audit compliance yearly, and prioritize customer opt-ins.

### Expert Advice:
These are going to be the most used ways to interact with any startup, right from WhatsApp, the ability to access a vast array of tools without downloading multiple apps. Get a piece of the market before it gets diluted.

## MARKETPLACE WEBSITES
One of the most in demand softwares, e.g Jumia, Amazon, Upwork, Jobberman, Airbnb e.t.c

### Technical Requirements:
1. Core Stack: Backend (Node/Rails), DB (PostgreSQL), frontend (React/Next.js).
2. Marketplace Logic: Listings/search, matching algorithm, and escrow payments.
3. Payments & Security: Gateways (Stripe), fraud detection, OAuth/TLS.
4. Features: Reviews/ratings, messaging, geolocation, image uploads.
5. Infrastructure: Cloud (AWS), microservices, CDN, CI/CD pipelines.
6. Ops: Monitoring (Datadog), scaling, A/B testing, and analytics tracking.

### Business & Legal Requirements:
1. Model: Commission fees, premium listings, and multi-sided revenue streams.
2. Market: Maintain supply/demand balance, leverage network effects, and analyze competitors.
3. Financials: GMV projections, unit economics, and funding roadmap.
4. Operations: Vendor onboarding, dispute resolution, and trust/safety team setup.
5. Legal: Terms of service, liability limits, and tax compliance (VAT).
6. Advice: Bootstrap liquidity, insure transactions, and localize regulations.

### Expert Advice:
One of the greatest advantages of this niche is that you can rarely go astray. If you maintain consistent communication and effective marketing, you'll steer your Marketplace SOFTWARE business towards profitability.

## CURRENCY EXCHANGE SOFTWARES
This niche is quite interesting because, without influencers promoting your platform, it simply won't take off.

### Technical Requirements:
1. Core Stack: Backend (Node.js/Python), DB (PostgreSQL/MongoDB), mobile/web frontend (React Native/Flutter).
2. Exchange Logic: Crypto APIs (Binance/Coinbase), gift card scanners (OCR/ML), real-time rates with NGN conversion.
3. Payments & Utilities: Airtime gateways (MTN/Glo APIs), wallets (BVN-verified), and instant P2P/escrow transfers.
4. Security: KYC/AML (ID verification), TLS/AES encryption, and fraud AI for transaction monitoring.
5. Infrastructure: Cloud hosting (AWS/GCP Africa regions), microservices, and CI/CD with Docker/Kubernetes.
6. Ops & Testing: Logging (ELK), analytics (Mixpanel), compliance audits, and load testing.

### Business & Legal Requirements:
1. Model: Commissions on trades (1-5%), subscriptions for premium rates, and volume-based fees.
2. Market: Focus on Nigeria/Africa, define user personas (traders/remitters), and establish competitive edge (gift card liquidity).
3. Financials: NGN projections, crypto volatility buffers, and CBN forex compliance.
4. Operations: P2P matching, support ticketing, and managing liquidity providers.
5. Legal: CBN/SEC registration, anti-money laundering policies, and NDPR-compliant data protection.
6. Advice: Partner with BSPs early, audit rates daily, and prioritize mobile UX.

### Expert Advice:
You're not building software — you're building trust infrastructure. Every transaction must feel transparent, traceable, and secure.`}
                      </ReactMarkdown>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
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
        </div>
      </div>
    </section>
  );
}
