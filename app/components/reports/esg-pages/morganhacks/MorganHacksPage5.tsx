import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';

interface MorganHacksPage5Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage5: React.FC<MorganHacksPage5Props> = ({
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
                    Join Us as a Sponsor
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <BackgroundGradient className="p-6 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/20">
                <h2 className="text-2xl font-semibold text-red-400 mb-4">Be Part of the Innovation</h2>
                <p className="text-gray-200 mb-6">
                    Your sponsorship will directly support student innovation, provide valuable resources and prizes,
                    and help create an unforgettable experience for participants. Join us in shaping the future of technology.
                </p>

                <div className="text-center p-6 bg-gradient-to-r from-red-900/50 to-blue-900/50 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/10 mb-8">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400 mb-3">
                        Ready to Sponsor MorganHacks 2026?
                    </h3>
                    <p className="text-gray-200 mb-4">
                        Be part of an innovative experience that brings together talented students, cutting-edge technology,
                        and creative problem-solving in a vibrant, futuristic setting.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30 border border-red-500/30">
                            Become a Sponsor
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 border border-purple-500/30">
                            Contact Us
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-900/80 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
                        <h3 className="text-lg font-semibold text-blue-400 mb-2">Contact Information</h3>
                        <ul className="text-gray-200 space-y-2">
                            <li>Email: sponsor@morganhacks.org</li>
                            <li>Phone: (555) 123-4567</li>
                            <li>Website: www.morganhacks.org</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-gray-900/80 rounded-lg border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Event Details</h3>
                        <ul className="text-gray-200 space-y-2">
                            <li>Dates: April 11-12, 2026</li>
                            <li>Location: Morgan State University</li>
                            <li>Expected Attendees: 300+</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Thank you for considering sponsorship of MorganHacks 2026. We look forward to partnering with you!
                    </p>
                </div>
            </BackgroundGradient>
        </HybridPage>
    );
};
