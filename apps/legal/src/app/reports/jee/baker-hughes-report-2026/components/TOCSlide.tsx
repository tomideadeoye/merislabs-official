import React from 'react';

export const TOCSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white p-12">
            <div className="absolute top-8 left-12 font-extrabold text-xl tracking-tighter text-red-600">JEE</div>

            <div className="w-full h-full flex pt-16 mt-8 relative z-10">
                {/* Left side content */}
                <div className="w-1/2 flex flex-col justify-center px-12 z-20">
                    <h2 className="text-4xl font-black text-red-600 mb-12 uppercase tracking-wide">
                        Table of Contents
                    </h2>

                    <ul className="space-y-6 text-xl tracking-wide font-medium text-gray-800">
                        <li className="flex items-center space-x-4 group cursor-pointer transition-all hover:translate-x-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full group-hover:bg-teal-600"></span>
                            <span>Update on pending litigation</span>
                        </li>
                        <li className="flex items-center space-x-4 group cursor-pointer transition-all hover:translate-x-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full group-hover:bg-teal-600"></span>
                            <span>Update on closed cases in 2025</span>
                        </li>
                        <li className="flex items-center space-x-4 group cursor-pointer transition-all hover:translate-x-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full group-hover:bg-teal-600"></span>
                            <span>Our Priorities for 2026</span>
                        </li>
                        <li className="flex items-center space-x-4 group cursor-pointer transition-all hover:translate-x-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full group-hover:bg-teal-600"></span>
                            <span>Value-Add Services for 2026</span>
                        </li>
                    </ul>
                </div>

                {/* Right side graphic */}
                <div className="w-1/2 relative z-10">
                    {/* The red slant ribbon */}
                    <div className="absolute -left-10 w-full h-full bg-red-600 shadow-xl" style={{
                        clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)'
                    }}></div>

                    {/* The Image inside */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 h-[70%] bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center rounded-sm shadow-2xl border-4 border-white"></div>
                </div>
            </div>

            {/* Frame outline aesthetic */}
            <div className="absolute inset-4 border border-red-200 pointer-events-none rounded-xl"></div>
        </div>
    );
};
