'use client';

import React from 'react';

interface CoverPage2Props {
    projectTitle: string;
    subTitle?: string;
    date?: string;
    firmName?: string;
    brandColor?: string;
}

export const CoverPage2: React.FC<CoverPage2Props> = ({ 
    projectTitle, 
    subTitle, 
    date = '2026',
    firmName = 'MerisLabs',
    brandColor = '#1a1a1a'
}) => {
    return (
        <div className="w-full h-full bg-white relative flex flex-col p-20">
            {/* Vertical Accent Line */}
            <div 
                className="absolute top-0 left-12 w-px h-full bg-gray-100"
            />
            
            {/* Firm Header */}
            <div className="flex justify-between items-start z-10">
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block">
                        Confidential Report
                    </span>
                    <span className="text-sm font-bold text-gray-900 tracking-tight">
                        {firmName}
                    </span>
                </div>
                <span className="text-sm font-light text-gray-400 tabular-nums">
                    {date}
                </span>
            </div>

            {/* Main Title Section */}
            <div className="flex-1 flex flex-col justify-center max-w-2xl z-10">
                <div 
                    className="w-16 h-2 mb-12" 
                    style={{ backgroundColor: brandColor }}
                />
                <h1 className="text-6xl font-sans font-black tracking-tighter text-gray-900 leading-[0.9]">
                    {projectTitle.split(':').map((part, i) => (
                        <span key={i} className="block">
                            {part.trim()}
                            {i === 0 && projectTitle.includes(':') && '.'}
                        </span>
                    ))}
                </h1>
                {subTitle && (
                    <p className="mt-8 text-xl font-light text-gray-500 leading-relaxed">
                        {subTitle}
                    </p>
                )}
            </div>

            {/* Bottom Details */}
            <div className="z-10 flex items-end gap-12">
                <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Classification</span>
                    <p className="text-[11px] font-medium text-gray-900 uppercase">Strictly Internal</p>
                </div>
                <div className="space-y-1 border-l border-gray-100 pl-12">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Status</span>
                    <p className="text-[11px] font-medium text-gray-900 uppercase">Final Version</p>
                </div>
            </div>
        </div>
    );
};

export default CoverPage2;"}
{