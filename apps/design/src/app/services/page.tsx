import type { Metadata } from 'next';
import Link from 'next/link';
import { StructuredData } from '@/components/seo';
import { generatePageSEO, seoPresets, generateSoftwareSchema } from '@/lib/seo';
import { serviceCategories } from '@/data/services';
import { ArrowRight, Code, Lightbulb, BarChart3, CreditCard, Scale, Globe, FileText, Bot } from 'lucide-react';

export const metadata: Metadata = generatePageSEO({
  ...seoPresets.services,
  title: 'Our Services - AI Automation, FinTech, LegalTech & More',
  description: 'Comprehensive technology services including AI automation, browser automation, pitch deck automation, LegalTech, FinTech, data engineering, and CTO advisory. Transform your business with Meris Labs.',
  keywords: [
    'AI automation',
    'browser automation',
    'pitch deck automation',
    'LegalTech',
    'FinTech development',
    'business intelligence',
    'CTO advisory',
    'software development',
    'document automation',
    'compliance automation',
  ],
  path: '/services',
  image: '/images/services-og-image.png',
});

const categoryIcons: Record<string, any> = {
  'ai-automation': Bot,
  'browser-automation': Globe,
  'legaltech': Scale,
  'fintech': CreditCard,
  'data-engineering': BarChart3,
  'cto-advisory': Lightbulb,
};

export default function ServicesPage() {
  const organizationSchema = generateSoftwareSchema({
    name: 'Meris Labs Services',
    description: 'AI Automation, FinTech, LegalTech, and Custom Software Development',
    url: 'https://merislabs.com/services',
    applicationCategory: 'BusinessApplication',
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <StructuredData data={organizationSchema} />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From AI automation to FinTech infrastructure, we build technology solutions that drive business growth and operational efficiency.
            </p>
          </div>

          {/* Service Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category) => {
              const Icon = categoryIcons[category.id] || Code;
              return (
                <Link
                  key={category.id}
                  href={`/services/${category.slug}`}
                  className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  <div className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 mb-6 line-clamp-3">
                    {category.description}
                  </p>
                  <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  {/* Service count badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
                      {category.services.length} services
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Meris Labs?</h2>
            <p className="text-xl text-gray-400">Proven expertise across multiple domains</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '5+',
                label: 'Service Categories',
                description: 'From AI to FinTech',
              },
              {
                number: '95%',
                label: 'Time Savings',
                description: 'Average automation ROI',
              },
              {
                number: '80k+',
                label: 'Merchants Supported',
                description: 'Via Dexter platform',
              },
              {
                number: '$Millions',
                label: 'Transactions Processed',
                description: 'Via QorePay gateway',
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss how we can help you achieve your goals with custom technology solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:hello@merislabs.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Get a Free Consultation
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg font-semibold text-white hover:bg-gray-700 transition-all"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
