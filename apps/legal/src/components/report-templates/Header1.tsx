import React from 'react';

interface Header1Props {
    number: string | number;
    title: string;
    brandColor?: string;
    accentColor?: string;
}

export const Header1: React.FC<Header1Props> = ({ 
    number, 
    title, 
    brandColor = '#800020', 
    accentColor = '#1a1a1a' 
}) => {
    const displayNum = String(number).padStart(2, '0');
    
    return (
        <div className="relative mb-10">
            <div className="flex items-baseline gap-4">
                <span 
                    className="text-5xl font-serif font-bold leading-none translate-y-2 opacity-10"
                    style={{ color: brandColor }}
                >
                    {displayNum}
                </span>
                <h2 
                    className="text-3xl font-serif font-bold tracking-tight uppercase"
                    style={{ color: accentColor }}
                >
                    {title}
                </h2>
            </div>
            <div className="mt-4 w-full h-px bg-gray-100 relative">
                <div 
                    className="absolute top-0 left-0 w-24 h-px" 
                    style={{ backgroundColor: brandColor }}
                ></div>
            </div>
        </div>
    );
};

export default Header1;