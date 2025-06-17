import './css/style.css';
// GOAL OF FILE|FEATURES|FUNCTIONS: This is the main landing page component for the application. Currently serves as a placeholder, with commented-out imports for potential sections like Hero, Features, etc.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/page.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - This is the root page component rendered at the '/' route.
//   - Uses global CSS (`./css/style.css`).
//   - Intended to compose various UI sections (currently commented out).
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed this page will eventually contain the public-facing homepage content.
// import Hero from './src/components/hero';
// import Features from './src/components/features';
// import Newsletter from './src/components/newsletter';
// import Zigzag from './src/components/zigzag';
// import Testimonials from './src/components/testimonials';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen pt-14 bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      {/* <Hero /> */}
      {/* <Features /> */}
      {/* <Zigzag /> */}
      {/* <Testimonials /> */}
      {/* <Newsletter /> */}
    </main>
  );
}
