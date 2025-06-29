// GOAL OF FILE: Hero section for the homepage, including branding, intro, and call-to-action.
// FILEPATH: app/components/Hero.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS: Uses Blocks from app/(default)/blocks/page, ModalVideo from components/modal-video, and hero image from public/images/hero-image-01.jpg. Designed to be imported in app/page.tsx as the main hero section.
// ASSUMPTIONS & CLEAR COMMENTS: // NOTE: Assumed Blocks and ModalVideo are available and compatible with current app structure – confirm with team
// NOTES: Consider consolidating hero assets and logic if similar hero sections exist elsewhere. Opportunities for improvement: modularize SVG, add robust error handling for missing assets, and ensure all imports are up to date.

import BlocksSection from '@/components/BlocksSection';
// import ModalVideo from '../../components/modal-video';
// import VideoThumb from '../../public/images/hero-image-01.png';

export default function Hero() {
  return (
    <section>
      <div className="mx-auto sm:px-6 relative">
        <div
          className="absolute left-0 bottom-0 -ml-20 hidden lg:block pointer-events-none"
          aria-hidden="true"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <svg
            className="max-w-full"
            width="564"
            height="552"
            viewBox="0 0 564 552"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="illustration-02"
                x1="-3.766"
                y1="300.204"
                x2="284.352"
                y2="577.921"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5D5DFF" stopOpacity=".01" />
                <stop offset="1" stopColor="#5D5DFF" stopOpacity=".32" />
              </linearGradient>
            </defs>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M100 100 C 150 50, 200 150, 250 100 S 400 150, 450 100"
              fill="url(#illustration-02)"
            />
          </svg>
          <BlocksSection />
        </div>
        {/* Hero content */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tighter mb-4 md:text-5xl" data-aos="fade-up">
              MERISLABS
            </h1>
            <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
              We have experience in designing and developing web and mobile applications for various industries, from
              financial services to legal.
            </p>
            <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div data-aos="fade-up" data-aos-delay="400">
                <a
                  className="font-medium inline-flex items-center justify-center border border-transparent rounded-sm leading-snug transition duration-150 ease-in-out px-8 py-3 text-white bg-purple-600 hover:bg-purple-700 w-full mb-4 sm:w-auto sm:mb-0"
                  href="mailto:tomide@merislabs.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Drop an email
                </a>
              </div>
              {/* <div data-aos="fade-up" data-aos-delay="600">
                <a
                  className="font-medium inline-flex items-center justify-center border border-transparent rounded-sm leading-snug transition duration-150 ease-in-out px-8 py-3 text-white bg-gray-700 hover:bg-gray-800 w-full sm:w-auto sm:ml-4"
                  href="#0"
                >
                  Learn more
                </a>
              </div> */}
            </div>
          </div>

          {/* <ModalVideo
            thumb={VideoThumb}
            thumbWidth={1024}
            thumbHeight={576}
            thumbAlt="Modal video thumbnail"
            video="/videos/video.mp4"
            videoWidth={1920}
            videoHeight={1080}
          /> */}
        </div>{' '}
      </div>
    </section>
  );
}
