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
                                            <h1 className="text-lg font-serif text-gray-700 tracking-widest uppercase font-bold">The Family of Adeoye</h1>
                                            <p className="text-sm text-amber-600 italic font-serif">Invites the pleasure of</p>
                                        </div>

                                        {/* Guest Name Field - Handwritten */}
                                        <div className="text-center mb-2 pb-2 border-b-2 border-dashed border-amber-200">
                                            <p className="text-xs text-amber-600 mb-1">Mr./Mrs./Chief/Honorable</p>
                                            <div className="border-b-2 border-gray-400 mx-auto w-3/4 pb-1"></div>
                                        </div>

                                        <div className="text-center mb-2">
                                            <p className="text-sm text-gray-600 mb-1 font-serif">To the</p>
                                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent font-serif tracking-wide leading-tight">Celebration of Uncommon Grace</h2>
                                            <p className="text-base text-gray-700 font-semibold mt-1">at Retirement</p>
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
                                                <p className="text-xs text-gray-600 font-medium">(RETIREMENT SERVICE &amp; THANKSGIVING)</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded p-2 mb-2 shadow text-sm">
                                            <div className="flex justify-center items-center gap-4 text-center">
                                                <div><span className="font-bold">DATE:</span> 6th February, 2026</div>
                                                <div className="w-px h-4 bg-white/50"></div>
                                                <div><span className="font-bold">TIME:</span> 11:00 AM</div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded p-2 mb-3 shadow text-sm text-center">
                                            <span className="font-bold">VENUE:</span> Christian Vigil Center, Beside State Secretariat, Abere
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded p-2 text-center text-sm">
                                            <span className="font-bold text-amber-400">RSVP:</span>
                                            <span className="ml-2">Tobi</span>
                                            <span className="text-amber-400 mx-2">|</span>
                                            <span className="text-amber-300 font-semibold">+2348139207076</span>
                                        </div>

                                        <div className="mt-2 text-center">
                                            <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px]">
                                                <div className="h-px w-8 bg-amber-300"></div>
                                                <span className="italic">With Love from the Family of Adeoye</span>
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
                                                The Family of Adeoye
                                            </h1>
                                            <p className="text-amber-600 italic text-base font-serif mt-1">
                                                Invites the pleasure of
                                            </p>
                                        </div>

                                        {/* Guest Name Field - Handwritten */}
                                        <div className="text-center mb-3">
                                            <p className="text-sm text-amber-600 mb-2">Mr./Mrs./Chief/Honorable</p>
                                            <div className="border-b-2 border-gray-400 mx-auto w-3/5 pb-1"></div>
                                        </div>

                                        {/* Main Title - Large & Elegant */}
                                        <div className="text-center mb-4">
                                            <p className="text-base text-gray-600 mb-2 font-serif">To the</p>
                                            <h2 className="text-4xl md:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 leading-tight tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                                                Celebration of
                                            </h2>
                                            <h2 className="text-3xl md:text-4xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 -mt-1">
                                                Uncommon Grace
                                            </h2>
                                            <h3 className="text-2xl font-semibold text-gray-700 mt-1">at Retirement</h3>
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
                                            <p className="text-rose-600 text-xs font-medium mt-1 tracking-wider">(RETIREMENT SERVICE &amp; THANKSGIVING)</p>
                                        </div>

                                        {/* Event Details - Elegant Cards */}
                                        <div className="flex justify-center gap-4 mb-3">
                                            <div className="text-center px-6 py-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 shadow-sm">
                                                <p className="text-amber-700 font-bold text-xs uppercase tracking-wider">Date</p>
                                                <p className="text-gray-800 font-semibold text-sm">6th February</p>
                                                <p className="text-amber-600 font-bold text-lg">2026</p>
                                            </div>
                                            <div className="text-center px-6 py-2 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg border border-rose-200 shadow-sm">
                                                <p className="text-rose-700 font-bold text-xs uppercase tracking-wider">Time</p>
                                                <p className="text-gray-800 font-bold text-xl">11:00</p>
                                                <p className="text-rose-600 font-semibold text-sm">AM</p>
                                            </div>
                                        </div>

                                        {/* Venue - Elegant */}
                                        <div className="text-center mb-3 py-2 px-4 bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 rounded-lg border border-rose-200">
                                            <p className="text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">✦ Venue ✦</p>
                                            <p className="text-gray-800 font-medium text-sm">Christian Vigil Center</p>
                                            <p className="text-gray-600 text-xs">Beside State Secretariat, Abere</p>
                                        </div>

                                        {/* RSVP - Elegant */}
                                        <div className="text-center py-2 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
                                            <p className="text-amber-400 font-bold text-xs uppercase tracking-widest">RSVP</p>
                                            <p className="text-white text-sm">Tobi <span className="text-amber-400 mx-2">•</span> <span className="text-amber-300 font-bold">+2348139207076</span></p>
                                        </div>

                                        {/* Footer Flourish */}
                                        <div className="mt-3 text-center">
                                            <div className="inline-flex items-center gap-2">
                                                <span className="text-amber-300">✿</span>
                                                <span className="text-gray-400 italic text-[10px]">With Love & Blessings from the Family of Adeoye</span>
                                                <span className="text-amber-300">✿</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== DESIGN 3: Modern Minimalist ==================== */}
                <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 print:bg-white print:min-h-0 py-8 print:py-0 print:mt-0 print:page-break-before-always">
                    <div className="text-center mb-4 print:hidden">
                        <span className="bg-slate-100 text-slate-800 px-4 py-1 rounded-full text-sm font-semibold">Design 3 - Modern Minimalist</span>
                    </div>
                    <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none">
                        <div className="p-6 print:p-4">
                            {/* Top Gold Bar */}
                            <div className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6"></div>

                            {/* Minimal Header */}
                            <div className="text-center mb-4">
                                <h1 className="text-sm font-light text-gray-600 tracking-[0.5em] uppercase">The Family of Adeoye</h1>
                                <p className="text-xs text-amber-600 mt-2 font-light italic">Invites the pleasure of</p>
                            </div>

                            {/* Guest Name - Clean Line */}
                            <div className="text-center mb-6">
                                <p className="text-xs text-gray-500 mb-2 tracking-wider">Mr./Mrs./Chief/Honorable</p>
                                <div className="w-2/3 mx-auto border-b border-gray-300"></div>
                            </div>

                            {/* Main Title - Bold & Simple */}
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500 mb-2">To the</p>
                                <h2 className="text-5xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>Celebration</h2>
                                <p className="text-lg text-amber-600 italic">of Uncommon Grace at Retirement</p>
                            </div>

                            {/* Photo - Center Stage */}
                            <div className="flex justify-center mb-6">
                                <div className="relative w-40 h-48 overflow-hidden shadow-2xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}>
                                    <Image src="/images/mum.jpeg" alt="Mrs Bose Adeoye" fill className="object-cover" priority />
                                </div>
                            </div>

                            {/* Name - Clean Typography */}
                            <div className="text-center mb-6">
                                <p className="text-xs text-amber-600 tracking-widest uppercase mb-2">Celebrating</p>
                                <h3 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Mrs Bose Adeoye</h3>
                                <div className="w-24 h-px bg-amber-400 mx-auto my-2"></div>
                            </div>

                            {/* Event Details - Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                <div className="border-l-2 border-amber-400 pl-3">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                                    <p className="text-base font-bold text-gray-900">6 Feb 2026</p>
                                </div>
                                <div className="border-l-2 border-rose-400 pl-3">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Time</p>
                                    <p className="text-base font-bold text-gray-900">11:00 AM</p>
                                </div>
                                <div className="border-l-2 border-amber-400 pl-3">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Venue</p>
                                    <p className="text-xs font-semibold text-gray-900">Christian Vigil</p>
                                </div>
                            </div>

                            {/* Venue Detail */}
                            <div className="text-center mb-4 text-xs text-gray-600">
                                <p>Christian Vigil Center, Beside State Secretariat, Abere</p>
                            </div>

                            {/* RSVP - Minimal */}
                            <div className="text-center py-3 border-t border-b border-gray-200">
                                <p className="text-xs text-amber-600 uppercase tracking-widest mb-1">RSVP</p>
                                <p className="text-sm text-gray-800">Tobi • <span className="font-semibold">+2348139207076</span></p>
                            </div>

                            {/* Bottom Gold Bar */}
                            <div className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-6"></div>
                        </div>
                    </div>
                </div>

                {/* ==================== DESIGN 4: Floral Elegance ==================== */}
                <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 print:bg-white print:min-h-0 py-8 print:py-0 print:mt-0 print:page-break-before-always">
                    <div className="text-center mb-4 print:hidden">
                        <span className="bg-pink-100 text-pink-800 px-4 py-1 rounded-full text-sm font-semibold">Design 4 - Floral Elegance</span>
                    </div>
                    <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none overflow-hidden">
                        {/* Decorative Top Border */}
                        <div className="h-2 bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200"></div>

                        <div className="relative p-5 print:p-4">
                            {/* Floral Corner Decorations */}
                            <div className="absolute top-3 left-3 text-4xl text-rose-300 opacity-50">🌸</div>
                            <div className="absolute top-3 right-3 text-4xl text-rose-300 opacity-50">🌸</div>
                            <div className="absolute bottom-3 left-3 text-4xl text-rose-300 opacity-50">🌸</div>
                            <div className="absolute bottom-3 right-3 text-4xl text-rose-300 opacity-50">🌸</div>

                            {/* Header with Floral Frame */}
                            <div className="text-center mb-3 relative z-10">
                                <div className="inline-block px-6 py-2 border-2 border-rose-200 rounded-full bg-white shadow-sm">
                                    <h1 className="text-base font-serif text-rose-700 tracking-wider">The Family of Adeoye</h1>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 italic">Invites the pleasure of</p>
                            </div>

                            {/* Guest Name Field */}
                            <div className="text-center mb-4 relative z-10">
                                <div className="inline-block px-8 py-1 border border-dashed border-rose-300 rounded bg-rose-50/30">
                                    <p className="text-xs text-rose-600">Mr./Mrs./Chief/Honorable _______________</p>
                                </div>
                            </div>

                            {/* Main Title - Elegant Floral */}
                            <div className="text-center mb-4 relative z-10">
                                <p className="text-sm text-gray-600 mb-1">To the</p>
                                <div className="inline-block relative">
                                    <span className="text-2xl text-rose-300 absolute -left-8 top-0">✿</span>
                                    <h2 className="text-3xl font-bold text-rose-600 font-serif px-8">Celebration of</h2>
                                    <span className="text-2xl text-rose-300 absolute -right-8 top-0">✿</span>
                                </div>
                                <h3 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-clip-text text-transparent font-serif">Uncommon Grace</h3>
                                <p className="text-lg text-gray-700 font-semibold">at Retirement</p>
                            </div>

                            {/* Photo with Floral Frame */}
                            <div className="flex justify-center mb-4 relative z-10">
                                <div className="relative">
                                    <div className="absolute -inset-2 border-2 border-rose-200 rounded-full opacity-30"></div>
                                    <div className="absolute -inset-4 border border-rose-200 rounded-full opacity-20"></div>
                                    <div className="relative w-32 h-40 overflow-hidden rounded-lg shadow-xl border-4 border-white">
                                        <Image src="/images/mum.jpeg" alt="Mrs Bose Adeoye" fill className="object-cover" priority />
                                    </div>
                                </div>
                            </div>

                            {/* Name - Elegant */}
                            <div className="text-center mb-4 relative z-10">
                                <p className="text-xs text-rose-500 uppercase tracking-widest mb-1">✿ Celebrating ✿</p>
                                <h3 className="text-3xl font-bold text-gray-900 font-serif">Mrs Bose Adeoye</h3>
                                <div className="flex items-center justify-center gap-2 my-2">
                                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300"></div>
                                    <span className="text-rose-400">❀</span>
                                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300"></div>
                                </div>
                            </div>

                            {/* Event Details - Floral Cards */}
                            <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 rounded-lg p-3 mb-3 border border-rose-200 shadow-sm relative z-10">
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div>
                                        <p className="text-xs text-rose-600 font-semibold">📅 Date</p>
                                        <p className="text-sm font-bold text-gray-800">6th February, 2026</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-rose-600 font-semibold">🕐 Time</p>
                                        <p className="text-sm font-bold text-gray-800">11:00 AM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Venue */}
                            <div className="bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 rounded-lg p-2 mb-3 border border-rose-200 text-center relative z-10">
                                <p className="text-xs text-rose-600 font-semibold mb-1">📍 Venue</p>
                                <p className="text-sm text-gray-800 font-medium">Christian Vigil Center</p>
                                <p className="text-xs text-gray-600">Beside State Secretariat, Abere</p>
                            </div>

                            {/* RSVP - Floral */}
                            <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg p-2 text-center shadow-md relative z-10">
                                <p className="text-xs uppercase tracking-wider font-semibold">RSVP</p>
                                <p className="text-sm">Tobi • +2348139207076</p>
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-3 relative z-10">
                                <p className="text-[10px] text-gray-400 italic">With Love from the Family of Adeoye</p>
                            </div>
                        </div>

                        {/* Decorative Bottom Border */}
                        <div className="h-2 bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200"></div>
                    </div>
                </div>

                {/* ==================== DESIGN 5: Vintage Classic ==================== */}
                <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 print:bg-white print:min-h-0 py-8 print:py-0 print:mt-0 print:page-break-before-always">
                    <div className="text-center mb-4 print:hidden">
                        <span className="bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-semibold">Design 5 - Vintage Classic</span>
                    </div>
                    <div className="max-w-[210mm] mx-auto bg-gradient-to-br from-amber-50 to-yellow-50 shadow-2xl print:shadow-none print:max-w-none">
                        <div className="relative p-5 print:p-4">
                            {/* Ornate Vintage Border */}
                            <div className="border-4 border-double border-amber-600 p-4 relative">
                                {/* Corner Ornaments */}
                                <div className="absolute -top-1 -left-1 w-6 h-6 bg-amber-600 transform rotate-45"></div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-600 transform rotate-45"></div>
                                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-amber-600 transform rotate-45"></div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-600 transform rotate-45"></div>

                                <div className="border border-amber-400 p-3">
                                    {/* Vintage Header */}
                                    <div className="text-center mb-3">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="text-amber-600">◈</span>
                                            <div className="h-px w-12 bg-amber-400"></div>
                                            <span className="text-amber-700 text-xl">✦</span>
                                            <div className="h-px w-12 bg-amber-400"></div>
                                            <span className="text-amber-600">◈</span>
                                        </div>
                                        <h1 className="text-lg font-serif text-amber-900 tracking-widest mt-2" style={{ fontFamily: 'Garamond, serif' }}>THE FAMILY OF ADEOYE</h1>
                                        <p className="text-sm text-amber-700 italic mt-1">Invites the pleasure of</p>
                                    </div>

                                    {/* Guest Name - Vintage Style */}
                                    <div className="text-center mb-3">
                                        <div className="inline-block bg-white px-6 py-2 border-2 border-amber-300 shadow-inner">
                                            <p className="text-xs text-amber-700 tracking-wide">Mr./Mrs./Chief/Honorable</p>
                                            <div className="border-b-2 border-dotted border-amber-400 w-48 mx-auto mt-1"></div>
                                        </div>
                                    </div>

                                    {/* Main Title - Vintage Typography */}
                                    <div className="text-center mb-3">
                                        <p className="text-sm text-amber-800 mb-1">To the</p>
                                        <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 py-3 px-4 border-y-2 border-amber-400">
                                            <h2 className="text-3xl font-bold text-amber-900 font-serif" style={{ fontFamily: 'Garamond, serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Celebration of</h2>
                                            <h2 className="text-4xl font-bold text-amber-800 font-serif" style={{ fontFamily: 'Garamond, serif' }}>Uncommon Grace</h2>
                                            <p className="text-xl text-amber-700 font-semibold mt-1">at Retirement</p>
                                        </div>
                                    </div>

                                    {/* Photo - Vintage Frame */}
                                    <div className="flex justify-center mb-3">
                                        <div className="relative p-2 bg-gradient-to-br from-amber-200 to-yellow-200 shadow-lg">
                                            <div className="border-4 border-amber-600 border-double">
                                                <div className="border-2 border-amber-400 p-1 bg-white">
                                                    <div className="relative w-32 h-40 overflow-hidden">
                                                        <Image src="/images/mum.jpeg" alt="Mrs Bose Adeoye" fill className="object-cover sepia" priority />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name - Vintage Elegance */}
                                    <div className="text-center mb-3">
                                        <div className="inline-flex items-center gap-2 mb-1">
                                            <div className="h-px w-8 bg-amber-500"></div>
                                            <p className="text-xs text-amber-700 uppercase tracking-widest">Celebrating</p>
                                            <div className="h-px w-8 bg-amber-500"></div>
                                        </div>
                                        <h3 className="text-3xl font-bold text-amber-900 font-serif" style={{ fontFamily: 'Garamond, serif' }}>Mrs Bose Adeoye</h3>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <span className="text-amber-500">✧</span>
                                            <span className="text-amber-500">◆</span>
                                            <span className="text-amber-500">✧</span>
                                        </div>
                                    </div>

                                    {/* Event Details - Vintage Table */}
                                    <div className="bg-white border-2 border-amber-400 p-3 mb-3 shadow-inner">
                                        <table className="w-full text-sm">
                                            <tbody>
                                                <tr className="border-b border-amber-200">
                                                    <td className="py-1 text-amber-700 font-semibold text-right pr-3">Date:</td>
                                                    <td className="py-1 text-amber-900 font-bold">6th February, 2026</td>
                                                </tr>
                                                <tr className="border-b border-amber-200">
                                                    <td className="py-1 text-amber-700 font-semibold text-right pr-3">Time:</td>
                                                    <td className="py-1 text-amber-900 font-bold">11:00 AM</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 text-amber-700 font-semibold text-right pr-3 align-top">Venue:</td>
                                                    <td className="py-1 text-amber-900 font-bold">Christian Vigil Center<br /><span className="text-xs font-normal text-amber-700">Beside State Secretariat, Abere</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* RSVP - Vintage Badge */}
                                    <div className="text-center mb-2">
                                        <div className="inline-block bg-gradient-to-r from-amber-700 to-amber-800 text-white px-6 py-2 shadow-lg" style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)' }}>
                                            <p className="text-xs uppercase tracking-widest font-semibold">RSVP</p>
                                            <p className="text-sm">Tobi • +2348139207076</p>
                                        </div>
                                    </div>

                                    {/* Vintage Footer */}
                                    <div className="text-center mt-3">
                                        <div className="inline-flex items-center gap-2">
                                            <div className="h-px w-12 bg-amber-400"></div>
                                            <p className="text-[10px] text-amber-600 italic tracking-wide">With Love from the Family of Adeoye</p>
                                            <div className="h-px w-12 bg-amber-400"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== DESIGN 6: Royal Majestic (Dark Edition) ==================== */}
                <div className="w-full min-h-screen bg-slate-950 print:bg-white print:min-h-0 py-12 print:py-0 print:mt-0 print:page-break-before-always flex flex-col items-center justify-center">
                    <div className="text-center mb-6 print:hidden">
                        <span className="bg-indigo-900/50 text-indigo-200 px-6 py-1.5 rounded-full text-sm font-bold tracking-[0.2em] uppercase border border-indigo-500/30 backdrop-blur-md">Design 6 - Royal Majestic</span>
                    </div>

                    <div className="max-w-[210mm] w-full mx-auto relative group">
                        {/* Deep background with subtle texture/gradient */}
                        <div className="bg-[#0c0a21] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden relative border-[1px] border-amber-500/30 print:border-amber-600 print:bg-white min-h-[297mm] flex flex-col">

                            {/* Animated/Glassy Gold Accents (Only on Screen) */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 via-transparent to-transparent -rotate-12 transform translate-x-32 -translate-y-32 blur-3xl print:hidden"></div>
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent rotate-12 transform -translate-x-32 translate-y-32 blur-3xl print:hidden"></div>

                            {/* Ornate Gold Border Corners */}
                            <div className="absolute top-8 left-8 w-16 h-16 border-t-[3px] border-l-[3px] border-amber-400 print:border-amber-600"></div>
                            <div className="absolute top-8 right-8 w-16 h-16 border-t-[3px] border-r-[3px] border-amber-400 print:border-amber-600"></div>
                            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-[3px] border-l-[3px] border-amber-400 print:border-amber-600"></div>
                            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-[3px] border-r-[3px] border-amber-400 print:border-amber-600"></div>

                            <div className="p-16 print:p-10 flex flex-col items-center text-center flex-grow">

                                {/* Royal Emblem Removed */}
                                <div className="mb-16"></div>

                                <div className="space-y-4 mb-10">
                                    <h1 className="text-xl font-serif text-amber-500 tracking-[0.5em] uppercase font-light print:text-amber-700">The Family of Adeoye</h1>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50 print:to-amber-600"></div>
                                        <span className="text-amber-500/50">✧</span>
                                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50 print:to-amber-600"></div>
                                    </div>
                                    <p className="text-indigo-200/70 text-lg italic font-serif print:text-gray-500">invites you to witness the milestone of</p>
                                </div>

                                <div className="mb-12">
                                    <h2 className="text-7xl md:text-8xl font-bold font-serif text-white tracking-tighter mb-2 uppercase print:text-gray-900 leading-[0.85]" style={{ textShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                                        Legacy
                                    </h2>
                                    <h3 className="text-3xl md:text-4xl font-serif text-amber-400 italic font-light print:text-amber-700">
                                        & Uncommon Grace
                                    </h3>
                                </div>

                                {/* Hero Section with Photo */}
                                <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-16 w-full max-w-2xl">
                                    <div className="relative group">
                                        <div className="absolute -inset-4 border border-amber-400/20 rounded-full print:hidden"></div>
                                        <div className="absolute -inset-2 border-2 border-amber-400/40 rounded-full print:border-amber-600"></div>
                                        <div className="relative w-56 h-56 rounded-full overflow-hidden border-[6px] border-[#0c0a21] shadow-[0_0_30px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform duration-500 print:border-amber-600">
                                            <Image src="/images/mum.jpeg" alt="Mrs Bose Adeoye" fill className="object-cover" priority />
                                        </div>
                                    </div>

                                    <div className="text-left space-y-4">
                                        <div>
                                            <p className="text-amber-500 text-sm uppercase tracking-[0.4em] font-bold mb-2 print:text-amber-700">Celebrating</p>
                                            <h4 className="text-5xl font-bold text-white font-serif leading-tight print:text-gray-900 tracking-tight">Mrs Bose<br />Adeoye</h4>
                                        </div>
                                        <div className="w-20 h-1.5 bg-gradient-to-r from-amber-600 to-amber-400 print:bg-amber-600"></div>
                                        <p className="text-indigo-200 text-sm font-medium tracking-[0.2em] uppercase print:text-gray-500">Retirement Service<br />& Thanksgiving Ceremony</p>
                                    </div>
                                </div>

                                {/* Event Pillars */}
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                                    <div className="relative p-8 bg-white/5 border border-white/10 group overflow-hidden print:bg-gray-50 print:border-gray-200">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 print:hidden"></div>
                                        <p className="text-amber-500 text-xs uppercase tracking-[0.3em] mb-4 font-bold print:text-amber-700">The Occasion</p>
                                        <p className="text-white text-3xl font-serif mb-1 print:text-gray-900">6th Feb 2026</p>
                                        <p className="text-indigo-300 text-lg print:text-gray-600 font-light">Friday, 11:00 AM Prompt</p>
                                    </div>

                                    <div className="relative p-8 bg-white/5 border border-white/10 group overflow-hidden print:bg-gray-50 print:border-gray-200">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 print:hidden"></div>
                                        <p className="text-amber-500 text-xs uppercase tracking-[0.3em] mb-4 font-bold print:text-amber-700">The Sanctuary</p>
                                        <p className="text-white text-3xl font-serif mb-1 print:text-gray-900">Christian Vigil</p>
                                        <p className="text-indigo-300 text-sm print:text-gray-600 font-light leading-relaxed">Beside State Secretariat, Abere</p>
                                    </div>
                                </div>

                                {/* RSVP & Footer */}
                                <div className="mt-auto w-full pt-12 border-t border-white/10 flex flex-col items-center space-y-8 print:border-gray-200">
                                    <div className="text-center">
                                        <p className="text-amber-500 text-xs uppercase tracking-[0.6em] font-bold mb-4 print:text-amber-700">R.S.V.P</p>
                                        <p className="text-white text-3xl font-serif print:text-gray-900">Tobi Adeoye</p>
                                        <p className="text-amber-400 font-bold text-xl mt-1 tracking-widest print:text-amber-700">+234 813 920 7076</p>
                                    </div>

                                    <div className="flex items-center gap-6 text-amber-500/20 print:text-gray-300">
                                        <div className="h-px w-32 bg-current"></div>
                                        <span className="text-xl">✧</span>
                                        <div className="h-px w-32 bg-current"></div>
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
