'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';

export const TealDrapesTemplate = ({ client, content, containerRef, visualAsset }: TemplateProps) => {
    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-square overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #0d4f5c 0%, #0a3d47 50%, #083540 100%)' }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Montserrat:wght@300;700;900&display=swap');
            `}</style>

            {/* Drapes Background */}
            {visualAsset.path && visualAsset.id === 'teal-drapes' && (
                <img
                    src={visualAsset.path}
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-contain object-top opacity-80"
                />
            )}

            {/* Gold baubles scattered effect - if using gold baubles asset */}
            {visualAsset.path && visualAsset.id === 'gold-baubles' && (
                <img
                    src={visualAsset.path}
                    alt="Decoration"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
            )}

            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#083540]/80" />

            {/* Logo placement - top left */}
            {client.type === 'corporate' && client.logo && (
                <div className="absolute top-6 left-6 z-20">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <img src={client.logo} alt={client.name} className="h-10 w-auto" />
                    </div>
                </div>
            )}

            {/* Main Content - Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                {/* HAPPY text */}
                <p 
                    className="text-lg uppercase tracking-[0.5em] text-amber-400 mb-2"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                >
                    {content.subtitle || 'HAPPY'}
                </p>

                {/* New Year in script */}
                <h2 
                    className="text-6xl mb-4"
                    style={{ 
                        fontFamily: "'Dancing Script', cursive",
                        color: '#D4AF37'
                    }}
                >
                    {content.title.split(' ').slice(1).join(' ') || 'New Year'}
                </h2>

                {/* Large 3D Year */}
                <div 
                    className="text-8xl font-black tracking-tight"
                    style={{
                        fontFamily: "'Montserrat', sans-serif",
                        background: 'linear-gradient(180deg, #ffffff 0%, #c0c0c0 40%, #808080 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '4px 4px 8px rgba(0,0,0,0.3)'
                    }}
                >
                    {content.year}
                </div>
            </div>

            {/* Visual Asset - If not background type, show as accent */}
            {visualAsset.path && !['teal-drapes', 'gold-baubles'].includes(visualAsset.id) && (
                <div className="absolute bottom-20 right-8 w-32 h-32 opacity-80">
                    <img
                        src={visualAsset.path}
                        alt={visualAsset.name}
                        className="w-full h-full object-contain"
                    />
                </div>
            )}

            {/* Footer with contact info */}
            <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-between items-center z-20">
                <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {client.phone || ''}
                </p>
                <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {client.website || ''}
                </p>
            </div>
        </div>
    );
};
