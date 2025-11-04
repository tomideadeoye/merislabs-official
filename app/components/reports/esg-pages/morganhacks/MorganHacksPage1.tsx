import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';

interface MorganHacksPage1Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage1: React.FC<MorganHacksPage1Props> = ({
    width = 794,
    height = 1123,
    columns = 1
}) => {
    return (
        <HybridPage
            components={{}}
            width={width}
            height={height}
            columns={columns}
        >
            <div
                className="relative w-full h-full rounded-xl overflow-hidden"
                style={{
                    backgroundImage: "url('/images/futuristic-city-dystopia-cyberpunk-portrait.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative z-10 flex flex-col items-center justify-between h-full p-8">
                    <div className="text-center pt-16">
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 mb-4">
                            MorganHacks 2026 Sponsorship Packet
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full mb-8"></div>

                        <BackgroundGradient className="p-6 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/20 max-w-2xl mx-auto">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400 mb-2">
                                    MorganHacks 2026
                                </h2>
                                <p className="text-lg text-gray-300">April 11th – 12th, 2026</p>
                                <p className="text-sm text-red-400 mt-2">Student-led Hackathon at Morgan State University</p>
                            </div>
                        </BackgroundGradient>
                    </div>

                    {/* Theme Tags at the bottom */}
                    <div className="pb-16">
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-2 py-1 bg-gradient-to-r from-cyan-900/50 to-cyan-700/50 text-cyan-400 text-xs rounded border border-cyan-500/30 shadow-lg shadow-cyan-500/10">The Future</span>
                            <span className="px-2 py-1 bg-gradient-to-r from-red-900/50 to-red-700/50 text-red-400 text-xs rounded border border-red-500/30 shadow-lg shadow-red-500/10">Boldness</span>
                            <span className="px-2 py-1 bg-gradient-to-r from-blue-900/50 to-blue-700/50 text-blue-400 text-xs rounded border border-blue-500/30 shadow-lg shadow-blue-500/10">Tech</span>
                            <span className="px-2 py-1 bg-gradient-to-r from-purple-900/50 to-purple-700/50 text-purple-400 text-xs rounded border border-purple-500/30 shadow-lg shadow-purple-500/10">Innovation</span>
                        </div>
                    </div>
                </div>
            </div>
        </HybridPage>
    );
};
