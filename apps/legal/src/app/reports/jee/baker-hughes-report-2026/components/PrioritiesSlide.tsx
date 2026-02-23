import React from 'react';
import { priorities2026 } from '../data';

export const PrioritiesSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white p-12 flex flex-col">
            <div className="absolute top-8 left-12 font-extrabold text-xl tracking-tighter text-red-600">JEE</div>

            {/* Slide Title */}
            <div className="w-full text-center mt-2 mb-12">
                <h2 className="text-3xl font-black text-red-600 uppercase tracking-wide inline-block border-b-2 border-red-200 pb-1">
                    Our Priorities for 2026
                </h2>
            </div>

            {/* Layout Split */}
            <div className="flex-grow flex w-full max-w-5xl mx-auto gap-12 items-center">

                {/* Visual / Icon Box */}
                <div className="w-1/3 flex flex-col justify-center items-center">
                    <div className="w-[80%] aspect-square rounded-full border-8 border-red-600 shadow-xl flex items-center justify-center p-8 bg-red-50 relative">
                        <div className="text-red-700 w-full h-full grid place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[60%] h-[60%]">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="w-2/3 h-full flex flex-col justify-center gap-6">
                    {priorities2026.split('\n\n').map((paragraph, index) => (
                        <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-red-100 flex items-start gap-4 text-justify relative">
                            <span className="text-red-600 font-extrabold text-2xl mt-1">
                                {index + 1}.
                            </span>
                            <p className="text-gray-700 leading-relaxed text-base pt-1">
                                {paragraph}
                            </p>
                        </div>
                    ))}
                </div>

            </div>

            <div className="absolute inset-4 border border-red-100 pointer-events-none rounded-xl"></div>
        </div>
    );
};
