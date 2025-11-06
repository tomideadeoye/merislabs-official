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
            {/* Full A4 page background - positioned to cover entire page */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: "url('/images/futuristic-city-dystopia-cyberpunk-portrait.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    // Position to cover beyond the HybridPage content area
                    transform: 'scale(1.1)', // Slightly scale up to ensure edge coverage
                    transformOrigin: 'center'
                }}
            >
                {/* Morgan Blue overlay */}
                <div className="absolute inset-0 bg-[#1B4383]/70"></div>
            </div>

            {/* Content positioned over the background */}
            <div className="relative z-10 flex flex-col items-center justify-between h-full p-8">
                <div className="text-center flex-1 flex flex-col justify-center">
                    <h1 className="font-bold text-white mb-8 text-8xl">
                        MorganHacks 2026
                    </h1>
                    <div className="h-8"></div>
                    <h2 className="font-bold text-[#F47937] mb-12 text-4xl">
                        Sponsorship Packet
                    </h2>
                    <div className="w-32 h-1 bg-[#F47937] mx-auto rounded-full mb-12"></div>

                    <div className="text-center">
                        <p className="text-4xl font-bold text-white mb-4">April 11th – 12th, 2026</p>
                        <p className="text-xl text-white">Student-led Hackathon at Morgan State University</p>
                    </div>
                </div>
            </div>
        </HybridPage>
    );
};
