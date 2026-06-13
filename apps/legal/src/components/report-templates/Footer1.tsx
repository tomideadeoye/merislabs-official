import React from 'react';

interface Footer1Props {
    pageNumber: string | number;
    projectName?: string;
    date?: string;
    logoSrc?: string;
    firmName?: string;
    backgroundColor?: string;
    textColor?: string;
}

export const Footer1: React.FC<Footer1Props> = ({ 
    pageNumber, 
    projectName = 'Project Report', 
    date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    logoSrc, 
    firmName = 'Firm Name',
    backgroundColor = '#1a1a1a',
    textColor = '#ffffff'
}) => {
    return (
        <footer 
            className="w-full py-4 px-16 text-xs flex justify-between items-center transition-all"
            style={{ backgroundColor, color: textColor }}
        >
            <div className="flex items-center gap-3">
                {logoSrc ? (
                    <img
                        src={logoSrc}
                        alt={firmName}
                        className="h-5 w-auto brightness-0 invert"
                    />
                ) : (
                    <span className="font-bold uppercase tracking-wider">{firmName}</span>
                )}
            </div>
            <div className="flex items-center gap-6 font-light uppercase tracking-widest text-[9px]">
                <span>{projectName}</span>
                <span className="opacity-20">|</span>
                <span>{date}</span>
                <span className="opacity-20">|</span>
                <span className="font-bold">Page {pageNumber}</span>
            </div>
        </footer>
    );
};

export default Footer1;