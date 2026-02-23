import React from 'react';
import { valueAdd2026 } from '../data';

export const ValueAddSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white p-12 flex flex-col">
            <div className="absolute top-8 left-12 font-extrabold text-xl tracking-tighter text-red-600">JEE</div>

            {/* Slide Title */}
            <div className="w-full text-center mt-2 mb-16">
                <h2 className="text-3xl font-black text-red-600 uppercase tracking-wide inline-block border-b-2 border-red-200 pb-1">
                    Value-Add Services for 2026
                </h2>
            </div>

            {/* Visual Grid Split */}
            <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-8 items-start justify-center max-w-6xl mx-auto">
                {valueAdd2026.map((item, index) => (
                    <div key={index} className="flex flex-col relative bg-[#f9f9f9] rounded-2xl p-8 border border-gray-100 shadow-sm h-full group hover:bg-red-50 transition-colors duration-300">
                        {/* Number Indicator */}
                        <div className="absolute -top-6 -left-6 bg-red-600 text-white font-black text-4xl w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Text Content */}
                        <p className="text-gray-700 font-medium text-lg leading-relaxed mt-8 pl-4 border-l-4 border-red-200 group-hover:border-red-600 transition-colors text-justify">
                            {item}
                        </p>
                    </div>
                ))}
            </div>

            <div className="absolute inset-4 border border-red-100 pointer-events-none rounded-xl"></div>
        </div>
    );
};
