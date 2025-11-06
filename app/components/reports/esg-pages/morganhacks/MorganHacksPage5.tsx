import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import GlitchText from '../../../../components/GlitchText';

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
                <GlitchText
                    speed={1}
                    enableShadows={true}
                    enableOnHover={false}
                    className="font-bold text-white mb-4"
                >
                    Join Us as a Sponsor
                </GlitchText>
                <div className="w-24 h-1 bg-[#F47937] mx-auto rounded-full"></div>
            </div>

            <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20">
                <h2 className="font-semibold text-white mb-4 text-xl">
                    Be Part of the Innovation
                </h2>
                <p className="text-gray-200 mb-6">
                    Your sponsorship will directly support student innovation, provide valuable resources and prizes,
                    and help create an unforgettable experience for participants. Join us in shaping the future of technology.
                </p>

                <div className="mt-8 p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                    <h3 className="text-lg font-semibold text-white mb-2">Sponsor Testimonials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-800/80 rounded border border-gray-600/30">
                            <p className="text-gray-200 italic text-sm">"MorganHacks provided an excellent opportunity to connect with talented students and see innovative solutions to real-world problems."</p>
                            <p className="text-gray-400 text-xs mt-2">- Google Recruiting Team</p>
                        </div>
                        <div className="p-3 bg-gray-800/80 rounded border border-gray-600/30">
                            <p className="text-gray-200 italic text-sm">"The energy and creativity at MorganHacks was incredible. We were impressed by the quality of projects and the passion of the participants."</p>
                            <p className="text-gray-400 text-xs mt-2">- Microsoft Innovation Lab</p>
                        </div>
                    </div>
                </div>

                <div className="text-center p-6 bg-[#F47937] rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10 mb-8 mt-8">
                    <h3 className="text-2xl font-bold text-white mb-3">
                        Ready to Sponsor MorganHacks 2026?
                    </h3>
                    <p className="text-white mb-4">
                        Be part of an innovative experience that brings together talented students, cutting-edge technology,
                        and creative problem-solving in a vibrant, futuristic setting.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <button className="px-6 py-3 bg-[#F47937] text-white font-semibold rounded-lg hover:bg-[#F47937] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#F47937]/30 border border-[#F47937]/30">
                            Become a Sponsor
                        </button>
                        <button className="px-6 py-3 bg-white text-[#F47937] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#F47937]/30 border border-[#F47937]/30">
                            Contact Us
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                        <h3 className="text-lg font-semibold text-white mb-2">Contact Information</h3>
                        <ul className="text-gray-200 space-y-2">
                            <li>Email: morganhacks2022@gmail.com</li>
                            <li>Website: www.morganhacks.org</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                        <h3 className="text-lg font-semibold text-white mb-2">Event Details</h3>
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
