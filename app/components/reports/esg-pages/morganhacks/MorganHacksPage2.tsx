import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import GlitchText from '../../../../components/GlitchText';

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
                <GlitchText
                    speed={1}
                    enableShadows={true}
                    enableOnHover={false}
                    className="font-bold text-white mb-4"
                >
                    Why Sponsor MorganHacks?
                </GlitchText>
                <div className="w-24 h-1 bg-[#F47937] mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
                <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                            <h3 className="text-lg font-semibold text-[#F47937] mb-2">🎓 Talent Pipeline</h3>
                            <p className="text-gray-200">
                                Connect with top-tier students from Morgan State University and other institutions who are passionate about technology and innovation.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                            <h3 className="text-lg font-semibold text-[#F47937] mb-2">🚀 Brand Visibility</h3>
                            <p className="text-gray-200">
                                Showcase your brand to hundreds of attendees, online viewers, and media outlets covering this exciting tech event.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                            <h3 className="text-lg font-semibold text-[#F47937] mb-2">💡 Innovation Access</h3>
                            <p className="text-gray-200">
                                Gain early access to groundbreaking projects and solutions developed during the hackathon that could drive your business forward.
                            </p>
                        </div>
                    </div>
                </BackgroundGradient>

                <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Event Impact
                    </h2>
                    <p className="text-gray-200 mb-4">
                        MorganHacks brings together diverse talent from across the region to solve real-world challenges through technology and innovation.
                        Our previous events have resulted in dozens of innovative projects, new startups, and valuable connections between students and industry professionals.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                            <div className="text-3xl font-bold text-[#F47937]">300+</div>
                            <div className="text-gray-200">Attendees</div>
                        </div>
                        <div className="text-center p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                            <div className="text-3xl font-bold text-[#F47937]">50+</div>
                            <div className="text-gray-200">Projects</div>
                        </div>
                        <div className="text-center p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                            <div className="text-3xl font-bold text-[#F47937]">20+</div>
                            <div className="text-gray-200">Sponsors</div>
                        </div>
                    </div>
                </BackgroundGradient>
            </div>
        </HybridPage>
    );
};
