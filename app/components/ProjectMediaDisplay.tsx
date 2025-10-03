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
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'; // Fixed import path
import { Project } from 'components/projects'; // Assuming Project interface is exported from here
import './ProjectMediaDisplay.css';

interface ProjectMediaDisplayProps {
  project: Project;
  isFullscreen?: boolean;
}

// Client-side only iframe component to prevent hydration mismatches
function ClientIframe({ url, title, className }: { url: string; title: string; className: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`${className} project-iframe-loading`}>
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title={title}
      allowFullScreen
      className={`${className} project-iframe`}
      allow="fullscreen"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: 'inherit'
      }}
    />
  );
}

export default function ProjectMediaDisplay({ project, isFullscreen = false }: ProjectMediaDisplayProps) {
  const videoLink = project.links.find((link) => link[0] === 'video');
  const videoUrl = videoLink ? videoLink[1] : undefined;

  const availableMediaTypes = [];
  if (videoUrl) availableMediaTypes.push('video');
  if (project.image) availableMediaTypes.push('image');
  if (project.iframe) availableMediaTypes.push('iframe');

  const [activeMedia, setActiveMedia] = useState(availableMediaTypes[0] || '');

  // In fullscreen mode, show only the active media without tabs
  if (isFullscreen && availableMediaTypes.length > 0) {
    return (
      <div className={`project-media-container ${isFullscreen ? 'fullscreen' : ''}`} data-aos="fade-up">
        {videoUrl && activeMedia === 'video' && (
          <video
            controls
            autoPlay
            muted
            loop
            src={videoUrl}
            className="project-video-fullscreen"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        )}
        {project.image && activeMedia === 'image' && (
          <Image
            src={`/images/${project.image}`}
            alt={project.name}
            width={1200}
            height={800}
            className="project-image-fullscreen"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        )}
        {project.iframe && activeMedia === 'iframe' && (
          <ClientIframe url={project.iframe} title={project.name} className="project-iframe-container-fullscreen" />
        )}
      </div>
    );
  }

  return (
    <div className="project-media-container" data-aos="fade-up">
      {availableMediaTypes.length > 0 && (
        <Tabs defaultValue={activeMedia} className="w-full">
          <TabsList
            className="project-tabs-list"
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
                className="project-video"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: 'inherit'
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
                className="project-image"
              />
            </TabsContent>
          )}
          {project.iframe && (
            <TabsContent value="iframe" className="mt-4">
              <ClientIframe url={project.iframe} title={project.name} className="project-iframe-container" />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
