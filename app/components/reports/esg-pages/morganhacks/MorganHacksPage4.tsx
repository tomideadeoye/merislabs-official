import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { SponsorGrid } from './SponsorGrid';

interface MorganHacksPage4Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage4: React.FC<MorganHacksPage4Props> = ({
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
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 mb-4">
                    Our Previous Sponsors
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <BackgroundGradient className="p-6 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/20">
                <h2 className="text-2xl font-semibold text-red-400 mb-4">Trusted by Industry Leaders</h2>
                <p className="text-gray-200 mb-6">
                    We're grateful for the support of our previous sponsors who have helped make MorganHacks a success.
                    Their investment in our students and event has enabled us to provide valuable experiences and resources.
                </p>

                <SponsorGrid />
            </BackgroundGradient>
        </HybridPage>
    );
};
