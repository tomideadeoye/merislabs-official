import React from 'react';
import { THEME_TAGS } from './constants';
import { BackgroundGradient } from '@/components/ui/background-gradient';

export const ThemeDescription: React.FC = () => {
    // Function to get the appropriate color classes based on tag color
    const getColorClasses = (color: string) => {
        if (color === 'blue') {
            return 'bg-gradient-to-r from-[#1B4383]/50 to-[#1B4383]/70 text-[#1B4383] border-[#1B4383]/30 shadow-[#1B4383]/10';
        } else if (color === 'orange') {
            return 'bg-gradient-to-r from-[#F47937]/50 to-[#F47937]/70 text-[#F47937] border-[#F47937]/30 shadow-[#F47937]/10';
        }
        // Fallback to blue if neither blue nor orange
        return 'bg-gradient-to-r from-[#1B4383]/50 to-[#1B4383]/70 text-[#1B4383] border-[#1B4383]/30 shadow-[#1B4383]/10';
    };

    return (
        <BackgroundGradient className="mb-8 p-4 rounded-lg border border-[#1B4383]/30 shadow-lg shadow-[#1B4383]/20">
            <h3 className="text-xl font-semibold text-[#1B4383] mb-3 flex items-center">
                <span className="mr-2">🏙️</span> Event Theme
            </h3>
            <p className="text-gray-200">
                <span className="font-semibold text-[#F47937]">A Futuristic Tech City in a Dystopian Setting</span> -
                Modern and tech-inspired with glowing lights, digital effects, and futuristic energy.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
                {THEME_TAGS.map((tag, index) => (
                    <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded ${getColorClasses(tag.color)}`}
                    >
                        {tag.label}
                    </span>
                ))}
            </div>
        </BackgroundGradient>
    );
};
