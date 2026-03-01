import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StructuredData } from '@/components/seo';
import { generatePageSEO } from '@/lib/seo';
import { serviceCategories, getCategoryBySlug } from '@/data/services';
import Link from 'next/link';
import { CheckCircle, DollarSign, Users, Package, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata for each service category
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Service Not Found',
      description: 'The requested service category was not found.',
    };
  }

  return generatePageSEO({
    title: `${category.name} | Meris Labs`,
    description: category.description,
    keywords: category.services.flatMap(s => [s.name, ...s.features]),
    path: `/services/${slug}`,
    type: 'website',
  });
}

// Generate static params for all categories
export function generateStaticParams() {
  return serviceCategories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function ServiceCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: category.name,
    description: category.description,
    provider: {
      '@type': 'Organization',
      name: 'Meris Labs',
      url: 'https://merislabs.com',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: category.name,
      itemListElement: category.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <StructuredData data={categorySchema} />
      
      {/* Header */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`} />
        <div className="max-w-6xl mx-auto relative z-10">
          <Link
            href="/services"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
          
          <div className="flex items-center mb-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-4xl mr-6`}>
              {category.icon}
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-2">{category.name}</h1>
              <p className="text-xl text-gray-300">{category.services.length} services available</p>
            </div>
          </div>
          
          <p className="text-2xl text-gray-300 max-w-4xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Our {category.name} Services</h2>
          
          <div className="space-y-8">
            {category.services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 scroll-mt-24"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Info */}
                  <div className="lg:col-span-2">
                    <h3 className="text-3xl font-bold mb-4 text-white">{service.name}</h3>
                    <p className="text-xl text-gray-300 mb-6">{service.description}</p>
                    
                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3 text-purple-300">Key Features</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Pricing */}
                    {service.pricing && (
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center mb-3">
                          <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                          <span className="text-sm font-semibold text-gray-300">Starting at</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                          {service.pricing.starting}
                        </div>
                        <div className="text-sm text-gray-400">
                          {service.pricing.model === 'project' ? 'Per project' : 
                           service.pricing.model === 'retainer' ? 'Per month' : 'Per hour'}
                        </div>
                      </div>
                    )}

                    {/* Ideal For */}
                    <div className="bg-gray-700/50 rounded-xl p-6">
                      <div className="flex items-center mb-3">
                        <Users className="w-5 h-5 text-blue-400 mr-2" />
                        <span className="text-sm font-semibold text-gray-300">Ideal for</span>
                      </div>
                      <ul className="space-y-2">
                        {service.idealFor.slice(0, 4).map((item) => (
                          <li key={item} className="text-sm text-gray-300 flex items-start">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="bg-gray-700/50 rounded-xl p-6">
                      <div className="flex items-center mb-3">
                        <Package className="w-5 h-5 text-purple-400 mr-2" />
                        <span className="text-sm font-semibold text-gray-300">Technologies</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-gray-600 text-gray-200 px-3 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`mailto:hello@merislabs.com?subject=Inquiry about ${service.name}`}
                      className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-all"
                    >
                      Get a Quote
                    </Link>
                  </div>
                </div>

                {/* Deliverables */}
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <h4 className="text-lg font-semibold mb-3 text-purple-300">What You'll Receive</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {service.deliverables.map((deliverable) => (
                      <div key={deliverable} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      {category.caseStudies && category.caseStudies.length > 0 && (
        <section className="py-20 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12">Case Studies</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {category.caseStudies.map((caseStudy) => (
                <div key={caseStudy.name} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-2">{caseStudy.name}</h3>
                  <p className="text-purple-400 mb-4">{caseStudy.client}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Challenge</h4>
                      <p className="text-gray-300">{caseStudy.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Solution</h4>
                      <p className="text-gray-300">{caseStudy.solution}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Results</h4>
                      <ul className="space-y-2">
                        {caseStudy.results.map((result) => (
                          <li key={result} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {caseStudy.link && (
                    <Link
                      href={caseStudy.link}
                      className="inline-flex items-center mt-6 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View Project <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss how our {category.name.toLowerCase()} services can help your business.
          </p>
          <Link
            href="mailto:hello@merislabs.com"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
