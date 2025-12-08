"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

export const RetirementCelebrationClient: React.FC = () => {
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nav = document.querySelector('nav');
        const header = document.querySelector('header');
        if (nav) nav.classList.add('print:hidden');
        if (header) header.classList.add('print:hidden');
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Print Button */}
            <div className="fixed top-4 right-4 z-50 print:hidden no-print">
                <button
                    onClick={handlePrint}
                    className="bg-gradient-to-r from-amber-600 to-rose-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print / Save as PDF
                </button>
            </div>

            <div ref={printRef} className="print-content">

                {/* ==================== DESIGN 1: Original Compact ==================== */}
                <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 print:bg-white print:min-h-0 py-8 print:py-0">
                    <div className="text-center mb-4 print:hidden">
                        <span className="bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-semibold">Design 1 - Corporate Style</span>
                    </div>
                    <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none">
                        <div className="relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent"></div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-400/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400/20 to-transparent"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-rose-400/20 to-transparent"></div>

                            <div className="m-2 border-4 border-amber-400 relative" style={{ borderImage: 'linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37, #FFD700, #D4AF37) 1' }}>
                                <div className="border-2 border-amber-300 m-0.5">
                                    <div className="p-4 print:p-3">

                                        <div className="text-center mb-2">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-500 to-amber-500"></div>
                                                <span className="text-amber-500 text-base">✦</span>
                                                <div className="h-px w-12 bg-gradient-to-l from-transparent via-amber-500 to-amber-500"></div>
                                            </div>
                                            <h1 className="text-lg font-serif text-gray-700 tracking-widest uppercase font-bold">The Adeoye Family</h1>
                                            <p className="text-sm text-amber-600 italic font-serif">Cordially Invites You To The</p>
                                        </div>

                                        <div className="text-center mb-2">
                                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent font-serif tracking-wide leading-tight">Retirement Celebration</h2>
                                            <p className="text-sm text-gray-600 italic font-serif">Of Our Beloved Matriarch</p>
                                        </div>

                                        <div className="flex items-center justify-center gap-4 mb-3">
                                            <div className="relative flex-shrink-0">
                                                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded opacity-75"></div>
                                                <div className="relative bg-white p-1 rounded shadow-lg">
                                                    <div className="relative w-28 h-36 print:w-24 print:h-32 overflow-hidden rounded">
                                                        <Image src="/images/mum.jpeg" alt="Mrs Bose Adeoye" fill className="object-cover" priority />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-amber-600 uppercase tracking-widest font-semibold">Celebrating</p>
                                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif">Mrs Bose Adeoye</h3>
                                                <div className="flex items-center gap-2 my-1">
                                                    <div className="h-px w-6 bg-amber-400"></div>
                                                    <span className="text-amber-500 text-xs">★</span>
                                                    <div className="h-px w-6 bg-amber-400"></div>
                                                </div>
                                                <p className="text-xs text-gray-600 font-medium">(RETIREMENT SERVICE & THANKSGIVING)</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded p-2 mb-2 shadow text-sm">
                                            <div className="flex justify-center items-center gap-4 text-center">
                                                <div><span className="font-bold">DATE:</span> [Saturday, 00th Month, 2025]</div>
                                                <div className="w-px h-4 bg-white/50"></div>
                                                <div><span className="font-bold">TIME:</span> [00:00 AM]</div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded p-2 mb-3 shadow text-sm text-center">
                                            <span className="font-bold">VENUE:</span> [Venue Name, Address Line 1, City, State]
                                        </div>

                                        <div className="text-center mb-2 bg-amber-50 rounded p-2 border border-amber-200">
                                            <p className="text-amber-600 font-bold uppercase tracking-wider text-xs">Chairman</p>
                                            <p className="text-base font-bold text-gray-800">[Chairman&apos;s Full Name]</p>
                                            <p className="text-xs text-amber-600 italic">[Title/Position]</p>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 mb-2 text-center text-[10px]">
                                            <div className="bg-amber-50 rounded p-1.5 border border-amber-200">
                                                <p className="text-amber-600 font-bold uppercase">Host</p>
                                                <p className="font-semibold text-gray-800 text-xs">[Host Name]</p>
                                                <p className="text-gray-500">[Title]</p>
                                            </div>
                                            <div className="bg-rose-50 rounded p-1.5 border border-rose-200">
                                                <p className="text-rose-600 font-bold uppercase">Hostess</p>
                                                <p className="font-semibold text-gray-800 text-xs">[Hostess Name]</p>
                                                <p className="text-gray-500">[Title]</p>
                                            </div>
                                            <div className="bg-orange-50 rounded p-1.5 border border-orange-200">
                                                <p className="text-orange-600 font-bold uppercase">Special Guest</p>
                                                <p className="font-semibold text-gray-800 text-xs">[Guest Name]</p>
                                                <p className="text-gray-500">[Title]</p>
                                            </div>
                                            <div className="bg-pink-50 rounded p-1.5 border border-pink-200">
                                                <p className="text-pink-600 font-bold uppercase">Guest of Honour</p>
                                                <p className="font-semibold text-gray-800 text-xs">[Guest Name]</p>
                                                <p className="text-gray-500">[Title]</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded p-2 mb-2 border border-amber-200">
                                            <p className="text-amber-600 font-bold uppercase tracking-wider text-[10px] text-center mb-1">Distinguished Guests</p>
                                            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                                                <div><p className="font-semibold text-gray-800">[Guest 1]</p><p className="text-gray-500">[Title]</p></div>
                                                <div><p className="font-semibold text-gray-800">[Guest 2]</p><p className="text-gray-500">[Title]</p></div>
                                                <div><p className="font-semibold text-gray-800">[Guest 3]</p><p className="text-gray-500">[Title]</p></div>
                                                <div><p className="font-semibold text-gray-800">[Guest 4]</p><p className="text-gray-500">[Title]</p></div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded p-2 text-center text-sm">
                                            <span className="font-bold text-amber-400">RSVP:</span>
                                            <span className="ml-2">[Contact Name]</span>
                                            <span className="text-amber-400 mx-2">|</span>
                                            <span className="text-amber-300 font-semibold">[Phone Number]</span>
                                        </div>

                                        <div className="mt-2 text-center">
                                            <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px]">
                                                <div className="h-px w-8 bg-amber-300"></div>
                                                <span className="italic">With Love from the Adeoye Family</span>
                                                <div className="h-px w-8 bg-amber-300"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== DESIGN 2: Elegant Centered ==================== */}
                <div className="w-full min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 print:bg-white print:min-h-0 py-8 print:py-0 print:mt-0 print:page-break-before-always">
                    <div className="text-center mb-4 print:hidden">
                        <span className="bg-rose-100 text-rose-800 px-4 py-1 rounded-full text-sm font-semibold">Design 2 - Elegant Centered</span>
                    </div>
                    <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none overflow-hidden">
                        {/* Ornate Border */}
                        <div className="relative p-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300">
                            <div className="bg-white">
                                <div className="p-1 border-2 border-amber-200">
                                    {/* Inner decorative border */}
                                    <div className="relative border border-amber-100 p-4 print:p-3">

                                        {/* Corner Ornaments */}
                                        <div className="absolute top-2 left-2 text-amber-400 text-2xl">❧</div>
                                        <div className="absolute top-2 right-2 text-amber-400 text-2xl transform scale-x-[-1]">❧</div>
                                        <div className="absolute bottom-2 left-2 text-amber-400 text-2xl transform scale-y-[-1]">❧</div>
                                        <div className="absolute bottom-2 right-2 text-amber-400 text-2xl transform scale-[-1]">❧</div>

                                        {/* Header with Flourish */}
                                        <div className="text-center mb-3">
                                            <div className="inline-flex items-center gap-3">
                                                <span className="text-amber-400">✿</span>
                                                <span className="text-amber-400 text-lg">═══════</span>
                                                <span className="text-amber-500 text-xl">✦</span>
                                                <span className="text-amber-400 text-lg">═══════</span>
                                                <span className="text-amber-400">✿</span>
                                            </div>
                                            <h1 className="text-xl font-serif text-gray-800 tracking-[0.3em] uppercase mt-2 font-light">
                                                The Adeoye Family
                                            </h1>
                                            <p className="text-amber-600 italic text-base font-serif mt-1">
                                                Joyfully Invites You To The
                                            </p>
                                        </div>

                                        {/* Main Title - Large & Elegant */}
                                        <div className="text-center mb-4">
                                            <h2 className="text-4xl md:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 leading-tight tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                                                Retirement
                                            </h2>
                                            <h2 className="text-3xl md:text-4xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 -mt-1">
                                                Celebration
                                            </h2>
                                            <div className="flex items-center justify-center gap-2 mt-2">
                                                <span className="text-rose-400">~</span>
                                                <span className="text-gray-500 italic text-sm">Of Our Beloved Matriarch</span>
                                                <span className="text-rose-400">~</span>
                                            </div>
                                        </div>

                                        {/* CENTERED PHOTO - Hero Element */}
                                        <div className="flex justify-center mb-3">
                                            <div className="relative">
                                                {/* Outer Glow */}
                                                <div className="absolute -inset-3 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 rounded-lg blur-sm opacity-60"></div>
                                                {/* Frame */}
                                                <div className="relative bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 p-1 rounded-lg shadow-2xl">
                                                    <div className="bg-white p-1 rounded">
                                                        <div className="relative w-36 h-44 print:w-32 print:h-40 overflow-hidden rounded">
                                                            <Image src="/images/mum.jpeg" alt="Mrs Bose Adeoye" fill className="object-cover" priority />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* NAME - Massive & Proud */}
                                        <div className="text-center mb-3">
                                            <p className="text-amber-600 uppercase tracking-[0.4em] text-xs font-semibold mb-1">✦ Celebrating ✦</p>
                                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif tracking-wide" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                                                Mrs Bose Adeoye
                                            </h3>
                                            <div className="flex items-center justify-center gap-3 mt-2">
                                                <span className="text-amber-400">✧</span>
                                                <span className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></span>
                                                <span className="text-rose-500 text-lg">❋</span>
                                                <span className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></span>
                                                <span className="text-amber-400">✧</span>
                                            </div>
                                            <p className="text-rose-600 text-xs font-medium mt-1 tracking-wider">(RETIREMENT SERVICE & THANKSGIVING)</p>
                                        </div>

                                        {/* Event Details - Elegant Cards */}
                                        <div className="flex justify-center gap-4 mb-3">
                                            <div className="text-center px-6 py-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 shadow-sm">
                                                <p className="text-amber-700 font-bold text-xs uppercase tracking-wider">Date</p>
                                                <p className="text-gray-800 font-semibold text-sm">[Saturday, 00th Month]</p>
                                                <p className="text-amber-600 font-bold text-lg">2025</p>
                                            </div>
                                            <div className="text-center px-6 py-2 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg border border-rose-200 shadow-sm">
                                                <p className="text-rose-700 font-bold text-xs uppercase tracking-wider">Time</p>
                                                <p className="text-gray-800 font-bold text-xl">[00:00]</p>
                                                <p className="text-rose-600 font-semibold text-sm">AM</p>
                                            </div>
                                        </div>

                                        {/* Venue - Elegant */}
                                        <div className="text-center mb-3 py-2 px-4 bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 rounded-lg border border-rose-200">
                                            <p className="text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">✦ Venue ✦</p>
                                            <p className="text-gray-800 font-medium text-sm">[Venue Name, Address, City, State]</p>
                                        </div>

                                        {/* Chairman */}
                                        <div className="text-center mb-2 py-2 bg-amber-50/50 rounded border border-amber-100">
                                            <p className="text-amber-600 font-semibold text-[10px] uppercase tracking-widest">Chairman of the Occasion</p>
                                            <p className="text-gray-900 font-bold text-lg font-serif">[Chairman&apos;s Name]</p>
                                            <p className="text-amber-600 italic text-xs">[Title/Position]</p>
                                        </div>

                                        {/* Dignitaries - Elegant Grid */}
                                        <div className="grid grid-cols-4 gap-2 mb-2 text-center">
                                            <div className="py-1.5 border-l-2 border-amber-400 bg-amber-50/30">
                                                <p className="text-amber-700 font-bold text-[9px] uppercase">Host</p>
                                                <p className="text-gray-800 font-semibold text-[11px]">[Name]</p>
                                                <p className="text-gray-500 text-[9px]">[Title]</p>
                                            </div>
                                            <div className="py-1.5 border-l-2 border-rose-400 bg-rose-50/30">
                                                <p className="text-rose-700 font-bold text-[9px] uppercase">Hostess</p>
                                                <p className="text-gray-800 font-semibold text-[11px]">[Name]</p>
                                                <p className="text-gray-500 text-[9px]">[Title]</p>
                                            </div>
                                            <div className="py-1.5 border-l-2 border-orange-400 bg-orange-50/30">
                                                <p className="text-orange-700 font-bold text-[9px] uppercase">Special Guest</p>
                                                <p className="text-gray-800 font-semibold text-[11px]">[Name]</p>
                                                <p className="text-gray-500 text-[9px]">[Title]</p>
                                            </div>
                                            <div className="py-1.5 border-l-2 border-pink-400 bg-pink-50/30">
                                                <p className="text-pink-700 font-bold text-[9px] uppercase">Guest of Honour</p>
                                                <p className="text-gray-800 font-semibold text-[11px]">[Name]</p>
                                                <p className="text-gray-500 text-[9px]">[Title]</p>
                                            </div>
                                        </div>

                                        {/* Distinguished Guests */}
                                        <div className="mb-2 py-2 px-3 border border-dashed border-amber-300 rounded bg-gradient-to-r from-amber-50/50 via-white to-rose-50/50">
                                            <p className="text-center text-amber-700 font-semibold text-[9px] uppercase tracking-widest mb-1">Distinguished Guests</p>
                                            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                                                <div><p className="font-semibold text-gray-800">[Guest 1]</p><p className="text-gray-400 text-[8px]">[Title]</p></div>
                                                <div><p className="font-semibold text-gray-800">[Guest 2]</p><p className="text-gray-400 text-[8px]">[Title]</p></div>
                                                <div><p className="font-semibold text-gray-800">[Guest 3]</p><p className="text-gray-400 text-[8px]">[Title]</p></div>
                                                <div><p className="font-semibold text-gray-800">[Guest 4]</p><p className="text-gray-400 text-[8px]">[Title]</p></div>
                                            </div>
                                        </div>

                                        {/* RSVP - Elegant */}
                                        <div className="text-center py-2 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
                                            <p className="text-amber-400 font-bold text-xs uppercase tracking-widest">RSVP</p>
                                            <p className="text-white text-sm">[Contact Name] <span className="text-amber-400 mx-2">•</span> <span className="text-amber-300 font-bold">[Phone Number]</span></p>
                                        </div>

                                        {/* Footer Flourish */}
                                        <div className="mt-3 text-center">
                                            <div className="inline-flex items-center gap-2">
                                                <span className="text-amber-300">✿</span>
                                                <span className="text-gray-400 italic text-[10px]">With Love & Blessings from the Adeoye Family</span>
                                                <span className="text-amber-300">✿</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          nav, header, .no-print, button {
            display: none !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          @page {
            size: A4;
            margin: 5mm;
          }

          .print-content {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }

          .print\\:page-break-before-always {
            page-break-before: always !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
        </>
    );
};
