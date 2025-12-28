'use client';

import React, { useState, useRef } from 'react';
import { Download, Share2, Type, Image as ImageIcon, Sparkles, Upload } from 'lucide-react';

export default function MumsDPPage() {
    const [name, setName] = useState('Adeoye Bosede Josephine');
    const [title, setTitle] = useState('From my household to yours');
    const [year, setYear] = useState('2026');
    const [message, setMessage] = useState('God shall crown your 2025 with goodness and drop fatness on your path. May the Great El Shaddai show you the path through the year 2026 and grant you the grace of access to your dreams in Jesus Name.');
    const [viewMode, setViewMode] = useState<'single' | 'gallery'>('gallery');
    const [theme, setTheme] = useState<keyof typeof themes>('gold');
    const [image, setImage] = useState<string | null>('/images/mum.jpeg');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const PRESET_IMAGES = [
        { id: 'mum-1', name: 'Original', url: '/images/mum.jpeg' },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const themes = {
        gold: {
            id: 'gold',
            name: 'Golden New Year',
            bg: 'bg-gradient-to-br from-yellow-50 to-amber-100',
            border: 'border-yellow-200',
            text: 'text-amber-900',
            accent: 'text-yellow-600',
            gradient: 'from-amber-400 to-yellow-600',
            button: 'bg-amber-600 hover:bg-amber-700'
        },
        red: {
            id: 'red',
            name: 'Christmas Red',
            bg: 'bg-gradient-to-br from-red-50 to-pink-100',
            border: 'border-red-200',
            text: 'text-red-900',
            accent: 'text-red-600',
            gradient: 'from-red-500 to-pink-600',
            button: 'bg-red-600 hover:bg-red-700'
        },
        purple: {
            id: 'purple',
            name: 'Royal Purple',
            bg: 'bg-gradient-to-br from-purple-50 to-indigo-100',
            border: 'border-purple-200',
            text: 'text-purple-900',
            accent: 'text-purple-600',
            gradient: 'from-purple-500 to-indigo-600',
            button: 'bg-purple-600 hover:bg-purple-700'
        },
        emerald: {
            id: 'emerald',
            name: 'Emerald Glass',
            bg: 'bg-[#064802]',
            border: 'border-[#a9ce46]/30',
            text: 'text-white',
            accent: 'text-[#d4af37]',
            gradient: 'from-[#064802] to-[#043301]',
            button: 'bg-[#d4af37] hover:bg-[#b8860b]'
        }
    };

    const currentTheme = themes[theme];

    const Card = ({ themeKey }: { themeKey: keyof typeof themes }) => {
        const themeConfig = themes[themeKey];
        return (
            <div
                className={`w-[400px] h-[660px] ${themeConfig.bg} rounded-3xl shadow-2xl relative overflow-hidden flex flex-col items-center text-center border-[6px] ${themeConfig.border} flex-shrink-0 transition-all hover:scale-[1.02] duration-300`}
            >
                {/* Decorative Elements */}
                {themeKey === 'emerald' ? (
                    <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 35c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                    }} />
                ) : (
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
                        <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br ${themeConfig.gradient}`}></div>
                        <div className={`absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t ${themeConfig.gradient} opacity-20`}></div>
                    </div>
                )}

                {/* Card Content */}
                <div className="relative z-10 w-full h-full flex flex-col p-10 pt-12">

                    {/* Header */}
                    <div className="mb-8">
                        {themeKey === 'emerald' ? (
                            <div className="space-y-1">
                                <h2 className="text-4xl text-white drop-shadow-lg" style={{ fontFamily: "'Great Vibes', cursive" }}>
                                    Merry Christmas
                                </h2>
                                <p className="text-[10px] tracking-[0.4em] text-[#d4af37] font-serif uppercase">
                                    & Happy New Year
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className={`text-2xl font-serif font-bold ${themeConfig.gradient} bg-clip-text text-transparent`}>
                                    {title}
                                </h2>
                                <h3 className={`text-sm font-medium text-gray-500 tracking-widest uppercase mt-1`}>
                                    {themeKey === 'gold' ? `@NEW YEAR ${year}` : `@CHRISTMAS ${year}`}
                                </h3>
                            </>
                        )}
                    </div>

                    {/* Photo Frame */}
                    <div className="mx-auto w-48 h-48 mb-6 relative">
                        <div className={`w-full h-full rounded-full border-4 ${themeConfig.border} p-1 shadow-lg bg-white overflow-hidden relative z-10`}>
                            {image ? (
                                <img src={image} alt="Mum" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                        </div>

                        {/* Static Sub-image */}
                        <div className="absolute -top-4 -right-2 w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden z-20">
                            <img src="/images/mum-sub.png" alt="Sub 1" className="w-full h-full object-cover" />
                        </div>

                        <div className={`absolute bottom-0 right-0 w-12 h-12 ${themeConfig.button} rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white z-30`}>
                            {year}
                        </div>
                    </div>

                    {/* Message Body */}
                    <div className="flex-1 flex flex-col justify-center px-2">
                        <div className={`text-xs md:text-sm font-medium ${themeConfig.text} leading-relaxed italic mb-2`}>
                            "Wishing you a merry Christmas and a prosperous new year in advance."
                        </div>

                        <div className="my-2 h-px w-16 mx-auto bg-current opacity-20"></div>

                        <div className={`text-[13px] md:text-sm font-serif ${themeConfig.text} leading-relaxed`}>
                            {message}
                        </div>
                    </div>

                    {/* Footer - Moved to bottom with padding */}
                    <div className="mt-6 pt-4 pb-2 border-t border-gray-400/20 w-full">
                        {themeKey === 'emerald' ? (
                            <p className="text-[#d4af37] font-serif text-xl italic drop-shadow-sm font-semibold">
                                Beejaybee cares
                            </p>
                        ) : (
                            <>
                                <p className={`text-[10px] tracking-widest uppercase ${themeConfig.accent} font-semibold mb-1`}>
                                    WITH LOVE FROM
                                </p>
                                <p className={`text-lg font-serif ${themeConfig.text} font-bold`}>
                                    {name}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans relative overflow-hidden">
            <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
            <div className={`max-w-[1600px] mx-auto ${viewMode === 'gallery' ? 'flex flex-col gap-8' : 'grid grid-cols-1 lg:grid-cols-2 gap-8'}`}>

                {/* Editor Panel - Full Width in Gallery Mode */}
                <div className={`bg-white rounded-2xl shadow-xl p-6 h-fit ${viewMode === 'gallery' ? 'w-full max-w-4xl mx-auto' : ''}`}>
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            <h1 className="text-2xl font-bold text-gray-800">Mum's Christmas Card Creator</h1>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('single')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'single' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Single View
                            </button>
                            <button
                                onClick={() => setViewMode('gallery')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'gallery' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Gallery View
                            </button>
                        </div>
                    </div>

                    <div className={`${viewMode === 'gallery' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-6'}`}>
                        {/* Theme Selection - Only show in Single View */}
                        {viewMode === 'single' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                <div className="flex gap-3">
                                    {Object.entries(themes).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => setTheme(key as any)}
                                            className={`flex-1 py-2 rounded-lg border-2 ${theme === key ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}
                                        >
                                            {config.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Image Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors bg-gray-50"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <span className="text-sm text-gray-500">Click to upload custom photo</span>
                                </div>
                            </div>

                            {/* Preset Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preset Photos</label>
                                <div className="flex gap-4">
                                    {PRESET_IMAGES.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => setImage(preset.url)}
                                            className={`relative w-24 h-24 rounded-xl overflow-hidden border-4 transition-all ${image === preset.url ? 'border-purple-500 ring-4 ring-purple-100' : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                                            {image === preset.url && (
                                                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                                    <Sparkles className="w-6 h-6 text-white drop-shadow-md" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Header (Greeting)</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <input
                                        type="text"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className={viewMode === 'gallery' ? 'col-span-2' : ''}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prayer / Message</label>
                                <textarea
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Helpful Note */}
                        <div className={`bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm ${viewMode === 'gallery' ? 'col-span-2' : ''}`}>
                            <Share2 className="w-5 h-5 flex-shrink-0" />
                            <p>Upload a photo, customize text, and all cards below will update instantly!</p>
                        </div>
                    </div>
                </div>

                {/* Preview Panel - Single or Gallery */}
                <div className={`${viewMode === 'gallery' ? 'w-full flex flex-wrap justify-center gap-10 pb-20' : 'flex items-center justify-center bg-gray-200 rounded-2xl p-8 shadow-inner min-h-[600px]'}`}>
                    {viewMode === 'gallery' ? (
                        <>
                            <Card themeKey="gold" />
                            <Card themeKey="red" />
                            <Card themeKey="purple" />
                            <Card themeKey="emerald" />
                        </>
                    ) : (
                        <div ref={cardRef}>
                            <Card themeKey={theme} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
