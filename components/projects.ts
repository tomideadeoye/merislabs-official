// GOAL OF FILE|FEATURES|FUNCTIONS:
// Exports the Project interface, projects array, and reviews array for use in the Zigzag component and others.
// FILEPATH: components/projects.ts
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - Used by components/zigzag.tsx
// - Media assets referenced in public/images/
// ASSUMPTIONS & CLEAR COMMENTS: // NOTE: Assumed all referenced images exist in public/images/ or public/
// NOTES: Consider consolidating project/review data, add more robust error handling/logging, and test for missing assets.

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  image?: string;
  iframe?: string;
  tag: string;
  links: [string, string][];
  img: string;
}

const projects: Project[] = [
  {
    name: 'QorePay Payment Gateway',
    tag: 'QOREPAY: Payment settlement for Nigerian Businesses',
    description:
      'QorePay is a payment app that allows users to send and receive money from anywhere in the world. It also allows users to pay bills, buy airtime, and make transfers to bank accounts.',
    technologies: ['ExpressJs', 'React/NextJs', 'AWS'],
    iframe: 'https://qorepay.com',
    img: '/qorepay.png',
    links: [
      ['website', 'https://qorepay.com/'],
      [
        'video',
        'https://user-images.githubusercontent.com/55337742/268929386-345b9e34-a559-417e-b957-3f9971a77ecb.mp4',
      ],
    ],
  },
  {
    name: 'PitchR',
    tag: 'Business funding for startups',
    description: 'PitchR provides advisory services for startups to grow their businesses.',
    technologies: ['NextJs'],
    iframe: 'https://www.pitchr.africa/',
    img: '/pitchr.png',
    links: [
      ['website', 'https://pitchr.africa/'],
      [
        'video',
        'https://user-images.githubusercontent.com/55337742/268929386-345b9e34-a559-417e-b957-3f9971a77ecb.mp4',
      ],
    ],
  },
  {
    name: 'UNICOM',
    tag: 'JEE: Compliance Management for Enterprises',
    description: `Project Unicom Project is a web app developed for JEE to present need compliance with regulations.`,
    technologies: ['ExpressJS', 'React'],
    iframe: 'https://unicomreport.netlify.app/home',
    links: [
      ['website', 'https://unicomreport.netlify.app/'],
      [
        'video',
        'https://user-images.githubusercontent.com/55337742/241769519-0da29dbd-d2e7-49e0-a463-bd074a7c4e11.mp4',
      ],
    ],
    img: 'unicom.png',
  },
  {
    name: 'CyberStream',
    tag: 'Explore IMDB Database',
    description: 'Get IMDB movie details from website or add javascript SDK package to you app',
    technologies: ['Electron', 'React', 'Tsup Bundler'],
    iframe: 'https://cyberstream.vercel.app',
    links: [
      ['NPM Package', 'https://www.npmjs.com/package/cyber-stream-sdk'],
      ['Website', 'https://cyberstream.vercel.app'],
    ],
    img: '/cyberstream.png',
  },
  {
    name: 'Price History Chart',
    description:
      "Built a candlestick chart to describe price movements of a cryptocurrencies.  Each 'candlestick' typically shows one day, thus a one-month chart may show the 20 trading days as 20 candlesticks. Candlestick charts can also be built using intervals shorter or longer than one day.",
    technologies: ['React', 'Binance API', 'Apex Charts'],
    iframe: 'https://sisyphus-tomide.vercel.app',
    tag: 'PROPRIETARY: live Rate Conversion Data',
    links: [
      ['website', 'https://sisyphus-tomide.vercel.app/'],
      [
        'video',
        'https://user-images.githubusercontent.com/55337742/241746561-b4bbc74e-9729-4285-bf09-e1d830ed323e.mp4',
      ],
    ],
    img: '/cyberstream.png',
  },
  {
    name: 'QTF Energy Solutions',
    description: 'Company website with Slack Integration for Demo Requests',
    technologies: ['NextJs', 'Slack APIs', 'SendGrid'],
    iframe: 'https://www.qtfenergy.com/',
    tag: 'PROPRIETARY: live Rate Conversion Data',
    links: [['website', 'https://www.qtfenergy.com/']],
    img: '/qtf.png',
  },
  {
    name: 'JUICE SPEND',
    tag: 'JUICE: Liquidity Provider for Enterprises',
    description:
      'Beta website of crypto payment startup. Juice helps African businesses make global payments with local currency.',
    technologies: ['React', 'Material UI'],
    iframe: 'https://tomidejuiceui.netlify.app/',
    links: [
      ['website', 'https://tomidejuiceui.netlify.app/'],
      [
        'video',
        'https://user-images.githubusercontent.com/55337742/211080250-419b92a5-7ef0-423a-be4a-2e0658dca314.mov',
      ],
    ],
    img: 'juice.png',
  },
  {
    name: 'EXPERI by Hiyalo',
    tag: 'Property search and listing platform',
    description: `A web app to search and list properties.`,
    technologies: ['NextJS', 'tRPC', 'Drizzle ORM', 'T3 Stack', 'Clerk Auth'],
    links: [['website', 'https://experi-nine.vercel.app/']],
    iframe: 'https://experi-nine.vercel.app/',
    img: '/experi.png',
  },
  {
    name: 'DUKKA',
    description:
      'Book keeping App for SMEs created for Dukka Inc. The company aims to build the os for e-commerce in Africa and competes with other providers like Bumpa.',
    technologies: ['flutter', 'django'],
    iframe: 'https://dukka.com',
    img: '/software3.png',
    tag: 'DUKKA: Book Keeping for SMEs',
    links: [['website', 'https://dukka.com']],
  },
  {
    name: 'DEXTER',
    description: 'Analyses company user signups, churn, & more for informed business decisions.',
    technologies: ['Django', 'Python', 'React'],
    image: 'software2.png',
    img: '/software2.png',
    tag: 'DUKKA: Analytics for company internal teams',
    links: [['website', 'dexter.dukka.com']],
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
