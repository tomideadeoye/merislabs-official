import React from 'react';

interface LitigationData {
    suitNo: string;
    summary: string;
    status: string;
    nextSteps?: string;
}

export const LitigationSlide: React.FC<{ data: LitigationData }> = ({ data }) => {
    // 2 columns or 3 columns depending on nextSteps
    const cols = data.nextSteps ? 3 : 2;

    return (
        <div className="w-full h-full relative overflow-hidden bg-white p-12 flex flex-col">
            {/* Logo */}
            <div className="absolute top-8 left-12 font-extrabold text-xl tracking-tighter text-red-600">JEE</div>

            {/* Slide Title */}
            <div className="w-full text-center mt-2 mb-4">
                <h2 className="text-3xl font-black text-red-600 uppercase tracking-wide inline-block border-b-2 border-red-200 pb-1">
                    Pending Litigation Matters
                </h2>
            </div>

            {/* Suit Number Pill */}
            <div className="w-full max-w-4xl mx-auto bg-gray-50 border-2 border-red-200 rounded-full px-8 py-3 text-center shadow-sm mb-8">
                <p className="font-bold text-gray-800 text-sm tracking-widest uppercase">
                    {data.suitNo}
                </p>
            </div>

            {/* Content Grid */}
            <div className={`grid grid-cols-${cols} gap-6 flex-grow pb-8`}>

                {/* Summary Column */}
                <div className="flex flex-col h-full relative">
                    <div className="bg-green-600 text-white rounded-t-2xl py-2 px-6 shadow-md text-center mx-4 -mb-4 z-10 relative mt-2 relative">
                        <span className="font-bold tracking-widest text-sm uppercase shadow-sm">Summary</span>
                    </div>
                    <div className="bg-[#f0f8f4] border border-green-100 rounded-2xl p-8 pt-10 flex-grow shadow-inner text-sm text-gray-700 leading-relaxed text-justify overflow-hidden flex flex-col justify-start">
                        {data.summary.split('\n').map((para, i) => (
                            <p key={i} className={i > 0 ? "mt-3" : ""}>{para}</p>
                        ))}
                    </div>
                </div>

                {/* Status Column */}
                <div className="flex flex-col h-full relative">
                    <div className="bg-red-700 text-white rounded-t-2xl py-2 px-6 shadow-md text-center mx-4 -mb-4 z-10 relative mt-2 relative">
                        <span className="font-bold tracking-widest text-sm uppercase shadow-sm">Status</span>
                    </div>
                    <div className="bg-[#fcf2f2] border border-red-100 rounded-2xl p-8 pt-10 flex-grow shadow-inner text-sm text-gray-700 leading-relaxed text-justify overflow-hidden flex flex-col justify-start">
                        {data.status.split('\n').map((para, i) => (
                            <p key={i} className={i > 0 ? "mt-3" : ""}>{para}</p>
                        ))}
                    </div>
                </div>

                {/* Next Steps Column (Optional) */}
                {data.nextSteps && (
                    <div className="flex flex-col h-full relative">
                        <div className="bg-purple-600 text-white rounded-t-2xl py-2 px-6 shadow-md text-center mx-4 -mb-4 z-10 relative mt-2 relative">
                            <span className="font-bold tracking-widest text-sm shadow-sm uppercase">Next Steps / Actions</span>
                        </div>
                        <div className="bg-[#f6f2fc] border border-purple-100 rounded-2xl p-8 pt-10 flex-grow shadow-inner text-sm text-gray-700 leading-relaxed text-justify overflow-hidden flex flex-col justify-start">
                            {data.nextSteps.split('\n').map((para, i) => (
                                <p key={i} className={i > 0 ? "mt-3" : ""}>{para}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Outline aesthetic */}
            <div className="absolute inset-4 border border-gray-100 pointer-events-none rounded-xl"></div>
        </div>
    );
};
