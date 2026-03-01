import Link from 'next/link';
import { FaRobot, FaBalanceScale, FaCreditCard, FaChartLine, FaLightbulb, FaCode, FaGlobe, FaFileAlt } from 'react-icons/fa';
import { serviceCategories } from '@/data/services';

export default function Features() {
  const offerings = [
    {
      name: 'AI Automation',
      description: 'Autonomous AI workflows, document automation, and executive AI assistants powered by Orion.',
      icon: <FaRobot />,
      link: '/services/ai-automation',
      color: 'from-purple-600 to-blue-600',
    },
    {
      name: 'Browser Automation',
      description: 'Automate web workflows, form filling, and data extraction at enterprise scale.',
      icon: <FaGlobe />,
      link: '/services/browser-automation',
      color: 'from-cyan-600 to-blue-600',
    },
    {
      name: 'Pitch Deck Automation',
      description: 'Reduce deck creation from days to 1 hour with automated slide generation and PDF export.',
      icon: <FaFileAlt />,
      link: '/services/ai-automation#pitch-deck-automation',
      color: 'from-pink-600 to-rose-600',
    },
    {
      name: 'LegalTech',
      description: 'Compliance automation, litigation dashboards, and legal API infrastructure.',
      icon: <FaBalanceScale />,
      link: '/services/legaltech',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      name: 'FinTech',
      description: 'Payment gateways, merchant analytics, KYC/AML systems, and core banking ledgers.',
      icon: <FaCreditCard />,
      link: '/services/fintech',
      color: 'from-green-600 to-emerald-600',
    },
    {
      name: 'Data & BI',
      description: 'Retention analysis, business intelligence dashboards, and real-time analytics.',
      icon: <FaChartLine />,
      link: '/services/data-engineering',
      color: 'from-orange-600 to-red-600',
    },
    {
      name: 'CTO Advisory',
      description: 'Technical due diligence, product strategy, and CTO-as-a-Service for startups.',
      icon: <FaLightbulb />,
      link: '/services/cto-advisory',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      name: 'Custom Development',
      description: 'Full-stack web, mobile apps, and cloud solutions tailored to your needs.',
      icon: <FaCode />,
      link: '/services',
      color: 'from-gray-600 to-gray-700',
    },
  ];

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Our Services</h2>
            <p className="text-xl text-gray-400">
              From AI automation to FinTech infrastructure, we build technology solutions that drive business growth.
            </p>
          </div>

          {/* Items */}
          <div
            className="max-w-sm mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 items-start md:max-w-2xl lg:max-w-none"
            data-aos-id-blocks
          >
            {offerings.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="relative flex flex-col items-center group cursor-pointer"
                data-aos="fade-up"
              >
                <div className={`w-16 h-16 mb-4 flex p-2 justify-center items-center text-white bg-gradient-to-br ${item.color} rounded-full transition duration-150 ease-in-out group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h4 className="h4 mb-2 text-white">{item.name}</h4>
                <p className="text-lg text-gray-400 text-center">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
