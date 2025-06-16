// GOAL: Provide placeholder data for components that depend on project/review information.
// This prevents build errors due to missing modules.

export const reviews = [
  {
    review: 'A placeholder review for the testimonials section.',
    image: '/images/avatar-placeholder.png', // Make sure you have a placeholder image here
    name: 'Jane Doe',
    link: '#',
    company: 'Example Corp',
  },
];

export const projects = [
  {
    title: 'Placeholder Project',
    image: '/images/project-placeholder.png', // Make sure you have a placeholder image here
    summary: 'This is a placeholder project description.',
    technologies: ['React', 'Next.js', 'TypeScript'],
    links: [{ type: 'github', url: '#' }],
  },
];
