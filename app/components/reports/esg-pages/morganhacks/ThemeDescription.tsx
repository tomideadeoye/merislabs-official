import React from 'react';
import { THEME_TAGS } from './constants';
import { BackgroundGradient } from '@/components/ui/background-gradient';

export const ThemeDescription: React.FC = () => {
    return (
        <BackgroundGradient className="mb-8 p-4 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
            <h3 className="text-xl font-semibold text-cyan-400 mb-3 flex items-center">
                <span className="mr-2">🏙️</span> Event Theme
            </h3>
            <p className="text-gray-200">
                <span className="font-semibold text-purple-400">A Futuristic Tech City in a Dystopian Setting</span> -
                Modern and tech-inspired with glowing lights, digital effects, and futuristic energy.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
                {THEME_TAGS.map((tag, index) => (
                    <span
                        key={index}
                        className={`px-2 py-1 bg-${tag.color}-900/50 text-${tag.color}-400 text-xs rounded border border-${tag.color}-500/30 shadow-lg shadow-${tag.color}-500/10`}
                    >
                        {tag.label}
                    </span>
                ))}
            </div>
        </BackgroundGradient>
    );
};
