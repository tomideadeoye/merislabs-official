import './css/style.css';
import Hero from '../components/hero';
import Features from '../components/features';
import Newsletter from '../components/newsletter';
import Zigzag from '../components/zigzag';
import Testimonials from '../components/testimonials';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen pt-14 bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <Hero />
      <Features />
      <Zigzag />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
