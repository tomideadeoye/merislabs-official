// GOAL OF FILE|FEATURES|FUNCTIONS:
// Exports the Project interface, projects array, and reviews array for use in the Zigzag component and others.
// FILEPATH: components/projects.ts
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - Used by components/zigzag.tsx
// - Media assets referenced in public/images/
// ASSUMPTIONS & CLEAR COMMENTS: // NOTE: Assumed all referenced images exist in public/images/ or public/
// NOTES: Consider consolidating project/review data, add more robust error handling/logging, and test for missing assets.

export type LinkType = 'website' | 'github' | 'npm-package' | 'live-demo' | 'video' | 'documentation' | 'api' | 'blog' | 'case-study' | 'working-example' | 'google-play-store';

export interface Link {
  type: LinkType;
  url: string;
  label?: string; // Optional custom label
}

export interface Project {
  id: string; // Added ID field for dynamic routing
  name: string;
  description: string; // Supports Markdown formatting
  technologies: string[];
  image?: string;
  iframe?: string;
  tag: string;
  links: Link[];
  img: string;
}

const projects: Project[] = [
  {
    id: 'brandqor',
    name: 'BrandQor',
    description: 'BrandQor is a personal branding platform designed for visionary leaders, founders, executives, and creators. It helps build authentic authority, attract the right opportunities, and grow businesses sustainably without burnout. Through their Influence Engine, they provide a done-for-you visibility system that turns expertise into influence with strategic content creation, distribution, and storytelling. The platform offers two paths: the Executive version for busy professionals who want full-service management, and the Starter version for DIY growth with structured guidance. BrandQor focuses on clarifying your story, designing your online presence, creating compelling content, distributing effectively, and compounding visibility into trust and opportunities.',
    technologies: ['NextJs', 'Personal Branding', 'Content Strategy'],
    iframe: 'https://brandqor.com',
    img: '/brandqor.png',
    tag: 'BRANDQOR: Personal Branding for Visionary Leaders',
    links: [{ type: 'website', url: 'https://brandqor.com' }],
  },
  {
    id: 'bundul-due-payments',
    name: 'Bundul Due Payments',
    description: 'Bundul Due Payments is a React Native Expo application that displays a list of upcoming payments for user subscriptions with a modern fintech dark theme UI. It features payment tracking with service name, amount, due date, and "Pay Now" functionality. The app includes "Due Soon" badges with pulse effects for payments within 3 days, sorted by due date with highlighted rows. Users can tap "Pay Now" to open confirmation modals, pull-to-refresh, search payments, and filter by All, Due Soon, or Paid status. It tracks payment history with persistent storage and real-time updates across tabs, plus an insights dashboard with payment visualization charts. The app delivers a modern dark theme fintech UI with animations and responsive design.',
    technologies: ['React Native', 'Expo', 'TypeScript', 'React Native Paper', 'React Native Reanimated'],
    img: '/bundul.png',
    tag: 'BUNDUL: Subscription Payment Tracker',
    links: [
      { type: 'github', url: 'https://github.com/tomideadeoye/bundul-due-payments' },
      { type: 'video', url: 'https://github.com/tomideadeoye/bundul-due-payments/raw/refs/heads/main/assets/Screen%20Recording%202025-10-23%20at%2000.41.36.mp4' },
    ],
  },
  {
    id: 'qorepay',
    name: 'QorePay Payment Gateway',
    tag: 'QOREPAY: Payment settlement for Nigerian Businesses',
    description:
      'QorePay is a payment app that allows users to send and receive money from anywhere in the world. It also allows users to pay bills, buy airtime, and make transfers to bank accounts.',
    technologies: ['ExpressJs', 'React/NextJs', 'AWS'],
    iframe: 'https://qorepay.com',
    img: '/qorepay.png',
    links: [
      { type: 'website', url: 'https://qorepay.com/' },
      {
        type: 'video',
        url: 'https://user-images.githubusercontent.com/55337742/268929386-345b9e34-a559-417e-b957-3f9971a77ecb.mp4',
      },
    ],
  },
  {
    id: 'pitchr',
    name: 'PitchR',
    tag: 'Business funding for startups',
    description: 'PitchR provides advisory services for startups to grow their businesses.',
    technologies: ['NextJs'],
    iframe: 'https://pitchr.vercel.app/',
    img: '/pitchr.png',
    links: [
      { type: 'website', url: 'https://pitchr.vercel.app' },
    ],
  },
  {
    id: 'unicom',
    name: 'UNICOM',
    tag: 'JEE: Compliance Management for Enterprises',
    description: `Project Unicom Project is a web app developed for JEE to present need compliance with regulations.`,
    technologies: ['ExpressJS', 'React'],
    iframe: 'https://unicomreport.netlify.app/home',
    links: [
      { type: 'website', url: 'https://unicomreport.netlify.app/' },
      {
        type: 'video',
        url: 'https://user-images.githubusercontent.com/55337742/241769519-0da29dbd-d2e7-49e0-a463-bd074a7c4e11.mp4',
      },
    ],
    img: 'unicom.png',
  },
  {
    id: 'cyberstream',
    name: 'CyberStream',
    tag: 'Explore IMDB Database with SDK & Electron App',
    description: 'CyberStream is a **comprehensive movie discovery platform** that generates 10 new random movies on every load from the IMDB database.\n\n**Key Features:**\n\n- **Random Movie Generation**: Loads 10 new random movies on every page load as required in the assessment document\n- **Robust Search**: Navigate directly to movie details with efficient search functionality\n- **Cross-Platform**: Works seamlessly on web and desktop (Electron app)\n\n**Technical Implementation:**\n\n1. **Web Application**: Deployed on Vercel with real-time movie data fetching\n2. **JavaScript SDK**: Separately deployed on NPM (`cyber-stream-sdk`) for business logic separation\n3. **Electron App**: Desktop application with the same business logic for cross-platform compatibility\n\n**Project Requirements Fulfilled:**\n\n- ✅ Web app with random movie generation and search\n- ✅ Separately deployed SDK on NPM\n- ✅ Electron app with the same business logic\n\nThe application gracefully handles network delays and provides a smooth user experience even when loading completely random movies.',
    technologies: ['Electron', 'React', 'Tsup Bundler', 'IMDB API', 'NPM', 'Vercel'],
    iframe: 'https://cyberstream.vercel.app',
    links: [
      { type: 'live-demo', url: 'https://cyberstream.vercel.app' },
      { type: 'npm-package', url: 'https://www.npmjs.com/package/cyber-stream-sdk' },
      { type: 'github', url: 'https://github.com/tomideadeoye/cyberstream' },
      { type: 'video', url: 'https://github.com/tomideadeoye/merislabs-github-media/raw/main/tutorials/cyberstream-sdk/CyberStream%20JavaScript%20SDK%20Complete%20Walkthrough%3A%20Integrating%20IMDB%20Movie%20Data%20API%20with%20NPM%20Package%20Installation%2C%20Random%20Movie%20Generation%2C%20Search%20Functionality%2C%20and%20Cross-Platform%20Electron%20App%20Development%20Tutorial.mp4' },
    ],
    img: '/cyberstream.png',
  },
  {
    id: 'price-history-chart',
    name: 'Price History Chart',
    description:
      "Built a candlestick chart to describe price movements of a cryptocurrencies.  Each 'candlestick' typically shows one day, thus a one-month chart may show the 20 trading days as 20 candlesticks. Candlestick charts can also be built using intervals shorter or longer than one day.",
    technologies: ['React', 'Binance API', 'Apex Charts'],
    iframe: 'https://sisyphus-tomide.vercel.app',
    tag: 'PROPRIETARY: live Rate Conversion Data',
    links: [
      { type: 'website', url: 'https://sisyphus-tomide.vercel.app/' },
      {
        type: 'video',
        url: 'https://user-images.githubusercontent.com/55337742/241746561-b4bbc74e-9729-4285-bf09-e1d830ed323e.mp4',
      },
    ],
    img: '/cyberstream.png',
  },
  {
    id: 'qtf-energy-solutions',
    name: 'QTF Energy Solutions',
    description: 'Company website with Slack Integration for Demo Requests',
    technologies: ['NextJs', 'Slack APIs', 'SendGrid'],
    iframe: 'https://www.qtfenergy.com/',
    tag: 'PROPRIETARY: live Rate Conversion Data',
    links: [{ type: 'website', url: 'https://www.qtfenergy.com/' }],
    img: '/qtf.png',
  },
  {
    id: 'juice-spend',
    name: 'JUICE SPEND',
    tag: 'JUICE: Liquidity Provider for Enterprises',
    description:
      'Beta website of crypto payment startup. Juice helps African businesses make global payments with local currency.',
    technologies: ['React', 'Material UI'],
    iframe: 'https://tomidejuiceui.netlify.app/',
    links: [
      { type: 'website', url: 'https://tomidejuiceui.netlify.app/' },
      {
        type: 'video',
        url: 'https://user-images.githubusercontent.com/55337742/211080250-419b92a5-7ef0-423a-be4a-2e0658dca314.mov',
      },
    ],
    img: 'juice.png',
  },
  {
    id: 'experi-by-hiyalo',
    name: 'EXPERI by Hiyalo',
    tag: 'Property search and listing platform',
    description: `A web app to search and list properties.`,
    technologies: ['NextJS', 'tRPC', 'Drizzle ORM', 'T3 Stack', 'Clerk Auth'],
    links: [{ type: 'website', url: 'https://experi-nine.vercel.app/' }],
    iframe: 'https://experi-nine.vercel.app/',
    img: '/experi.png',
  },
  {
    id: 'dukka',
    name: 'DUKKA',
    description:
      'Book keeping App for SMEs created for Dukka Inc. The company aims to build the os for e-commerce in Africa and competes with other providers like Bumpa.',
    technologies: ['flutter', 'django'],
    iframe: 'https://dukka.com',
    img: '/software3.png',
    tag: 'DUKKA: Book Keeping for SMEs',
    links: [
      { type: 'website', url: 'https://dukka.com' },
      { type: 'google-play-store', url: 'https://play.google.com/store/apps/details?id=com.dukka.dukka&pli=1' }
    ],
  },
  {
    id: 'dexter',
    name: 'DEXTER',
    description: `I developed Project Dexter, an analytics platform during my tenure as a Fullstack Developer at Dukka (April 2022 - June 2023). It's a business intelligence dashboard built with React/Django that serves as a data analytics and visualization tool for small and medium enterprise (SME) merchants.

**Key Features and Functionality**
- **Merchant Analytics Dashboard**: I built a dashboard that visualizes key metrics for over 80,000 merchants using Dukka's platform
- **Data Accuracy Improvement**: I improved data accuracy by 40% through proper data modeling and React Query implementation
- **User Retention Analysis**: I identified features linked to approximately 60% customer attrition, directly informing critical product strategy pivots
- **Business Intelligence**: I extracted and analyzed customer, sales agent, and merchant data to visualize acquisition, activity, LTV (Lifetime Value), and churn patterns
- **Referral System**: I implemented a referral system component that contributed to acquiring 80,000+ merchants and 100+ sales agents
- **Smart Data Aggregation**: The application receives JSON data which I convert into a table, then aggregates signups by city. I handled unstructured city data through intelligent aliasing (e.g., recognizing that "Lagos Island", "Victoria Island", and "Surulari" are all part of Lagos)
- **Performance Tracking**: I built monitoring for signups, active users, and field agents engaging in the signup process
- **Leaderboard**: I created a simple computation that searches through filters for the highest performing referrer in the program
- **Applicant Monitoring**: I implemented a notification badge that leads to the applicants page, monitoring the number of applicants looking to get into the program
- **Excel Export**: I added a button that downloads an Excel file by converting the JSON data in the table using the XLSX library

**Technical Implementation**
- Frontend: React.js
- Backend: Django (Python)
- Architecture: I led the transition from monolithic codebase to microservices architecture
- Deployment: I implemented containerization with Docker for scalable deployments
- Database: PostgreSQL

**Business Impact**
- User Acquisition: I drove the acquisition of 80,000+ merchants and 100+ sales agents
- Data-Driven Decisions: I enabled data-driven business decisions for over 80,000 merchants
- Product Development: I accelerated product development cycles by identifying pain points through data insights
- User Engagement: I improved overall user engagement by 25%
- Customer Retention: I reduced customer churn through actionable insights
- New User Acquisition: I contributed to acquiring over 10,000 new users

**Key Achievements**
- I led frontend development of the analytics platform, visualizing key metrics for 80k+ merchants
- I improved data accuracy by 40% and enabled data-driven business decisions
- I developed Python scripts analyzing user retention, identifying a feature linked to ~60% customer attrition
- I led the transition from a monolithic codebase to a microservices architecture
- I implemented containerization with Docker for scalable deployments
- I built two new products using Django and React frameworks, reducing time-to-market by 30%`,
    technologies: ['Django', 'Python', 'React', 'PostgreSQL', 'Docker'],
    image: 'software2.png',
    img: '/software2.png',
    tag: 'DUKKA: Analytics for company internal teams',
    links: [
      { type: 'website', url: 'dexter.dukka.com' },
      { type: 'video', url: 'https://github.com/tomideadeoye/merislabs-github-media/raw/main/9-to-5/Dexter%20Platform%20Complete%20Walkthrough%20Business%20Intelligence%20Dashboard%20for%20SME%20Merchants%20with%20Data%20Aggregation%20Analytics%20and%20Excel%20Export%20Features.mp4' }
    ],
  },
];

