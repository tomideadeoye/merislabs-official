import React from 'react';

interface HeaderProps {
    number: string;
    title: string;
}

export const JEEHeader: React.FC<HeaderProps> = ({ number, title }) => {
    return (
        <div className="relative mb-10">
            <div className="flex items-baseline gap-4">
                <span className="text-5xl font-serif font-bold text-[#800020]/10 leading-none translate-y-2">
                    {number.padStart(2, '0')}
                </span>
                <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] tracking-tight uppercase">
                    {title}
                </h2>
            </div>
            <div className="mt-4 w-full h-px bg-gray-100 relative">
                <div className="absolute top-0 left-0 w-24 h-px bg-[#800020]"></div>
            </div>
        </div>
    );
};

export default JEEHeader;