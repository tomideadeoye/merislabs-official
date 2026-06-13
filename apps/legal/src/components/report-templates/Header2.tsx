import React from 'react';

interface Header2Props {
    number: string | number;
    title: string;
    brandColor?: string;
}

export const Header2: React.FC<Header2Props> = ({ 
    number, 
    title, 
    brandColor = '#1a1a1a' 
}) => {
    return (
        <div className="relative mb-12 flex items-center gap-6">
            <div 
                className="w-1.5 h-16 rounded-full" 
                style={{ backgroundColor: brandColor }}
            />
            <div>
                <span 
                    className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-1 opacity-40"
                >
                    Section {String(number).padStart(2, '0')}
                </span>
                <h2 className="text-4xl font-sans font-extrabold tracking-tight text-gray-900">
                    {title}
                </h2>
            </div>
        </div>
    );
};

export default Header2;