import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';

interface MorganHacksPage3Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage3: React.FC<MorganHacksPage3Props> = ({
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
                    Sponsorship Tiers
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
                <BackgroundGradient className="p-6 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
                    <h2 className="text-2xl font-semibold text-purple-400 mb-4">Choose Your Level of Engagement</h2>
                    <p className="text-gray-200 mb-6">
                        Each sponsorship tier offers unique opportunities to connect with our participants and showcase your brand.
                        All sponsors receive recognition in our event materials and social media channels.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-red-900 to-blue-900">
                                    <th className="p-3 font-semibold text-white">Benefits</th>
                                    <th className="p-3 font-semibold text-red-300">Bronze ($1K)</th>
                                    <th className="p-3 font-semibold text-blue-300">Silver ($2.5K)</th>
                                    <th className="p-3 font-semibold text-yellow-300">Gold ($5K)</th>
                                    <th className="p-3 font-semibold text-purple-300">Platinum ($10K)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-700">
                                    <td className="p-3 text-gray-200">Logo on event website</td>
                                    <td className="p-3 text-center text-red-400">✓</td>
                                    <td className="p-3 text-center text-blue-400">✓</td>
                                    <td className="p-3 text-center text-yellow-400">✓</td>
                                    <td className="p-3 text-center text-purple-400">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-3 text-gray-200">Social media mentions</td>
                                    <td className="p-3 text-center text-red-400">✓</td>
                                    <td className="p-3 text-center text-blue-400">✓</td>
                                    <td className="p-3 text-center text-yellow-400">✓</td>
                                    <td className="p-3 text-center text-purple-400">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-3 text-gray-200">Booth/table space</td>
                                    <td className="p-3 text-center text-gray-500">-</td>
                                    <td className="p-3 text-center text-blue-400">✓</td>
                                    <td className="p-3 text-center text-yellow-400">✓</td>
                                    <td className="p-3 text-center text-purple-400">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-3 text-gray-200">Judging opportunity</td>
                                    <td className="p-3 text-center text-gray-500">-</td>
                                    <td className="p-3 text-center text-gray-500">-</td>
                                    <td className="p-3 text-center text-yellow-400">✓</td>
                                    <td className="p-3 text-center text-purple-400">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-3 text-gray-200">Speaking slot</td>
                                    <td className="p-3 text-center text-gray-500">-</td>
                                    <td className="p-3 text-center text-gray-500">-</td>
                                    <td className="p-3 text-center text-gray-500">-</td>
                                    <td className="p-3 text-center text-purple-400">✓</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                    <td className="p-3 text-gray-200">Dedicated recognition</td>
                                    <td className="p-3 text-center text-gray-500">-</td>
                                    <td className="p-3 text-center text-gray-500">-</td>
                                    <td className="p-3 text-center text-gray-500">-</td>
                                    <td className="p-3 text-center text-purple-400">✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </BackgroundGradient>

                <BackgroundGradient className="p-6 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/20">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">Custom Sponsorship Opportunities</h3>
                    <p className="text-gray-200">
                        Interested in a custom sponsorship package? We're happy to work with you to create a partnership that meets your specific goals and budget.
                        Contact our sponsorship team to discuss tailored opportunities.
                    </p>
                </BackgroundGradient>
            </div>
        </HybridPage>
    );
};
