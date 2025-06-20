/**
 * @fileoverview This component is responsible for rendering the media (video, image, iframe)
 *   associated with a single project within the Zigzag section. It provides a tabbed interface
 *   to allow users to switch between available media types for a cleaner display.
 * @description Encapsulates the media presentation logic for individual projects,
 *   ensuring only one media type is displayed at a time and improving the overall UI/UX
 *   of the project showcase.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To display a project's media content (video, image, iframe) in a single, switchable view.
 *   - To provide a user-friendly way to navigate between different media representations of a project.
 *   - To maintain a clean and uncluttered design within the Zigzag section by avoiding simultaneous media display.
 *
 * FILEPATH: `app/components/ProjectMediaDisplay.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `components/projects.ts`: Source of the `Project` interface and data.
 *   - `@/components/ui/tabs.tsx`: Utilizes the shared Tabs components for media navigation.
 *   - `next/image`: Used for rendering project images.
 *   - `react-iframe`: Used for embedding external iframe content.
 *   - `components/zigzag.tsx`: This component is consumed by the Zigzag component to render individual project media.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `project.links` is an array that may contain a `video` link.
 *   - Assumes that `project.image` and `project.iframe` properties are correctly defined when present.
 *   - The component is client-side (`'use client'`) due to the use of `useState`.
 *
 * NOTES:
 *   - This component centralizes media display logic for projects, making it more maintainable.
 *   - Consider adding a fallback UI if no media types are available for a project.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Media Optimization**: Implement lazy loading for videos and iframes to improve initial page load performance.
 *   - **Error Handling**: Add visual indicators or fallback messages for media that fails to load.
 *   - **Accessibility**: Ensure keyboard navigation and ARIA attributes are fully supported for the media tabs.
 */

'use client';

import Image from 'next/image';
import Iframe from 'react-iframe';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project } from 'components/projects'; // Assuming Project interface is exported from here

interface ProjectMediaDisplayProps {
  project: Project;
}

export default function ProjectMediaDisplay({ project }: ProjectMediaDisplayProps) {
  const videoLink = project.links.find((link) => link[0] === 'video');
  const videoUrl = videoLink ? videoLink[1] : undefined;

  const availableMediaTypes = [];
  if (videoUrl) availableMediaTypes.push('video');
  if (project.image) availableMediaTypes.push('image');
  if (project.iframe) availableMediaTypes.push('iframe');

  const [activeMedia, setActiveMedia] = useState(availableMediaTypes[0] || '');

  return (
    <div className={`max-w-xl md:max-w-none md:w-full mx-auto flex-row-reverse items-center w-full`} data-aos="fade-up">
      {availableMediaTypes.length > 0 && (
        <Tabs defaultValue={activeMedia} className="w-full">
          <TabsList
            className="grid w-full"
            style={{ gridTemplateColumns: `repeat(${availableMediaTypes.length}, 1fr)` }}
          >
            {videoUrl && (
              <TabsTrigger value="video" onClick={() => setActiveMedia('video')}>
                Video
              </TabsTrigger>
            )}
            {project.image && (
              <TabsTrigger value="image" onClick={() => setActiveMedia('image')}>
                Image
              </TabsTrigger>
            )}
            {project.iframe && (
              <TabsTrigger value="iframe" onClick={() => setActiveMedia('iframe')}>
                Iframe
              </TabsTrigger>
            )}
          </TabsList>
          {videoUrl && (
            <TabsContent value="video" className="mt-4">
              <video
                controls
                autoPlay
                muted
                loop
                src={videoUrl}
                width="auto"
                height="300px"
                style={{
                  borderRadius: '10px',
                }}
              />
            </TabsContent>
          )}
          {project.image && (
            <TabsContent value="image" className="mt-4">
              <Image
                src={`/images/${project.image}`}
                alt={project.name}
                width={600}
                height={400}
                className="object-contain rounded-2xl px-4 self-center"
                style={{
                  borderRadius: '40px',
                }}
              />
            </TabsContent>
          )}
          {project.iframe && (
            <TabsContent value="iframe" className="mt-4">
              <Iframe
                width="640px"
                height="320px"
                id=""
                display="block"
                allowFullScreen
                position="relative"
                title={project.name}
                url={project.iframe}
                className="object-contain rounded-2xl px-4 self-center w-full aspect-video min-h-[400px]"
                styles={{
                  borderRadius: '40px',
                }}
              />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
