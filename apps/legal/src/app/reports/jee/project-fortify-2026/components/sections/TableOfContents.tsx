import React from 'react';

export const TableOfContents: React.FC = () => {
  const sections = [
    { title: 'Executive Summary', page: 1 },
    { title: 'Personal Case, Commercial Impact & Contributions', page: 3 },
    { title: 'The Business – CLDR Practice / Project Fortify', page: 6 },
    { title: 'Market & Competitive Landscape Analysis', page: 9 },
    { title: 'Strategic Objectives', page: 12 },
    { title: 'Implementation Plan', page: 13 },
    { title: 'International Referral Architecture', page: 16 },
    { title: 'Team Development & Practice Capacity Plan', page: 17 },
    { title: 'Financial Requirements', page: 19 },
    { title: 'Investment Logic and ROI', page: 21 },
    { title: 'Bottom-Up Revenue Model & Financial Projections', page: 22 },
    { title: 'Profitability, Leverage & Fee Collection', page: 24 },
    { title: 'Success Factors, KPIs & Risk Register', page: 25 },
    { title: 'Conclusion – Commitment to Partnership & Firm Growth', page: 27 },
  ];

  return (
    <div className="p-16 h-full flex flex-col">
      <h2 className="text-3xl font-serif text-[#1a1a1a] mb-12 border-b border-[#800020] pb-4 uppercase tracking-wider">
        Table of Contents
      </h2>
      
      <div className="flex-grow space-y-6">
        {sections.map((section, index) => (
          <a 
            key={index} 
            href={`#page-${section.page}`}
            className="flex items-end group cursor-pointer hover:no-underline"
          >
            <span className="text-[#800020] font-serif text-xl w-12">{index + 1}.</span>
            <span className="text-xl text-[#1a1a1a] font-medium group-hover:text-[#800020] transition-colors">
              {section.title}
            </span>
            <div className="flex-grow border-b border-dotted border-gray-300 mx-4 mb-1" />
            <span className="text-[#1a1a1a] font-serif text-xl">{section.page}</span>
          </a>
        ))}
      </div>

      <div className="mt-auto pt-12 text-sm text-gray-400 font-light max-w-md">
        This document contains confidential commercial strategy and financial projections. 
        It is intended solely for the use of the Partnership Selection Committee.
      </div>
    </div>
  );
};
