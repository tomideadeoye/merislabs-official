import { Layout, FileText, Cpu, Sparkles } from 'lucide-react';

export const navItems = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Services',
    href: '/services',
    icon: 'Sparkles',
    description: 'AI workflow consulting, web development, and document design.',
  },
  {
    name: 'Blog',
    href: '/blog',
    icon: 'FileText',
    description: 'Insights, requirements, and best practices for software business development.',
  },
  {
    name: 'Design Studio',
    href: '#',
    children: [
      {
        name: 'Decks',
        href: '/decks',
        icon: 'Layout',
        description: 'Professional presentation decks and pitch materials.',
      },
      {
        name: 'Flyers',
        href: '/tools/nicarb-flyers',
        icon: 'FileText',
        description: 'Marketing flyers and promotional document generators.',
      },
      {
        name: 'Asset Generator',
        href: '/tools/asset-factory',
        icon: 'Cpu',
        description: 'Automated brand asset and visual content production.',
      },
      {
        name: 'Proposals',
        href: '/proposals',
        icon: 'FileText',
        description: 'Config-driven proposal system with PDF export.',
      },
    ],
  },
];
