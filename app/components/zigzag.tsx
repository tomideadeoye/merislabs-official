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
import ReactMarkdown from 'react-markdown';
import { projects, Project } from './projects';

import ProjectMediaDisplay from './ProjectMediaDisplay';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import DecksSection from './DecksSection';
import { SiGoogleplay } from 'react-icons/si';

// Function to truncate text to a specified length
const truncateDescription = (text: string, maxLength: number = 300): string => {
  // Remove markdown formatting for truncation calculation
  const plainText = text.replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2')   // Remove italic
    .replace(/`{1,2}([^`]+)`{1,2}/g, '$1') // Remove inline code
    .replace(/~~(.*?)~~/g, '$1')       // Remove strikethrough
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/#+\s/g, '')              // Remove headers
    .replace(/\n/g, ' ');              // Replace newlines with spaces

  if (plainText.length <= maxLength) {
    return text;
  }

  // Truncate at the last space within the limit to avoid cutting words
  let truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  if (lastSpaceIndex > 0) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated + '...';
};

// Function to check if description needs truncation
const needsTruncation = (text: string, maxLength: number = 300): boolean => {
  // Remove markdown formatting for truncation calculation
  const plainText = text.replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2')   // Remove italic
    .replace(/`{1,2}([^`]+)`{1,2}/g, '$1') // Remove inline code
    .replace(/~~(.*?)~~/g, '$1')       // Remove strikethrough
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/#+\s/g, '')              // Remove headers
    .replace(/\n/g, ' ');              // Replace newlines with spaces

  return plainText.length > maxLength;
};

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {projects.map((project: Project) => {
                  const videoLink = project.links.find((link) => link.type === 'video');
                  const typedLinks = project.links || [];
                  const shouldShowSeeMore = needsTruncation(project.description, 300);

                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="flex flex-col gap-4 p-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors duration-200 min-h-[800px]"
                    >
                      <div className="w-full h-80 relative flex-shrink-0 overflow-hidden rounded">
                        <ProjectMediaDisplay project={project} />
                      </div>
                      <div className="flex-1">
                        <div className="font-architects-daughter text-base text-purple-600 mb-1">{project.tag}</div>
                        <h3 className="h3 mb-2">{project.name}</h3>
                        <div className="text-sm text-gray-400 mb-3">
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                              strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
                              em: ({ node, ...props }) => <span className="italic" {...props} />,
                            }}
                          >
                            {truncateDescription(project.description, 300)}
                          </ReactMarkdown>
                        </div>
                        {shouldShowSeeMore && (
                          <div className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded-full mb-3">
                            See More
                          </div>
                        )}
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
                            <span key={link.url} className="text-xs hover:underline flex items-center">
                              {link.type === 'google-play-store' ? (
                                <>
                                  <SiGoogleplay className="inline mr-1" />
                                  Google Play Store
                                </>
                              ) : link.type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
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
