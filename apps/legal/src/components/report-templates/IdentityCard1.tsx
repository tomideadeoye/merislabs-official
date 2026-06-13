import React from 'react';

interface IdentityCard1Props {
    name: string;
    role: string;
    imageUrl: string;
    brandColor?: string;
    accentColor?: string;
    linkedInUrl?: string;
}

export const IdentityCard1: React.FC<IdentityCard1Props> = ({ 
    name, 
    role, 
    imageUrl, 
    brandColor = '#800020',
    accentColor = '#1a1a1a',
    linkedInUrl
}) => {
    const CardContent = (
        <div className="flex items-center gap-8 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] group">
            <div className="relative">
                <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" 
                    style={{ backgroundColor: brandColor }}
                />
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/30 relative z-10 shadow-xl transition-transform duration-500"
                />
            </div>
            
            <div className="text-left border-l border-white/10 pl-8">
                <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40 mb-1">Profile</div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-0.5">{name}</h2>
                <div className="flex items-center gap-3 mt-1">
                    <p 
                        className="text-sm font-medium bg-white/90 px-2 py-0.5 rounded inline-block"
                        style={{ color: brandColor }}
                    >
                        {role}
                    </p>
                </div>
            </div>
        </div>
    );

    if (linkedInUrl) {
        return (
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
                {CardContent}
            </a>
        );
    }

    return CardContent;
};

export default IdentityCard1;