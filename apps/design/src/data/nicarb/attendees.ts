export interface AttendeeProfile {
  id: string;
  name: string;
  title: string;
  organization?: string;
  bio?: string;
  profilePictureUrl?: string;
  type: 'individual' | 'company' | 'organization';
  role: 'speaker' | 'attendee' | 'organizer' | 'sponsor';
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export const attendeeProfiles: Record<string, AttendeeProfile> = {
  // Planning Committee
  'bolaji-ayorinde': {
    id: 'bolaji-ayorinde',
    name: 'Chief Bolaji Ayorinde, OFR, SAN, FCArb',
    title: 'Chairman, 2025 Annual Conference Planning Committee',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    bio: 'Chairman of the 2025 Annual Conference Planning Committee',
    profilePictureUrl: '/nicarb/attendee-images/Bolaji-Ayorinde-SAN-1200x725.jpg',
    type: 'individual',
    role: 'organizer',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/bolaji-ayorinde-2a9911275'
    }
  },
  'shola-oshodi-john': {
    id: 'shola-oshodi-john',
    name: 'Mrs. Shola Oshodi-John',
    title: 'Co-Chair',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/shola-oshodi-john.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'obosa-akpata': {
    id: 'obosa-akpata',
    name: 'Mrs. Obosa Akpata',
    title: 'Co-Chair',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/obosa-akpata.jpg',
    type: 'individual',
    role: 'organizer'
  },
  
  // Keynote Speakers
  'fabian-ajogwu': {
    id: 'fabian-ajogwu',
    name: 'Professor Fabian Ajogwu, OFR, SAN',
    title: 'President/Chairman, NICArb',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    bio: 'President and Chairman of NICArb',
    profilePictureUrl: '/nicarb/attendee-images/fabian ajogwu.jpeg',
    type: 'individual',
    role: 'speaker',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/prof-fabian-ajogwu-san-40909475/?originalSubdomain=ng'
    }
  },
  'wang-chengjie': {
    id: 'wang-chengjie',
    name: 'Wang Chengjie',
    title: 'Vice Chairman/Secretary General',
    organization: 'CIETAC',
    bio: 'Mr. Wang Chengjie is the Vice Chairman and Secretary-General of the China International Economic and Trade Arbitration Commission (CIETAC) and the Arbitration Center Across the Straits (ACAS). He also serves as the President of the Asian Domain Name Dispute Resolution Centre (ADNDRC), Vice Chairman of the China Maritime Arbitration Commission (CMAC), and Committee Member of the Asia Pacific Regional Arbitration Group (APRAG). With nearly 30 years of experience in dispute resolution, Mr. Wang has played a pivotal role in shaping arbitration and mediation practice in China and beyond. He has overseen numerous institutional reforms and capacity-building initiatives that have enhanced the credibility and efficiency of international arbitration in Asia. As an arbitrator and mediator, he has presided over and participated in hundreds of domestic and international cases involving trade, investment, maritime, intellectual property, and technology-related disputes. Mr. Wang also represents China in major international arbitration forums, contributing to dialogue on the development of global dispute resolution standards. He frequently lectures at universities and professional conferences on arbitration law, international trade, and cross-border dispute settlement. Through his leadership, CIETAC continues to strengthen its position as a leading arbitral institution in the Asia-Pacific region.',
    profilePictureUrl: '/nicarb/attendee-images/MR. WANG CHENGJIE.png',
    type: 'individual',
    role: 'speaker'
  },
  'afam-osigwe': {
    id: 'afam-osigwe',
    name: 'Mazi Afam Osigwe, SAN, FCIArb (UK)',
    title: 'President',
    organization: 'Nigerian Bar Association',
    bio: 'Mazi Afam Josiah Osigwe, SAN, is a distinguished legal practitioner, arbitrator, and the 32nd President of the Nigerian Bar Association (NBA), having assumed office in August 2024. A quintessential "Bar Man," he is renowned for his vast experience in legal practice and his longstanding commitment to the advancement of the legal profession in Nigeria.\n\nEducation & Qualifications\n\nHe graduated from the University of Nigeria, Enugu Campus, with a Bachelor of Laws (LL.B) in 1997 and was called to the Nigerian Bar in 1999. Demonstrating a commitment to continuous learning, he holds two Master of Laws (LL.M) degrees: one from the University of Jos (2010) and another in Transnational Commercial Practice from the Centre for International Legal Studies, Austria (in collaboration with Lazarski University, Poland).\n\nProfessional Career\n\nMazi Osigwe began his legal career at the chambers of Chike Chigbue & Co. in Abuja. In 2002, he founded Law Forte, a full-service law firm where he serves as Senior Partner. His practice expertise spans Corporate and Commercial Law, Banking, Intellectual Property, Litigation, and Financial Crimes defense.\n\nHe was appointed a Notary Public in 2006.\nHe became a Fellow of the Chartered Institute of Arbitrators (UK) in 2011.\nHe was elevated to the prestigious rank of Senior Advocate of Nigeria (SAN) in December 2020.\n\nService to the Bar\n\nPrior to his election as President, Mazi Osigwe served the Bar in numerous critical capacities:\n\nGeneral Secretary of the NBA (2014–2016).\nChairman, NBA Abuja Branch (Unity Bar).\nLife Bencher, serving on the Body of Benchers.\n\nHe is widely recognized for his advocacy regarding the welfare of lawyers, pro bono representation for the indigent, and sports development within the legal community.',
    profilePictureUrl: '/nicarb/attendee-images/afam-osigwe.jpg',
    type: 'individual',
    role: 'speaker'
  },
  'sanwo-olu': {
    id: 'sanwo-olu',
    name: 'His Excellency, Mr. Babajide Olusola Sanwo-Olu',
    title: 'Executive Governor',
    organization: 'Lagos State',
    bio: 'As the Chief Host, Governor Sanwo-Olu welcomes delegates to Lagos, the commercial nerve centre of Nigeria and a growing hub for international arbitration.',
    profilePictureUrl: '/nicarb/attendee-images/sanwo-olu.jpg',
    type: 'individual',
    role: 'speaker'
  },
  'anna-joubin-bret': {
    id: 'anna-joubin-bret',
    name: 'Anna Joubin-Bret',
    title: 'Secretary General',
    organization: 'UNCITRAL',
    bio: 'Secretary of the United Nations Commission on International Trade Law (UNCITRAL). She brings over three decades of experience in international investment law and arbitration.',
    profilePictureUrl: '/nicarb/attendee-images/ANNA_JOUBIN-BRET-removebg-preview.png',
    type: 'individual',
    role: 'speaker'
  },
  'lateef-fagbemi': {
    id: 'lateef-fagbemi',
    name: 'Chief Lateef Olasunkanmi Fagbemi, SAN',
    title: 'Honourable Minister of Justice and Attorney General of the Federation',
    organization: 'Federal Republic of Nigeria',
    bio: 'The Honourable Attorney General delivers a keynote address on the government\'s commitment to strengthening the legal framework for arbitration and ADR in Nigeria.',
    profilePictureUrl: '/nicarb/attendee-images/lateef-fagbemi.jpg',
    type: 'individual',
    role: 'speaker'
  },
  
  // Other Committee Members
  'olatunde-busari': {
    id: 'olatunde-busari',
    name: 'Mr. Olatunde Busari, SAN',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/olatunde-busari.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'funmi-roberts': {
    id: 'funmi-roberts',
    name: 'Mrs. Funmi Roberts',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/funmi-roberts.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'dele-aloko': {
    id: 'dele-aloko',
    name: 'Mr. Dele Aloko',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/dele-aloko.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'adebayo-adenipekun': {
    id: 'adebayo-adenipekun',
    name: 'Mr. Adebayo Adenipekun, SAN',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/adebayo-adenipekun.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'norrison-quakers': {
    id: 'norrison-quakers',
    name: 'Mr. Norrison Quakers, SAN',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/norrison-quakers.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'adedoyin-rhodes-vivour': {
    id: 'adedoyin-rhodes-vivour',
    name: 'Mrs. Adedoyin Rhodes-Vivour, SAN',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/adedoyin-rhodes-vivour.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'paul-idornigie': {
    id: 'paul-idornigie',
    name: 'Prof. Paul Idornigie, SAN',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/paul-idornigie.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'olufunlola-adekeye': {
    id: 'olufunlola-adekeye',
    name: 'Hon. Justice Olufunlola Adekeye (Rtd)',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/olufunlola-adekeye.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'moyosore-onigbanjo': {
    id: 'moyosore-onigbanjo',
    name: 'Mr. Moyosore Onigbanjo, SAN',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/moyosore-onigbanjo.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'seun-abimbola': {
    id: 'seun-abimbola',
    name: 'Mr. Seun Abimbola, SAN',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/seun-abimbola.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'adeyemi-agbelusi': {
    id: 'adeyemi-agbelusi',
    name: 'Dr. Adeyemi Agbelusi',
    title: 'Committee Member',
    organization: 'Nigerian Institute of Chartered Arbitrators',
    profilePictureUrl: '/nicarb/attendee-images/adeyemi-agbelusi.jpg',
    type: 'individual',
    role: 'organizer'
  },
  'festus-ogun': {
    id: 'festus-ogun',
    name: 'Festus Ogun',
    title: 'Partner',
    organization: 'FOLEGAL',
    bio: 'Festus Ogun is a Partner at FOLEGAL, a premier Nigerian disputes resolution Law Firm based in Lagos and he heads the litigation, arbitration and alternative dispute resolution team of the firm.\n\nHe routinely appears before high courts, industrial courts, appellate courts, and arbitral tribunals. He handles courtroom disputes and arbitration work related to labour and employment, banking and finance, energy and oil and gas, shipping and maritime, electoral and constitutional matters, and general contracts.\n\nThe Firm, under is leadership, recently launched FOLEGAL Mediation Centre which serves as a hub for fast, amicable and efficient resolution of commercial disputes.\n\nBeyond his dispute resolution work, Festus is the co-founder of Campaign for Justice Reform Initiative, a nonprofit advocating for justice system reforms, access to justice, and sustainable development in Nigeria.',
    profilePictureUrl: '/nicarb/attendee-images/Festus Ogun.jpeg',
    type: 'individual',
    role: 'speaker'
  },
  'hadiza-shagari': {
    id: 'hadiza-shagari',
    name: 'Hon. Justice Hadiza Shagari, JCA',
    title: 'Justice of the Court of Appeal',
    organization: 'Federal Republic of Nigeria',
    bio: "Hon. Justice Hadiza Rabi'u Shagari (JCA) was appointed to the Court of Appeal in 2023, after serving as a Judge of the Federal High Court since 2015. She began her judicial career as a Senior Magistrate in 2006, rising to Chief Magistrate II before her federal appointment. Prior to joining the judiciary, she worked at the Nigerian Ports Authority from 1994 to 2006, where she was involved in legal drafting, advisory services, and contract agreements. She served on federal government committees for maritime business forums and port development. A 1991 graduate of Usman Danfodiyo University with a combined LLB in Common Law & Sharia, she was called to the Bar in 1992. In 2021, she became a Fellow of the Nigerian Institute of Chartered Arbitrators. She has interests in marine and commercial law and advocates for transparency, integrity, and timely justice delivery.",
    profilePictureUrl: '/nicarb/attendee-images/Justice Hadiza Rabiu Shagari.jpeg',
    type: 'individual',
    role: 'speaker'
  }};