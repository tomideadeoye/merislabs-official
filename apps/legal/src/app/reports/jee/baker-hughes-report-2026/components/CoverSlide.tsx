import React from 'react';

export const CoverSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white border-[12px] border-[#ececec]">
            {/* Top Red Bar */}
            <div className="absolute top-[88px] left-0 w-full h-[6px] bg-[#E80000] z-20"></div>

            {/* Header Logos */}
            <div className="absolute top-6 left-12 z-20 flex space-x-4 items-center h-12">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="Jackson Etti & Edu"
                    className="h-full w-auto object-contain"
                />
            </div>

            <div className="absolute top-6 right-12 z-20 flex space-x-3 items-center h-10">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Baker_Hughes_Logo.svg/2560px-Baker_Hughes_Logo.svg.png"
                    alt="Baker Hughes"
                    className="h-full w-auto object-contain"
                />
            </div>

            {/* Background Image Setup */}
            <div className="absolute right-0 top-[94px] bottom-[24px] w-[55%] z-0">
                <div className="w-full h-full bg-[url('/union-bank/marina-skyline.jpg')] bg-cover bg-right"></div>
            </div>

            {/* The White Overlay for left side */}
            <div className="absolute left-0 top-[94px] bottom-[24px] w-[45%] bg-white z-10"></div>

            {/* The Red Chevron Shape */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[65%] h-[200px] z-20 flex items-center pr-[10%]" style={{
                background: 'linear-gradient(90deg, #db2b2b 0%, #E80000 85%, #b21f1f 100%)',
                clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
                boxShadow: '10px 10px 30px rgba(0,0,0,0.5)'
            }}>
                <h1 className="text-white text-[32px] font-bold leading-[1.2] uppercase tracking-wide ml-12 drop-shadow-md">
                    JEE STATUS<br />REPORT TO BAKER<br />HUGHES-2026
                </h1>
            </div>

            {/* Date Badge */}
            <div className="absolute top-[calc(50%+120px)] left-12 bg-[#4a4a4a] text-white px-8 py-2 font-semibold text-sm shadow-md z-30">
                February 2026
            </div>

            {/* Bottom Red Bar */}
            <div className="absolute bottom-[24px] left-0 w-full h-[6px] bg-[#E80000] z-20"></div>

        </div>
    );
};
