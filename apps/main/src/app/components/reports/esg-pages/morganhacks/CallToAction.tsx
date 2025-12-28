import React, { useState } from 'react';
import { CONTACT_INFO } from './constants';
import { BackgroundGradient } from '@/components/ui/background-gradient';

export const CallToAction: React.FC = () => {
    return (
        <BackgroundGradient className="text-center p-6 rounded-xl border border-[#1B4383]/30 shadow-lg shadow-[#1B4383]/20">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B4383] to-[#F47937] mb-3">
                Ready to Sponsor MorganHacks 2026?
            </h3>
            <p className="text-gray-200 mb-4">
                Be part of an innovative experience that brings together talented students, cutting-edge technology,
                and creative problem-solving in a vibrant, futuristic setting.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <div className="px-6 py-3 bg-gradient-to-r from-[#1B4383] to-[#F47937] text-white font-semibold rounded-lg shadow-lg shadow-[#1B4383]/30 border border-[#1B4383]/30">
                    Become a Sponsor
                </div>
            </div>

            <div className="mt-8 p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                <h4 className="text-lg font-semibold text-white mb-2">Contact Information</h4>
                <p className="text-gray-200">
                    For sponsorship inquiries, please contact us at:
                </p>
                <p className="text-[#F47937] font-medium mt-2">
                    {CONTACT_INFO.email}
                </p>
            </div>
        </BackgroundGradient>
    );
};