export { projects };

interface Reviews {
  name: string;
  review: string;
  image: string;
  company: string;
  link?: string;
  role?: string;
}

export interface Deck {
  title: string;
  iframe: string;
  link: string;
  client: string;
  tags: string[];
}

export const reviews: Reviews[] = [
  {
    name: 'Obefemi Agaba',
    review:
      'The team assisted us in creating a compliance web application which our client needed. The team was very professional and helpful. We highly recommend them.',
    image: `https://d2dzik4ii1e1u6.cloudfront.net/images/lexology/authorv2/squaretop/8274e25e-1290-4f96-a8c8-15351cf48bbf/W144/H144/20000101000000/photo.jpg`,
    company: 'Jackson, Etti & Edu',
    link: 'https://www.linkedin.com/in/obafemi-agaba-97b2041b/',
    role: 'Managing Partner',
  },
  {
    name: 'Tobi Olayiwola',
    review:
      'We have spun up to web applications working with MeriLabs. The team not only did those in record time but assisted us in integrating forms in the Apps with our Slackbot',
    image: `https://res.cloudinary.com/dnosyydcn/image/upload/v1708534489/merislabs/tobi_ft9rmw.jpg`,
    company: 'QorePay Technologies',
    link: 'https://www.qorepay.com/about',
    role: 'CTO',
  },
  {
    name: 'Timileyin Idowu',
    review:
      'MerisLabs built us PitchR and assisted in linking this with multiple channels to create a platform facilitating good deal flow.',
    image: `https://res.cloudinary.com/dnosyydcn/image/upload/v1708538644/merislabs/u8rgho2qrhlvwzny4ewe.jpg`,
    company: 'PitchR',
    link: 'https://www.linkedin.com/in/timileyin-idowu-507523146/',
    role: 'Consultant',
  },
];
// All deck data is now in this file
export const decks: Deck[] = [
  {
    title: 'African Startup Review presentation for Timi',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/uSHyLAV4WE3y4D?hostedIn=slideshare&page=upload',
    link: 'https://www.slideshare.net/slideshow/embed_code/key/uSHyLAV4WE3y4D?hostedIn=slideshare&page=upload',
    client: 'Timileyin Idowu',
    tags: ['Africa', 'Startup', 'Review', 'Presentation', 'Timi'],
  },
  {
    title: 'DeFi Protocols: Business Models, Revenue Streams, and Sustainability',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/2ElMQ82Etd1bLI?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/defi-protocols-business-models-revenue-streams-and-sustainability-72a2/276257056',
    client: 'MerisLabs',
    tags: ['DeFi', 'Finance', 'Protocols', 'Business Models', 'Sustainability'],
  },
  {
    title: 'Digital Transformation in Education: Trends, Frameworks, and Case Studies',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/3XmCVcUAFXfCK2?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/digital-transformation-in-education-trends-frameworks-and-case-studies/276191841',
    client: 'MerisLabs',
    tags: ['Education', 'Digital Transformation', 'Frameworks', 'Case Studies'],
  },
  {
    title: 'Legal Pages Magazine: Law, COVID-19, and Technology',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/znd08lqf8TBWsD?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/legal-pages-magazine-law-covid-19-and-technology/276181658',
    client: 'MerisLabs',
    tags: ['Law', 'COVID-19', 'Technology', 'Magazine'],
  },
  {
    title: 'Understanding Nigerian Taxes A Comprehensive Handbook for Tax Enthusiasts.pdf',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/6wUr7amntGCswB?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/understanding-nigerian-taxes-a-comprehensive-handbook-for-tax-enthusiasts-pdf/276163470',
    client: 'MerisLabs',
    tags: ['Tax', 'Nigeria', 'Handbook', 'Finance'],
  },
  {
    title: 'The Nigerian Insurance Industry An Overview of the Regulatory & Commercial Landscape - Obafemi Agaba .pdf',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/NINRrQFB4UdTre?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/the-nigerian-insurance-industry-an-overview-of-the-regulatory-commercial-landscape-obafemi-agaba-pdf/276154806',
    client: 'MerisLabs',
    tags: ['Insurance', 'Nigeria', 'Regulation', 'Commerce'],
  },
  {
    title: 'VerifyPro: A real estate management pitch deck',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/C0cFij9FGAU0Hg?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/verifypro-a-real-estate-management-pitch-deck/276153996',
    client: 'MerisLabs',
    tags: ['Real Estate', 'Management', 'Pitch Deck'],
  },
  {
    title: 'AI IN FRAUD DETECTION; TOMIDE ADEOYE.pdf',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/whmgP1moV0ydMl?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/ai-in-fraud-detection-tomide-adeoye-pdf/276133039',
    client: 'MerisLabs',
    tags: ['AI', 'Fraud Detection', 'Finance'],
  },
  {
    title: 'A Tech-Driven Approach to Land Ownership Transparency',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/tIpfebzR67BwPW?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/a-tech-driven-approach-to-land-ownership-transparency/276130608',
    client: 'MerisLabs',
    tags: ['Land Ownership', 'Transparency', 'Tech'],
  },
  {
    title: 'JEE Data Protection Newsletter - January 2025 - MerisLabs.pdf',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/KmM7Ofqe4N4hTi?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/jee-data-protection-newsletter-january-2025-merislabs-pdf/275746018',
    client: 'MerisLabs',
    tags: ['Data Protection', 'Newsletter', '2025'],
  },
  {
    title: 'Nigerian Tax Research Network Presentation; Tomide Adeoye.ppsx',
    iframe: 'https://www.slideshare.net/slideshow/embed_code/key/tsTd0FoVFnfeS?startSlide=1',
    link: 'https://www.slideshare.net/slideshow/nigerian-tax-research-network-presentation-tomide-adeoye-ppsx/274809170',
    client: 'MerisLabs',
    tags: ['Tax', 'Nigeria', 'Research', 'Presentation'],
  },
  {
    title: 'Copy of Blue Home Decor Interior Design Presentation',
    iframe: 'https://www.canva.com/design/DAGhK2aVnRo/TyrIsHbSZJYBokRxZZ8VeA/view?embed',
    link: 'https://www.canva.com/design/DAGhK2aVnRo/TyrIsHbSZJYBokRxZZ8VeA/view?utm_content=DAGhK2aVnRo&utm_campaign=designshare&utm_medium=embeds&utm_source=link',
    client: 'Tomide Adeoye',
    tags: ['Interior Design', 'Home Decor', 'Presentation'],
  },
  {
    title: 'TLcom Assessment  ',
    iframe: 'https://www.canva.com/design/DAFetMaQ5jQ/M67_tLZX0yVEYVOgyGw0Gg/view?embed',
    link: 'https://www.canva.com/design/DAFetMaQ5jQ/M67_tLZX0yVEYVOgyGw0Gg/view?utm_content=DAFetMaQ5jQ&utm_campaign=designshare&utm_medium=embeds&utm_source=link',
    client: 'Adeoye Tomide',
    tags: ['Assessment', 'TLcom'],
  },
  {
    title: 'Kuramo Investment paper - Timileyin Idowu',
    iframe: 'https://www.canva.com/design/DAGJjBzb9RQ/pLJHolL-ZO-8gQUMZ42dMw/view?embed',
    link: 'https://www.canva.com/design/DAGJjBzb9RQ/pLJHolL-ZO-8gQUMZ42dMw/view?utm_content=DAGJjBzb9RQ&utm_campaign=designshare&utm_medium=embeds&utm_source=link',
    client: 'Timileyin Idowu',
    tags: ['Investment', 'Kuramo'],
  },
  {
    title: 'Copy of QOREPAY DECK (SALES)',
    iframe: 'https://www.canva.com/design/DAGhKw2BNsw/reaCdwf5J9FTklFUaeFZIg/view?embed',
    link: 'https://www.canva.com/design/DAGhKw2BNsw/reaCdwf5J9FTklFUaeFZIg/view?utm_content=DAGhKw2BNsw&utm_campaign=designshare&utm_medium=embeds&utm_source=link',
    client: 'Tomide Adeoye',
    tags: ['QOREPAY', 'Sales', 'Deck'],
  },
  {
    title:
      "Copy of Businesses in Africa struggle with: - Poor customer service - High operational costs - Limited access to skilled outsourcing solutions Global BPO providers do not fully cater to Africa's unique needs.",
    iframe: 'https://www.canva.com/design/DAGnUK85WoQ/6_wLW_7NDbcCUnJLcnW1uQ/view?embed',
    link: 'https://www.canva.com/design/DAGnUK85WoQ/6_wLW_7NDbcCUnJLcnW1uQ/view?utm_content=DAGnUK85WoQ&utm_campaign=designshare&utm_medium=embeds&utm_source=link',
    client: 'Tomide Adeoye',
    tags: ['Africa', 'Customer Service', 'BPO', 'Operations'],
  },
];
