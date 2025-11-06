import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import GlitchText from '../../../../components/GlitchText';

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
            {/* Page container with Morgan Orange background */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#F47937] p-2">
                <div
                    className="relative w-full h-full rounded-lg overflow-hidden"
                    style={{
                        backgroundImage: "url('/images/futuristic-city-dystopia-cyberpunk-portrait.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Morgan Blue overlay */}
                    <div className="absolute inset-0 bg-[#1B4383]/70"></div>
                    <div className="relative z-10 flex flex-col items-center justify-between h-full p-8">
                        <div className="text-center pt-16">
                            <GlitchText
                                speed={1}
                                enableShadows={true}
                                enableOnHover={false}
                                className="font-bold text-[#F47937] mb-2"
                            >
                                MorganHacks 2026
                            </GlitchText>
                            <div className="h-6"></div>
                            <GlitchText
                                speed={1.2}
                                enableShadows={true}
                                enableOnHover={false}
                                className="font-bold text-[#F47937] mb-8"
                            >
                                Sponsorship Packet
                            </GlitchText>
                            <div className="w-24 h-1 bg-[#F47937] mx-auto rounded-full mb-8"></div>

                            <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20 max-w-2xl mx-auto">
                                <div className="text-center">
                                    <h2 className="font-bold text-white mb-2 text-xl">
                                        MorganHacks 2026
                                    </h2>
                                    <p className="text-lg text-white">April 11th – 12th, 2026</p>
                                    <p className="text-sm text-white mt-2">Student-led Hackathon at Morgan State University</p>
                                </div>
                            </BackgroundGradient>
                        </div>

                        {/* Minimalist Contact Information */}
                        <div className="text-center text-white/80 text-sm mb-6">
                            <p>📧 morganhacks2022@gmail.com</p>
                            <p className="mt-1">🌐 morganhacks.com</p>
                        </div>

                        {/* Theme Tags at the bottom with alternating colors */}
                        <div className="pb-16">
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-2 py-1 bg-[#1B4383] text-white text-xs rounded border border-[#1B4383]/30 shadow-lg shadow-[#1B4383]/10">The Future</span>
                                <span className="px-2 py-1 bg-[#F47937] text-white text-xs rounded border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">Boldness</span>
                                <span className="px-2 py-1 bg-[#1B4383] text-white text-xs rounded border border-[#1B4383]/30 shadow-lg shadow-[#1B4383]/10">Tech</span>
                                <span className="px-2 py-1 bg-[#F47937] text-white text-xs rounded border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">Innovation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HybridPage>
    );
};
