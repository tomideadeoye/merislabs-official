// GOAL OF FILE|FEATURES|FUNCTIONS:
// TypeScript module declaration for components/projects.ts to resolve import errors in Zigzag and other components.
// FILEPATH: components/projects.d.ts
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - Used by components/zigzag.tsx for type resolution
// ASSUMPTIONS & CLEAR COMMENTS: // NOTE: Assumed this resolves "Cannot find module './projects'" error.

export type LinkType = 'website' | 'github' | 'npm-package' | 'live-demo' | 'video' | 'documentation' | 'api' | 'blog' | 'case-study';

export interface Link {
  type: LinkType;
  url: string;
  label?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  video?: string;
  image?: string;
  iframe?: string;
  tag: string;
  links: Link[];
  img: string;
  challenge?: string;
  solution?: string;
  impact?: string[];
  systemsDesign?: string[];
  metrics?: { value: string; label: string }[];
  demoAvailable?: boolean;
}

export const projects: Project[];
