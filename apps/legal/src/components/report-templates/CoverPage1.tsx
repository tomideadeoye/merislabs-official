'use client';

import React from 'react';

interface CandidateProfile {
    name: string;
    title: string;
    imageUrl: string;
    linkedInUrl?: string;
}

interface CoverPage1Props {
    projectTitle: string;
    subTitle?: string;
    programmeName?: string;
    logoSrc?: string;
    brandColor?: string;
    accentColor?: string;
    candidate?: CandidateProfile;
}

export const CoverPage1: React.FC<CoverPage1Props> = ({ 
    projectTitle, 
    subTitle, 
    programmeName = 'Professional Submission', 
    logoSrc,
    brandColor = '#800020',
    accentColor = '#1a1a1a',
    candidate
}) => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl print:shadow-none print:m-0 overflow-hidden h-full relative flex flex-col shrink-0">
            {/* Top Accent Border */}
            <div 
                className="absolute top-0 left-0 right-0 h-2 z-50"
                style={{ background: `linear-gradient(to right, ${accentColor}, ${brandColor}, ${accentColor})` }}
            ></div>

            {/* Geometric Corner Accents */}
            <div className="absolute top-0 left-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48">
                    <div className="absolute top-0 left-0 w-32 h-1" style={{ background: `linear-gradient(to right, ${accentColor}, ${brandColor})` }}></div>
                    <div className="absolute top-0 left-0 w-1 h-32" style={{ background: `linear-gradient(to bottom, ${accentColor}, ${brandColor})` }}></div>
                </div>
            </div>

            {/* Logo Header */}
            <div className="h-[15%] w-full flex items-center px-16 py-4 border-b border-gray-100">
                {logoSrc && <img src={logoSrc} alt="Logo" className="h-9 w-auto object-contain" />}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center items-center p-16 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 opacity-10 rounded-full blur-3xl" style={{ background: `linear-gradient(to bottom right, ${brandColor}, ${accentColor})` }}></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl space-y-12 px-8">
                    <div className="space-y-8">
                        <div className="inline-block px-6 py-2 rounded-full" style={{ backgroundColor: `${brandColor}1A`, border: `1px solid ${brandColor}33` }}>
                            <div className="text-sm font-bold tracking-widest uppercase" style={{ color: accentColor }}>{programmeName}</div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight tracking-wide" style={{ color: accentColor }}>
                            {projectTitle}
                        </h1>

                        {subTitle && (
                            <div className="text-gray-700 text-lg italic max-w-2xl mx-auto px-4">
                                {subTitle}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Candidate Card */}
            {candidate && (
                <div 
                    className="h-[20%] w-full flex items-center justify-center px-16 text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(to bottom right, ${accentColor}, ${brandColor})` }}
                >
                    <div className="flex items-center gap-8 relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-2xl">
                        <img src={candidate.imageUrl} alt={candidate.name} className="w-20 h-20 rounded-full object-cover border-2 border-white/30" />
                        <div className="text-left border-l border-white/10 pl-8">
                            <h2 className="text-2xl font-bold tracking-tight text-white">{candidate.name}</h2>
                            <p className="text-sm font-medium bg-white/90 px-2 py-0.5 rounded mt-1" style={{ color: brandColor }}>
                                {candidate.title}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoverPage1;"}
{