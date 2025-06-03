import Hero from "@/components/hero";
import Features from "@/components/features";
import Newsletter from "@/components/newsletter";
import Zigzag from "@/components/zigzag";
import Testimonials from "@/components/testimonials";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
      {/* Immersive Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center py-24 md:py-32">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 dark:text-yellow-100 text-center drop-shadow">
          MERISLABS
        </h1>
        <p className="text-lg md:text-2xl text-gray-500 dark:text-gray-300 mb-10 text-center max-w-2xl">
          We have experience in designing and developing web and mobile applications
          for various industries, from financial services to legal.
        </p>
        <a
          href="mailto:hello@merislabs.com"
          className="px-8 py-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold text-lg shadow-lg transition mb-8"
        >
          Drop an email
        </a>
      </section>

      {/* Feature Cards Section */}
      <section className="container mx-auto pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Journal</CardTitle>
              <CardDescription>Write and view journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Record your thoughts and reflections in a journal that's stored in memory.</p>
              <Link href="/journal">
                <Button>Open Journal</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memory Explorer</CardTitle>
              <CardDescription>Search and explore your memory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Search through your memory and add new memories of different types.</p>
              <Link href="/memory-explorer">
                <Button>Explore Memory</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opportunities</CardTitle>
              <CardDescription>Manage and evaluate opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Track and evaluate job opportunities, projects, and more.</p>
              <Link href="/opportunities">
                <Button>View Opportunities</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional sections for depth and content richness */}
      <Hero />
      <Features />
      <Zigzag />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
