export interface Project {
  name: string;
  description: string;
  technologies: string[];
  video?: string;
  image?: string;
  iframe?: string;
  tag: string;
  links: [string, string][];
  img: string;
}

const projects: Project[] = [
  {
    name: "QorePay Payment Gateway",
    tag: "QOREPAY: Payment settlement for Nigerian Businesses",
    description:
      "QorePay is a payment app that allows users to send and receive money from anywhere in the world. It also allows users to pay bills, buy airtime, and make transfers to bank accounts.",
    technologies: ["ExpressJs", "React/NextJs", "AWS"],
    iframe: "https://qorepay.com",
    img: "/qorepay.png",
    links: [
      ["website", "https://qorepay.com/"],
      [
        "video",
        "https://user-images.githubusercontent.com/55337742/268929386-345b9e34-a559-417e-b957-3f9971a77ecb.mp4",
      ],
    ],
  },
  {
    name: "PitchR",
    tag: "Business funding for startups",
    description:
      "PitchR provides advisory services for startups to grow their businesses.",
    technologies: ["NextJs"],
    iframe: "https://www.pitchr.africa/",
    img: "/pitchr.png",

    links: [
      ["website", "https://pitchr.africa/"],
      [
        "video",
        "https://user-images.githubusercontent.com/55337742/268929386-345b9e34-a559-417e-b957-3f9971a77ecb.mp4",
      ],
    ],
  },
  {
    name: "UNICOM",
    tag: "JEE: Compliance Management for Enterprises",
    description: `Project Unicom Project is a web app developed for JEE to present need compliance with regulations.`,
    technologies: ["ExpressJS", "React"],
    iframe: "https://unicomreport.netlify.app/home",
    links: [
      ["website", "https://unicomreport.netlify.app/"],
      [
        "video",
        "https://user-images.githubusercontent.com/55337742/241769519-0da29dbd-d2e7-49e0-a463-bd074a7c4e11.mp4",
      ],
    ],
    img: "unicom.png",
  },
  {
    name: "CyberStream",
    tag: "Explore IMDB Database",
    description:
      "Get IMDB movie details from website or add javascript SDK package to you app",
    technologies: ["Electron", "React", "Tsup Bundler"],
    iframe: "https://cyberstream.vercel.app",
    links: [
      ["NPM Package", "https://www.npmjs.com/package/cyber-stream-sdk"],
      ["Website", "https://cyberstream.vercel.app"],
    ],
    img: "/cyberstream.png",
  },
  {
    name: "Price History Chart",
    description:
      "Built a candlestick chart to describe price movements of a cryptocurrencies.  Each 'candlestick' typically shows one day, thus a one-month chart may show the 20 trading days as 20 candlesticks. Candlestick charts can also be built using intervals shorter or longer than one day.",
    technologies: ["React", "Binance API", "Apex Charts"],

    iframe: "https://sisyphus-tomide.vercel.app",
    tag: "PROPRIETARY: live Rate Conversion Data",
    links: [
      ["website", "https://sisyphus-tomide.vercel.app/"],
      [
        "video",
        "https://user-images.githubusercontent.com/55337742/241746561-b4bbc74e-9729-4285-bf09-e1d830ed323e.mp4",
      ],
    ],
    img: "/cyberstream.png",
  },
  {
    name: "QTF Energy Solutions",
    description: "Company website with Slack Integration for Demo Requests",
    technologies: ["NextJs", "Slack APIs", "SendGrid"],
    iframe: "https://www.qtfenergy.com/",
    tag: "PROPRIETARY: live Rate Conversion Data",
    links: [["website", "https://www.qtfenergy.com/"]],
    img: "/qtf.png",
  },
  {
    name: "JUICE SPEND",
    tag: "JUICE: Liquidity Provider for Enterprises",
    description:
      "Beta website of crypto payment startup. Juice helps African businesses make global payments with local currency.",
    technologies: ["React", "Material UI"],
    iframe: "https://tomidejuiceui.netlify.app/",
    links: [
      ["website", "https://tomidejuiceui.netlify.app/"],
      [
        "video",
        "https://user-images.githubusercontent.com/55337742/211080250-419b92a5-7ef0-423a-be4a-2e0658dca314.mov",
      ],
    ],
    img: "juice.png",
  },
  {
    name: "EXPERI by Hiyalo",
    tag: "Property search and listing platform",
    description: `A web app to search and list properties.`,
    technologies: ["NextJS", "tRPC", "Drizzle ORM", "T3 Stack", "Clerk Auth"],
    links: [["website", "https://experi-nine.vercel.app/"]],
    iframe: "https://experi-nine.vercel.app/",
    img: "/experi.png",
  },
  {
    name: "DUKKA",
    description:
      "Book keeping App for SMEs created for Dukka Inc. The company aims to build the os for e-commerce in Africa and competes with other providers like Bumpa.",
    technologies: ["flutter", "django"],
    iframe: "https://dukka.com",
    img: "/software3.png",
    tag: "DUKKA: Book Keeping for SMEs",
    links: [["website", "https://dukka.com"]],
  },
  {
    name: "DEXTER",
    description:
      "Analyses company user signups, churn, & more for informed business decisions.",
    technologies: ["Django", "Python", "React"],
    image: "software2.png",
    img: "/software2.png",
    tag: "DUKKA: Analytics for company internal teams",
    links: [["website", "dexter.dukka.com"]],
  },
  {
    name: `Lexology`,
    description: `Natural Language Processing pipelines to extract key legal concepts and trends from a vast corpus of legal documents.`,
    image: `https://picsum.photos/144/144`,
    tag: `Legal Tech, NLP`,
    technologies: [`Python`, `NLTK`, `spaCy`],
    img: `https://picsum.photos/144/144`,
    links: [["website", "#"]],
  },
  {
    name: `Meris`,
    description: `Placeholder description.`,
    image: `https://picsum.photos/200/200`,
    tag: 'Placeholder',
    technologies: ['React', 'Next.js'],
    img: `https://picsum.photos/200/200`,
    links: [["website", "#"]],
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

export const reviews: Reviews[] = [
  {
    name: "Obefemi Agaba",
    review:
      "The team assisted us in creating a compliance web application which our client needed. The team was very professional and helpful. We highly recommend them.",
    image: `https://res.cloudinary.com/dnosyydcn/image/upload/v1708534489/merislabs/tobi_ft9rmw.jpg`,
    company: "Jackson, Etti & Edu",
    link: "https://www.linkedin.com/in/obafemi-agaba-97b2041b/",
    role: "Managing Partner",
  },
  {
    name: "Tobi Olayiwola",
    review:
      "We have spun up to web applications working with MeriLabs. The team not only did those in record time but assisted us in integrating forms in the Apps with our Slackbot",
    image: `https://res.cloudinary.com/dnosyydcn/image/upload/v1708534489/merislabs/tobi_ft9rmw.jpg`,
    company: "QorePay Technologies",
    link: "https://www.qorepay.com/about",
    role: "CTO",
  },
  {
    name: "Timileyin Idowu",
    review:
      "MerisLabs built us PitchR and assisted in linking this with multiple channels to create a platform facilitating good deal flow.",
    image: `https://res.cloudinary.com/dnosyydcn/image/upload/v1708538644/merislabs/u8rgho2qrhlvwzny4ewe.jpg`,
    company: "PitchR",
    link: "https://www.linkedin.com/in/timileyin-idowu-507523146/",
    role: "Consultant",
  },
];
