import React from 'react';

interface ClosedCaseData {
    suitNo: string;
    status: string;
}

export const ClosedCasesSlide: React.FC<{ data: ClosedCaseData, index: number, total: number }> = ({ data, index, total }) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white p-12 flex flex-col">
            <div className="absolute top-8 left-12 font-extrabold text-xl tracking-tighter text-blue-800">JEE</div>

            {/* Slide Title */}
            <div className="w-full text-center mt-2 mb-4">
                <h2 className="text-3xl font-black text-blue-800 uppercase tracking-wide inline-block border-b-2 border-blue-200 pb-1">
                    Closed Cases in 2025
                    <span className="text-gray-400 text-sm ml-4 font-normal tracking-wide lowercase">({index + 1} of {total})</span>
                </h2>
            </div>

            {/* Suit Number Header */}
            <div className="w-full bg-blue-50 border-l-4 border-blue-800 p-6 rounded-r-lg shadow-sm mb-8 relative">
                <div className="absolute top-0 right-0 bg-blue-800 text-white px-4 py-1 text-xs font-bold uppercase rounded-bl-lg">Case Complete</div>
                <h3 className="font-bold text-gray-800 text-lg uppercase pr-24">
                    {data.suitNo}
                </h3>
            </div>

            {/* Content Box */}
            <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner flex-grow relative pb-8">
                <div className="bg-slate-200 px-8 py-4 border-b border-slate-300">
                    <h4 className="font-bold text-slate-800 uppercase tracking-widest text-sm flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
                        Status & Resolution
                    </h4>
                </div>
                <div className="p-10 flex-grow flex flex-col justify-start">
                    <p className="text-gray-700 leading-loose text-justify text-base">
                        {data.status}
                    </p>
                </div>
            </div>

            {/* Outline aesthetic */}
            <div className="absolute inset-4 border border-blue-100 pointer-events-none rounded-xl"></div>
        </div>
    );
};
