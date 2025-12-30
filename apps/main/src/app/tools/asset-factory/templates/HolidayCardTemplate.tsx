'use client';

import { cn } from '@/lib/utils';
import { TemplateProps } from '../types';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

const themes = {
    gold: {
        id: 'gold',
        name: 'Golden New Year',
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-100',
        border: 'border-yellow-200',
        text: 'text-amber-900',
        accent: 'text-yellow-600',
        gradient: 'from-amber-400 to-yellow-600',
        button: 'bg-amber-600'
    },
    red: {
        id: 'red',
        name: 'Christmas Red',
        bg: 'bg-gradient-to-br from-red-50 to-pink-100',
        border: 'border-red-200',
        text: 'text-red-900',
        accent: 'text-red-600',
        gradient: 'from-red-500 to-pink-600',
        button: 'bg-red-600'
    },
    purple: {
        id: 'purple',
        name: 'Royal Purple',
        bg: 'bg-gradient-to-br from-purple-50 to-indigo-100',
        border: 'border-purple-200',
        text: 'text-purple-900',
        accent: 'text-purple-600',
        gradient: 'from-purple-500 to-indigo-600',
        button: 'bg-purple-600'
    },
    emerald: {
        id: 'emerald',
        name: 'Emerald Glass',
        bg: 'bg-[#064802]',
        border: 'border-[#a9ce46]/30',
        text: 'text-white',
        accent: 'text-[#d4af37]',
        gradient: 'from-[#064802] to-[#043301]',
        button: 'bg-[#d4af37]'
    }
};

export const HolidayCardTemplate = ({ client, content, containerRef, visualAsset }: TemplateProps) => {
    // For now, hardcode Emerald theme as default since that's the preferred one
    // In future refinement, we can expose theme selection in the props
    const themeKey: keyof typeof themes = 'emerald';
    const themeConfig = themes[themeKey];
    const image = content.customImage || '/images/mum.jpeg';

    return (
        <div
            ref={containerRef}
            className={`w-[600px] h-[990px] ${themeConfig.bg} rounded-3xl shadow-2xl relative overflow-hidden flex flex-col items-center text-center border-[6px] ${themeConfig.border} flex-shrink-0`}
        >
                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
            `}</style>
            
            {/* Decorative Elements */}
            {themeKey === 'emerald' ? (
                <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 35c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                }} />
            ) : (
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
                    <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br ${themeConfig.gradient}`}></div>
                    <div className={`absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t ${themeConfig.gradient} opacity-20`}></div>
                </div>
            )}

            {/* Card Content */}
            <div className="relative z-10 w-full h-full flex flex-col p-10 pt-16">

                {/* Header */}
                <div className="mb-12">
                    {themeKey === 'emerald' ? (
                        <div className="space-y-2">
                            <h2 className="text-6xl text-white drop-shadow-lg" style={{ fontFamily: "'Great Vibes', cursive" }}>
                                Merry Christmas
                            </h2>
                            <p className="text-xs tracking-[0.4em] text-[#d4af37] font-serif uppercase">
                                & Happy New Year
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className={`text-4xl font-serif font-bold ${themeConfig.gradient} bg-clip-text text-transparent`}>
                                {content.title}
                            </h2>
                            <h3 className={`text-sm font-medium text-gray-500 tracking-widest uppercase mt-2`}>
                                @{content.year}
                            </h3>
                        </>
                    )}
                </div>

                {/* Photo Frame */}
                <div className="mx-auto w-72 h-72 mb-10 relative">
                    <div className={`w-full h-full rounded-full border-4 ${themeConfig.border} p-1 shadow-lg bg-white overflow-hidden relative z-10`}>
                        {image ? (
                            <img src={image} alt="Mum" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-16 h-16" />
                            </div>
                        )}
                    </div>

                    {/* Static Sub-image */}
                    <div className="absolute -top-6 -right-3 w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden z-20">
                        <img src="/images/mum-sub.png" alt="Sub 1" className="w-full h-full object-cover" />
                    </div>

                    <div className={`absolute bottom-0 right-0 w-16 h-16 ${themeConfig.button} rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg border-2 border-white z-30`}>
                        {content.year}
                    </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 flex flex-col justify-center px-4">
                    <div className={`text-lg font-medium ${themeConfig.text} leading-relaxed italic mb-4`}>
                        "{content.subtitle || "Wishing you a merry Christmas and a prosperous new year in advance."}"
                    </div>

                    <div className="my-4 h-px w-24 mx-auto bg-current opacity-20"></div>

                    <div className={`text-xl font-serif ${themeConfig.text} leading-relaxed`}>
                        {content.message}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 pb-4 border-t border-gray-400/20 w-full">
                        <>
                            <p className={`text-xs tracking-widest uppercase ${themeConfig.accent} font-semibold mb-2`}>
                                WITH LOVE FROM
                            </p>
                            <p className={`text-3xl font-serif ${themeConfig.text} font-bold`}>
                                {content.brandName || client.name}
                            </p>
                        </>
                </div>
            </div>
        </div>
    );
};
