'use client';

import { useState, useRef } from 'react';
import { Copy, Check, Download, ExternalLink, Mail, Sparkles, Layout, Palette, Image as ImageIcon } from 'lucide-react';

export default function NICARBSignaturesPage() {
    const [copied, setCopied] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<keyof typeof signatures>('simple');

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const signatures = {
        simple: `<img src="https://merislabs.com/nicarb/christmas-signatures/nicarb_final_2026_white_1765805295269.jpeg" alt="NICARB - Merry Christmas & Happy New Year 2026" style="max-width: 600px; height: auto; display: block;">`,

        custom: `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; max-width: 600px;">
    <tr>
        <td style="vertical-align: middle; padding-right: 20px;">
            <img src="https://merislabs.com/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" style="height: 60px; width: auto; display: block;">
        </td>
        <td style="vertical-align: middle; padding: 0 15px;">
            <div style="width: 2px; height: 60px; background: linear-gradient(to bottom, #D4AF37, #C5A028);"></div>
        </td>
        <td style="vertical-align: middle; padding-left: 15px;">
            <div style="font-family: Georgia, serif; font-size: 22px; color: #2d5a2d; font-style: italic; margin-bottom: 5px;">
                Merry Christmas
            </div>
            <div style="font-family: Georgia, serif; font-size: 14px; color: #2d5a2d;">
                & Happy New Year 2026
            </div>
        </td>
    </tr>
</table>`,

        withOrnament: `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; max-width: 600px; background: #ffffff;">
    <tr>
        <td style="text-align: center; padding: 20px;">
            <img src="https://merislabs.com/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" style="height: 60px; width: auto; display: block; margin: 0 auto 10px;">

            <div style="text-align: center; margin: 0 auto 15px; max-width: 300px;">
                <svg width="280" height="30" viewBox="0 0 280 30" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                    <line x1="0" y1="15" x2="80" y2="15" stroke="#D4AF37" stroke-width="1.5"/>
                    <path d="M110 10 Q115 8 120 10 Q125 12 130 10 Q135 8 140 10" stroke="#2d5a2d" fill="none" stroke-width="1.5"/>
                    <circle cx="125" cy="12" r="3" fill="#D4AF37"/>
                    <circle cx="115" cy="14" r="2" fill="#2d5a2d" opacity="0.6"/>
                    <circle cx="135" cy="14" r="2" fill="#2d5a2d" opacity="0.6"/>
                    <path d="M105 12 L107 15 L105 18 L103 15 Z" fill="#2d5a2d" opacity="0.7"/>
                    <path d="M145 12 L147 15 L145 18 L143 15 Z" fill="#2d5a2d" opacity="0.7"/>
                    <line x1="160" y1="15" x2="280" y2="15" stroke="#D4AF37" stroke-width="1.5"/>
                    <path d="M95 10 L96 13 L99 13 L96.5 15 L97.5 18 L95 16 L92.5 18 L93.5 15 L91 13 L94 13 Z" fill="#D4AF37" opacity="0.6"/>
                    <path d="M155 10 L156 13 L159 13 L156.5 15 L157.5 18 L155 16 L152.5 18 L153.5 15 L151 13 L154 13 Z" fill="#D4AF37" opacity="0.6"/>
                </svg>
            </div>

            <div style="margin-bottom: 5px;">
                <span style="font-family: Georgia, serif; font-size: 22px; color: #2d5a2d; font-style: italic;">Merry Christmas</span>
            </div>
            <div>
                <span style="font-family: Georgia, serif; font-size: 14px; color: #2d5a2d;">& Happy New Year 2026</span>
            </div>
        </td>
    </tr>
</table>`,

        newYear: `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; max-width: 600px;">
    <tr>
        <td style="vertical-align: middle; padding-right: 20px;">
            <img src="https://merislabs.com/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" style="height: 60px; width: auto; display: block;">
        </td>
        <td style="vertical-align: middle; padding: 0 15px;">
            <div style="width: 2px; height: 60px; background: linear-gradient(to bottom, #D4AF37, #C5A028);"></div>
        </td>
        <td style="vertical-align: middle; padding-left: 15px;">
            <div style="font-family: Georgia, serif; font-size: 24px; color: #2d5a2d; font-style: italic; margin-bottom: 5px;">
                Happy New Year
            </div>
            <div style="font-family: Georgia, serif; font-size: 16px; color: #D4AF37; letter-spacing: 2px;">
                2026
            </div>
        </td>
    </tr>
</table>`,

        christmasOnly: `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; max-width: 600px;">
    <tr>
        <td style="vertical-align: middle; padding-right: 20px;">
            <img src="https://merislabs.com/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" style="height: 60px; width: auto; display: block;">
        </td>
        <td style="vertical-align: middle; padding: 0 15px;">
            <div style="width: 2px; height: 60px; background: linear-gradient(to bottom, #D4AF37, #C5A028);"></div>
        </td>
        <td style="vertical-align: middle; padding-left: 15px;">
            <div style="font-family: Georgia, serif; font-size: 24px; color: #2d5a2d; font-style: italic;">
                Merry Christmas 2025
            </div>
        </td>
    </tr>
</table>`
    };

    const variantDetails = {
        simple: { name: 'Simple Image', icon: ImageIcon, color: 'text-green-600', bg: 'bg-green-50', preview: '/nicarb/christmas-signatures/preview-simple.html' },
        custom: { name: 'Elegant Custom', icon: Layout, color: 'text-amber-600', bg: 'bg-amber-50', preview: '/nicarb/christmas-signatures/preview-custom.html' },
        withOrnament: { name: 'Royal Ornament', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50', preview: '/nicarb/christmas-signatures/preview-ornament.html' },
        newYear: { name: 'New Year 2026', icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-50', preview: '/nicarb/christmas-signatures/preview-simple.html' },
        christmasOnly: { name: 'Christmas Classic', icon: Palette, color: 'text-red-600', bg: 'bg-red-50', preview: '/nicarb/christmas-signatures/preview-simple.html' }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-widest">Official 2026</span>
                            <span className="h-1 w-8 bg-green-200 rounded-full"></span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-green-900 tracking-tight">
                            NICARB <span className="text-amber-600">Signatures</span>
                        </h1>
                    </div>
                    <p className="text-gray-600 max-w-md md:text-right">
                        Professional, high-fidelity seasonal signatures for the NICArb team. 
                        Optimized for all email clients.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Sidebar / Selection */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Layout className="w-4 h-4" />
                                Select Variant
                            </h2>
                            <div className="space-y-3">
                                {Object.entries(variantDetails).map(([key, details]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedVariant(key as any)}
                                        className={`w-full group px-4 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                                            selectedVariant === key 
                                            ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${
                                            selectedVariant === key ? 'bg-white/20' : 'bg-white'
                                        }`}>
                                            <details.icon className={`w-5 h-5 ${
                                                selectedVariant === key ? 'text-white' : details.color
                                            }`} />
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-bold text-sm">{details.name}</span>
                                        </div>
                                        <div className="ml-auto">
                                            {selectedVariant === key ? (
                                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 border-2 border-gray-200 rounded-full"></div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Download Final Call to Action */}
                        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-6 text-white shadow-xl shadow-green-100 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>
                             <h3 className="text-lg font-bold mb-2 relative z-10 font-serif">Official Image Asset</h3>
                             <p className="text-green-100 text-sm mb-6 relative z-10 leading-relaxed">The certified 2026 header designed for the entire corporation.</p>
                             <a
                                href="/nicarb/christmas-signatures/nicarb_final_2026_white_1765805295269.jpeg"
                                download="NICARB_Official_2026.jpeg"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                            >
                                <Download className="w-4 h-4" />
                                Download Certified JPEG
                            </a>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-full relative group">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                    <div className={`w-2 h-8 rounded-full ${variantDetails[selectedVariant].bg} ${variantDetails[selectedVariant].color}`}></div>
                                    Live Preview
                                </h2>
                                <a 
                                    href={variantDetails[selectedVariant].preview} 
                                    target="_blank" 
                                    className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 bg-green-50 px-4 py-2 rounded-full transition-colors"
                                >
                                    Open Clean Preview <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-10 border-2 border-dashed border-gray-100 mb-8 min-h-[250px] transition-all group-hover:bg-white group-hover:border-green-100">
                                <div 
                                    className="transform transition-all duration-500 scale-110"
                                    dangerouslySetInnerHTML={{ __html: signatures[selectedVariant] }} 
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold text-gray-400 uppercase tracking-widest">Generation Code (HTML)</span>
                                    <span className="text-xs text-amber-600 font-medium">Ready for deployment</span>
                                </div>
                                <div className="bg-gray-900 rounded-2xl p-6 relative group/code">
                                    <pre className="text-xs text-green-400/80 overflow-x-auto font-mono scrollbar-hide py-2">
                                        {signatures[selectedVariant]}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(signatures[selectedVariant], selectedVariant)}
                                        className={`absolute top-4 right-4 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${
                                            copied === selectedVariant 
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                                            : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                                        }`}
                                    >
                                        {copied === selectedVariant ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied === selectedVariant ? 'Copied' : 'Copy Code'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                     {/* Tutorial Card */}
                     <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <Mail className="w-6 h-6 text-green-600" />
                            How to Use in Email
                        </h2>
                        
                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 mb-6">
                            <p className="text-amber-900 text-sm font-semibold mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Pro-Tip for Perfect Formatting
                            </p>
                            <p className="text-amber-800/80 text-sm leading-relaxed">
                                Don't paste the code into your signature settings. Instead, open the <strong>Clean Preview</strong> link, select the visual signature, copy it, and paste it directly into Gmail or Outlook.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                <p className="text-gray-700 text-sm pt-1">Open the <strong>Clean Preview</strong> for your variant.</p>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                <p className="text-gray-700 text-sm pt-1">Select the visual signature and press <strong>Cmd+C</strong>.</p>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                                <p className="text-gray-700 text-sm pt-1">Paste into your Email Signature settings.</p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Stats */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Mail className="w-32 h-32" />
                        </div>
                        <h2 className="text-2xl font-bold mb-6 font-serif tracking-tight">Enterprise Level Authentication</h2>
                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Max Width</p>
                                <p className="text-3xl font-bold">600px</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Status</p>
                                <p className="text-3xl font-bold text-green-400">Stable</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Compatibility</p>
                                <p className="text-xl font-bold">Gmail, Outlook, Apple</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Rendering</p>
                                <p className="text-xl font-bold text-amber-400">High Fidelity</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alternative Design Gallery */}
                <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Alternative Gallery</h2>
                            <p className="text-gray-500">Explore and download the full range of creative explorations.</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-400"></div>
                             <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                             <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[
                            { name: 'Transparent Wreath', file: 'nicarb_xmas_transparent_v2_1765777025997.png' },
                            { name: 'Transparent Ornament', file: 'nicarb_xmas_transparent_v1_1765777006645.png' },
                            { name: 'Artistic Watercolor', file: 'nicarb_xmas_artistic_1765777044817.png' },
                            { name: 'Modern Geometric', file: 'nicarb_xmas_modern_1765777066057.png' },
                            { name: 'Luxe Bells', file: 'nicarb_xmas_luxe_1765777085007.png' },
                            { name: 'Nigerian Adire', file: 'nicarb_xmas_nigerian_1765777103494.png' },
                            { name: 'Premium Classic', file: 'nicarb_xmas_premium_v1_1765776025250.png' },
                            { name: 'Navy & Gold', file: 'nicarb_xmas_navy_gold_1765776116371.png' },
                            { name: 'Festive Final', file: 'nicarb_xmas_festive_final_1765776145698.png' },
                            { name: 'Vibrant V3', file: 'nicarb_xmas_premium_v3_1765776077258.png' },
                        ].map((design, index) => (
                            <div key={index} className="group relative bg-gray-50 rounded-2xl p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-white border border-transparent hover:border-gray-100">
                                <div className="aspect-[3/2] bg-white rounded-xl overflow-hidden mb-4 border border-gray-100 flex items-center justify-center p-2">
                                    <img
                                        src={`/nicarb/christmas-signatures/${design.file}`}
                                        alt={design.name}
                                        className="object-contain w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-1">{design.name}</p>
                                <a
                                    href={`/nicarb/christmas-signatures/${design.file}`}
                                    download
                                    className="absolute inset-x-4 top-4 h-[calc(100%-60px)] opacity-0 group-hover:opacity-100 bg-green-600/90 rounded-xl flex flex-col items-center justify-center transition-all duration-300 text-white gap-2 backdrop-blur-sm"
                                >
                                    <Download className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Download High-Res</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-20 text-gray-400 text-xs font-medium tracking-[0.3em] uppercase">
                    <p>Designed & Developed by Merislabs • Dec 2025</p>
                </div>
            </div>
        </div>
    );
}
