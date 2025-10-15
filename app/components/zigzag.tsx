// GOAL OF FILE|FEATURES|FUNCTIONS:
// Zigzag component: Showcases a grid of project successes with media (video, image, iframe) and details.
// FILEPATH: components/zigzag.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - Depends on { projects } from './projects'
// - Uses Next.js Image, Link, and react-iframe
// - Media assets referenced in public/images/
// ASSUMPTIONS & CLEAR COMMENTS: // NOTE: Assumed all referenced images exist in public/images/ or public/
// NOTES: Consider consolidating project media handling, add more robust error handling/logging, and test for missing assets.

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { projects, Project } from './projects';

import ProjectMediaDisplay from './ProjectMediaDisplay';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import DecksSection from './DecksSection';


export default function Zigzag() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {projects.map((project: Project) => {
                  const videoLink = project.links.find((link) => link[0] === 'video');
                  const typedLinks: [string, string][] = project.links || [];

                  return (
                    <Dialog
                      key={project.name}
                      open={isModalOpen && selectedProject?.name === project.name}
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsModalOpen(false);
                          setSelectedProject(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <div
                          className="flex flex-col gap-4 p-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors duration-200 min-h-[800px]"
                          onClick={() => handleProjectClick(project)}
                        >
                          <div className="w-full h-80 relative flex-shrink-0 overflow-hidden rounded">
                            <ProjectMediaDisplay project={project} />
                          </div>
                          <div className="flex-1">
                            <div className="font-architects-daughter text-base text-purple-600 mb-1">{project.tag}</div>
                            <h3 className="h3 mb-2">{project.name}</h3>
                            <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {Array.isArray(project?.technologies) &&
                                project?.technologies.slice(0, 3).map((tool: string, techIndex: number) => (
                                  <span key={tool} className="text-[10px] bg-gray-700 px-2 py-1 rounded">
                                    {tool}
                                  </span>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-2">
                              {typedLinks.slice(0, 2).map((link, linkIndex) => (
                                <Link key={link[1]} className="text-xs hover:underline" href={link[1]}>
                                  {link[0].toLowerCase()}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-gray-800">
                        <DialogTitle className="sr-only">{project.name}</DialogTitle>
                        <div className="flex flex-col h-full">
                          <div className="flex-1 p-8 relative z-10">
                            <div className="max-w-4xl mx-auto h-full">
                              <ProjectMediaDisplay project={project} isFullscreen={true} />
                            </div>
                          </div>
                          <div className="p-8 bg-gray-900/50 backdrop-blur-sm relative z-20">
                            <div className="max-w-4xl mx-auto">
                              <div className="font-architects-daughter text-base text-purple-600 mb-2">{project.tag}</div>
                              <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
                              <p className="text-base text-gray-300 mb-4">{project.description}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {Array.isArray(project?.technologies) &&
                                  project?.technologies.map((tool: string, techIndex: number) => (
                                    <span key={tool} className="text-xs bg-gray-700 px-3 py-1 rounded-full">
                                      {tool}
                                    </span>
                                  ))}
                              </div>
                              <div className="flex gap-4">
                                {typedLinks.map((link, linkIndex) => (
                                  <Link
                                    key={link[1]}
                                    className="text-xs hover:underline px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
                                    href={link[1]}
                                  >
                                    {link[0].toLowerCase()}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
