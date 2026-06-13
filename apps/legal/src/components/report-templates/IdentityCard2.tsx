import React from 'react';

interface IdentityCard2Props {
    name: string;
    role: string;
    imageUrl: string;
    brandColor?: string;
    email?: string;
}

export const IdentityCard2: React.FC<IdentityCard2Props> = ({ 
    name, 
    role, 
    imageUrl, 
    brandColor = '#1a1a1a',
    email
}) => {
    return (
        <div className="flex flex-col items-center p-8 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-gray-200 transition-all text-center group">
            <div className="relative mb-6">
                <div 
                    className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{ backgroundColor: brandColor }}
                />
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-24 h-24 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all border-4 border-white shadow-md"
                />
            </div>
            
            <span 
                className="text-[10px] font-black uppercase tracking-[0.2em] mb-2"
                style={{ color: brandColor }}
            >
                {role}
            </span>
            <h3 className="text-xl font-sans font-bold text-gray-900 tracking-tight mb-1">
                {name}
            </h3>
            {email && (
                <p className="text-xs text-gray-400 font-light">
                    {email}
                </p>
            )}
            
            <div 
                className="w-8 h-1 mt-6 rounded-full"
                style={{ backgroundColor: brandColor }}
            />
        </div>
    );
};

export default IdentityCard2;"}
{