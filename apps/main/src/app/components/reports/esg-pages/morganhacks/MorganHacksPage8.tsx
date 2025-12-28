import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { SponsorGrid } from './SponsorGrid';

interface MorganHacksPage8Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage8: React.FC<MorganHacksPage8Props> = ({
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
            {/* Full page transparent Morgan Blue background */}
            <div
                className="absolute inset-0 w-full h-full bg-[#1B4383]/70"
            ></div>

            {/* Content positioned over the background */}
            <div className="relative z-10">
                <div className="text-center mb-8">
                    <h1 className="font-bold text-white mb-4 text-4xl">
                        Our Past Sponsors
                    </h1>
                    <div className="w-24 h-1 bg-[#F47937] mx-auto rounded-full"></div>
                </div>

                <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Thank You to Our Sponsors
                        </h2>
                        <p className="text-gray-200 mb-6">
                            We are grateful for the continued support of our sponsors who make MorganHacks possible.
                            Their contributions help us provide valuable resources, prizes, and mentorship to our participants.
                        </p>
                    </div>

                    <SponsorGrid />

                    <div className="mt-8 text-center">
                        <p className="text-white text-sm">
                            Interested in becoming a sponsor? Contact us at morganhacks2022@gmail.com
                        </p>
                    </div>
                </BackgroundGradient>
            </div>
        </HybridPage>
    );
};
