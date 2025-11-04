import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';

interface MorganHacksPage2Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage2: React.FC<MorganHacksPage2Props> = ({
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
                    Why Sponsor MorganHacks?
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
                <BackgroundGradient className="p-6 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-900/80 rounded-lg border border-red-500/30 shadow-lg shadow-red-500/10">
                            <h3 className="text-lg font-semibold text-red-400 mb-2">🎓 Talent Pipeline</h3>
                            <p className="text-gray-200">
                                Connect with top-tier students from Morgan State University and other institutions who are passionate about technology and innovation.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-900/80 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
                            <h3 className="text-lg font-semibold text-blue-400 mb-2">🚀 Brand Visibility</h3>
                            <p className="text-gray-200">
                                Showcase your brand to hundreds of attendees, online viewers, and media outlets covering this exciting tech event.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-900/80 rounded-lg border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                            <h3 className="text-lg font-semibold text-yellow-400 mb-2">💡 Innovation Access</h3>
                            <p className="text-gray-200">
                                Gain early access to groundbreaking projects and solutions developed during the hackathon that could drive your business forward.
                            </p>
                        </div>
                    </div>
                </BackgroundGradient>

                <BackgroundGradient className="p-6 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
                    <h2 className="text-2xl font-semibold text-purple-400 mb-4">Event Impact</h2>
                    <p className="text-gray-200 mb-4">
                        MorganHacks brings together diverse talent from across the region to solve real-world challenges through technology and innovation.
                        Our previous events have resulted in dozens of innovative projects, new startups, and valuable connections between students and industry professionals.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 bg-gray-900/80 rounded-lg border border-red-500/30 shadow-lg shadow-red-500/10">
                            <div className="text-3xl font-bold text-red-400">300+</div>
                            <div className="text-gray-200">Attendees</div>
                        </div>
                        <div className="text-center p-4 bg-gray-900/80 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
                            <div className="text-3xl font-bold text-blue-400">50+</div>
                            <div className="text-gray-200">Projects</div>
                        </div>
                        <div className="text-center p-4 bg-gray-900/80 rounded-lg border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                            <div className="text-3xl font-bold text-yellow-400">20+</div>
                            <div className="text-gray-200">Sponsors</div>
                        </div>
                    </div>
                </BackgroundGradient>
            </div>
        </HybridPage>
    );
};
