import React from 'react';
import { priorities2026 } from '../data';
import { useDeckNavigation } from './NavigationContext';

export const PrioritiesSlide = () => {
    const { goToSlideById } = useDeckNavigation();
    return (
        <div className="w-full h-full relative overflow-hidden bg-white font-sans">
            {/* Background branding */}
            <div className="absolute top-10 left-16 z-20 flex items-center space-x-4">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="JEE"
                    className="h-6 w-auto opacity-70"
                />
                <div className="h-4 w-px bg-gray-300" />
                <span className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase">Strategic Roadmap // 2026</span>
            </div>

            {/* Slide Title - MOVED HIGHER */}
            <div className="absolute top-24 left-16 right-16 z-20">
                <div className="flex items-center space-x-4 mb-3">
                    <div className="h-[2px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.4em] text-xs uppercase underline-offset-8">Execution Priorities</span>
                </div>
                <h2 className="text-gray-900 text-5xl font-black uppercase tracking-tighter">
                    Forward <span className="text-red-600">Strategy</span>
                </h2>
            </div>

            {/* Content Core - MOVED HIGHER AND TIGHTENED */}
            <div className="absolute top-[180px] bottom-12 left-16 right-16 z-10 grid grid-cols-12 gap-8">

                {/* Visual / Icon Box */}
                <div className="col-span-4 flex flex-col justify-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-red-600/10 blur-[100px] rounded-full group-hover:bg-red-600/20 transition-all duration-1000" />
                        <div className="relative w-full aspect-square border-2 border-red-600/30 rounded-sm flex items-center justify-center p-10 bg-gray-50 overflow-hidden">
                            <div className="absolute inset-4 border border-gray-200 rounded-full" />
                            <div className="absolute inset-10 border border-gray-200 rounded-full" />
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />
                            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200" />

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[45%] h-[45%] text-red-600 relative z-10 opacity-90">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" fill="currentColor" />
                                <path strokeLinecap="round" d="M12 2v2m0 16v2M2 12h2m16 0h2" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Text Content - HIGH CONTRAST */}
                <div className="col-span-8 flex flex-col justify-start space-y-4 h-full overflow-hidden">
                    <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar space-y-4">
                        {priorities2026.split('\n\n').map((paragraph, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 p-7 rounded-sm relative group hover:border-red-600/50 transition-all shadow-sm shrink-0">
                                <div className="absolute top-0 left-0 w-1 h-12 bg-red-600" />
                                <div className="flex items-start space-x-6">
                                    <span className="text-red-600 font-mono text-2xl font-black italic mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                        0{index + 1}
                                    </span>
                                    <p className="text-gray-700 leading-relaxed text-[15px] pt-1 text-justify">
                                        {paragraph}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-row items-center justify-between px-6 border-l border-red-600/30 shrink-0 gap-4">
                        <p className="text-gray-500 text-[9px] font-bold tracking-[0.4em] uppercase leading-relaxed flex-1">
                            Securing positive outcomes through precision legal engineering
                        </p>
                        <button
                            onClick={() => goToSlideById('04')}
                            className="text-red-600 border border-red-600/30 bg-red-600/5 hover:bg-red-600/20 hover:text-red-500 px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors shrink-0 flex items-center space-x-2"
                        >
                            <span>Explore Value-Add Advisory</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.05);
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(232, 0, 0, 0.4);
                        border-radius: 10px;
                    }
                `}</style>

            </div>

            {/* Frame outline aesthetic */}
            <div className="absolute inset-8 border border-gray-200 pointer-events-none"></div>

            {/* Pagination / ID */}
            <div className="absolute bottom-12 left-16 text-gray-900/10 font-mono text-xs tracking-widest uppercase">
                Strategy Module // Ref. BK-2026
            </div>
        </div>
    );
};
