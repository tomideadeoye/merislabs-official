import React from 'react';
import { ThemeDescription } from '../esg-pages/morganhacks/ThemeDescription';
import { SponsorGrid } from '../esg-pages/morganhacks/SponsorGrid';
import { CallToAction } from '../esg-pages/morganhacks/CallToAction';
import { EVENT_DETAILS } from '../esg-pages/morganhacks/constants';
import { BackgroundGradient } from '@/components/ui/background-gradient';

export const MorganHacksSponsorshipPacket: React.FC = () => {
    return (
        <BackgroundGradient className="my-8 p-6 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                    {EVENT_DETAILS.name}
                </h2>
                <p className="text-lg text-gray-300">{EVENT_DETAILS.dates}</p>
                <p className="text-sm text-cyan-300 mt-2">{EVENT_DETAILS.description}</p>
            </div>

            <ThemeDescription />

            {/* Design Goals */}
            <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="p-4 bg-gray-900/80 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/10">
                    <h3 className="text-xl font-semibold text-green-400 mb-3 flex items-center">
                        <span className="mr-2">🎯</span> Design Goals
                    </h3>
                    <ul className="text-gray-200 space-y-2">
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            Eye-catching and professional
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            Easy to read and well-organized
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            Reflects futuristic theme without losing clarity
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            Consistent fonts, colors, and layout
                        </li>
                    </ul>
                </div>

                <div className="p-4 bg-gray-900/80 rounded-lg border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center">
                        <span className="mr-2">📸</span> Visual Elements
                    </h3>
                    <ul className="text-gray-200 space-y-2">
                        <li className="flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            Spider-Man: Into the Spider-Verse inspired design
                        </li>
                        <li className="flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            Bold colors and neon glows
                        </li>
                        <li className="flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            Glitch textures and digital city elements
                        </li>
                        <li className="flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            Images from previous MorganHacks events
                        </li>
                    </ul>
                </div>
            </div>

            <SponsorGrid />

            <CallToAction />
        </BackgroundGradient>
    );
};
