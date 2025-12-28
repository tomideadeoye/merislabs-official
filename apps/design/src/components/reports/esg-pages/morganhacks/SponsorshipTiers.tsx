import React from 'react';
import { SPONSORSHIP_TIERS } from './constants';

export const SponsorshipTiers: React.FC = () => {
    return (
        <div className="p-6 bg-gray-900 rounded-xl border border-purple-500/50">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Choose Your Level of Engagement</h2>
            <p className="text-gray-300 mb-6">
                Each sponsorship tier offers unique opportunities to connect with our participants and showcase your brand.
                All sponsors receive recognition in our event materials and social media channels.
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-cyan-900 to-purple-900">
                            <th className="p-3 font-semibold text-white">Benefits</th>
                            {SPONSORSHIP_TIERS.map((tier) => (
                                <th key={tier.name} className="p-3 font-semibold text-white">
                                    {tier.name} ({tier.price})
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            "Logo on event website",
                            "Social media mentions",
                            "Booth/table space",
                            "Judging opportunity",
                            "Speaking slot",
                            "Dedicated recognition"
                        ].map((benefit, benefitIndex) => (
                            <tr key={benefit} className="border-b border-gray-700">
                                <td className="p-3 text-gray-300">{benefit}</td>
                                {SPONSORSHIP_TIERS.map((tier) => (
                                    <td key={tier.name} className="p-3 text-center">
                                        {tier.benefits.includes(benefit) ? (
                                            <span className="text-green-400">✓</span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
