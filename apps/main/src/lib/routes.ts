import { Layout, FileText, Cpu, Briefcase } from 'lucide-react';

export const navItems = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Case Studies',
    href: '/case-studies',
    icon: 'Briefcase',
    description: 'Proprietary systems architecture and software business knowledge base.',
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
    ],
  },
];
