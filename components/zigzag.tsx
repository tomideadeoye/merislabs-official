// GOAL OF FILE|FEATURES|FUNCTIONS:
// Zigzag component: Showcases a grid of project successes with media (video, image, iframe) and details.
// FILEPATH: components/zigzag.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - Depends on { projects } from './projects'
// - Uses Next.js Image, Link, and react-iframe
// - Media assets referenced in public/images/
// ASSUMPTIONS & CLEAR COMMENTS: // NOTE: Assumed all referenced images exist in public/images/ or public/
// NOTES: Consider consolidating project media handling, add more robust error handling/logging, and test for missing assets.


import Link from 'next/link';
import { projects, Project } from './projects';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DecksSection from '@/components/DecksSection';
import ProjectMediaDisplay from '@/components/ProjectMediaDisplay';

export default function Zigzag() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-green-600 bg-green-200 rounded-full mb-4">
              Reach your business goals
            </div>
            <h1 className="h2 mb-4">Our Successes</h1>
            <p className="text-xl text-gray-400">
              We have experience in designing and developing web and mobile applications for various industries, from
              financial services to legal.
            </p>
          </div>
          {/* Tabs */}
          <Tabs defaultValue="successes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="successes">Web Applications</TabsTrigger>
              <TabsTrigger value="decks">Decks & Presentations</TabsTrigger>
            </TabsList>
            <TabsContent value="successes">
              <div className="grid gap-20 mt-8">
                {projects.map((project: Project) => {
                  const videoLink = project.links.find((link) => link[0] === 'video');
                  const videoUrl = videoLink ? videoLink[1] : undefined;
                  const typedLinks: [string, string][] = project.links || [];

                  return (
                    <div className="flex flex-col md:flex-row gap-4" key={project.name}>
                      <ProjectMediaDisplay project={project} />
                      <div
                        className="max-w-xl md:max-w-none w-full mx-auto md:col-span-7 lg:col-span-6 "
                        data-aos="fade-left"
                      >
                        <div className="md:pl-4 lg:pl-12 xl:pl-16">
                          <div className="font-architects-daughter text-xl text-purple-600 mb-2">{project.tag}</div>
                          <h3 className="h3 mb-3">{project.name}</h3>
                          <p className="text-xl text-gray-400 mb-4">{project.description}</p>
                          <ul className="text-lg text-gray-400 -mb-2">
                            {Array.isArray(project?.technologies) &&
                              project?.technologies.map((tool: string, techIndex: number) => (
                                <li className="flex items-center mb-2" key={tool}>
                                  <svg
                                    className="w-3 h-3 fill-current text-green-500 mr-2 shrink-0"
                                    viewBox="0 0 12 12"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                                  </svg>
                                  <span key={techIndex}>{tool}</span>
                                </li>
                              ))}
                          </ul>
                          <div className="flex gap-2 mt-6">
                            {typedLinks.map((link, linkIndex) => (
                              <Link key={linkIndex} className="hover:underline" href={link[1]}>
                                {link[0].toLowerCase()}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="decks">
              <DecksSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
