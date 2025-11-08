/**
 * @fileoverview Business Software Notes page for Meris Labs
 * @description A notes page that displays a list of business software notes, similar to the zigzag component approach.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Display a grid of business software notes
 *   - Allow clicking on notes to view detailed content in a modal
 *   - Serve as a knowledge base for software development practices
 *
 * FILEPATH: app/business-software-notes/page.tsx
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - app/lib/routes.ts: Includes this page in navigation
 *   - app/layout.tsx: Uses the global layout
 *   - app/components/ui/dialog.tsx: For modal content display
 *   - app/components/ui/tabs.tsx: For tabbed interface in modals
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This is a static notes page for now, can be expanded with dynamic content later
 *   - Follows the same structure as other pages in the app
 *
 * NOTES:
 *   - Uses modal dialogs for detailed content display
 *   - Implements tabbed interface for different requirement categories
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Add search functionality for notes
 *   - Implement categorization of notes
 *   - Add user authentication for private notes
 */

'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

interface BusinessNote {
  id: string;
  title: string;
  description: string;
  tag: string;
  technical: string[];
  businessLegal: string[];
  advice: string;
}

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

export default function BusinessSoftwareNotes() {
  const [selectedNote, setSelectedNote] = useState<BusinessNote | null>(null);

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-green-600 bg-green-200 rounded-full mb-4">
              Business Software Knowledge Base
            </div>
            <h1 className="h2 mb-4">Business Software Notes</h1>
            <p className="text-xl text-gray-400">
              A comprehensive collection of insights, requirements, and best practices for software business development.
            </p>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessNotes.map((note, index) => (
              <Dialog key={note.id}>
                <DialogTrigger asChild>
                  <div
                    className="flex flex-col gap-4 p-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors duration-200 min-h-[250px]"
                    onClick={() => setSelectedNote(note)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-purple-400">{note.tag}</span>

                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{note.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{note.description}</p>
                    <div className="mt-auto">
                      <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
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
      </div>
    </section>
  );
}
