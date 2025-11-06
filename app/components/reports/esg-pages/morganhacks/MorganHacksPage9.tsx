import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import GlitchText from '../../../../components/GlitchText';

interface MorganHacksPage9Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage9: React.FC<MorganHacksPage9Props> = ({
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
            <div className="text-center mb-4">
                <GlitchText
                    speed={1}
                    enableShadows={true}
                    enableOnHover={false}
                    className="font-bold text-white mb-2"
                >
                    Sponsorship Tiers
                </GlitchText>
                <div className="w-24 h-1 bg-[#F47937] mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
                <BackgroundGradient className="p-4 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
                    <h2 className="text-xl font-semibold text-white mb-2">Choose Your Level of Engagement</h2>
                    <p className="text-gray-200 text-sm mb-3">
                        Each sponsorship tier offers unique opportunities to connect with our participants and showcase your brand.
                        All sponsors receive recognition in our event materials and social media channels.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-red-900 to-blue-900">
                                    <th className="p-2 font-semibold text-white">Benefits</th>
                                    <th className="p-2 font-semibold text-blue-300">CUB ($7K)</th>
                                    <th className="p-2 font-semibold text-pink-300">KOALA ($10K)</th>
                                    <th className="p-2 font-semibold text-green-300">PANDA ($15K)</th>
                                    <th className="p-2 font-semibold text-orange-300">GRIZZLY ($20K)</th>
                                    <th className="p-2 font-semibold text-red-300">POLAR ($25K)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Distribute SWAG</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Mentors</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Judges</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓<span className="text-xs ml-1 text-white">(Early Access)</span></td>
                                    <td className="p-2 text-center text-white">✓<span className="text-xs ml-1 text-white">(Early Access)</span></td>
                                    <td className="p-2 text-center text-white">✓<span className="text-xs ml-1 text-white">(Early Access)</span></td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Career Fair Booth</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Resume Access</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Lounge for Sponsors</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Logo on T-shirt</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Logo on Banner</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Logo on Website</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Social Media Shoutout</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Sponsored Events</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Interview Room</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Host Workshop</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Finalist Judge</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Challenge Statement</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Room Named After You</td>
                                    <td className="p-2 text-center text-gray-500">-</td>
                                    <td className="p-2 text-center text-gray-500">-</td>
                                    <td className="p-2 text-center text-gray-500">-</td>
                                    <td className="p-2 text-center text-gray-500">-</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-2 text-white">Opening / Closing Speaker</td>
                                    <td className="p-2 text-center text-gray-500">-</td>
                                    <td className="p-2 text-center text-gray-500">-</td>
                                    <td className="p-2 text-center text-gray-500">-</td>
                                    <td className="p-2 text-center text-gray-500">-</td>
                                    <td className="p-2 text-center text-white">✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </BackgroundGradient>


            </div>
        </HybridPage>
    );
};
