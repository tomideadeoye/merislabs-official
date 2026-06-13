import React from 'react';

interface Footer2Props {
    pageNumber: string | number;
    projectName?: string;
    brandColor?: string;
    firmName?: string;
}

export const Footer2: React.FC<Footer2Props> = ({ 
    pageNumber, 
    projectName = 'Quarterly Brief', 
    brandColor = '#1a1a1a',
    firmName = 'MerisLabs'
}) => {
    return (
        <footer className="w-full px-16 py-8 border-t border-gray-100 flex justify-between items-end bg-white text-[10px] text-gray-400 font-medium tracking-wide uppercase">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                    <span className="text-gray-900 font-bold tracking-widest">{firmName}</span>
                </div>
                <p>{projectName}</p>
            </div>
            <div className="flex items-baseline gap-4">
                <span className="text-gray-200">/</span>
                <span className="text-gray-900 font-bold text-base tabular-nums">
                    {String(pageNumber).padStart(2, '0')}
                </span>
            </div>
        </footer>
    );
};

export default Footer2;