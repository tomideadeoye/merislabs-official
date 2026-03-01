// Comprehensive services data for MerisLabs
// FILEPATH: data/services.ts

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  services: Service[];
  caseStudies?: CaseStudy[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  features: string[];
  technologies: string[];
  deliverables: string[];
  idealFor: string[];
  pricing?: {
    starting: string;
    model: 'project' | 'retainer' | 'hourly';
    currency: 'USD' | 'NGN';
  };
}

export interface CaseStudy {
  name: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  image?: string;
  link?: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'ai-automation',
    name: 'AI Automation & Agentic Systems',
    slug: 'ai-automation',
    description: 'Transform your business operations with autonomous AI workflows, intelligent document automation, and custom AI agents that work 24/7.',
    icon: '🤖',
    color: 'from-purple-600 to-blue-600',
    services: [
      {
        id: 'pitch-deck-automation',
        name: 'Pitch Deck & Report Automation',
        description: 'Reduce deck/report creation from days to 1 hour. Automated slide generation, data visualization, and PDF export.',
        features: [
          'Automated slide generation from templates',
          'Data-driven chart creation',
          'PDF export with print optimization',
          'Multi-format output (PPTX, PDF, HTML)',
          'Version control and collaboration',
          'Brand consistency enforcement',
        ],
        technologies: ['React PDF', 'Puppeteer', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        deliverables: [
          'Automated deck generation system',
          'Custom template library',
          'Data integration pipelines',
          'PDF export functionality',
          'Team training and documentation',
        ],
        idealFor: [
          'Investment firms creating pitch books',
          'Consulting firms with client reports',
          'Startups raising funding',
          'Corporate development teams',
        ],
        pricing: {
          starting: '$4,000',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'autonomous-ai-workflows',
        name: 'Autonomous AI Workflows',
        description: 'Build self-operating AI systems that handle complex multi-step tasks without human intervention.',
        features: [
          'Multi-agent orchestration systems',
          'Task automation pipelines',
          'Decision-making AI agents',
          'Human-in-the-loop workflows',
          'Error handling and recovery',
        ],
        technologies: ['MCP Protocol', 'LangChain', 'LlamaIndex', 'Python', 'TypeScript'],
        deliverables: [
          'Custom AI agent architecture',
          'Workflow automation scripts',
          'Integration with existing tools',
          'Monitoring and logging dashboard',
        ],
        idealFor: [
          'Operations teams drowning in repetitive tasks',
          'Customer support automation',
          'Data processing pipelines',
          'Content generation workflows',
        ],
        pricing: {
          starting: '$5,000',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'document-automation',
        name: 'Document Automation',
        description: 'Reduce document turnaround from days to 1 hour with intelligent templates, auto-filling, and generation.',
        features: [
          'Smart document templates',
          'Auto-population from databases',
          'PDF generation and manipulation',
          'Contract clause libraries',
          'Version control and audit trails',
        ],
        technologies: ['React PDF', 'Docx', 'Puppeteer', 'OCR', 'NLP'],
        deliverables: [
          'Automated document generation system',
          'Template management interface',
          'Integration with CRM/ERP',
          'Bulk processing capabilities',
        ],
        idealFor: [
          'Legal teams creating contracts',
          'HR departments with onboarding docs',
          'Finance teams generating reports',
          'Consulting firms with proposals',
        ],
        pricing: {
          starting: '$3,000',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'executive-ai-assistants',
        name: 'Executive AI Assistants',
        description: 'Multi-channel AI agents that manage communications, schedule meetings, and handle routine executive tasks.',
        features: [
          'WhatsApp/Telegram/Beeper integration',
          'Email drafting and responses',
          'Meeting scheduling automation',
          'Information retrieval on demand',
          'Personalized learning from preferences',
        ],
        technologies: ['MCP', 'WhatsApp Business API', 'Gmail API', 'Calendar APIs', 'Vector DBs'],
        deliverables: [
          'Custom AI assistant deployment',
          'Multi-channel integration',
          'Personal knowledge base setup',
          'Privacy and security configuration',
        ],
        idealFor: [
          'C-level executives',
          'Busy founders and CEOs',
          'Investment professionals',
          'Legal partners and consultants',
        ],
        pricing: {
          starting: '$2,500',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'custom-rag-systems',
        name: 'Custom RAG Systems',
        description: 'Retrieval-Augmented Generation systems that give AI accurate knowledge from your proprietary data.',
        features: [
          'Vector database setup (Qdrant, Pinecone)',
          'Document embedding pipelines',
          'Semantic search implementation',
          'Citation and source tracking',
          'Multi-format document support',
        ],
        technologies: ['Qdrant', 'Pinecone', 'OpenAI Embeddings', 'HuggingFace', 'LangChain'],
        deliverables: [
          'RAG pipeline architecture',
          'Vector database deployment',
          'Search and retrieval API',
          'Chat interface with sources',
        ],
        idealFor: [
          'Companies with large knowledge bases',
          'Customer support with product docs',
          'Legal firms with case precedents',
          'Research organizations',
        ],
        pricing: {
          starting: '$4,000',
          model: 'project',
          currency: 'USD',
        },
      },
    ],
    caseStudies: [
      {
        name: 'NICArb Pitch Deck Automation',
        client: 'NICArb (Nigerian Institute of Chartered Arbitrators)',
        challenge: 'Creating investment pitch decks and conference reports took 3-5 days of manual work per deck, with inconsistent formatting and frequent errors.',
        solution: 'Built automated deck generation system with React-based templates, automated PDF export, and data-driven content population. Created 7+ specialized slide layouts with automatic formatting.',
        results: [
          '95% reduction in deck creation time (3 days → 1 hour)',
          'Consistent branding across all decks',
          'Zero formatting errors',
          '7+ reusable template layouts',
          'Print-ready PDF generation',
        ],
        technologies: ['React', 'Next.js', 'React PDF', 'Puppeteer', 'TypeScript', 'Tailwind CSS'],
        link: '/decks/nicarb-annual-conference-2025',
      },
      {
        name: 'Orion - Sovereign AI System',
        client: 'Internal Product',
        challenge: 'Needed an AI system that could manage complex tasks across multiple tools (email, calendar, messaging, memory) with full context awareness and autonomous operation.',
        solution: 'Built Orion, a multi-agent AI system with MCP protocol integration, vector memory (Qdrant), LLM orchestration, and autonomous task execution across WhatsApp, Gmail, Calendar, and custom databases.',
        results: [
          '90% reduction in routine task time',
          'Autonomous meeting scheduling and follow-ups',
          'Cross-platform memory and context retention',
          'Natural language interface for complex operations',
        ],
        technologies: ['MCP', 'Qdrant', 'LLM Orchestration', 'Python', 'TypeScript', 'Node.js'],
      },
    ],
  },
  {
    id: 'browser-automation',
    name: 'Browser & Form Automation',
    slug: 'browser-automation',
    description: 'Automate web interactions, form filling, and browser workflows at scale. From compliance filings to data extraction.',
    icon: '🌐',
    color: 'from-cyan-600 to-blue-600',
    services: [
      {
        id: 'browser-automation',
        name: 'Browser Automation',
        description: 'Automate complex web workflows, multi-step processes, and browser-based tasks at enterprise scale.',
        features: [
          'Multi-step workflow automation',
          'Cross-browser compatibility',
          'CAPTCHA handling',
          'Session management',
          'Error recovery and retry logic',
          'Concurrent execution',
        ],
        technologies: ['Playwright', 'Puppeteer', 'Selenium', 'BeachPatrol', 'Node.js'],
        deliverables: [
          'Automated workflow scripts',
          'Browser orchestration system',
          'Monitoring and logging',
          'Scalability infrastructure',
        ],
        idealFor: [
          'Enterprise IT teams',
          'QA automation',
          'Data entry operations',
          'Web application testing',
        ],
        pricing: {
          starting: '$3,500',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'form-filling-automation',
        name: 'Form Filling Automation',
        description: 'Automate repetitive form submissions for compliance filings, applications, and data entry.',
        features: [
          'Multi-platform form automation',
          'Data validation and error checking',
          'File upload automation',
          'Submission tracking',
          'Compliance audit trails',
        ],
        technologies: ['Playwright', 'Puppeteer', 'Python', 'TypeScript', 'OCR'],
        deliverables: [
          'Form automation scripts',
          'Data integration layer',
          'Submission tracking dashboard',
          'Error handling system',
        ],
        idealFor: [
          'Compliance teams',
          'Legal operations',
          'Government filings',
          'Insurance applications',
        ],
        pricing: {
          starting: '$2,500',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'web-scraping-intelligence',
        name: 'Web Scraping & Business Intelligence',
        description: 'Extract actionable business intelligence from web data. Market monitoring, competitor analysis, and data aggregation.',
        features: [
          'Large-scale data extraction',
          'Anti-blocking measures',
          'Data cleaning and normalization',
          'Real-time monitoring',
          'API delivery or database export',
        ],
        technologies: ['Playwright', 'Cheerio', 'Puppeteer', 'Python', 'PostgreSQL'],
        deliverables: [
          'Web scraping pipeline',
          'Data processing system',
          'Monitoring dashboard',
          'Data export APIs',
        ],
        idealFor: [
          'Market research firms',
          'Investment analysis',
          'Competitive intelligence',
          'Price monitoring',
        ],
        pricing: {
          starting: '$3,000',
          model: 'project',
          currency: 'USD',
        },
      },
    ],
    caseStudies: [
      {
        name: 'BeachPatrol Browser Automation',
        client: 'Enterprise Client',
        challenge: 'Needed to automate complex multi-step web workflows across multiple browser tabs, handling authentication, data extraction, and form submissions at scale.',
        solution: 'Built BeachPatrol, a browser automation system using Playwright with multi-tab orchestration, session management, and concurrent execution capabilities.',
        results: [
          'Automated 1000+ daily workflows',
          '99.9% success rate with error recovery',
          'Concurrent execution of 50+ browsers',
          'Reduced manual work by 95%',
        ],
        technologies: ['Playwright', 'Node.js', 'TypeScript', 'Redis', 'Docker'],
      },
      {
        name: 'UNICOM Compliance Form Automation',
        client: 'JEE (Jackson, Etti & Edu)',
        challenge: 'Manual compliance form filings for multiple clients across different regulatory bodies was time-consuming and prone to errors.',
        solution: 'Integrated automated form filling into UNICOM compliance platform, with data validation, auto-submission, and audit trail generation.',
        results: [
          '80% reduction in filing time',
          'Zero filing errors',
          'Automated audit trails',
          'Multi-client batch processing',
        ],
        technologies: ['React', 'Playwright', 'Node.js', 'PostgreSQL'],
        link: 'https://unicomreport.netlify.app',
      },
    ],
  },
  {
    id: 'legaltech',
    name: 'LegalTech & Compliance Automation',
    slug: 'legaltech',
    description: 'Digitize legal operations, automate compliance monitoring, and build regulatory technology solutions for modern legal practices.',
    icon: '⚖️',
    color: 'from-blue-600 to-cyan-600',
    services: [
      {
        id: 'compliance-automation',
        name: 'Compliance Automation Platforms',
        description: 'End-to-end compliance management systems that track regulations, automate reporting, and reduce manual oversight.',
        features: [
          'Regulatory change monitoring',
          'Automated compliance checklists',
          'Risk assessment workflows',
          'Audit trail generation',
          'Multi-jurisdiction support',
        ],
        technologies: ['React', 'Node.js', 'PostgreSQL', 'NLP', 'Rule Engines'],
        deliverables: [
          'Compliance management dashboard',
          'Automated monitoring system',
          'Report generation engine',
          'Alert and notification system',
        ],
        idealFor: [
          'Financial institutions',
          'Legal departments',
          'Regulated industries',
          'Multi-national corporations',
        ],
        pricing: {
          starting: '$8,000',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'litigation-dashboards',
        name: 'Litigation Dashboards',
        description: 'Real-time visibility into case portfolios, court dates, billing, and matter management.',
        features: [
          'Case portfolio tracking',
          'Court date calendar integration',
          'Billing and time tracking',
          'Document management',
          'Client reporting portal',
        ],
        technologies: ['React', 'D3.js', 'PostgreSQL', 'Calendar APIs', 'Document Storage'],
        deliverables: [
          'Executive dashboard',
          'Case management interface',
          'Automated reporting system',
          'Client portal',
        ],
        idealFor: [
          'Law firms with 10+ lawyers',
          'Corporate legal departments',
          'Litigation finance firms',
          'Insurance claims departments',
        ],
        pricing: {
          starting: '$6,000',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'legal-api-infrastructure',
        name: 'Legal API Infrastructure',
        description: 'Build queryable legal databases and APIs for case research, compliance checks, and regulatory lookups.',
        features: [
          'Legal database design',
          'Search and indexing',
          'API development',
          'Data normalization',
          'Access control and security',
        ],
        technologies: ['PostgreSQL', 'Elasticsearch', 'GraphQL', 'REST APIs', 'OAuth'],
        deliverables: [
          'Database schema and migration',
          'Search API',
          'Documentation',
          'Integration guides',
        ],
        idealFor: [
          'Legal tech startups',
          'Research organizations',
          'Government agencies',
          'Compliance platforms',
        ],
        pricing: {
          starting: '$5,000',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'contract-digitization',
        name: 'Contract Digitization',
        description: 'OCR + AI extraction to convert paper contracts into structured, searchable, analyzable data.',
        features: [
          'OCR processing pipeline',
          'Clause extraction with NLP',
          'Entity recognition',
          'Contract comparison',
          'Risk flagging',
        ],
        technologies: ['Tesseract', 'AWS Textract', 'spaCy', 'Transformers', 'Python'],
        deliverables: [
          'Document ingestion system',
          'Extraction pipeline',
          'Search interface',
          'Analytics dashboard',
        ],
        idealFor: [
          'Law firms with paper archives',
          'Corporate legal teams',
          'Due diligence teams',
          'M&A advisors',
        ],
        pricing: {
          starting: '$4,500',
          model: 'project',
          currency: 'USD',
        },
      },
    ],
    caseStudies: [
      {
        name: 'UNICOM - Compliance Management for JEE',
        client: 'JEE (Jackson, Etti & Edu)',
        challenge: 'Manual compliance tracking for multiple clients across different regulatory frameworks was time-consuming and error-prone.',
        solution: 'Built UNICOM, a web-based compliance management platform with automated checklists, regulatory monitoring, and client reporting dashboards.',
        results: [
          '70% reduction in compliance review time',
          'Real-time regulatory change alerts',
          'Automated client reporting',
          'Centralized compliance database',
        ],
        technologies: ['React', 'Express.js', 'PostgreSQL', 'Node.js'],
        link: 'https://unicomreport.netlify.app',
      },
    ],
  },
  {
    id: 'fintech',
    name: 'FinTech & Payment Systems',
    slug: 'fintech',
    description: 'Build secure, scalable payment infrastructure, merchant analytics, and financial technology solutions for African markets.',
    icon: '💳',
    color: 'from-green-600 to-emerald-600',
    services: [
      {
        id: 'payment-gateway-integration',
        name: 'Payment Gateway Integration',
        description: 'Seamless integration with Paystack, Flutterwave, Klasha, and other payment processors for African and global markets.',
        features: [
          'Multi-provider integration',
          'Payment flow optimization',
          'Webhook handling',
          'Refund and dispute management',
          'PCI DSS compliance',
        ],
        technologies: ['Paystack API', 'Flutterwave', 'Stripe', 'Node.js', 'React'],
        deliverables: [
          'Payment integration module',
          'Transaction management dashboard',
          'Webhook processing system',
          'Testing and documentation',
        ],
        idealFor: [
          'E-commerce platforms',
          'SaaS companies',
          'Marketplace platforms',
          'Subscription businesses',
        ],
        pricing: {
          starting: '$3,500',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'merchant-analytics',
        name: 'Merchant Analytics Dashboards',
        description: 'Business intelligence dashboards for payment processors, showing transaction volumes, merchant performance, and fraud detection.',
        features: [
          'Transaction analytics',
          'Merchant performance tracking',
          'Fraud detection algorithms',
          'Revenue reporting',
          'Real-time monitoring',
        ],
        technologies: ['React', 'D3.js', 'PostgreSQL', 'Python', 'WebSocket'],
        deliverables: [
          'Analytics dashboard',
          'Real-time monitoring system',
          'Fraud detection module',
          'Automated reports',
        ],
        idealFor: [
          'Payment processors',
          'Acquiring banks',
          'Fintech platforms',
          'Financial institutions',
        ],
        pricing: {
          starting: '$7,000',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'kyc-aml-systems',
        name: 'KYC/AML Systems',
        description: 'Know Your Customer and Anti-Money Laundering compliance systems with identity verification and transaction monitoring.',
        features: [
          'Identity verification',
          'Document validation',
          'Sanctions screening',
          'Transaction monitoring',
          'Risk scoring',
        ],
        technologies: ['Python', 'Machine Learning', 'APIs', 'OCR', 'Blockchain'],
        deliverables: [
          'KYC verification pipeline',
          'AML monitoring system',
          'Risk assessment engine',
          'Compliance reporting',
        ],
        idealFor: [
          'Banks and financial institutions',
          'Crypto exchanges',
          'Payment processors',
          'Investment platforms',
        ],
        pricing: {
          starting: '$6,500',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'ledger-systems',
        name: 'Double-Entry Ledger Systems',
        description: 'Core banking logic with double-entry bookkeeping, multi-currency support, and audit trails.',
        features: [
          'Double-entry accounting',
          'Multi-currency processing',
          'Journal entry management',
          'Reconciliation tools',
          'Audit trail generation',
        ],
        technologies: ['PostgreSQL', 'Node.js', 'TypeScript', 'Accounting Standards'],
        deliverables: [
          'Ledger core system',
          'Transaction processing engine',
          'Reporting module',
          'Integration APIs',
        ],
        idealFor: [
          'Neobanks',
          'Microfinance institutions',
          'Investment platforms',
          'Accounting firms',
        ],
        pricing: {
          starting: '$8,000',
          model: 'project',
          currency: 'USD',
        },
      },
    ],
    caseStudies: [
      {
        name: 'QorePay Payment Gateway',
        client: 'QorePay Technologies',
        challenge: 'Needed a payment gateway that could handle international transactions, local currency settlement, and multiple payment methods for African businesses.',
        solution: 'Built QorePay, a payment platform with Paystack/Flutterwave integration, merchant dashboard, and automated settlement processing.',
        results: [
          'Processing millions in transactions',
          'Support for 5+ payment methods',
          'Real-time transaction monitoring',
          'Automated merchant settlements',
        ],
        technologies: ['React', 'Next.js', 'Express.js', 'AWS', 'Paystack', 'Flutterwave'],
        link: 'https://qorepay.com',
      },
      {
        name: 'Dexter - Merchant Analytics Platform',
        client: 'Dukka Inc.',
        challenge: '80,000+ merchants generating unstructured data with no visibility into user behavior, retention, or city-level performance.',
        solution: 'Built Dexter, a business intelligence platform with merchant analytics, retention analysis, user acquisition tracking, and automated Excel exports.',
        results: [
          'Analytics for 80,000+ merchants',
          '40% improvement in data accuracy',
          'Identified 60% churn cause',
          'Automated reporting saving 20hrs/week',
        ],
        technologies: ['Django', 'React', 'PostgreSQL', 'Python', 'D3.js'],
      },
    ],
  },
  {
    id: 'data-engineering',
    name: 'Data Engineering & Business Intelligence',
    slug: 'data-engineering',
    description: 'Transform raw data into actionable insights with custom analytics, retention analysis, and real-time business intelligence dashboards.',
    icon: '📊',
    color: 'from-orange-600 to-red-600',
    services: [
      {
        id: 'retention-analysis',
        name: 'Retention Analysis Systems',
        description: 'Python-powered analysis identifying churn causes, user behavior patterns, and retention improvement opportunities.',
        features: [
          'Cohort analysis',
          'Churn prediction models',
          'User behavior tracking',
          'Feature usage analysis',
          'Retention funnel optimization',
        ],
        technologies: ['Python', 'Pandas', 'Scikit-learn', 'Jupyter', 'SQL'],
        deliverables: [
          'Retention analysis report',
          'Churn prediction model',
          'User segmentation',
          'Actionable recommendations',
        ],
        idealFor: [
          'SaaS companies',
          'Subscription businesses',
          'E-commerce platforms',
          'Mobile apps',
        ],
        pricing: {
          starting: '$3,000',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'bi-dashboards',
        name: 'Business Intelligence Dashboards',
        description: 'Executive dashboards for investor reporting, board meetings, and operational decision-making.',
        features: [
          'KPI tracking',
          'Financial reporting',
          'Operational metrics',
          'Trend analysis',
          'Automated report distribution',
        ],
        technologies: ['React', 'D3.js', 'Recharts', 'PostgreSQL', 'Python'],
        deliverables: [
          'Executive dashboard',
          'Custom report builder',
          'Automated email reports',
          'Data export functionality',
        ],
        idealFor: [
          'Startups raising funds',
          'Growth-stage companies',
          'Investment firms',
          'Portfolio companies',
        ],
        pricing: {
          starting: '$4,500',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'realtime-analytics',
        name: 'Real-time Analytics',
        description: 'Live data processing and visualization with WebSocket telemetry and instant updates.',
        features: [
          'WebSocket integration',
          'Real-time data processing',
          'Live dashboards',
          'Alert systems',
          'Performance monitoring',
        ],
        technologies: ['Socket.io', 'WebSocket', 'Redis', 'Node.js', 'React'],
        deliverables: [
          'Real-time data pipeline',
          'Live dashboard',
          'Alert configuration',
          'Performance optimization',
        ],
        idealFor: [
          'Trading platforms',
          'Monitoring systems',
          'IoT applications',
          'Live events platforms',
        ],
        pricing: {
          starting: '$5,000',
          model: 'project',
          currency: 'USD',
        },
      },
    ],
    caseStudies: [
      {
        name: 'Dexter - Business Intelligence for 80k Merchants',
        client: 'Dukka Inc.',
        challenge: 'Needed visibility into merchant performance, user retention, and city-level analytics for 80,000+ merchants across multiple products.',
        solution: 'Built comprehensive BI platform with retention analysis, cohort tracking, referral system monitoring, and automated Excel exports.',
        results: [
          'Data-driven decisions for 80k+ merchants',
          'Identified feature causing 60% churn',
          'Referral system drove 80k merchant acquisitions',
          '25% improvement in user engagement',
        ],
        technologies: ['Django', 'React', 'PostgreSQL', 'Python', 'XLSX'],
      },
    ],
  },
  {
    id: 'cto-advisory',
    name: 'CTO Advisory & Strategic Consulting',
    slug: 'cto-advisory',
    description: 'Technical leadership, product strategy, and due diligence for startups, investors, and enterprises navigating technology decisions.',
    icon: '🎯',
    color: 'from-indigo-600 to-purple-600',
    services: [
      {
        id: 'technical-due-diligence',
        name: 'Technical Due Diligence',
        description: 'Comprehensive technical assessment for VCs evaluating FinTech, LegalTech, and SaaS investments.',
        features: [
          'Code quality assessment',
          'Architecture review',
          'Security audit',
          'Scalability analysis',
          'Team capability evaluation',
        ],
        technologies: ['All Major Stacks', 'Security Tools', 'Performance Profiling'],
        deliverables: [
          'Due diligence report',
          'Risk assessment',
          'Technical recommendations',
          'Investment memo support',
        ],
        idealFor: [
          'VCs evaluating tech startups',
          'Private equity firms',
          'Angel investors',
          'Corporate development teams',
        ],
        pricing: {
          starting: '$2,500',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'product-strategy',
        name: 'Product Strategy & GTM',
        description: 'Requirements analysis, product roadmap, and go-to-market strategy for tech products.',
        features: [
          'Market analysis',
          'Competitive landscape',
          'Product roadmap',
          'MVP definition',
          'GTM strategy',
        ],
        technologies: ['Product Management Tools', 'Market Research'],
        deliverables: [
          'Product strategy document',
          'Roadmap and timeline',
          'MVP requirements',
          'GTM plan',
        ],
        idealFor: [
          'Early-stage startups',
          'Companies launching new products',
          'Enterprises digitizing services',
          'Non-technical founders',
        ],
        pricing: {
          starting: '$3,000',
          model: 'project',
          currency: 'USD',
        },
      },
      {
        id: 'cto-as-a-service',
        name: 'CTO-as-a-Service',
        description: 'Part-time technical leadership for startups needing experienced guidance without full-time commitment.',
        features: [
          'Technical strategy',
          'Team building and hiring',
          'Architecture decisions',
          'Vendor selection',
          'Investor technical updates',
        ],
        technologies: ['All Modern Stacks', 'Cloud Platforms', 'DevOps'],
        deliverables: [
          'Technical roadmap',
          'Architecture documentation',
          'Team structure plan',
          'Monthly strategy sessions',
        ],
        idealFor: [
          'Seed-stage startups',
          'Non-technical founders',
          'Companies transitioning to tech',
          'Small teams needing guidance',
        ],
        pricing: {
          starting: '$2,000',
          model: 'retainer',
          currency: 'USD',
        },
      },
    ],
    caseStudies: [
      {
        name: 'Technical Due Diligence for FinTech Investment',
        client: 'Confidential VC Firm',
        challenge: 'VC needed rapid technical assessment of FinTech startup before Series A investment decision.',
        solution: 'Conducted comprehensive code review, architecture assessment, security audit, and team evaluation over 5 days.',
        results: [
          'Identified critical security vulnerabilities',
          'Validated scalability claims',
          'Provided investment recommendation',
          'Outlined post-investment tech priorities',
        ],
        technologies: ['Node.js', 'React', 'AWS', 'PostgreSQL', 'Security Tools'],
      },
    ],
  },
];

export const getAllServices = (): Service[] => {
  return serviceCategories.flatMap((category) => category.services);
};

export const getServiceBySlug = (slug: string): Service | undefined => {
  return getAllServices().find((service) => service.id === slug);
};

export const getCategoryBySlug = (slug: string): ServiceCategory | undefined => {
  return serviceCategories.find((category) => category.slug === slug);
};
