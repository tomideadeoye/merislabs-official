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
import { Project } from './projects'; // Project interface is exported from the same directory
import './ProjectMediaDisplay.css';

interface ProjectMediaDisplayProps {
  project: Project;
  isFullscreen?: boolean;
}

// Client-side only iframe component to prevent hydration mismatches
function ClientIframe({ url, title, className, containerClassName }: { url: string; title: string; className: string; containerClassName: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`${containerClassName} project-iframe-loading`}>
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <iframe
        src={url}
        title={title}
        allowFullScreen
        className={className}
        allow="fullscreen"
        scrolling="no"
      />
    </div>
  );
}

export default function ProjectMediaDisplay({ project, isFullscreen = false }: ProjectMediaDisplayProps) {
  const videoLink = project.links.find((link) => link.type === 'video');
  const videoUrl = videoLink ? videoLink.url : undefined;

  const availableMediaTypes = [];
  if (project.iframe) availableMediaTypes.push('iframe');
  if (videoUrl) availableMediaTypes.push('video');
  if (project.image || project.img) availableMediaTypes.push('image');

  const [activeMedia, setActiveMedia] = useState(availableMediaTypes[0] || '');

  // Always show tabs, even in fullscreen mode
  return (
    <div className={`project-media-container ${isFullscreen ? 'fullscreen' : ''}`} data-aos="fade-up">
      {availableMediaTypes.length > 0 && (
        <Tabs defaultValue={activeMedia} className="w-full h-full flex flex-col">
          <TabsList
            className="project-tabs-list flex-shrink-0"
            style={{ gridTemplateColumns: `repeat(${availableMediaTypes.length}, 1fr)` }}
          >
            {project.iframe && (
              <TabsTrigger value="iframe" onClick={() => setActiveMedia('iframe')}>
                Working Example
              </TabsTrigger>
            )}
            {videoUrl && (
              <TabsTrigger value="video" onClick={() => setActiveMedia('video')}>
                Video
              </TabsTrigger>
            )}
            {(project.image || project.img) && (
              <TabsTrigger value="image" onClick={() => setActiveMedia('image')}>
                Image
              </TabsTrigger>
            )}
          </TabsList>
          <div className="flex-1 overflow-hidden">
            {project.iframe && (
              <TabsContent value="iframe" className="h-full mt-4">
                <div className="media-scroll-container h-full">
                  <ClientIframe 
                    url={project.iframe} 
                    title={project.name} 
                    className="project-iframe" 
                    containerClassName={`project-iframe-container ${isFullscreen ? 'project-iframe-container-fullscreen' : ''}`} 
                  />
                </div>
              </TabsContent>
            )}
            {videoUrl && (
              <TabsContent value="video" className="h-full mt-4">
                <div className="media-scroll-container h-full">
                  <video
                    controls
                    muted
                    loop
                    preload="metadata"
                    src={videoUrl}
                    className={`project-video ${isFullscreen ? 'project-video-fullscreen' : ''}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 'inherit',
                      minHeight: '400px' // Ensure minimum height for better display
                    }}
                    onError={(e) => {
                      // If video fails to load, show error message
                      const target = e.currentTarget;
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center;">
                            <svg style="width: 64px; height: 64px; margin-bottom: 1rem; color: #9CA3AF;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p style="color: #6B7280; margin-bottom: 1rem;">Video playback unavailable</p>
                            <a href="${videoUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #8B5CF6; color: white; border-radius: 0.375rem; text-decoration: none; font-size: 0.875rem;">
                              <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download Video
                            </a>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </TabsContent>
            )}
            {(project.image || project.img) && (
              <TabsContent value="image" className="h-full mt-4">
                <div className="media-scroll-container h-full">
                  <Image
                    src={project.image ? `/images/${project.image}` : project.img!}
                    alt={project.name}
                    width={isFullscreen ? 1200 : 600}
                    height={isFullscreen ? 800 : 400}
                    className={`project-image ${isFullscreen ? 'project-image-fullscreen' : ''}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 'inherit'
                    }}
                  />
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      )}
    </div>
  );
}
